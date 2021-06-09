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
import ae.utils.funopt;
import ae.utils.main;

import ddoc;
import grammar;
import writer;

enum dlangOrgPath = "dlang.org";

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

	auto writer = Writer("../grammar.js");
	Grammar grammar;

	foreach (file; files)
	{
		scope(failure) stderr.writeln("Error in file " ~ file ~ ":");
		auto source = dlangOrgPath.buildPath("spec", file ~ ".dd").readText;
		auto ddoc = source.parseDDoc;

		if (source.indexOf(`$(GRAMMAR`) < 0)
			continue;

		writer.startFile(file);

		void scan(ref const Node node)
		{
			if (node.type != Node.Type.call)
				return;

			if (node.call.macroName == "GRAMMAR")
			{
				auto macros = (globalMacros ~ ddoc.macros).fold!merge((DDoc[string]).init);
				auto newDefs = grammar.parse(node.call.contents, macros);
				writer.startSection();
				foreach (def; newDefs)
					writer.writeRule(def, grammar.defs[def]);
			}
			else
				foreach (ref childNode; node.call.contents)
					scan(childNode);
		}
		foreach (ref node; ddoc.contents)
			scan(node);
	}

	writer.close();
}

mixin main!(funopt!program);
