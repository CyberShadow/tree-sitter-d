module writer;

import std.algorithm.iteration;
import std.array;
import std.stdio;
import std.string;
import std.sumtype;

import ae.utils.text : splitByCamelCase;

import grammar;

struct Writer
{
	File f;

	this(string fileName)
	{
		f.open(fileName, "wb");

		f.write(q"EOF
module.exports = grammar({
  name: 'd',

  rules: {
    source_file: $ => $._module,
EOF");
	}

	string currentFile;
	bool fileHeaderPending;
	bool sectionHeaderPending;

	void startFile(string file)
	{
		currentFile = file;
		fileHeaderPending = true;
		sectionHeaderPending = true;
	}

	void startSection()
	{
		if (!fileHeaderPending)
			sectionHeaderPending = true;
	}

	void writeRule(string name, ref Grammar.Def def)
	{
		if (fileHeaderPending)
		{
			f.writef(q"EOF

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/%s.html
    // ------------------------------------------------------------------------
EOF", currentFile);
			fileHeaderPending = false;
			sectionHeaderPending = false;
		}

		if (sectionHeaderPending)
		{
			f.write(q"EOF

    // ---
EOF");
			sectionHeaderPending = false;
		}

		f.writef(q"EOF

    %s: $ =>
EOF", convertRuleName(name));
		writeRuleBody(def.node);
	}

	void close()
	{
		f.write(q"EOF
  }
});
EOF");
	}

private:
	static string convertRuleName(string name)
	{
		return "_" ~ name.splitByCamelCase.map!toLower.join("_");
	}

	void writeRuleBody(ref Grammar.Node node)
	{
		int indent = 6;

		void writeNode(ref Grammar.Node node)
		{
			void line(string s) { f.writeln(" ".replicate(indent), s); }
			void single(string s) { line(s ~ ","); }

			void list(string fun, Grammar.Node[] children)
			{
				line(fun ~ "(");
				indent += 2;
				foreach (ref child; children)
					writeNode(child);
				indent -= 2;
				line("),");
			}

			node.value.match!(
				(ref Grammar.Placeholder  v) => single("/* " ~ v.description ~ " */"),
				(ref Grammar.LiteralChars v) => single(format!"%(%s%)"([v.chars])),
				(ref Grammar.LiteralToken v) => single(format!"%(%s%)"([v.literal])),
				(ref Grammar.Reference    v) => single("$." ~ convertRuleName(v.name)),
				(ref Grammar.Choice       v) => list("choice"  , v.nodes),
				(ref Grammar.Seq          v) => list("seq"     , v.nodes),
				(ref Grammar.Repeat1      v) => list("repeat1" , v.node),
				(ref Grammar.Optional     v) => list("optional", v.node),
			);
		}
		writeNode(node);
	}
}

// "