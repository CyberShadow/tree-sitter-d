import std.algorithm.comparison;
import std.algorithm.iteration;
import std.algorithm.searching;
import std.array;
import std.exception;
import std.file;
import std.path;
import std.stdio;
import std.string;

import ae.utils.aa;
import ae.utils.array;
import ae.utils.funopt;
import ae.utils.main;

import ddoc;
import grammar;
import parser;
import writer;

enum dlangOrgPath = "dlang.org";

static immutable string[] extras = [
	"WhiteSpace",
	"EndOfLine",
	"Comment",
	"SpecialTokenSequence",
];

/// Entry point.
void program()
{
	if (!exists(dlangOrgPath) && exists("../" ~ dlangOrgPath))
		chdir("..");

	auto globalMacros = [
		"dlang.org.ddoc",
	]
		.map!(fn => dlangOrgPath.buildPath(fn))
		.map!readText
		.map!parseMacros
		.array;

	string[] files;
	void scanTOC(const DDoc ddoc)
	{
		foreach (ref node; ddoc)
			if (node.type == Node.Type.call)
			{
				if (node.call.macroName == "ITEMIZE")
					files = node.call.splitArguments()
						.map!((DDoc argument) {
							argument = argument.strip();
							enforce(argument.length == 1);
							enforce(argument[0].type == Node.Type.call);
							enforce(argument[0].call.macroName == "A");
							auto href = argument[0].call.splitArguments()[0].strip;
							enforce(href.length == 1);
							enforce(href[0].type == Node.Type.text);
							enforce(href[0].text.endsWith(".html"));
							return href[0].text[0 .. $ - 5];
						})
						.filter!(name => !name.among("abi")) // Skip mangling definition
						.array;
				else
					scanTOC(node.call.contents);
			}
	}
	scanTOC(dlangOrgPath.buildPath("spec", "spec.dd").readText.parseDDoc.contents);
	enforce(files.length, "Failed to parse the table of contents (spec/spec.dd)");

	Grammar grammar;
	string[][][string] order;

	foreach (file; files)
	{
		scope(failure) stderr.writeln("Error in file " ~ file ~ ":");
		auto source = dlangOrgPath.buildPath("spec", file ~ ".dd").readText;
		auto ddoc = source.parseDDoc;

		if (source.indexOf(`$(GRAMMAR`) < 0)
			continue;

		void scan(ref const Node node)
		{
			if (node.type != Node.Type.call)
				return;
			scope(failure) stderr.writefln("Error on line %d:",
				1 + source[0 .. source.sliceIndex(node.call.macroName)].representation.count('\n'));

			if (node.call.macroName == "GRAMMAR" || node.call.macroName == "GRAMMAR_LEX")
			{
				enforce(node.call.contents.length &&
					node.call.contents[$-1].type == Node.type.text &&
					node.call.contents[$-1].isText("\n"),
					"Unexpected text at the end of GRAMMAR node"
				);
				auto macros = (globalMacros ~ ddoc.macros).fold!merge((DDoc[string]).init);
				auto kind = node.call.macroName == "GRAMMAR" ? Grammar.Def.Kind.tokens : Grammar.Def.Kind.chars;
				auto newDefs = grammar.parse(node.call.contents, macros, kind);
				order[file] ~= newDefs;
			}
			else
				foreach (ref childNode; node.call.contents)
					scan(childNode);
		}
		foreach (ref node; ddoc.contents)
			scan(node);
	}

	grammar.analyze(["SourceFile"] ~ extras);

	foreach (defName; ["WhiteSpace", "EndOfLine"])
		grammar.defs[defName].hidden = true;

	auto writer = Writer("../grammar.js", grammar, extras);

	foreach (file; files)
	{
		writer.startFile(file);
		foreach (section; order.get(file, null))
		{
			writer.startSection();
			foreach (def; section)
				writer.writeRule(def);
		}
	}

	writer.close();
}

mixin main!(funopt!program);
