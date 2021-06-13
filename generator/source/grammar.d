import std.algorithm.comparison;
import std.algorithm.iteration;
import std.algorithm.searching;
import std.algorithm.sorting;
import std.array;
import std.exception;
import std.format;
import std.functional;
import std.range;
import std.sumtype;

import ae.utils.aa;
import ae.utils.meta;
import ae.utils.text;

import ddoc;

static this()
{
	if (false)
	{
		// Avoid https://issues.dlang.org/show_bug.cgi?id=22010
		// (or some similar bug)
		Grammar.Node node;
		auto b = node == node;
	}
}

struct Grammar
{
	struct RegExp { string regexp; } /// Regular expression, generally with the intent to describe some character set.
	struct LiteralChars { string chars; } /// Describes contiguous characters (e.g. number syntax)
	struct LiteralToken { string literal; } /// May be surrounded by whitespace/comments
	struct Reference { string name; } /// Reference to another definition.
	struct Choice { Node[] nodes; } /// Choice of multiple possible nodes.
	struct Seq { Node[] nodes; } /// Consecutive sequence of nodes.
	// https://issues.dlang.org/show_bug.cgi?id=22010
	struct Repeat { Node[/*1*/] node; } /// Zero-or-more occurrences of the given node.
	struct Repeat1 { Node[/*1*/] node; } /// One-or-more occurrences of the given node.
	struct Optional { Node[/*1*/] node; } /// Zero-or-one occurrences of the given node.
	struct SeqChoice { Node[][] nodes; } /// Internal node, superset of Choice, Seq and Optional. `nodes` is a list of choices of sequences.

	// https://issues.dlang.org/show_bug.cgi?id=22003
	alias NodeValue = SumType!(
		RegExp,
		LiteralChars,
		LiteralToken,
		Reference,
		Choice,
		Repeat,
		Repeat1,
		Seq,
		Optional,
		SeqChoice,
	);

	/// A grammar node.
	struct Node
	{
		NodeValue value;
		alias value this;

		void toString(scope void delegate(const(char)[]) sink) const
		{
			value.match!(
				(ref v) => sink.formattedWrite!"%s"(v),
			);
		}
	}

	/// A grammar definition.
	/// Emitted as `name: $ => ...`
	struct Def
	{
		Node node; /// The root AST node.

		/// How to emit this definition in the grammar.
		enum Kind
		{
			tokens, /// As a regular rule.
			chars, /// As a token(...) rule.
		}
		Kind kind; /// ditto

		bool used; /// Include the definition in the generated grammar.
		bool hidden; /// Hide in the tree-sitter AST (by prefixing the name with _).
		bool synthetic; /// We made this one up - don't emit a dlang.org link.

		string publicName; /// If set, use this name instead of the `defs` key.
		string[] tail; /// Also write these (synthetic) rules after this one
	}

	/// All definitions in the grammar, indexed by their official names.
	Def[string] defs;

	/// Pre-process and prepare for writing
	void analyze(string[] roots)
	{
		checkReferences();
		normalize();
		optimize();
		deRecurse();
		extractBodies();
		checkKinds();
		scanUsed(roots);
		scanHidden();
		compile();
	}

	// Ensure that all referenced grammar definitions are defined.
	private void checkReferences()
	{
		void scan(Node node)
		{
			node.match!(
				(ref RegExp       v) {},
				(ref LiteralChars v) {},
				(ref LiteralToken v) {},
				(ref Reference    v) { enforce(v.name in defs, "Unknown reference: " ~ v.name); },
				(ref Choice       v) { v.nodes       .each!scan(); },
				(ref Seq          v) { v.nodes       .each!scan(); },
				(ref Repeat       v) { v.node        .each!scan(); },
				(ref Repeat1      v) { v.node        .each!scan(); },
				(ref Optional     v) { v.node        .each!scan(); },
				(ref SeqChoice    v) { v.nodes.joiner.each!scan(); },
			);
		}
		foreach (name, ref def; defs)
			scan(def.node);
	}

	// Convert rules to an intermediate normalized form, which makes other manipulations easier.
	// In the normalized form, only the following nodes are allowed:
	// - Leaf nodes (RegExp, LiteralChars, LiteralToken)
	// - Reference
	// - SeqChoice
	// - Repeat1
	// Seq, Choice, and Optional are expressed as SeqChoice nodes.
	// Repeat is expressed as SeqChoice([[], [Repeat1(...)]]).
	private void normalize()
	{
		void normalizeNode(ref Node node)
		{
			// Normalize children
			node.match!(
				(ref RegExp       v) {},
				(ref LiteralChars v) {},
				(ref LiteralToken v) {},
				(ref Reference    v) {},
				(ref Choice       v) { v.nodes.each!normalizeNode(); },
				(ref Seq          v) { v.nodes.each!normalizeNode(); },
				(ref Repeat       v) { v.node .each!normalizeNode(); },
				(ref Repeat1      v) { v.node .each!normalizeNode(); },
				(ref Optional     v) { v.node .each!normalizeNode(); },
				(ref SeqChoice    v) { assert(false); },
			);

			// Normalize node
			node = node.match!(
				(ref RegExp       v) => node,
				(ref LiteralChars v) => node,
				(ref LiteralToken v) => node,
				(ref Reference    v) => node,
				(ref Choice       v) => seqChoice(v.nodes.map!((ref Node node) => node.match!(
					(ref RegExp       v) => [[node]],
					(ref LiteralChars v) => [[node]],
					(ref LiteralToken v) => [[node]],
					(ref Reference    v) => [[node]],
					(ref SeqChoice    v) => v.nodes,
					(ref Repeat1      v) => [[node]],
					(ref              _) => enforce(null),
				)).join),
				(ref Seq          v) => seqChoice([v.nodes]),
				(ref Repeat       v) => seqChoice([[], [repeat1(v.node[0])]]),
				(ref Repeat1      v) => node,
				(ref Optional     v) => seqChoice([[], v.node]),
				(ref SeqChoice    v) { enforce(false); return node; },
			);
		}

		foreach (defName, ref def; defs)
			normalizeNode(def.node);
	}

	// Extract the empty choice from a SeqChoice, if it has one.
	// If not, just return null and leave the argument unmodified.
	// The return value can then be appended to a choice list to
	// re-add the optional choice back in the tree.
	private Node[][] extractOptional(ref Node[][] choices)
	{
		foreach (i, choice; choices)
			if (!choice.length)
			{
				choices = choices[0 .. i] ~ choices[i + 1 .. $];
				return [[]];
			}
		return null;
	}

	// Optimize the given normalized node in-place.
	private void optimizeNode(ref Node node)
	{
		void optimizeNode(ref Node node) { Grammar.optimizeNode(node); }

		// Optimize children
		node.match!(
			(ref RegExp       v) {},
			(ref LiteralChars v) {},
			(ref LiteralToken v) {},
			(ref Reference    v) {},
			(ref SeqChoice    v) { v.nodes.joiner.each!optimizeNode(); },
			(ref Repeat1      v) { v.node        .each!optimizeNode(); },
			(ref              _) { assert(false); },
		);

		// Replace unary SeqChoice nodes with their sole contents.
		node = node.match!(
			(ref SeqChoice    v) => v.nodes.length == 1 && v.nodes[0].length == 1 ? v.nodes[0][0] : node,
			(ref              _) => node,
		);

		// Un-nest single-choice SeqChoice nodes.
		node.match!(
			(ref SeqChoice    v)
			{
				foreach (ref choice; v.nodes)
					foreach_reverse (i; 0 .. choice.length)
						choice[i].match!(
							(ref SeqChoice v)
							{
								if (v.nodes.length == 1) // single-choice
									choice = choice[0 .. i] ~ v.nodes[0] ~ choice[i + 1 .. $];
							},
							(ref _) {}
						);
			},
			(ref              _) {},
		);

		// Lift the common part (prefix or suffix) out of SeqChoice, e.g, transform:
		// x | x a | x b | ... => x ( | a | b | ... )
		node.match!(
			(ref SeqChoice scNode)
			{
				auto choices = scNode.nodes;
				auto optional = extractOptional(choices);

				if (choices.length < 2)
					return; // Must have at least two choices

				auto prefix = choices          .fold!commonPrefix      ;
				auto suffix = choices.map!retro.fold!commonPrefix.retro;
				if (!prefix.length && !suffix.length)
					return;

				// Avoid overlap
				auto minLength = choices.map!(choiceSeq => choiceSeq.length).reduce!min;
				while (prefix.length + suffix.length > minLength)
					if (!suffix.empty)
						suffix.popFront();
					else
					if (!prefix.empty)
						prefix.popBack();
					else
						assert(false);

				node = seqChoice(optional ~ [
					(prefix.length ? [seqChoice([prefix])] : []) ~
					seqChoice(
						choices.map!(choiceSeq => choiceSeq[prefix.length .. $ - suffix.length]).array,
					) ~
					(suffix.length ? [seqChoice([suffix])] : [])
				]);

				optimizeNode(node);
			},
			(ref _) {},
		);
	}

	// Fold away unnecessary grammar nodes, simplify the node tree,
	// and otherwise prepare it for the transformations to follow.
	private void optimize()
	{
		foreach (ref def; defs)
			optimizeNode(def.node);
	}

	// Attempt to remove recursion as needed
	private void deRecurse()
	{
		foreach (defName, ref def; defs)
		{
			// In the D grammar, recursion is used for two purposes:
			// - Repetition (e.g. Characters)
			// - Nested constructs (e.g. binary expressions)
			// We only want to de-recurse the first kind.
			bool shouldDeRecurse =

				// We must always de-recurse token fragments,
				// because we can't use tree-sitter recursion with them.
				def.kind == Def.Kind.chars ||

				// Lists of things generally involve repetition.
				defName.splitByCamelCase.canFind("List") ||

				// If the definition name is the plural of the name of another definition,
				// then this is almost certainly used for repetition.
				["s", "es"].any!(pluralSuffix =>
					defName.endsWith(pluralSuffix) &&
					["", "Name"].any!(singularSuffix =>
						defName[0 .. $ - pluralSuffix.length] ~ singularSuffix in defs
					)
				);

			if (shouldDeRecurse)
			{
				auto x = reference(defName);

				// Transform x := y ( | x ) into x := ( y )+
				def.node.match!(
					(ref SeqChoice sc1)
					{
						if (sc1.nodes.length != 1)
							return; // Single choice
						if (sc1.nodes[0].length < 2)
							return;

						auto y = sc1.nodes[0][0 .. $-1];

						sc1.nodes[0][$-1].match!(
							(ref SeqChoice sc2)
							{
								auto choices = sc2.nodes;
								if (!extractOptional(choices))
									return;
								if (choices != [[x]])
									return;

								def.node = repeat1(
									seqChoice([y])
								);
								optimizeNode(def.node);
							},
							(_) {}
						);
					},
					(_) {}
				);

				// Transform x := ( | x ) y into x := ( y )+
				def.node.match!(
					(ref SeqChoice sc1)
					{
						if (sc1.nodes.length != 1)
							return; // Single choice
						if (sc1.nodes[0].length < 2)
							return;

						auto y = sc1.nodes[0][1 .. $];

						sc1.nodes[0][0].match!(
							(ref SeqChoice sc2)
							{
								auto choices = sc2.nodes;
								if (!extractOptional(choices))
									return;
								if (choices != [[x]])
									return;

								def.node = repeat1(
									seqChoice([y])
								);
								optimizeNode(def.node);
							},
							(_) {}
						);
					},
					(_) {}
				);

				// Transform x := y ( | z x ) into x := y ( | ( z y )+ )
				def.node.match!(
					(ref SeqChoice sc1)
					{
						if (sc1.nodes.length != 1)
							return; // Single choice
						if (sc1.nodes[0].length < 2)
							return;

						auto y = sc1.nodes[0][0 .. $-1];

						sc1.nodes[0][$-1].match!(
							(ref SeqChoice sc2)
							{

								auto choices = sc2.nodes;
								if (!extractOptional(choices))
									return;
								if (choices.length != 1)
									return;
								if (choices[0][$-1] != x)
									return;

								auto z = choices[0][0 .. $-1];

								def.node = seqChoice([
									y ~
									seqChoice([
										[], // optional
										[repeat1(
											seqChoice([
												z ~
												y,
											])
										)],
									]),
								]);
								optimizeNode(def.node);
							},
							(_) {}
						);
					},
					(_) {}
				);

				// Transform x := ( | x z ) y into x := ( | y z ) y
				// Same as above, but in the other direction.
				def.node.match!(
					(ref SeqChoice sc1)
					{
						if (sc1.nodes.length != 1)
							return; // Single choice
						if (sc1.nodes[0].length < 2)
							return;

						auto y = sc1.nodes[0][1 .. $];

						sc1.nodes[0][0].match!(
							(ref SeqChoice sc2)
							{
								auto choices = sc2.nodes;
								if (!extractOptional(choices))
									return;
								if (choices.length != 1)
									return;
								if (choices[0][0] != x)
									return;

								auto z = choices[0][1 .. $];

								def.node = seqChoice([
									seqChoice([
										[], // optional
										[repeat1(
											seqChoice([
												y ~
												z,
											])
										)],
									]) ~
									y,
								]);
								optimizeNode(def.node);
							},
							(_) {}
						);
					},
					(_) {}
				);

				// Transform x := y ( | z ( | x ) ) into x := y ( | ( z y )+ ) ( | z )
				def.node.match!(
					(ref SeqChoice sc1)
					{
						if (sc1.nodes.length != 1)
							return; // Single choice
						if (sc1.nodes[0].length < 2)
							return;

						auto y = sc1.nodes[0][0 .. $-1];

						sc1.nodes[0][$-1].match!(
							(ref SeqChoice sc2)
							{
								auto choices = sc2.nodes;
								if (!extractOptional(choices))
									return;
								if (choices.length != 1)
									return;

								auto z = choices[0][0 .. $-1];

								sc2.nodes[1][$-1].match!(
									(ref SeqChoice sc3)
									{
										auto choices = sc3.nodes;
										if (!extractOptional(choices))
											return;
										if (choices != [[x]])
											return;

										def.node = seqChoice([
											y ~
											seqChoice([
												[], // optional
												[repeat1(
													seqChoice([
														z ~
														y,
													])
												)],
											]) ~
											seqChoice([
												[], // optional
												z,
											]),
										]);
										optimizeNode(def.node);
									},
									(_) {}
								);
							},
							(_) {}
						);
					},
					(_) {}
				);
			}
		}
	}

	// Refactor some definitions into a descending part and an
	// implementation part, so that we can hide the descending
	// part to avoid excessive nesting in the tree-sitter AST.
	// This aims to solve the problem described in
	// http://tree-sitter.github.io/tree-sitter/creating-parsers#structuring-rules-well ,
	// though using a different approach.
	private void extractBodies()
	{
		foreach (defName; defs.keys)
		{
			auto def = &defs[defName];

			if (def.kind != Def.Kind.tokens)
				continue;

			// The rule of thumb to decide whether a rule should have its body extracted
			// is to see if the rule name makes sense even with just the minimal,
			// non-body interpretation of the definition.
			// E.g., an AddExpression is expected to always have an addition,
			// but an Import is an import even without a ModuleAliasIdentifier.

			// The following grammar definitions are eligible for body extraction,
			// but it doesn't make sense to do so for them.
			// As far as I can see, there is no way to mechanically distinguish these cases
			// from the majority of cases where body extraction is desirable.
			if (defName.among(
					"Import",
					"ImportBind",
					"Declarators",
					"VarDeclaratorIdentifier",
					"ArrayMemberInitialization",
					"StructMemberInitializer",
					"Slice", // needs to be de-recursed
					"Symbol",
					"MixinTemplateName",
				))
				continue;

			auto x = reference(defName);

			/*
				x := y ( | a... | b... ) z
				=>
				x := y z | x_ts_body
				x_ts_body := y ( a... | b... ) z

				- y and z are the mandatory descending part (must be references)
				- a, b, ... are the implementation part, which we will extract to a separate rule
				  These should contain a token or such (i.e. consist of not just all references).
			*/
			def.node.match!(
				(ref SeqChoice sc1)
				{
					if (sc1.nodes.length != 1)
						return; // Single choice

					auto optionalIndex =
						sc1.nodes[0].countUntil!((ref Node node) => node.match!(
							(ref SeqChoice sc2) => sc2.nodes.canFind(null),
							(ref _) => false
						));
					if (optionalIndex < 0)
						return;

					auto y = sc1.nodes[0][0 .. optionalIndex];
					auto z = sc1.nodes[0][optionalIndex + 1 .. $];
					auto y_z = y ~ z;
					if (y_z.length != 1) // Match logic in scanHidden
						return;
					bool yzOK = y_z.all!((ref Node node) => node.match!(
						(ref Reference v) => true,
						(ref           _) => false,
					));
					if (!yzOK)
						return;

					auto choices = sc1.nodes[0][optionalIndex].tryMatch!(
						(ref SeqChoice sc2) => sc2.nodes,
					);
					extractOptional(choices).enforce();
					alias choicesOK = delegate bool (choices) => choices.all!(choice => choice.any!((ref Node node) => node.match!(
						(ref RegExp       v) => true,
						(ref LiteralChars v) => true,
						(ref LiteralToken v) => true,
						(ref SeqChoice    v) => choicesOK(v.nodes),
						(ref              _) => false,
					)));
					if (!choicesOK(choices))
						return;

					auto bodyName = defName ~ "TSBody";
					def.node = seqChoice([
						y_z,
						[reference(bodyName)],
					]);
					def.tail ~= bodyName;
					def.publicName = "Maybe" ~ (def.publicName ? def.publicName : defName);

					Def bodyDef;
					bodyDef.node = seqChoice([y ~ seqChoice(choices) ~ z]);
					bodyDef.kind = Def.Kind.tokens;
					bodyDef.synthetic = true;
					bodyDef.publicName = defName;

					optimizeNode(def.node);
					optimizeNode(bodyDef.node);

					defs[bodyName] = bodyDef;
				},
				(ref _) {}
			);

			/*
			  x := choice(
			    // Some choices are references (descending part)
				reference(...),
				reference(...),

				// Some choices are sequences (implementation part)
				seq(...),
				seq(...),
			  )

			  =>

			  x := choice(
				reference(...),
				reference(...),
				reference(x_ts_body),
			  )

			  x_ts_body := choice(
				seq(...),
				seq(...),
			  )
			*/
			def.node.match!(
				(ref SeqChoice sc1)
				{
					alias isRecursive = delegate bool (ref Node node) => node.tryMatch!(
						(ref RegExp       v) => false,
						(ref LiteralChars v) => false,
						(ref LiteralToken v) => false,
						(ref Reference    v) => v.name == defName,
						(ref SeqChoice    v) => v.nodes.joiner.any!isRecursive,
						(ref Repeat1      v) => v.node[0].I!isRecursive,
					);
					if (isRecursive(def.node))
						return;

					alias isReference = (Node[] nodes) => nodes.length == 1 && nodes[0].match!(
						(ref Reference    v) => true,
						(_) => false,
					);
					auto references = sc1.nodes.filter!isReference.array;
					auto remainder  = sc1.nodes.filter!(not!isReference).array;
					if (!references || !remainder)
						return;

					auto bodyName = defName ~ "TSBody";
					def.node = seqChoice(
						references ~
						[reference(bodyName)],
					);
					def.tail ~= bodyName;
					def.publicName = "Maybe" ~ (def.publicName ? def.publicName : defName);

					Def bodyDef;
					bodyDef.node = seqChoice(
						remainder,
					);
					bodyDef.kind = Def.Kind.tokens;
					bodyDef.synthetic = true;
					bodyDef.publicName = defName;

					optimizeNode(def.node);
					optimizeNode(bodyDef.node);

					defs[bodyName] = bodyDef;
				},
				(ref _) {}
			);
		}
	}

	// Verify our assertions about definitions of the respective kind.
	private void checkKinds()
	{
		foreach (defName, ref def; defs)
			final switch (def.kind)
			{
				case Def.Kind.chars:
				{
					enum State : ubyte
					{
						hasChars = 1 << 0,
						hasToken = 1 << 1,
						recurses = 1 << 2,
					}

					HashSet!string scanning;

					State checkDef(string defName)
					{
						scope(failure) { import std.stdio; stderr.writefln("While checking %s:", defName); }
						if (defName in scanning)
							return State.recurses;
						scanning.add(defName);
						scope(success) scanning.remove(defName);

						State concat(State a, State b)
						{
							if (((a & State.hasToken) && b != 0) ||
								((b & State.hasToken) && a != 0))
								throw new Exception("Token / token fragment definition %s contains mixed %s and %s".format(defName, a, b));
							return a | b;
						}

						State scanNode(ref Node node)
						{
							return node.match!(
								(ref RegExp       v) => State.init,
								(ref LiteralChars v) => State.hasChars,
								(ref LiteralToken v) => State.hasToken,
								(ref Reference    v) { enforce(defs[v.name].kind == Def.Kind.chars, "%s of kind %s references %s of kind %s".format(defName, def.kind, v.name, defs[v.name].kind)); return checkDef(v.name); },
								(ref Repeat1      v) => v.node[0].I!scanNode().I!(x => concat(x, x)),
								(ref SeqChoice    v) => v.nodes.map!(choiceSeq => choiceSeq.map!scanNode().fold!concat(State.init)).fold!((a, b) => State(a | b)),
								(ref              _) => enforce(State.init),
							);
						}
						return scanNode(defs[defName].node);
					}

					checkDef(defName);
					break;
				}

				case Def.Kind.tokens:
				{
					void scanNode(ref Node node)
					{
						node.match!(
							(ref RegExp       v) {},
							(ref LiteralChars v) { throw new Exception("Definition %s with kind %s has literal chars: %(%s%)".format(defName, def.kind, [v.chars])); },
							(ref LiteralToken v) {},
							(ref Reference    v) {},
							(ref Repeat1      v) { v.node        .each!scanNode(); },
							(ref SeqChoice    v) { v.nodes.joiner.each!scanNode(); },
							(ref              _) { assert(false); },
						);
					}
					scanNode(def.node);
					break;
				}
			}
	}

	// Recursively visit definitions starting from `roots` to find
	// which ones are used and should be generated grammar.
	private void scanUsed(string[] roots)
	{
		void scanDef(string defName)
		{
			auto def = &defs[defName];
			if (def.used)
				return;
			def.used = true;
			if (def.kind == Def.Kind.chars)
				return; // Referencees will be inlined

			void scanNode(ref Node node)
			{
				node.match!(
					(ref RegExp       v) {},
					(ref LiteralChars v) {},
					(ref LiteralToken v) {},
					(ref Reference    v) { scanDef(v.name); },
					(ref Repeat1      v) { v.node        .each!scanNode(); },
					(ref SeqChoice    v) { v.nodes.joiner.each!scanNode(); },
					(ref              _) { assert(false); },
				);
			}
			scanNode(def.node);
		}

		foreach (root; roots)
			scanDef(root);
	}

	// Choose which definitions should be hidden (inlined) in the tree-sitter AST.
	// In the generated grammar, such definitions' names begin with an underscore.
	private void scanHidden()
	{
		foreach (defName, ref def; defs)
		{
			if (def.kind == Def.Kind.chars)
				continue; // Always represents a token; referencees are inlined

			// We make a definition hidden if it always contains at most one other definition.
			// Definitions which directly contain tokens are never hidden.

			// Exception: nodes which contain only one reference and nothing else
			// are implicitly understood to have semantic meaning, and are not hidden.
			if (def.node.match!(
				(ref Reference    v) => true,
				(ref              _) => false,
			))
				continue;

			size_t scanNode(ref Node node)
			{
				return node.match!(
					(ref RegExp       v) => enforce(0),
					(ref LiteralChars v) => enforce(0),
					(ref LiteralToken v) => 2,
					(ref Reference    v) => 1,
					(ref Repeat1      v) => v.node[0].I!scanNode() * 2,
					(ref SeqChoice    v) => v.nodes.map!(choiceSeq => choiceSeq.map!scanNode().sum()).reduce!max,
					(ref              _) => enforce(0),
				);
			}
			def.hidden = scanNode(def.node) <= 1;
		}
	}

	// Convert rules from the internal normalized form to the tree-sitter form.
	// This replaces SeqChoice nodes with Seq / Choice / Optional.
	private void compile()
	{
		void compileNode(ref Node node)
		{
			// Compile children
			node.match!(
				(ref RegExp       v) {},
				(ref LiteralChars v) {},
				(ref LiteralToken v) {},
				(ref Reference    v) {},
				(ref Choice       v) { assert(false); },
				(ref Seq          v) { assert(false); },
				(ref Repeat       v) { assert(false); },
				(ref Repeat1      v) { v.node        .each!compileNode(); },
				(ref Optional     v) { assert(false); },
				(ref SeqChoice    v) { v.nodes.joiner.each!compileNode(); },
			);

			// Compile node
			node = node.match!(
				(ref RegExp       v) => node,
				(ref LiteralChars v) => node,
				(ref LiteralToken v) => node,
				(ref Reference    v) => node,
				(ref SeqChoice    v)
				{
					auto optionalChoice = extractOptional(v.nodes);

					alias maybeSeq = (Node[] nodes) => nodes.length == 1 ? nodes[0] : seq(nodes);

					node = v.nodes.length == 1 ? maybeSeq(v.nodes[0]) : choice(v.nodes.map!maybeSeq.array);

					if (optionalChoice)
					{
						// optional(repeat1(...)) -> repeat(...)
						node = node.match!(
							(ref Repeat1 v) => repeat(v.node[0]),
							(ref         _) => optional(node),
						);
					}

					return node;
				},
				(ref Repeat1      v) => node,
				(ref              _) { enforce(false); return node; },
			);
		}

		foreach (defName, ref def; defs)
			compileNode(def.node);
	}
}

/// Convenience factory functions.
Grammar.Node regexp      (string           regexp ) { return Grammar.Node(Grammar.NodeValue(Grammar.RegExp      ( regexp  ))); }
Grammar.Node literalChars(string           chars  ) { return Grammar.Node(Grammar.NodeValue(Grammar.LiteralChars( chars   ))); } /// ditto
Grammar.Node literalToken(string           literal) { return Grammar.Node(Grammar.NodeValue(Grammar.LiteralToken( literal ))); } /// ditto
Grammar.Node reference   (string           name   ) { return Grammar.Node(Grammar.NodeValue(Grammar.Reference   ( name    ))); } /// ditto
Grammar.Node choice      (Grammar.Node[]   nodes  ) { return Grammar.Node(Grammar.NodeValue(Grammar.Choice      ( nodes   ))); } /// ditto
Grammar.Node seq         (Grammar.Node[]   nodes  ) { return Grammar.Node(Grammar.NodeValue(Grammar.Seq         ( nodes   ))); } /// ditto
Grammar.Node repeat      (Grammar.Node     node   ) { return Grammar.Node(Grammar.NodeValue(Grammar.Repeat      ([node   ]))); } /// ditto
Grammar.Node repeat1     (Grammar.Node     node   ) { return Grammar.Node(Grammar.NodeValue(Grammar.Repeat1     ([node   ]))); } /// ditto
Grammar.Node optional    (Grammar.Node     node   ) { return Grammar.Node(Grammar.NodeValue(Grammar.Optional    ([node   ]))); } /// ditto
Grammar.Node seqChoice   (Grammar.Node[][] nodes  ) { return Grammar.Node(Grammar.NodeValue(Grammar.SeqChoice   ( nodes   ))); } /// ditto
