module parser;

import std.algorithm.comparison;
import std.algorithm.iteration;
import std.algorithm.searching;
import std.array;
import std.conv : to;
import std.exception;
import std.string;

import ddoc;
import grammar;

string[] parse(ref Grammar grammar, const DDoc ddoc, string fileName, DDoc[string] macros, Grammar.Def.Kind kind)
{
	alias RegExp = Grammar.RegExp;
	alias LiteralChars = Grammar.LiteralChars;
	alias LiteralToken = Grammar.LiteralToken;
	alias Reference = Grammar.Reference;
	alias Optional = Grammar.Optional;
	alias Choice = Grammar.Choice;
	alias Seq = Grammar.Seq;

	alias NodeValue = Grammar.NodeValue;
	alias Node = Grammar.Node;
	alias Def = Grammar.Def;

	static DDoc preprocess(const DDoc ddoc)
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

	struct ParseContext
	{
		string currentName;
		string file;
		DDoc[string] macros;
		Def.Kind kind;
	}

	/*static*/ Node[] parseDefinition(const DDoc line, ref const ParseContext context)
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
						seqNodes ~= regexp(`/[\s\S]/`);
						break;
					case "physical end of the file":
						seqNodes ~= regexp(`/$/m`); // illustrative
						break;
					case "Letter":
						seqNodes ~= regexp(`/[A-Za-z]/`);
						break;
					case "UniversalAlpha":
						// src/dmd/utf.d
						static immutable wchar[2][] ALPHA_TABLE =
						[
							[0x00AA, 0x00AA],
							[0x00B5, 0x00B5],
							[0x00B7, 0x00B7],
							[0x00BA, 0x00BA],
							[0x00C0, 0x00D6],
							[0x00D8, 0x00F6],
							[0x00F8, 0x01F5],
							[0x01FA, 0x0217],
							[0x0250, 0x02A8],
							[0x02B0, 0x02B8],
							[0x02BB, 0x02BB],
							[0x02BD, 0x02C1],
							[0x02D0, 0x02D1],
							[0x02E0, 0x02E4],
							[0x037A, 0x037A],
							[0x0386, 0x0386],
							[0x0388, 0x038A],
							[0x038C, 0x038C],
							[0x038E, 0x03A1],
							[0x03A3, 0x03CE],
							[0x03D0, 0x03D6],
							[0x03DA, 0x03DA],
							[0x03DC, 0x03DC],
							[0x03DE, 0x03DE],
							[0x03E0, 0x03E0],
							[0x03E2, 0x03F3],
							[0x0401, 0x040C],
							[0x040E, 0x044F],
							[0x0451, 0x045C],
							[0x045E, 0x0481],
							[0x0490, 0x04C4],
							[0x04C7, 0x04C8],
							[0x04CB, 0x04CC],
							[0x04D0, 0x04EB],
							[0x04EE, 0x04F5],
							[0x04F8, 0x04F9],
							[0x0531, 0x0556],
							[0x0559, 0x0559],
							[0x0561, 0x0587],
							[0x05B0, 0x05B9],
							[0x05BB, 0x05BD],
							[0x05BF, 0x05BF],
							[0x05C1, 0x05C2],
							[0x05D0, 0x05EA],
							[0x05F0, 0x05F2],
							[0x0621, 0x063A],
							[0x0640, 0x0652],
							[0x0660, 0x0669],
							[0x0670, 0x06B7],
							[0x06BA, 0x06BE],
							[0x06C0, 0x06CE],
							[0x06D0, 0x06DC],
							[0x06E5, 0x06E8],
							[0x06EA, 0x06ED],
							[0x06F0, 0x06F9],
							[0x0901, 0x0903],
							[0x0905, 0x0939],
							[0x093D, 0x094D],
							[0x0950, 0x0952],
							[0x0958, 0x0963],
							[0x0966, 0x096F],
							[0x0981, 0x0983],
							[0x0985, 0x098C],
							[0x098F, 0x0990],
							[0x0993, 0x09A8],
							[0x09AA, 0x09B0],
							[0x09B2, 0x09B2],
							[0x09B6, 0x09B9],
							[0x09BE, 0x09C4],
							[0x09C7, 0x09C8],
							[0x09CB, 0x09CD],
							[0x09DC, 0x09DD],
							[0x09DF, 0x09E3],
							[0x09E6, 0x09F1],
							[0x0A02, 0x0A02],
							[0x0A05, 0x0A0A],
							[0x0A0F, 0x0A10],
							[0x0A13, 0x0A28],
							[0x0A2A, 0x0A30],
							[0x0A32, 0x0A33],
							[0x0A35, 0x0A36],
							[0x0A38, 0x0A39],
							[0x0A3E, 0x0A42],
							[0x0A47, 0x0A48],
							[0x0A4B, 0x0A4D],
							[0x0A59, 0x0A5C],
							[0x0A5E, 0x0A5E],
							[0x0A66, 0x0A6F],
							[0x0A74, 0x0A74],
							[0x0A81, 0x0A83],
							[0x0A85, 0x0A8B],
							[0x0A8D, 0x0A8D],
							[0x0A8F, 0x0A91],
							[0x0A93, 0x0AA8],
							[0x0AAA, 0x0AB0],
							[0x0AB2, 0x0AB3],
							[0x0AB5, 0x0AB9],
							[0x0ABD, 0x0AC5],
							[0x0AC7, 0x0AC9],
							[0x0ACB, 0x0ACD],
							[0x0AD0, 0x0AD0],
							[0x0AE0, 0x0AE0],
							[0x0AE6, 0x0AEF],
							[0x0B01, 0x0B03],
							[0x0B05, 0x0B0C],
							[0x0B0F, 0x0B10],
							[0x0B13, 0x0B28],
							[0x0B2A, 0x0B30],
							[0x0B32, 0x0B33],
							[0x0B36, 0x0B39],
							[0x0B3D, 0x0B43],
							[0x0B47, 0x0B48],
							[0x0B4B, 0x0B4D],
							[0x0B5C, 0x0B5D],
							[0x0B5F, 0x0B61],
							[0x0B66, 0x0B6F],
							[0x0B82, 0x0B83],
							[0x0B85, 0x0B8A],
							[0x0B8E, 0x0B90],
							[0x0B92, 0x0B95],
							[0x0B99, 0x0B9A],
							[0x0B9C, 0x0B9C],
							[0x0B9E, 0x0B9F],
							[0x0BA3, 0x0BA4],
							[0x0BA8, 0x0BAA],
							[0x0BAE, 0x0BB5],
							[0x0BB7, 0x0BB9],
							[0x0BBE, 0x0BC2],
							[0x0BC6, 0x0BC8],
							[0x0BCA, 0x0BCD],
							[0x0BE7, 0x0BEF],
							[0x0C01, 0x0C03],
							[0x0C05, 0x0C0C],
							[0x0C0E, 0x0C10],
							[0x0C12, 0x0C28],
							[0x0C2A, 0x0C33],
							[0x0C35, 0x0C39],
							[0x0C3E, 0x0C44],
							[0x0C46, 0x0C48],
							[0x0C4A, 0x0C4D],
							[0x0C60, 0x0C61],
							[0x0C66, 0x0C6F],
							[0x0C82, 0x0C83],
							[0x0C85, 0x0C8C],
							[0x0C8E, 0x0C90],
							[0x0C92, 0x0CA8],
							[0x0CAA, 0x0CB3],
							[0x0CB5, 0x0CB9],
							[0x0CBE, 0x0CC4],
							[0x0CC6, 0x0CC8],
							[0x0CCA, 0x0CCD],
							[0x0CDE, 0x0CDE],
							[0x0CE0, 0x0CE1],
							[0x0CE6, 0x0CEF],
							[0x0D02, 0x0D03],
							[0x0D05, 0x0D0C],
							[0x0D0E, 0x0D10],
							[0x0D12, 0x0D28],
							[0x0D2A, 0x0D39],
							[0x0D3E, 0x0D43],
							[0x0D46, 0x0D48],
							[0x0D4A, 0x0D4D],
							[0x0D60, 0x0D61],
							[0x0D66, 0x0D6F],
							[0x0E01, 0x0E3A],
							[0x0E40, 0x0E5B],
							[0x0E81, 0x0E82],
							[0x0E84, 0x0E84],
							[0x0E87, 0x0E88],
							[0x0E8A, 0x0E8A],
							[0x0E8D, 0x0E8D],
							[0x0E94, 0x0E97],
							[0x0E99, 0x0E9F],
							[0x0EA1, 0x0EA3],
							[0x0EA5, 0x0EA5],
							[0x0EA7, 0x0EA7],
							[0x0EAA, 0x0EAB],
							[0x0EAD, 0x0EAE],
							[0x0EB0, 0x0EB9],
							[0x0EBB, 0x0EBD],
							[0x0EC0, 0x0EC4],
							[0x0EC6, 0x0EC6],
							[0x0EC8, 0x0ECD],
							[0x0ED0, 0x0ED9],
							[0x0EDC, 0x0EDD],
							[0x0F00, 0x0F00],
							[0x0F18, 0x0F19],
							[0x0F20, 0x0F33],
							[0x0F35, 0x0F35],
							[0x0F37, 0x0F37],
							[0x0F39, 0x0F39],
							[0x0F3E, 0x0F47],
							[0x0F49, 0x0F69],
							[0x0F71, 0x0F84],
							[0x0F86, 0x0F8B],
							[0x0F90, 0x0F95],
							[0x0F97, 0x0F97],
							[0x0F99, 0x0FAD],
							[0x0FB1, 0x0FB7],
							[0x0FB9, 0x0FB9],
							[0x10A0, 0x10C5],
							[0x10D0, 0x10F6],
							[0x1E00, 0x1E9B],
							[0x1EA0, 0x1EF9],
							[0x1F00, 0x1F15],
							[0x1F18, 0x1F1D],
							[0x1F20, 0x1F45],
							[0x1F48, 0x1F4D],
							[0x1F50, 0x1F57],
							[0x1F59, 0x1F59],
							[0x1F5B, 0x1F5B],
							[0x1F5D, 0x1F5D],
							[0x1F5F, 0x1F7D],
							[0x1F80, 0x1FB4],
							[0x1FB6, 0x1FBC],
							[0x1FBE, 0x1FBE],
							[0x1FC2, 0x1FC4],
							[0x1FC6, 0x1FCC],
							[0x1FD0, 0x1FD3],
							[0x1FD6, 0x1FDB],
							[0x1FE0, 0x1FEC],
							[0x1FF2, 0x1FF4],
							[0x1FF6, 0x1FFC],
							[0x203F, 0x2040],
							[0x207F, 0x207F],
							[0x2102, 0x2102],
							[0x2107, 0x2107],
							[0x210A, 0x2113],
							[0x2115, 0x2115],
							[0x2118, 0x211D],
							[0x2124, 0x2124],
							[0x2126, 0x2126],
							[0x2128, 0x2128],
							[0x212A, 0x2131],
							[0x2133, 0x2138],
							[0x2160, 0x2182],
							[0x3005, 0x3007],
							[0x3021, 0x3029],
							[0x3041, 0x3093],
							[0x309B, 0x309C],
							[0x30A1, 0x30F6],
							[0x30FB, 0x30FC],
							[0x3105, 0x312C],
							[0x4E00, 0x9FA5],
							[0xAC00, 0xD7A3],
						];
						seqNodes ~= regexp(`/[%-(%s%)]/`.format(ALPHA_TABLE.map!(r =>
							r[0] == r[1]
							? `\u%04x`.format(r[0])
							: `\u%04x-\u%04x`.format(r[0], r[1])
						)));
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
					seqNodes ~= literalChars(wchar(text[2 .. $].to!ushort(16)).to!string);
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
						`q"(`, `)"`,
						`q"[`, `]"`,
						`q"{`, `}"`,
						`q"<`, `>"`,
						`(`, `[`, `<`, `{`,
						`)`, `]`, `>`, `}`,
						"L", "u", "U",
						"Lu", "LU",
						"uL", "UL",
						"0b",
						"0B",
						"_",
						".",
						`\'`,
						`\"`,
						`\?`,
						`\`,
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
						`#!`,
					), "Unknown B: " ~ text);
					seqNodes ~= literalChars(text);
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
					seqNodes ~= literalToken(word);
				}
			}
			else
			if (node.isCallTo("GLINK") || node.isCallTo("GLINK_LEX"))
			{
				auto text = node.getSingleTextChild();
				enforce(text != context.currentName, "GLINK to %(%s%) should be GSELF".format([text]));
				seqNodes ~= reference(text);
				auto file = node.call.macroName == "GLINK_LEX" ? "lex" : context.file;
				grammar.links.add([file, text].staticArray);
			}
			else
			if (node.isCallTo("GLINK2"))
			{
				auto arguments = node.call.splitArguments();
				enforce(arguments.length == 2);
				auto file = arguments[0].toString();
				enforce(file != context.file, "GLINK2 to the current file should be GLINK");
				auto text = arguments[1].toString();
				enforce(text != context.currentName, "GLINK to %(%s%) should be GSELF".format([text]));
				seqNodes ~= reference(text);
				grammar.links.add([file, text].staticArray);
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
				seqNodes ~= reference(text);
			}
			else
			if (node.isCallTo("OPT"))
			{
				enforce(seqNodes.length);
				seqNodes[$-1] = optional(seqNodes[$-1]);
			}
			else
			if (node.isCallTo("GDEPRECATED"))
				seqNodes ~= parseDefinition(node.call.contents, context);
			else
			if (node.isCallTo("GRESERVED"))
				seqNodes ~= parseDefinition(node.call.contents, context);
			else
			if (node.isCallToEmpty("CODE_AMP"))
				seqNodes ~= literalToken("&");
			else
			if (node.isCallToEmpty("CODE_LCURL"))
				seqNodes ~= literalToken("{");
			else
			if (node.isCallToEmpty("CODE_RCURL"))
				seqNodes ~= literalToken("}");
			else
			if (node.isCallToEmpty("CODE_PERCENT"))
				seqNodes ~= literalToken("%");
			else
			if (auto pdefinition = node.call.macroName in context.macros)
				seqNodes ~= parseDefinition(node.call.expand(*pdefinition), context);
			else
				throw new Exception("Unknown macro call (%(%s%)) in grammar".format([node.call.macroName]));
		}
		return seqNodes;
	}

	/// Parse and accumulate definitions from DDoc AST
	{
		ParseContext context;
		context.file = fileName;
		context.macros = macros;
		context.kind = kind;

		Node[] currentDefs;
		string[] newDefs;

		void flush()
		{
			if (!context.currentName)
				return;

			auto newDef = Def(choice(currentDefs), kind);
			grammar.defs.update(context.currentName,
				{ newDefs ~= context.currentName; return newDef; },
				(ref Def def)
				{
					enforce(Def(def.node, def.kind) == newDef,
						"Definition mismatch for " ~ context.currentName);
				}
			);

			auto pDef = &grammar.defs[context.currentName];
			pDef.definedIn.add(fileName);

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
				currentDefs ~= seq(parseDefinition(line, context));
			}
			else
				throw new Exception(format!"Can't parse grammar from: %s"(line));
		}
		flush();

		return newDefs;
	}
}
