module writer;

import std.algorithm.iteration;
import std.array;
import std.stdio;
import std.string;
import std.sumtype;

import ae.utils.aa;
import ae.utils.text : splitByCamelCase;

import grammar;

struct Writer
{
	File f;
	Grammar grammar;

	this(string fileName, Grammar grammar)
	{
		f.open(fileName, "wb");

		f.write(q"EOF
module.exports = grammar({
  name: 'd',

  rules: {
    source_file: $ => $._module,
EOF");

		this.grammar = grammar;
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

	void writeRule(string name)
	{
		scope(failure) { import std.stdio : stderr; stderr.writeln("Error while writing rule ", name); }
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
		writeRuleBody(name);
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

	void writeRuleBody(string defName)
	{
		int indent = 6;

		void line(string s) { f.writeln(" ".replicate(indent), s); }
		void single(string s) { line(s ~ ","); }

		void list(T)(string fun, T[] children, void delegate(ref T) childWriter)
		{
			line(fun ~ "(");
			indent += 2;
			foreach (ref child; children)
				childWriter(child);
			indent -= 2;
			line("),");
		}

		HashSet!string visiting;

		void writeDef(ref string defName)
		{
			if (defName in visiting)
				return single("/* recursion */");
			visiting.add(defName);
			scope(success) visiting.remove(defName);

			auto def = &grammar.defs[defName];
			if (def.kind == Grammar.Def.Kind.chars)
				line("// " ~ defName);

			void writeNode(ref Grammar.Node node)
			{
				node.value.match!(
					(ref Grammar.RegExp       v) => single(v.regexp),
					(ref Grammar.LiteralChars v) => single(format!"%(%s%)"([v.chars])),
					(ref Grammar.LiteralToken v) => single(format!"%(%s%)"([v.literal])),
					// https://issues.dlang.org/show_bug.cgi?id=22016
					(ref Grammar.Reference    v) { if (def.kind == Grammar.Def.Kind.chars) writeDef(v.name); else single("$." ~ convertRuleName(v.name)); },
					(ref Grammar.Choice       v) => list("choice"  , v.nodes, &writeNode),
					(ref Grammar.Seq          v) => list("seq"     , v.nodes, &writeNode),
					(ref Grammar.Repeat1      v) => list("repeat1" , v.node , &writeNode),
					(ref Grammar.Optional     v) => list("optional", v.node , &writeNode),
				);
			}
			writeNode(def.node);
		}

		auto def = &grammar.defs[defName];
		final switch (def.kind)
		{
			case Grammar.Def.Kind.chars:
				list("token", [defName], &writeDef);
				break;
			case Grammar.Def.Kind.tokens:
				writeDef(defName);
				break;
		}
	}
}

// "