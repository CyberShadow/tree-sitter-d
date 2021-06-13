import std.algorithm.comparison;
import std.algorithm.iteration;
import std.algorithm.searching;
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
		optimize();
		extractBodies();
		checkKinds();
		scanUsed(roots);
		scanHidden();
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
				(ref Choice       v) { v.nodes.each!scan(); },
				(ref Seq          v) { v.nodes.each!scan(); },
				(ref Repeat       v) { v.node .each!scan(); },
				(ref Repeat1      v) { v.node .each!scan(); },
				(ref Optional     v) { v.node .each!scan(); },
			);
		}
		foreach (name, ref def; defs)
			scan(def.node);
	}

	private void optimizeNode(ref Node node)
	{
		void optimizeNode(ref Node node) { Grammar.optimizeNode(node); }

		// Optimize children
		node.match!(
			(ref RegExp       v) {},
			(ref LiteralChars v) {},
			(ref LiteralToken v) {},
			(ref Reference    v) {},
			(ref Choice       v) { v.nodes.each!optimizeNode(); },
			(ref Seq          v) { v.nodes.each!optimizeNode(); },
			(ref Repeat       v) { v.node .each!optimizeNode(); },
			(ref Repeat1      v) { v.node .each!optimizeNode(); },
			(ref Optional     v) { v.node .each!optimizeNode(); },
		);

		// Optimize node
		node = node.match!(
			(ref RegExp       v) => node,
			(ref LiteralChars v) => node,
			(ref LiteralToken v) => node,
			(ref Reference    v) => node,
			(ref Choice       v) => v.nodes.length == 1 ? v.nodes[0] : node,
			(ref Seq          v) => v.nodes.length == 1 ? v.nodes[0] : node,
			(ref Repeat       v) => node,
			(ref Repeat1      v) => node,
			(ref Optional     v) => node,
		);

		// Returns the index of the shortest node in `nodes` (for the purposes of prefix/suffix lifting).
		size_t shortestIndex(Node[] nodes)
		{
			auto lengths = nodes.map!((ref Node node) => node.match!(
				(ref Seq seqNode) => seqNode.nodes.length,
				(ref _) => 1,
			));
			auto shortestLength = lengths.reduce!min;
			auto shortestIndex = lengths.countUntil(shortestLength);
			return shortestIndex;
		}

		// Transform choice(a, seq(a, b), seq(a, c)...) into seq(a, optional(choice(b, c, ...)))
		node.match!(
			(ref Choice choiceNode)
			{
				if (choiceNode.nodes.length < 2)
					return;
				auto prefixIndex = shortestIndex(choiceNode.nodes);
				auto prefix = choiceNode.nodes[prefixIndex].match!(
					(ref Seq seqNode) => seqNode.nodes,
					(_) => choiceNode.nodes[prefixIndex .. prefixIndex + 1],
				);
				if (!prefix)
					return;

				auto remainder = choiceNode.nodes[0 .. prefixIndex] ~ choiceNode.nodes[prefixIndex + 1 .. $];
				bool samePrefix = remainder.map!((ref Node node) => node.match!(
					(ref Seq seqNode) => seqNode.nodes.startsWith(prefix),
					(_) => false,
				)).all;
				if (!samePrefix)
					return;

				node = seq(
					prefix ~
					optional(
						choice(
							remainder.map!((ref n) => seq(
								n.tryMatch!(
									(ref Seq seqNode) => seqNode.nodes[prefix.length .. $],
								)
							))
							.array,
						)
					)
				);
				optimizeNode(node);
			},
			(ref _) {},
		);

		// Transform choice(a, seq(b, a), seq(c, a)...) into seq(optional(choice(b, c, ...)), a)
		// Same as the above transformation, but lifting the suffix instead of the prefix.
		node.match!(
			(ref Choice choiceNode)
			{
				if (choiceNode.nodes.length < 2)
					return;
				auto suffixIndex = shortestIndex(choiceNode.nodes);
				auto suffix = choiceNode.nodes[suffixIndex].match!(
					(ref Seq seqNode) => seqNode.nodes,
					(_) => choiceNode.nodes[suffixIndex .. suffixIndex + 1],
				);
				if (!suffix)
					return;

				auto remainder = choiceNode.nodes[0 .. suffixIndex] ~ choiceNode.nodes[suffixIndex + 1 .. $];
				bool sameSuffix = remainder.map!((ref n) => n.match!(
					(ref Seq seqNode) => seqNode.nodes.endsWith(suffix),
					(_) => false,
				)).all;
				if (!sameSuffix)
					return;

				node = seq(
					optional(
						choice(
							remainder.map!((ref n) => seq(
								n.tryMatch!(
									(ref Seq seqNode) => seqNode.nodes[0 .. $ - suffix.length],
								)
							))
							.array,
						)
					) ~
					suffix
				);
				optimizeNode(node);
			},
			(ref _) {},
		);
	}

	// Fold away unnecessary grammar nodes, or refactor into simpler constructs which
	// are available in tree-sitter but not used in the D grammar specification.
	private void optimize()
	{
		foreach (name, ref def; defs)
		{
			optimizeNode(def.node);

			// Attempt to remove recursion

			// In the D grammar, recursion is used for two purposes:
			// - Repetition (e.g. Characters)
			// - Nested constructs (e.g. binary expressions)
			// We only want to de-recurse the first kind.
			bool shouldDeRecurse =

				// We must always de-recurse token fragments,
				// because we can't use tree-sitter recursion with them.
				def.kind == Def.Kind.chars ||

				// Lists of things generally involve repetition.
				name.splitByCamelCase.canFind("List") ||

				// If the definition name is the plural of the name of another definition,
				// then this is almost certainly used for repetition.
				["s", "es"].any!(pluralSuffix =>
					name.endsWith(pluralSuffix) &&
					["", "Name"].any!(singularSuffix =>
						name[0 .. $ - pluralSuffix.length] ~ singularSuffix in defs
					)
				);

			if (shouldDeRecurse)
			{
				// Transform x := seq(y, optional(x)) into x := repeat1(y)
				def.node.match!(
					(ref Seq seqNode)
					{
						if (seqNode.nodes.length < 2)
							return;
						seqNode.nodes[$-1].match!(
							(ref Optional optionalNode)
							{
								optionalNode.node[0].match!(
									(ref Reference referenceNode)
									{
										if (referenceNode.name != name)
											return;

										def.node = repeat1(
											seq(
												seqNode.nodes[0 .. $ - 1],
											)
										);
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

				// Transform x := seq(y, optional(seq(z, x))) into x := seq(y, repeat(seq(z, y)))
				def.node.match!(
					(ref Seq seqNode1)
					{
						if (seqNode1.nodes.length < 2)
							return;
						seqNode1.nodes[$-1].match!(
							(ref Optional optionalNode)
							{
								optionalNode.node[0].match!(
									(ref Seq seqNode2)
									{
										if (seqNode2.nodes.length < 2)
											return;
										seqNode2.nodes[$-1].match!(
											(ref Reference referenceNode)
											{
												if (referenceNode.name != name)
													return;

												def.node = seq(
													seqNode1.nodes[0 .. $-1] ~
													repeat(
														seq(
															seqNode2.nodes[0 .. $-1] ~
															seqNode1.nodes[0 .. $-1],
														),
													),
												);
											},
											(_) {}
										);
									},
									(_) {}
								);
							},
							(_) {}
						);
					},
					(_) {}
				);

				// Transform x := seq(optional(seq(x, z)), y) into x := seq(repeat(seq(y, z)), y)
				// Same as above, but in the other direction.
				def.node.match!(
					(ref Seq seqNode1)
					{
						if (seqNode1.nodes.length < 2)
							return;
						seqNode1.nodes[0].match!(
							(ref Optional optionalNode)
							{
								optionalNode.node[0].match!(
									(ref Seq seqNode2)
									{
										if (seqNode2.nodes.length < 2)
											return;
										seqNode2.nodes[0].match!(
											(ref Reference referenceNode)
											{
												if (referenceNode.name != name)
													return;

												def.node = seq(
													repeat(
														seq(
															seqNode1.nodes[1 .. $] ~
															seqNode2.nodes[1 .. $],
														),
													) ~
													seqNode1.nodes[1 .. $],
												);
											},
											(_) {}
										);
									},
									(_) {}
								);
							},
							(_) {}
						);
					},
					(_) {}
				);

				// Transform x := seq(y, optional(seq(z, optional(x)))) into x := seq(y, repeat(seq(z, y)), optional(z))
				def.node.match!(
					(ref Seq seqNode1)
					{
						if (seqNode1.nodes.length < 2)
							return;
						auto y = seqNode1.nodes[0 .. $-1];
						seqNode1.nodes[$-1].match!(
							(ref Optional optionalNode1)
							{
								optionalNode1.node[0].match!(
									(ref Seq seqNode2)
									{
										if (seqNode2.nodes.length < 2)
											return;
										auto z = seqNode2.nodes[0 .. $-1];
										seqNode2.nodes[$-1].match!(
											(ref Optional optionalNode1)
											{
												optionalNode1.node[0].match!(
													(ref Reference referenceNode)
													{
														if (referenceNode.name != name)
															return;
														auto x = referenceNode;

														def.node = seq(
															y ~
															repeat(
																seq(
																	z ~
																	y
																)
															) ~
															optional(
																seq(
																	z
																)
															)
														);
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

			/*
				x := seq(
				  y... ,
				  optional(
					choice( // implied (with one child) if absent
					  seq( a... , x , p... ), // Contains x anywhere
					  seq( b... , x , q... ),
					  ...
					)
			      )
				  z... ,
				)

				=>

				x := choice(
				  seq(y ... , z ...),
				  x_ts_body,
				)

				x_ts_body := choice(
				  seq( y... , a... , x , p... , z... ),
				  seq( y... , b... , x , q... , z... ),
				  ...
				)
			*/
			def.node.match!(
				(ref Seq seqNode1)
				{
					auto x = reference(defName);

					auto optionalIndex =
						seqNode1.nodes.countUntil!((ref Node node) => node.match!(
							(ref Optional optionalNode) => optionalNode.node[0] == x || optionalNode.node[0].match!(
								(ref Choice choiceNode) => choiceNode.nodes.all!((ref Node node) => node == x || node.match!(
									(ref Seq seqNode2) => seqNode2.nodes.canFind(x),
									(ref _) => false,
								)),
								(ref Seq seqNode2) => seqNode2.nodes.canFind(x),
								(ref _) => false
							),
							(ref _) => false
						));
					if (optionalIndex < 0)
						return;

					Node[][] choices =
						seqNode1.nodes[optionalIndex].tryMatch!(
							(ref Optional optionalNode) => optionalNode.node[0].match!(
								(ref Choice choiceNode) => choiceNode.nodes.map!((ref Node node) => node.tryMatch!(
									(ref Seq seqNode2) => seqNode2.nodes,
								)).array,
								(ref Seq seqNode2) => [seqNode2.nodes],
								(ref _) => [[x]]
							)
						);

					auto y = seqNode1.nodes[0 .. optionalIndex];
					auto z = seqNode1.nodes[optionalIndex + 1 .. $];

					auto bodyName = defName ~ "TSBody";
					def.node = choice([
						seq(y ~ z),
						reference(bodyName),
					]);
					def.tail ~= bodyName;
					def.publicName = "Maybe" ~ (def.publicName ? def.publicName : defName);

					Def bodyDef;
					bodyDef.node = choice(
						choices.map!(choiceNodes => seq(y ~ choiceNodes ~ z)).array,
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
				(ref Choice choiceNode)
				{
					alias isRecursive = delegate bool (ref Node node) => node.match!(
						(ref RegExp       v) => false,
						(ref LiteralChars v) => false,
						(ref LiteralToken v) => false,
						(ref Reference    v) => v.name == defName,
						(ref Choice       v) => v.nodes.any!isRecursive,
						(ref Seq          v) => v.nodes.any!isRecursive,
						(ref Repeat       v) => v.node[0].I!isRecursive,
						(ref Repeat1      v) => v.node[0].I!isRecursive,
						(ref Optional     v) => v.node[0].I!isRecursive,
					);
					if (isRecursive(def.node))
						return;

					alias isReference = (ref Node node) => node.match!(
						(ref Reference    v) => true,
						(_) => false,
					);
					auto references = choiceNode.nodes.filter!isReference.array;
					auto remainder  = choiceNode.nodes.filter!(not!isReference).array;
					if (!references || !remainder)
						return;

					auto bodyName = defName ~ "TSBody";
					def.node = choice(
						references ~
						reference(bodyName),
					);
					def.tail ~= bodyName;
					def.publicName = "Maybe" ~ (def.publicName ? def.publicName : defName);

					Def bodyDef;
					bodyDef.node = choice(
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
								(ref Choice       v) => v.nodes.map!scanNode().fold!((a, b) => State(a | b)),
								(ref Seq          v) => v.nodes.map!scanNode().fold!concat,
								(ref Repeat       v) => v.node[0].I!scanNode().I!(x => concat(x, x)),
								(ref Repeat1      v) => v.node[0].I!scanNode().I!(x => concat(x, x)),
								(ref Optional     v) => v.node[0].I!scanNode(),
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
							(ref Choice       v) { v.nodes.each!scanNode(); },
							(ref Seq          v) { v.nodes.each!scanNode(); },
							(ref Repeat       v) { v.node .each!scanNode(); },
							(ref Repeat1      v) { v.node .each!scanNode(); },
							(ref Optional     v) { v.node .each!scanNode(); },
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
					(ref Choice       v) { v.nodes.each!scanNode(); },
					(ref Seq          v) { v.nodes.each!scanNode(); },
					(ref Repeat       v) { v.node .each!scanNode(); },
					(ref Repeat1      v) { v.node .each!scanNode(); },
					(ref Optional     v) { v.node .each!scanNode(); },
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

			size_t scanNode(ref Node node)
			{
				return node.match!(
					(ref RegExp       v) => enforce(0),
					(ref LiteralChars v) => enforce(0),
					(ref LiteralToken v) => 2,
					(ref Reference    v) => 1,
					(ref Choice       v) => v.nodes.map!scanNode().reduce!max(),
					(ref Seq          v) => v.nodes.map!scanNode().sum(),
					(ref Repeat       v) => v.node[0].I!scanNode() * 2,
					(ref Repeat1      v) => v.node[0].I!scanNode() * 2,
					(ref Optional     v) => v.node[0].I!scanNode(),
				);
			}
			def.hidden = scanNode(def.node) <= 1;
		}
	}
}

/// Convenience factory functions.
Grammar.Node regexp      (string         regexp ) { return Grammar.Node(Grammar.NodeValue(Grammar.RegExp      ( regexp  ))); }
Grammar.Node literalChars(string         chars  ) { return Grammar.Node(Grammar.NodeValue(Grammar.LiteralChars( chars   ))); } /// ditto
Grammar.Node literalToken(string         literal) { return Grammar.Node(Grammar.NodeValue(Grammar.LiteralToken( literal ))); } /// ditto
Grammar.Node reference   (string         name   ) { return Grammar.Node(Grammar.NodeValue(Grammar.Reference   ( name    ))); } /// ditto
Grammar.Node choice      (Grammar.Node[] nodes  ) { return Grammar.Node(Grammar.NodeValue(Grammar.Choice      ( nodes   ))); } /// ditto
Grammar.Node seq         (Grammar.Node[] nodes  ) { return Grammar.Node(Grammar.NodeValue(Grammar.Seq         ( nodes   ))); } /// ditto
Grammar.Node repeat      (Grammar.Node   node   ) { return Grammar.Node(Grammar.NodeValue(Grammar.Repeat      ([node   ]))); } /// ditto
Grammar.Node repeat1     (Grammar.Node   node   ) { return Grammar.Node(Grammar.NodeValue(Grammar.Repeat1     ([node   ]))); } /// ditto
Grammar.Node optional    (Grammar.Node   node   ) { return Grammar.Node(Grammar.NodeValue(Grammar.Optional    ([node   ]))); } /// ditto
