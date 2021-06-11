import std.algorithm.comparison;
import std.algorithm.iteration;
import std.algorithm.searching;
import std.conv;
import std.exception;
import std.format;
import std.string;
import std.sumtype;

import ae.utils.aa;
import ae.utils.meta;

import ddoc;

struct Grammar
{
	struct RegExp { string regexp; }
	struct LiteralChars { string chars; } // Describes contiguous characters (e.g. number syntax)
	struct LiteralToken { string literal; } // May be surrounded by whitespace/comments
	struct Reference { string name; }
	struct Choice { Node[] nodes; }
	struct Seq { Node[] nodes; }
	struct Repeat1 { Node[/*1*/] node; } // https://issues.dlang.org/show_bug.cgi?id=22010
	struct Optional { Node[/*1*/] node; } // https://issues.dlang.org/show_bug.cgi?id=22010
	// https://issues.dlang.org/show_bug.cgi?id=22003
	alias NodeValue = SumType!(
		RegExp,
		LiteralChars,
		LiteralToken,
		Reference,
		Choice,
		Repeat1,
		Seq,
		Optional,
	);
	struct Node
	{
		NodeValue value;
		alias value this;
	}
	struct Def
	{
		Node node;

		enum Kind
		{
			tokens,
			chars,
		}
		Kind kind;

		bool used;
	}

	Def[string] defs;

	// Parsing:

	private static DDoc preprocess(const DDoc ddoc)
	{
		DDoc result;
		foreach (ref node; ddoc)
			if (node.type != .Node.Type.call)
				result ~= node;
			else
			if (node.isCallTo("MULTICOLS"))
				result ~= node.call.splitArguments()[1];
			else
			{
				.Node node2 = node;
				node2.call.contents = preprocess(node.call.contents);
				result ~= node2;
			}
		return result;
	}

	private struct ParseContext
	{
		string currentName;
		DDoc[string] macros;
		Def.Kind kind;
	}

	private static Node[] parseDefinition(const DDoc line, ref const ParseContext context)
	{
		scope(failure) { import std.stdio : stderr; stderr.writeln("Error with line: ", line); }
		Node[] seqNodes;
		foreach (ref node; line)
		{
			if (node.type == .Node.Type.text)
				enforce(!node.text.strip.length, "Bare text node (%(%s%)) in grammar: %s".format([node.text], line));
			else
			if (node.isCallTo("I"))
			{
				auto text = node.getSingleTextChild();
				switch (text)
				{
					case "any Unicode character":
						seqNodes ~= Node(NodeValue(RegExp(`/[\s\S]/`)));
						break;
					case "physical end of the file":
						seqNodes ~= Node(NodeValue(RegExp(`/$/m`))); // illustrative
						break;
					case "Letter":
						seqNodes ~= Node(NodeValue(RegExp(`/\pLetter/`)));
						break;
					case "UniversalAlpha":
						seqNodes ~= Node(NodeValue(RegExp(`/\pUniversalAlpha/`)));
						break;
					default:
						throw new Exception("Unknown I: " ~ text);
				}
			}
			else
			if (node.isCallTo("B"))
			{
				auto text = node.call.contents.toString();
				enforce(context.kind == Def.Kind.chars, `B in GRAMMAR block: ` ~ text);
				if (text.length == 6 && text.startsWith(`\u`))
					seqNodes ~= Node(NodeValue(LiteralChars(wchar(text[2 .. $].to!ushort(16)).to!string)));
				else
				{
					// These are to aid fixing usage of $(D ...)/$(B ...) in the spec
					enforce(text.among(
						"0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
						"a", "b", "c", "d", "e", "f",
						"A", "B", "C", "D", "E", "F",
						"/*",
						"*/",
						"//",
						"/+",
						"+/",
						`r"`,
						`"`,
						"`",
						"'",
						"c",
						"w",
						"d",
						`q"`,
						`(`, `[`, `<`, `{`,
						`)`, `]`, `>`, `}`,
						"L", "u", "U",
						"Lu", "LU",
						"uL", "UL",
						"0b",
						"0B",
						"_",
						".",
						`\\'`,
						`\\"`,
						`\\?`,
						`\\\\`,
						`\0`,
						`\a`,
						`\b`,
						`\f`,
						`\n`,
						`\r`,
						`\t`,
						`\v`,
						`\x`,
						`\\`,
						`\u`,
						`\U`,
						`x"`,
						`e+`,
						`E+`,
						`e-`,
						`E-`,
						`0x`,
						`0X`,
						`p`,
						`P`,
						`p+`,
						`P+`,
						`p-`,
						`P-`,
						`i`,
						`&`,
						`;`,
					), "Unknown B: " ~ text);
					seqNodes ~= Node(NodeValue(LiteralChars(text)));
				}
			}
			else
			if (node.isCallTo("D"))
			{
				// ditto
				auto text = node.call.contents.toString();
				enforce(text.length);
				foreach (word; text.split)
				{
					enforce(
						// keywords
						(word.length >= 2 && word.representation.all!(c => "abcdefghijklmnopqrstuvwxyz_".representation.canFind(c))) ||
						// traits
						(["is", "has", "get"].any!(prefix => word.startsWith(prefix)) && word.representation.all!(c => "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".representation.canFind(c))) ||
						// magic keywords
						(word.startsWith("__") && word.endsWith("__") && word[2 .. $-2].representation.all!(c => "ABCDEFGHIJKLMNOPQRSTUVWXYZ_".representation.canFind(c))) ||
						// registers
						(word.length >= 2 && "ABCDEFGHIJKLMNOPQRSTUVWXYZ".representation.canFind(word[0]) && word.representation.all!(c => "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789()".representation.canFind(c))) ||
						// other tokens
						word.among(
							"/",
							"/=",
							".",
							"..",
							"...",
							"&",
							"&=",
							"&&",
							"|",
							"|=",
							"||",
							"-",
							"-=",
							"--",
							"+",
							"+=",
							"++",
							"<",
							"<=",
							"<<",
							"<<=",
							">",
							">=",
							">>=",
							">>>=",
							">>",
							">>>",
							"!",
							"!=",
							"(",
							")",
							"[",
							"]",
							"{",
							"}",
							"?",
							",",
							";",
							":",
							"$",
							"=",
							"==",
							"*",
							"*=",
							"%",
							"%=",
							"^",
							"^=",
							"^^",
							"^^=",
							"~",
							"~=",
							"@",
							"=>",
							"#",

							`q{`,

							"C",
							"C++",
							"D",
							"Windows",
							"System",
							"Objective-C",

							"classInstanceSize", // should have been getClassInstanceSize
							"allMembers",        // should have been getAllMembers
							"derivedMembers",    // should have been getDerivedMembers
							"toType",

							"__LOCAL_SIZE",
						), "Unknown D: " ~ word);
					seqNodes ~= Node(NodeValue(LiteralToken(word)));
				}
			}
			else
			if (node.isCallTo("GLINK") || node.isCallTo("GLINK_LEX"))
			{
				auto text = node.getSingleTextChild();
				enforce(text != context.currentName, "GLINK to %(%s%) should be GSELF".format([text]));
				seqNodes ~= Node(NodeValue(Reference(text)));
			}
			else
			if (node.isCallTo("GLINK2"))
			{
				auto arguments = node.call.splitArguments();
				enforce(arguments.length == 2);
				auto text = arguments[1].toString();
				enforce(text != context.currentName, "GLINK to %(%s%) should be GSELF".format([text]));
				seqNodes ~= Node(NodeValue(Reference(text)));
			}
			else
			if (node.isCallTo("LINK2") || node.isCallTo("RELATIVE_LINK2"))
			{
				auto arguments = node.call.splitArguments();
				enforce(arguments.length == 2);
				seqNodes ~= parseDefinition(arguments[1], context);
			}
			else
			if (node.isCallTo("GSELF"))
			{
				auto text = node.getSingleTextChild();
				enforce(text == context.currentName, "GSELF to %(%s%) should be GLINK or to %(%s%)".format([text], [context.currentName]));
				seqNodes ~= Node(NodeValue(Reference(text)));
			}
			else
			if (node.isCallTo("OPT"))
			{
				enforce(seqNodes.length);
				seqNodes[$-1] = Node(NodeValue(Optional([seqNodes[$-1]])));
			}
			else
			if (node.isCallTo("GDEPRECATED"))
				seqNodes ~= parseDefinition(node.call.contents, context);
			else
			if (node.isCallTo("GRESERVED"))
				seqNodes ~= parseDefinition(node.call.contents, context);
			else
			if (node.isCallToEmpty("CODE_AMP"))
				seqNodes ~= Node(NodeValue(LiteralToken("&")));
			else
			if (node.isCallToEmpty("CODE_LCURL"))
				seqNodes ~= Node(NodeValue(LiteralToken("{")));
			else
			if (node.isCallToEmpty("CODE_RCURL"))
				seqNodes ~= Node(NodeValue(LiteralToken("}")));
			else
			if (node.isCallToEmpty("CODE_PERCENT"))
				seqNodes ~= Node(NodeValue(LiteralToken("%")));
			else
			if (auto pdefinition = node.call.macroName in context.macros)
				seqNodes ~= parseDefinition(node.call.expand(*pdefinition), context);
			else
				throw new Exception("Unknown macro call (%(%s%)) in grammar".format([node.call.macroName]));
		}
		return seqNodes;
	}

	/// Parse and accumulate definitions from DDoc AST
	string[] parse(const DDoc ddoc, DDoc[string] macros, Def.Kind kind)
	{
		ParseContext context;
		context.macros = macros;
		context.kind = kind;

		Node[] currentDefs;
		string[] newDefs;

		void flush()
		{
			if (!context.currentName)
				return;

			auto newDef = Def(Node(NodeValue(Choice(currentDefs))), kind);
			defs.update(context.currentName,
				{ newDefs ~= context.currentName; return newDef; },
				(ref Def def) { enforce(def == newDef, "Definition mismatch for " ~ context.currentName); }
			);
			context.currentName = null;
			currentDefs = null;
		}

		foreach (line; preprocess(ddoc).split('\n'))
		{
			if (!line.length || (line.length == 1 && line[0].isText("")))
			{}  // Empty line
			else
			if (line.length == 2 && line[0].isCallTo("GNAME") && line[1].isText(":"))
			{
				// Definition
				flush();
				context.currentName = line[0].getSingleTextChild();
			}
			else
			if (line.length >= 2 && line[0].isText("    "))
			{
				// Possible declaration
				enforce(context.currentName, "Body line without definition line");
				currentDefs ~= Node(NodeValue(Seq(parseDefinition(line, context))));
			}
			else
				throw new Exception(format!"Can't parse grammar from: %s"(line));
		}
		flush();

		return newDefs;
	}

	/// Pre-process and prepare for writing
	void analyze(string[] roots)
	{
		checkReferences();
		optimize();
		checkKinds();
		scanUsed(roots);
	}

	private void checkReferences()
	{
		void scan(Node node)
		{
			node.value.match!(
				(ref RegExp       v) {},
				(ref LiteralChars v) {},
				(ref LiteralToken v) {},
				(ref Reference    v) { enforce(v.name in defs, "Unknown reference: " ~ v.name); },
				(ref Choice       v) { v.nodes.each!scan(); },
				(ref Seq          v) { v.nodes.each!scan(); },
				(ref Repeat1      v) { v.node .each!scan(); },
				(ref Optional     v) { v.node .each!scan(); },
			);
		}
		foreach (name, ref def; defs)
			scan(def.node);
	}

	private void optimize()
	{
		void optimizeNode(ref Node node)
		{
			// Optimize children
			node.value.match!(
				(ref RegExp       v) {},
				(ref LiteralChars v) {},
				(ref LiteralToken v) {},
				(ref Reference    v) {},
				(ref Choice       v) { v.nodes.each!optimizeNode(); },
				(ref Seq          v) { v.nodes.each!optimizeNode(); },
				(ref Repeat1      v) { v.node .each!optimizeNode(); },
				(ref Optional     v) { v.node .each!optimizeNode(); },
			);

			// Optimize node
			node = node.value.match!(
				(ref RegExp       v) => node,
				(ref LiteralChars v) => node,
				(ref LiteralToken v) => node,
				(ref Reference    v) => node,
				(ref Choice       v) => v.nodes.length == 1 ? v.nodes[0] : node,
				(ref Seq          v) => v.nodes.length == 1 ? v.nodes[0] : node,
				(ref Repeat1      v) => node,
				(ref Optional     v) => node,
			);

			// Transform choice(a, seq(a, b)) into seq(a, optional(b))
			node.value.match!(
				(ref Choice choice)
				{
					if (choice.nodes.length != 2)
						return;
					choice.nodes[1].match!(
						(ref Seq seq)
						{
							if (seq.nodes.length != 2)
								return;
							if (seq.nodes[0] != choice.nodes[0])
								return;
							node = Node(NodeValue(Seq([
								seq.nodes[0],
								Node(NodeValue(Optional([
									seq.nodes[1],
								]))),
							])));
						},
						(ref _) {});
				},
				(ref _) {},
			);
		}

		foreach (name, ref def; defs)
		{
			optimizeNode(def.node);

			// Transform x := seq(y, optional(x)) into x := repeat1(y)
			// (attempt to remove recursion)
			{
				def.node.match!(
					(ref Seq seq)
					{
						if (seq.nodes.length != 2)
							return;
						seq.nodes[1].match!(
							(ref Optional optional)
							{
								optional.node[0].match!(
									(ref Reference reference)
									{
										if (reference.name != name)
											return;

										def.node = Node(NodeValue(Repeat1([
											seq.nodes[0],
										])));
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
							return node.value.match!(
								(ref RegExp       v) => State.init,
								(ref LiteralChars v) => State.hasChars,
								(ref LiteralToken v) => State.hasToken,
								(ref Reference    v) { enforce(defs[v.name].kind == Def.Kind.chars, "%s of kind %s references %s of kind %s".format(defName, def.kind, v.name, defs[v.name].kind)); return checkDef(v.name); },
								(ref Choice       v) => v.nodes.map!scanNode().fold!((a, b) => State(a | b)),
								(ref Seq          v) => v.nodes.map!scanNode().fold!concat,
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
						node.value.match!(
							(ref RegExp       v) {},
							(ref LiteralChars v) { throw new Exception("Definition %s with kind %s has literal chars: %(%s%)".format(defName, def.kind, [v.chars])); },
							(ref LiteralToken v) {},
							(ref Reference    v) {},
							(ref Choice       v) { v.nodes.each!scanNode(); },
							(ref Seq          v) { v.nodes.each!scanNode(); },
							(ref Repeat1      v) { v.node .each!scanNode(); },
							(ref Optional     v) { v.node .each!scanNode(); },
						);
					}
					scanNode(def.node);
					break;
				}
			}
	}

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
				node.value.match!(
					(ref RegExp       v) {},
					(ref LiteralChars v) {},
					(ref LiteralToken v) {},
					(ref Reference    v) { scanDef(v.name); },
					(ref Choice       v) { v.nodes.each!scanNode(); },
					(ref Seq          v) { v.nodes.each!scanNode(); },
					(ref Repeat1      v) { v.node .each!scanNode(); },
					(ref Optional     v) { v.node .each!scanNode(); },
				);
			}
			scanNode(def.node);
		}

		foreach (root; roots)
			scanDef(root);
	}
}
