module ddoc;

import std.algorithm.comparison;
import std.algorithm.searching;
import std.ascii;
import std.exception;
import std.format;
import std.functional;
import std.string;

import ae.utils.array;
import ae.utils.meta;

/// A DDoc DOM node
struct Node
{
	/// Node type
	enum Type
	{
		text, /// Verbatim inline text
		call, /// Macro call
		parameter, /// Placeholder for parameter in macro definition
	}
	Type type; /// ditto

	union
	{
		/// When type == Type.text
		string text;

		/// When type == Type.call
		struct Call
		{
			string macroName; /// The macro being called
			const(Node)[] contents; /// The arguments (comma-separated).

			/// Split `contents` into individual arguments.
			DDoc[] splitArguments() const
			{
				auto arguments = contents.split(',');
				// Remove the optional space after each ,
				foreach (ref ddoc; arguments[1 .. $])
					if (ddoc.length && ddoc[0].type == Node.Type.text)
						ddoc[0].text.skipOver(" ");
				return arguments;
			}

			/// Expand this macro call using the given definition.
			DDoc expand(const(Node)[] definition) const
			{
				auto arguments = splitArguments();
				DDoc visit(const(Node)[] def)
				{
					DDoc result;
					foreach (defNode; def)
						final switch (defNode.type)
						{
							case Type.text:
								result ~= defNode;
								break;
							case Type.call:
							{
								Node node = defNode;
								node.call.contents = visit(defNode.call.contents);
								result ~= node;
								break;
							}
							case Type.parameter:
								switch (defNode.parameter)
								{
									case '1':
										..
									case '9':
										result ~= arguments.get(defNode.parameter - '1');
										break;
									case '0':
										result ~= contents;
										break;
									default:
										throw new Exception("Don't understand macro parameter $" ~ defNode.parameter);
								}
								break;
						}
					return result;
				}
				return visit(definition);
			}
		}
		Call call; /// ditto

		/// When type == Type.parameter
		char parameter;
	}

	/// Helper getters
	bool isText  (string text     ) const { return type == Node.Type.text && this.text           == text     ; }
	bool isCallTo(string macroName) const { return type == Node.Type.call && this.call.macroName == macroName; } /// ditto

	string getSingleTextChild() const
	{
		enforce(
			type == Type.call &&
			call.contents.length == 1 &&
			call.contents[0].type == .Node.Type.text,
			"Macro does not have a single text child"
		);
		return call.contents[0].text;
	} /// ditto

	bool isCallToEmpty(string macroName) const { return isCallTo(macroName) && !call.contents.length; } /// ditto

    void toString(scope void delegate(const(char)[]) sink) const
	{
		final switch (type)
		{
			case Type.text: sink.formattedWrite!"Node(%s, %(%s%))"(type, text.toArray); return;
			case Type.call: sink.formattedWrite!"%s"(call); return;
			case Type.parameter: sink.formattedWrite!"%s"(parameter); return;
		}
	} ///
}

/// A DDoc span is a list of root nodes.
alias DDoc = Node[];

private bool isMacroNameChar(char c) { return isAlphaNum(c) || c == '_'; }

private DDoc parseDDocFragment(ref string s, bool topLevel)
{
	DDoc ddoc;
	size_t parenDepth;
	bool verbatim;
	scope (success) enforce(!verbatim, "Unclosed code block");

	while (true)
	{
		if (!s.length)
		{
			enforce(topLevel, "Unexpected end of file");
			return ddoc;
		}

		switch (s[0])
		{
			case '\n':
				if (s[1 .. $].findSplit("\n")[0].strip.I!(line => line.length >= 3 && line.representation.all!(c => c == '-')))
					verbatim = !verbatim;
				goto default;

			case '$':
			{
				if (verbatim) goto default;
				Node node;
				if (s.length > 1 && s[1].among('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+'))
				{
					node.type = Node.Type.parameter;
					node.parameter = s[1];
					s = s[2 .. $];
				}
				else
				{
					// enforce(s[1 .. $].startsWith("("), "Expected macro call after $");
					if (!s[1 .. $].startsWith("(")) goto default;
					node.type = Node.Type.call;
					s = s[2 .. $];
					auto end = s.representation.countUntil!(not!isMacroNameChar);
					enforce(end > 0, "Expected macro name after $(");
					node.call.macroName = s[0 .. end];
					if (s[end] == ' ') end++; // Skip the space after the macro name
					s = s[end .. $];
					node.call.contents = parseDDocFragment(s, false);
				}
				ddoc ~= node;
				break;
			}

			case '(':
				if (verbatim) goto default;
				parenDepth++;
				goto default;

			case ')':
				if (verbatim) goto default;
				if (parenDepth)
				{
					parenDepth--;
					goto default;
				}
				enforce(!topLevel, "Mismatched )");
				s = s[1 .. $];
				return ddoc;

			default:
				if (!ddoc.length || ddoc[$-1].type != Node.Type.text)
					ddoc ~= Node(Node.Type.text);
				ddoc[$-1].text ~= s[0];
				s = s[1 .. $];
				break;
		}
	}

	assert(false);
}

/// A DDoc document.
struct Document
{
	DDoc contents; /// Document body.
	DDoc[string] macros; /// Local macro definitions.
}

/// Parse into DOM
Document parseDDoc(string s)
{
	auto os = s;
	scope(failure)
	{
		import std.stdio : stderr;
		stderr.writefln("Error at line %d:",
			1 + os[0 .. $ - s.length].representation.count('\n'),
		);
	}
	auto parts = s.findSplit("\nMacros:\n");
	os = s = parts[0];
	Document document;
	document.contents = parseDDocFragment(s, true);
	document.macros = parseMacros(parts[2]);
	return document;
}

/// Parse the "Macros:" section of a .dd file, or a .ddoc file.
DDoc[string] parseMacros(string s)
{
	DDoc[string] macros;

	size_t contentsStartPos, contentsEndPos, nameStartPos;
	bool maybeInName = true;
	string currentName;

	void flush(size_t endPos)
	{
		auto contents = s[contentsStartPos .. endPos];
		if (!currentName)
		{
			enforce(contents.strip.length == 0, "Macro body without name");
			return;
		}
		macros[currentName] = parseDDocFragment(contents, true);
		currentName = null;
	}

	size_t i;
	scope(failure)
	{
		import std.stdio : stderr;
		stderr.writefln("Error at line %d:",
			1 + s[0 .. i].representation.count('\n'),
		);
	}

	for (; i < s.length; i++)
	{
		auto c = s[i];
		switch (c)
		{
			case '=':
				if (!maybeInName)
					goto default;
				maybeInName = false;
				flush(contentsEndPos);
				currentName = s[nameStartPos .. i].strip;
				contentsStartPos = i + 1;
				break;
			case '\n':
				contentsEndPos = i;
				nameStartPos = i + 1;
				maybeInName = true;
				break;
			default:
				if (!isWhite(c) && !isMacroNameChar(c))
					maybeInName = false;
				break;
		}
	}
	flush(s.length);

	return macros;
}

/// Split `contents` by `delim`, like `std.string.split`.
DDoc[] split(const DDoc contents, char delim)
{
	DDoc slice(size_t startNodeIndex, size_t startOffset, size_t endNodeIndex, size_t endOffset)
	{
		DDoc result;
		foreach (nodeIndex; startNodeIndex .. endNodeIndex + (endOffset > 0))
		{
			Node node = contents[nodeIndex];
			if (nodeIndex == endNodeIndex && endOffset > 0)
			{
				assert(node.type == Node.Type.text);
				node.text = node.text[0 .. endOffset];
			}
			if (nodeIndex == startNodeIndex && startOffset > 0)
			{
				assert(node.type == Node.Type.text);
				node.text = node.text[startOffset .. $];
			}
			result ~= node;
		}
		return result;
	}

	DDoc[] result;
	size_t startNodeIndex = 0, startOffset = 0;
	foreach (nodeIndex, ref node; contents)
		if (node.type == Node.Type.text)
			foreach (offset; 0 .. node.text.length)
				if (node.text[offset] == delim)
				{
					result ~= slice(startNodeIndex, startOffset, nodeIndex, offset);

					startNodeIndex = nodeIndex;
					startOffset = offset;
					startOffset++;
					if (startOffset == node.text.length)
					{
						startNodeIndex++;
						startOffset = 0;
					}
				}
	result ~= slice(startNodeIndex, startOffset, contents.length, 0);
	return result;
}

/// Remove whitespace from around `d`, like `std.string.strip`.
inout(DDoc) strip(/*DDoc*/inout(Node)[] d)
{
	while (d.length && d[0].type == Node.Type.text)
	{
		auto s = d[0].text.stripLeft();
		if (!s.length)
			d = d[1 .. $];
		else
		{
			d = Node(Node.Type.text, s) ~ d[1 .. $];
			break;
		}
	}
	while (d.length && d[$-1].type == Node.Type.text)
	{
		auto s = d[$-1].text.stripRight();
		if (!s.length)
			d = d[0 .. $-1];
		else
		{
			d = d[0 .. $-1] ~ Node(Node.Type.text, s);
			break;
		}
	}
	return d;
}


/// Converts to a string by replacing basic macros with their characters.
string toString(in Node[] d)
{
	string s;
	foreach (ref node; d)
	{
		if (node.type == Node.Type.text)
			s ~= node.text;
		else
		if (node.isCallToEmpty("AMP"))
			s ~= "&";
		else
		if (node.isCallToEmpty("LT"))
			s ~= "<";
		else
		if (node.isCallToEmpty("GT"))
			s ~= ">";
		else
		if (node.isCallToEmpty("LPAREN"))
			s ~= "(";
		else
		if (node.isCallTo("RPAREN"))
			s ~= ")";
		else
		if (node.isCallTo("BACKTICK"))
			s ~= "`";
		else
			throw new Exception("Can't stringify: %s".format(node));
	}
	return s;
}

private alias strip = std.string.strip;
