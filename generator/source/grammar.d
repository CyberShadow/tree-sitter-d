import std.algorithm.comparison;
import std.conv;
import std.exception;
import std.format;
import std.string;
import std.sumtype;

import ae.utils.aa;

import ddoc;

struct Grammar
{
	struct Placeholder { string description; }
	struct LiteralChars { string chars; } // Describes contiguous characters (e.g. number syntax)
	struct LiteralToken { string literal; } // May be surrounded by whitespace/comments
	struct Reference { string name; }
	struct Choice { Node[] nodes; }
	struct Seq { Node[] nodes; }
	struct Optional { Node[/*1*/] node; } // https://issues.dlang.org/show_bug.cgi?id=22010
	// https://issues.dlang.org/show_bug.cgi?id=22003
	alias NodeValue = SumType!(
		Placeholder,
		LiteralChars,
		LiteralToken,
		Reference,
		Choice,
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
				enforce(text.among(
					"any Unicode character",
					"physical end of the file",
					"Letter",
					"UniversalAlpha",
				), "Unknown I: " ~ text);
				seqNodes ~= Node(NodeValue(Placeholder(text)));
			}
			else
			if (node.isCallTo("B"))
			{
				auto text = node.call.contents.toString();
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
						`q`,
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
				seqNodes ~= Node(NodeValue(LiteralToken(node.call.contents.toString())));
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
	string[] parse(const DDoc ddoc, DDoc[string] macros)
	{
		ParseContext context;
		context.macros = macros;

		Node[] currentDefs;
		string[] newDefs;

		void flush()
		{
			if (!context.currentName)
				return;

			auto newNode = Node(NodeValue(Choice(currentDefs)));
			defs.update(context.currentName,
				{ newDefs ~= context.currentName; return Def(newNode); },
				(ref Def def) { enforce(def.node == newNode, "Definition mismatch for " ~ context.currentName); }
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
}
