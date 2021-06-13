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

	this(string fileName, Grammar grammar, const string[] extras)
	{
		this.grammar = grammar;

		f.open(fileName, "wb");

		f.writef(q"EOF
module.exports = grammar({
  name: 'd',

  word: $ => $.identifier,

  extras: $ => [
%-(    $.%s,
%|%)  ],

  rules: {
EOF", extras.map!(extra => convertRuleName(extra)));
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

	void writeRule(string defName)
	{
		scope(failure) { import std.stdio : stderr; stderr.writeln("Error while writing rule ", defName); }

		auto def = &grammar.defs[defName];
		if (!def.used)
			return;

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

		f.writeln();
		if (!def.synthetic)
			f.writefln("    // https://dlang.org/spec/%s.html#%s",
				currentFile,
				defName,
			);

		f.writefln("    %s: $ =>",
			convertRuleName(defName));
		writeRuleBody(defName);

		foreach (tail; def.tail)
			writeRule(tail);
	}

	void close()
	{
		f.write(q"EOF
  }
});
EOF");
	}

private:
	string convertRuleName(string name)
	{
		string publicName = name;
		if (auto defPublicName = grammar.defs[name].publicName)
			publicName = defPublicName;
		return (grammar.defs[name].hidden ? "_" : "") ~ publicName.splitByCamelCase.map!toLower.join("_");
	}

	void writeRuleBody(string defName)
	{
		int indent = 6;

		void line(string s) { f.writeln(" ".replicate(indent), s); }
		void single(string s) { line(s ~ ","); }

		void list(T)(string fun, T[] children, void delegate(ref T) childWriter)
		{
			if (!children.length)
			{
				line(fun ~ "(),");
				return;
			}
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
				node.match!(
					(ref Grammar.RegExp       v) => single(v.regexp),
					(ref Grammar.LiteralChars v) => single(format!"%(%s%)"([v.chars])),
					(ref Grammar.LiteralToken v) => single(format!"%(%s%)"([v.literal])),
					// https://issues.dlang.org/show_bug.cgi?id=22016
					(ref Grammar.Reference    v) { if (def.kind == Grammar.Def.Kind.chars) writeDef(v.name); else single("$." ~ convertRuleName(v.name)); },
					(ref Grammar.Choice       v) => list("choice"  , v.nodes, &writeNode),
					(ref Grammar.Seq          v) => list("seq"     , v.nodes, &writeNode),
					(ref Grammar.Repeat       v) => list("repeat"  , v.node , &writeNode),
					(ref Grammar.Repeat1      v) => list("repeat1" , v.node , &writeNode),
					(ref Grammar.Optional     v) => list("optional", v.node , &writeNode),
					(ref Grammar.SeqChoice    v) { assert(false); },
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