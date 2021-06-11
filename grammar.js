module.exports = grammar({
  name: 'd',

  rules: {
    source_file: $ => $.module,

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/lex.html
    // ------------------------------------------------------------------------

    token_no_braces: $ =>
      choice(
        $.identifier,
        $.string_literal,
        $.character_literal,
        $.integer_literal,
        $.float_literal,
        $.keyword,
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
      ),

    // ---

    identifier: $ =>
      token(
        // Identifier
        seq(
          // IdentifierStart
          choice(
            "_",
            /\pLetter/,
            /\pUniversalAlpha/,
          ),
          optional(
            // IdentifierChars
            repeat1(
              // IdentifierChar
              choice(
                // IdentifierStart
                choice(
                  "_",
                  /\pLetter/,
                  /\pUniversalAlpha/,
                ),
                "0",
                // NonZeroDigit
                choice(
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                  "8",
                  "9",
                ),
              ),
            ),
          ),
        ),
      ),

    // ---

    string_literal: $ =>
      choice(
        $.wysiwyg_string,
        $.alternate_wysiwyg_string,
        $.double_quoted_string,
        $.hex_string,
        $.delimited_string,
        $.token_string,
      ),

    // ---

    wysiwyg_string: $ =>
      token(
        // WysiwygString
        seq(
          "r\"",
          optional(
            // WysiwygCharacters
            repeat1(
              // WysiwygCharacter
              choice(
                // Character
                /[\s\S]/,
                // EndOfLine
                choice(
                  "\r",
                  "\n",
                  seq(
                    "\r",
                    "\n",
                  ),
                  "\u2028",
                  "\u2029",
                  // EndOfFile
                  choice(
                    /$/m,
                    "\0",
                    "\x1A",
                  ),
                ),
              ),
            ),
          ),
          "\"",
          optional(
            // StringPostfix
            choice(
              "c",
              "w",
              "d",
            ),
          ),
        ),
      ),

    alternate_wysiwyg_string: $ =>
      token(
        // AlternateWysiwygString
        seq(
          "`",
          optional(
            // WysiwygCharacters
            repeat1(
              // WysiwygCharacter
              choice(
                // Character
                /[\s\S]/,
                // EndOfLine
                choice(
                  "\r",
                  "\n",
                  seq(
                    "\r",
                    "\n",
                  ),
                  "\u2028",
                  "\u2029",
                  // EndOfFile
                  choice(
                    /$/m,
                    "\0",
                    "\x1A",
                  ),
                ),
              ),
            ),
          ),
          "`",
          optional(
            // StringPostfix
            choice(
              "c",
              "w",
              "d",
            ),
          ),
        ),
      ),

    double_quoted_string: $ =>
      token(
        // DoubleQuotedString
        seq(
          "\"",
          optional(
            // DoubleQuotedCharacters
            repeat1(
              // DoubleQuotedCharacter
              choice(
                // Character
                /[\s\S]/,
                // EscapeSequence
                choice(
                  "\\\\'",
                  "\\\\\"",
                  "\\\\?",
                  "\\\\\\\\",
                  "\\0",
                  "\\a",
                  "\\b",
                  "\\f",
                  "\\n",
                  "\\r",
                  "\\t",
                  "\\v",
                  seq(
                    "\\x",
                    // HexDigit
                    choice(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      // HexLetter
                      choice(
                        "a",
                        "b",
                        "c",
                        "d",
                        "e",
                        "f",
                        "A",
                        "B",
                        "C",
                        "D",
                        "E",
                        "F",
                      ),
                    ),
                    // HexDigit
                    choice(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      // HexLetter
                      choice(
                        "a",
                        "b",
                        "c",
                        "d",
                        "e",
                        "f",
                        "A",
                        "B",
                        "C",
                        "D",
                        "E",
                        "F",
                      ),
                    ),
                  ),
                  seq(
                    "\\\\",
                    // OctalDigit
                    choice(
                      "0",
                      "1",
                      "2",
                      "3",
                      "4",
                      "5",
                      "6",
                      "7",
                    ),
                  ),
                  seq(
                    "\\\\",
                    // OctalDigit
                    choice(
                      "0",
                      "1",
                      "2",
                      "3",
                      "4",
                      "5",
                      "6",
                      "7",
                    ),
                    // OctalDigit
                    choice(
                      "0",
                      "1",
                      "2",
                      "3",
                      "4",
                      "5",
                      "6",
                      "7",
                    ),
                  ),
                  seq(
                    "\\\\",
                    // OctalDigit
                    choice(
                      "0",
                      "1",
                      "2",
                      "3",
                      "4",
                      "5",
                      "6",
                      "7",
                    ),
                    // OctalDigit
                    choice(
                      "0",
                      "1",
                      "2",
                      "3",
                      "4",
                      "5",
                      "6",
                      "7",
                    ),
                    // OctalDigit
                    choice(
                      "0",
                      "1",
                      "2",
                      "3",
                      "4",
                      "5",
                      "6",
                      "7",
                    ),
                  ),
                  seq(
                    "\\u",
                    // HexDigit
                    choice(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      // HexLetter
                      choice(
                        "a",
                        "b",
                        "c",
                        "d",
                        "e",
                        "f",
                        "A",
                        "B",
                        "C",
                        "D",
                        "E",
                        "F",
                      ),
                    ),
                    // HexDigit
                    choice(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      // HexLetter
                      choice(
                        "a",
                        "b",
                        "c",
                        "d",
                        "e",
                        "f",
                        "A",
                        "B",
                        "C",
                        "D",
                        "E",
                        "F",
                      ),
                    ),
                    // HexDigit
                    choice(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      // HexLetter
                      choice(
                        "a",
                        "b",
                        "c",
                        "d",
                        "e",
                        "f",
                        "A",
                        "B",
                        "C",
                        "D",
                        "E",
                        "F",
                      ),
                    ),
                    // HexDigit
                    choice(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      // HexLetter
                      choice(
                        "a",
                        "b",
                        "c",
                        "d",
                        "e",
                        "f",
                        "A",
                        "B",
                        "C",
                        "D",
                        "E",
                        "F",
                      ),
                    ),
                  ),
                  seq(
                    "\\U",
                    // HexDigit
                    choice(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      // HexLetter
                      choice(
                        "a",
                        "b",
                        "c",
                        "d",
                        "e",
                        "f",
                        "A",
                        "B",
                        "C",
                        "D",
                        "E",
                        "F",
                      ),
                    ),
                    // HexDigit
                    choice(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      // HexLetter
                      choice(
                        "a",
                        "b",
                        "c",
                        "d",
                        "e",
                        "f",
                        "A",
                        "B",
                        "C",
                        "D",
                        "E",
                        "F",
                      ),
                    ),
                    // HexDigit
                    choice(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      // HexLetter
                      choice(
                        "a",
                        "b",
                        "c",
                        "d",
                        "e",
                        "f",
                        "A",
                        "B",
                        "C",
                        "D",
                        "E",
                        "F",
                      ),
                    ),
                    // HexDigit
                    choice(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      // HexLetter
                      choice(
                        "a",
                        "b",
                        "c",
                        "d",
                        "e",
                        "f",
                        "A",
                        "B",
                        "C",
                        "D",
                        "E",
                        "F",
                      ),
                    ),
                    // HexDigit
                    choice(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      // HexLetter
                      choice(
                        "a",
                        "b",
                        "c",
                        "d",
                        "e",
                        "f",
                        "A",
                        "B",
                        "C",
                        "D",
                        "E",
                        "F",
                      ),
                    ),
                    // HexDigit
                    choice(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      // HexLetter
                      choice(
                        "a",
                        "b",
                        "c",
                        "d",
                        "e",
                        "f",
                        "A",
                        "B",
                        "C",
                        "D",
                        "E",
                        "F",
                      ),
                    ),
                    // HexDigit
                    choice(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      // HexLetter
                      choice(
                        "a",
                        "b",
                        "c",
                        "d",
                        "e",
                        "f",
                        "A",
                        "B",
                        "C",
                        "D",
                        "E",
                        "F",
                      ),
                    ),
                    // HexDigit
                    choice(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      // HexLetter
                      choice(
                        "a",
                        "b",
                        "c",
                        "d",
                        "e",
                        "f",
                        "A",
                        "B",
                        "C",
                        "D",
                        "E",
                        "F",
                      ),
                    ),
                  ),
                  seq(
                    "\\\\",
                    // NamedCharacterEntity
                    seq(
                      "&",
                      // Identifier
                      seq(
                        // IdentifierStart
                        choice(
                          "_",
                          /\pLetter/,
                          /\pUniversalAlpha/,
                        ),
                        optional(
                          // IdentifierChars
                          repeat1(
                            // IdentifierChar
                            choice(
                              // IdentifierStart
                              choice(
                                "_",
                                /\pLetter/,
                                /\pUniversalAlpha/,
                              ),
                              "0",
                              // NonZeroDigit
                              choice(
                                "1",
                                "2",
                                "3",
                                "4",
                                "5",
                                "6",
                                "7",
                                "8",
                                "9",
                              ),
                            ),
                          ),
                        ),
                      ),
                      ";",
                    ),
                  ),
                ),
                // EndOfLine
                choice(
                  "\r",
                  "\n",
                  seq(
                    "\r",
                    "\n",
                  ),
                  "\u2028",
                  "\u2029",
                  // EndOfFile
                  choice(
                    /$/m,
                    "\0",
                    "\x1A",
                  ),
                ),
              ),
            ),
          ),
          "\"",
          optional(
            // StringPostfix
            choice(
              "c",
              "w",
              "d",
            ),
          ),
        ),
      ),

    hex_string: $ =>
      token(
        // HexString
        seq(
          "x\"",
          optional(
            // HexStringChars
            repeat1(
              // HexStringChar
              choice(
                // HexDigit
                choice(
                  // DecimalDigit
                  choice(
                    "0",
                    // NonZeroDigit
                    choice(
                      "1",
                      "2",
                      "3",
                      "4",
                      "5",
                      "6",
                      "7",
                      "8",
                      "9",
                    ),
                  ),
                  // HexLetter
                  choice(
                    "a",
                    "b",
                    "c",
                    "d",
                    "e",
                    "f",
                    "A",
                    "B",
                    "C",
                    "D",
                    "E",
                    "F",
                  ),
                ),
                // WhiteSpace
                repeat1(
                  // Space
                  choice(
                    " ",
                    "\t",
                    "\v",
                    "\f",
                  ),
                ),
                // EndOfLine
                choice(
                  "\r",
                  "\n",
                  seq(
                    "\r",
                    "\n",
                  ),
                  "\u2028",
                  "\u2029",
                  // EndOfFile
                  choice(
                    /$/m,
                    "\0",
                    "\x1A",
                  ),
                ),
              ),
            ),
          ),
          "\"",
          optional(
            // StringPostfix
            choice(
              "c",
              "w",
              "d",
            ),
          ),
        ),
      ),

    delimited_string: $ =>
      token(
        // DelimitedString
        seq(
          "q\"",
          // Delimiter
          choice(
            "(",
            "{",
            "[",
            "<",
            // Identifier
            seq(
              // IdentifierStart
              choice(
                "_",
                /\pLetter/,
                /\pUniversalAlpha/,
              ),
              optional(
                // IdentifierChars
                repeat1(
                  // IdentifierChar
                  choice(
                    // IdentifierStart
                    choice(
                      "_",
                      /\pLetter/,
                      /\pUniversalAlpha/,
                    ),
                    "0",
                    // NonZeroDigit
                    choice(
                      "1",
                      "2",
                      "3",
                      "4",
                      "5",
                      "6",
                      "7",
                      "8",
                      "9",
                    ),
                  ),
                ),
              ),
            ),
          ),
          optional(
            // WysiwygCharacters
            repeat1(
              // WysiwygCharacter
              choice(
                // Character
                /[\s\S]/,
                // EndOfLine
                choice(
                  "\r",
                  "\n",
                  seq(
                    "\r",
                    "\n",
                  ),
                  "\u2028",
                  "\u2029",
                  // EndOfFile
                  choice(
                    /$/m,
                    "\0",
                    "\x1A",
                  ),
                ),
              ),
            ),
          ),
          // MatchingDelimiter
          choice(
            ")",
            "}",
            "]",
            ">",
            // Identifier
            seq(
              // IdentifierStart
              choice(
                "_",
                /\pLetter/,
                /\pUniversalAlpha/,
              ),
              optional(
                // IdentifierChars
                repeat1(
                  // IdentifierChar
                  choice(
                    // IdentifierStart
                    choice(
                      "_",
                      /\pLetter/,
                      /\pUniversalAlpha/,
                    ),
                    "0",
                    // NonZeroDigit
                    choice(
                      "1",
                      "2",
                      "3",
                      "4",
                      "5",
                      "6",
                      "7",
                      "8",
                      "9",
                    ),
                  ),
                ),
              ),
            ),
          ),
          "\"",
        ),
      ),

    // ---

    token_string: $ =>
      seq(
        "q{",
        optional(
          $.token_string_tokens,
        ),
        "}",
      ),

    token_string_tokens: $ =>
      repeat1(
        $.token_string_token,
      ),

    token_string_token: $ =>
      choice(
        $.token_no_braces,
        seq(
          "{",
          optional(
            $.token_string_tokens,
          ),
          "}",
        ),
      ),

    // ---

    character_literal: $ =>
      token(
        // CharacterLiteral
        seq(
          "'",
          // SingleQuotedCharacter
          choice(
            // Character
            /[\s\S]/,
            // EscapeSequence
            choice(
              "\\\\'",
              "\\\\\"",
              "\\\\?",
              "\\\\\\\\",
              "\\0",
              "\\a",
              "\\b",
              "\\f",
              "\\n",
              "\\r",
              "\\t",
              "\\v",
              seq(
                "\\x",
                // HexDigit
                choice(
                  // DecimalDigit
                  choice(
                    "0",
                    // NonZeroDigit
                    choice(
                      "1",
                      "2",
                      "3",
                      "4",
                      "5",
                      "6",
                      "7",
                      "8",
                      "9",
                    ),
                  ),
                  // HexLetter
                  choice(
                    "a",
                    "b",
                    "c",
                    "d",
                    "e",
                    "f",
                    "A",
                    "B",
                    "C",
                    "D",
                    "E",
                    "F",
                  ),
                ),
                // HexDigit
                choice(
                  // DecimalDigit
                  choice(
                    "0",
                    // NonZeroDigit
                    choice(
                      "1",
                      "2",
                      "3",
                      "4",
                      "5",
                      "6",
                      "7",
                      "8",
                      "9",
                    ),
                  ),
                  // HexLetter
                  choice(
                    "a",
                    "b",
                    "c",
                    "d",
                    "e",
                    "f",
                    "A",
                    "B",
                    "C",
                    "D",
                    "E",
                    "F",
                  ),
                ),
              ),
              seq(
                "\\\\",
                // OctalDigit
                choice(
                  "0",
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                ),
              ),
              seq(
                "\\\\",
                // OctalDigit
                choice(
                  "0",
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                ),
                // OctalDigit
                choice(
                  "0",
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                ),
              ),
              seq(
                "\\\\",
                // OctalDigit
                choice(
                  "0",
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                ),
                // OctalDigit
                choice(
                  "0",
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                ),
                // OctalDigit
                choice(
                  "0",
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                ),
              ),
              seq(
                "\\u",
                // HexDigit
                choice(
                  // DecimalDigit
                  choice(
                    "0",
                    // NonZeroDigit
                    choice(
                      "1",
                      "2",
                      "3",
                      "4",
                      "5",
                      "6",
                      "7",
                      "8",
                      "9",
                    ),
                  ),
                  // HexLetter
                  choice(
                    "a",
                    "b",
                    "c",
                    "d",
                    "e",
                    "f",
                    "A",
                    "B",
                    "C",
                    "D",
                    "E",
                    "F",
                  ),
                ),
                // HexDigit
                choice(
                  // DecimalDigit
                  choice(
                    "0",
                    // NonZeroDigit
                    choice(
                      "1",
                      "2",
                      "3",
                      "4",
                      "5",
                      "6",
                      "7",
                      "8",
                      "9",
                    ),
                  ),
                  // HexLetter
                  choice(
                    "a",
                    "b",
                    "c",
                    "d",
                    "e",
                    "f",
                    "A",
                    "B",
                    "C",
                    "D",
                    "E",
                    "F",
                  ),
                ),
                // HexDigit
                choice(
                  // DecimalDigit
                  choice(
                    "0",
                    // NonZeroDigit
                    choice(
                      "1",
                      "2",
                      "3",
                      "4",
                      "5",
                      "6",
                      "7",
                      "8",
                      "9",
                    ),
                  ),
                  // HexLetter
                  choice(
                    "a",
                    "b",
                    "c",
                    "d",
                    "e",
                    "f",
                    "A",
                    "B",
                    "C",
                    "D",
                    "E",
                    "F",
                  ),
                ),
                // HexDigit
                choice(
                  // DecimalDigit
                  choice(
                    "0",
                    // NonZeroDigit
                    choice(
                      "1",
                      "2",
                      "3",
                      "4",
                      "5",
                      "6",
                      "7",
                      "8",
                      "9",
                    ),
                  ),
                  // HexLetter
                  choice(
                    "a",
                    "b",
                    "c",
                    "d",
                    "e",
                    "f",
                    "A",
                    "B",
                    "C",
                    "D",
                    "E",
                    "F",
                  ),
                ),
              ),
              seq(
                "\\U",
                // HexDigit
                choice(
                  // DecimalDigit
                  choice(
                    "0",
                    // NonZeroDigit
                    choice(
                      "1",
                      "2",
                      "3",
                      "4",
                      "5",
                      "6",
                      "7",
                      "8",
                      "9",
                    ),
                  ),
                  // HexLetter
                  choice(
                    "a",
                    "b",
                    "c",
                    "d",
                    "e",
                    "f",
                    "A",
                    "B",
                    "C",
                    "D",
                    "E",
                    "F",
                  ),
                ),
                // HexDigit
                choice(
                  // DecimalDigit
                  choice(
                    "0",
                    // NonZeroDigit
                    choice(
                      "1",
                      "2",
                      "3",
                      "4",
                      "5",
                      "6",
                      "7",
                      "8",
                      "9",
                    ),
                  ),
                  // HexLetter
                  choice(
                    "a",
                    "b",
                    "c",
                    "d",
                    "e",
                    "f",
                    "A",
                    "B",
                    "C",
                    "D",
                    "E",
                    "F",
                  ),
                ),
                // HexDigit
                choice(
                  // DecimalDigit
                  choice(
                    "0",
                    // NonZeroDigit
                    choice(
                      "1",
                      "2",
                      "3",
                      "4",
                      "5",
                      "6",
                      "7",
                      "8",
                      "9",
                    ),
                  ),
                  // HexLetter
                  choice(
                    "a",
                    "b",
                    "c",
                    "d",
                    "e",
                    "f",
                    "A",
                    "B",
                    "C",
                    "D",
                    "E",
                    "F",
                  ),
                ),
                // HexDigit
                choice(
                  // DecimalDigit
                  choice(
                    "0",
                    // NonZeroDigit
                    choice(
                      "1",
                      "2",
                      "3",
                      "4",
                      "5",
                      "6",
                      "7",
                      "8",
                      "9",
                    ),
                  ),
                  // HexLetter
                  choice(
                    "a",
                    "b",
                    "c",
                    "d",
                    "e",
                    "f",
                    "A",
                    "B",
                    "C",
                    "D",
                    "E",
                    "F",
                  ),
                ),
                // HexDigit
                choice(
                  // DecimalDigit
                  choice(
                    "0",
                    // NonZeroDigit
                    choice(
                      "1",
                      "2",
                      "3",
                      "4",
                      "5",
                      "6",
                      "7",
                      "8",
                      "9",
                    ),
                  ),
                  // HexLetter
                  choice(
                    "a",
                    "b",
                    "c",
                    "d",
                    "e",
                    "f",
                    "A",
                    "B",
                    "C",
                    "D",
                    "E",
                    "F",
                  ),
                ),
                // HexDigit
                choice(
                  // DecimalDigit
                  choice(
                    "0",
                    // NonZeroDigit
                    choice(
                      "1",
                      "2",
                      "3",
                      "4",
                      "5",
                      "6",
                      "7",
                      "8",
                      "9",
                    ),
                  ),
                  // HexLetter
                  choice(
                    "a",
                    "b",
                    "c",
                    "d",
                    "e",
                    "f",
                    "A",
                    "B",
                    "C",
                    "D",
                    "E",
                    "F",
                  ),
                ),
                // HexDigit
                choice(
                  // DecimalDigit
                  choice(
                    "0",
                    // NonZeroDigit
                    choice(
                      "1",
                      "2",
                      "3",
                      "4",
                      "5",
                      "6",
                      "7",
                      "8",
                      "9",
                    ),
                  ),
                  // HexLetter
                  choice(
                    "a",
                    "b",
                    "c",
                    "d",
                    "e",
                    "f",
                    "A",
                    "B",
                    "C",
                    "D",
                    "E",
                    "F",
                  ),
                ),
                // HexDigit
                choice(
                  // DecimalDigit
                  choice(
                    "0",
                    // NonZeroDigit
                    choice(
                      "1",
                      "2",
                      "3",
                      "4",
                      "5",
                      "6",
                      "7",
                      "8",
                      "9",
                    ),
                  ),
                  // HexLetter
                  choice(
                    "a",
                    "b",
                    "c",
                    "d",
                    "e",
                    "f",
                    "A",
                    "B",
                    "C",
                    "D",
                    "E",
                    "F",
                  ),
                ),
              ),
              seq(
                "\\\\",
                // NamedCharacterEntity
                seq(
                  "&",
                  // Identifier
                  seq(
                    // IdentifierStart
                    choice(
                      "_",
                      /\pLetter/,
                      /\pUniversalAlpha/,
                    ),
                    optional(
                      // IdentifierChars
                      repeat1(
                        // IdentifierChar
                        choice(
                          // IdentifierStart
                          choice(
                            "_",
                            /\pLetter/,
                            /\pUniversalAlpha/,
                          ),
                          "0",
                          // NonZeroDigit
                          choice(
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "6",
                            "7",
                            "8",
                            "9",
                          ),
                        ),
                      ),
                    ),
                  ),
                  ";",
                ),
              ),
            ),
          ),
          "'",
        ),
      ),

    // ---

    integer_literal: $ =>
      token(
        // IntegerLiteral
        seq(
          // Integer
          choice(
            // DecimalInteger
            choice(
              "0",
              // NonZeroDigit
              choice(
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
              ),
              seq(
                // NonZeroDigit
                choice(
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                  "8",
                  "9",
                ),
                // DecimalDigitsUS
                repeat1(
                  // DecimalDigitUS
                  choice(
                    // DecimalDigit
                    choice(
                      "0",
                      // NonZeroDigit
                      choice(
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                      ),
                    ),
                    "_",
                  ),
                ),
              ),
            ),
            // BinaryInteger
            seq(
              // BinPrefix
              choice(
                "0b",
                "0B",
              ),
              // BinaryDigitsNoSingleUS
              choice(
                // BinaryDigit
                choice(
                  "0",
                  "1",
                ),
                seq(
                  // BinaryDigit
                  choice(
                    "0",
                    "1",
                  ),
                  // BinaryDigitsUS
                  repeat1(
                    // BinaryDigitUS
                    choice(
                      // BinaryDigit
                      choice(
                        "0",
                        "1",
                      ),
                      "_",
                    ),
                  ),
                ),
                seq(
                  // BinaryDigitsUS
                  repeat1(
                    // BinaryDigitUS
                    choice(
                      // BinaryDigit
                      choice(
                        "0",
                        "1",
                      ),
                      "_",
                    ),
                  ),
                  // BinaryDigit
                  choice(
                    "0",
                    "1",
                  ),
                ),
                seq(
                  // BinaryDigitsUS
                  repeat1(
                    // BinaryDigitUS
                    choice(
                      // BinaryDigit
                      choice(
                        "0",
                        "1",
                      ),
                      "_",
                    ),
                  ),
                  // BinaryDigit
                  choice(
                    "0",
                    "1",
                  ),
                  // BinaryDigitsUS
                  repeat1(
                    // BinaryDigitUS
                    choice(
                      // BinaryDigit
                      choice(
                        "0",
                        "1",
                      ),
                      "_",
                    ),
                  ),
                ),
              ),
            ),
            // HexadecimalInteger
            seq(
              // HexPrefix
              choice(
                "0x",
                "0X",
              ),
              // HexDigitsNoSingleUS
              choice(
                // HexDigit
                choice(
                  // DecimalDigit
                  choice(
                    "0",
                    // NonZeroDigit
                    choice(
                      "1",
                      "2",
                      "3",
                      "4",
                      "5",
                      "6",
                      "7",
                      "8",
                      "9",
                    ),
                  ),
                  // HexLetter
                  choice(
                    "a",
                    "b",
                    "c",
                    "d",
                    "e",
                    "f",
                    "A",
                    "B",
                    "C",
                    "D",
                    "E",
                    "F",
                  ),
                ),
                seq(
                  // HexDigit
                  choice(
                    // DecimalDigit
                    choice(
                      "0",
                      // NonZeroDigit
                      choice(
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                      ),
                    ),
                    // HexLetter
                    choice(
                      "a",
                      "b",
                      "c",
                      "d",
                      "e",
                      "f",
                      "A",
                      "B",
                      "C",
                      "D",
                      "E",
                      "F",
                    ),
                  ),
                  // HexDigitsUS
                  repeat1(
                    // HexDigitUS
                    choice(
                      // HexDigit
                      choice(
                        // DecimalDigit
                        choice(
                          "0",
                          // NonZeroDigit
                          choice(
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "6",
                            "7",
                            "8",
                            "9",
                          ),
                        ),
                        // HexLetter
                        choice(
                          "a",
                          "b",
                          "c",
                          "d",
                          "e",
                          "f",
                          "A",
                          "B",
                          "C",
                          "D",
                          "E",
                          "F",
                        ),
                      ),
                      "_",
                    ),
                  ),
                ),
                seq(
                  // HexDigitsUS
                  repeat1(
                    // HexDigitUS
                    choice(
                      // HexDigit
                      choice(
                        // DecimalDigit
                        choice(
                          "0",
                          // NonZeroDigit
                          choice(
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "6",
                            "7",
                            "8",
                            "9",
                          ),
                        ),
                        // HexLetter
                        choice(
                          "a",
                          "b",
                          "c",
                          "d",
                          "e",
                          "f",
                          "A",
                          "B",
                          "C",
                          "D",
                          "E",
                          "F",
                        ),
                      ),
                      "_",
                    ),
                  ),
                  // HexDigit
                  choice(
                    // DecimalDigit
                    choice(
                      "0",
                      // NonZeroDigit
                      choice(
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                      ),
                    ),
                    // HexLetter
                    choice(
                      "a",
                      "b",
                      "c",
                      "d",
                      "e",
                      "f",
                      "A",
                      "B",
                      "C",
                      "D",
                      "E",
                      "F",
                    ),
                  ),
                ),
              ),
            ),
          ),
          optional(
            // IntegerSuffix
            choice(
              "L",
              "u",
              "U",
              "Lu",
              "LU",
              "uL",
              "UL",
            ),
          ),
        ),
      ),

    // ---

    float_literal: $ =>
      token(
        // FloatLiteral
        choice(
          // Float
          choice(
            // DecimalFloat
            choice(
              seq(
                // LeadingDecimal
                choice(
                  // DecimalInteger
                  choice(
                    "0",
                    // NonZeroDigit
                    choice(
                      "1",
                      "2",
                      "3",
                      "4",
                      "5",
                      "6",
                      "7",
                      "8",
                      "9",
                    ),
                    seq(
                      // NonZeroDigit
                      choice(
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                      ),
                      // DecimalDigitsUS
                      repeat1(
                        // DecimalDigitUS
                        choice(
                          // DecimalDigit
                          choice(
                            "0",
                            // NonZeroDigit
                            choice(
                              "1",
                              "2",
                              "3",
                              "4",
                              "5",
                              "6",
                              "7",
                              "8",
                              "9",
                            ),
                          ),
                          "_",
                        ),
                      ),
                    ),
                  ),
                  seq(
                    "0",
                    // DecimalDigitsNoSingleUS
                    choice(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      seq(
                        // DecimalDigit
                        choice(
                          "0",
                          // NonZeroDigit
                          choice(
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "6",
                            "7",
                            "8",
                            "9",
                          ),
                        ),
                        // DecimalDigitsUS
                        repeat1(
                          // DecimalDigitUS
                          choice(
                            // DecimalDigit
                            choice(
                              "0",
                              // NonZeroDigit
                              choice(
                                "1",
                                "2",
                                "3",
                                "4",
                                "5",
                                "6",
                                "7",
                                "8",
                                "9",
                              ),
                            ),
                            "_",
                          ),
                        ),
                      ),
                      seq(
                        // DecimalDigitsUS
                        repeat1(
                          // DecimalDigitUS
                          choice(
                            // DecimalDigit
                            choice(
                              "0",
                              // NonZeroDigit
                              choice(
                                "1",
                                "2",
                                "3",
                                "4",
                                "5",
                                "6",
                                "7",
                                "8",
                                "9",
                              ),
                            ),
                            "_",
                          ),
                        ),
                        // DecimalDigit
                        choice(
                          "0",
                          // NonZeroDigit
                          choice(
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "6",
                            "7",
                            "8",
                            "9",
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
                ".",
              ),
              seq(
                // LeadingDecimal
                choice(
                  // DecimalInteger
                  choice(
                    "0",
                    // NonZeroDigit
                    choice(
                      "1",
                      "2",
                      "3",
                      "4",
                      "5",
                      "6",
                      "7",
                      "8",
                      "9",
                    ),
                    seq(
                      // NonZeroDigit
                      choice(
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                      ),
                      // DecimalDigitsUS
                      repeat1(
                        // DecimalDigitUS
                        choice(
                          // DecimalDigit
                          choice(
                            "0",
                            // NonZeroDigit
                            choice(
                              "1",
                              "2",
                              "3",
                              "4",
                              "5",
                              "6",
                              "7",
                              "8",
                              "9",
                            ),
                          ),
                          "_",
                        ),
                      ),
                    ),
                  ),
                  seq(
                    "0",
                    // DecimalDigitsNoSingleUS
                    choice(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      seq(
                        // DecimalDigit
                        choice(
                          "0",
                          // NonZeroDigit
                          choice(
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "6",
                            "7",
                            "8",
                            "9",
                          ),
                        ),
                        // DecimalDigitsUS
                        repeat1(
                          // DecimalDigitUS
                          choice(
                            // DecimalDigit
                            choice(
                              "0",
                              // NonZeroDigit
                              choice(
                                "1",
                                "2",
                                "3",
                                "4",
                                "5",
                                "6",
                                "7",
                                "8",
                                "9",
                              ),
                            ),
                            "_",
                          ),
                        ),
                      ),
                      seq(
                        // DecimalDigitsUS
                        repeat1(
                          // DecimalDigitUS
                          choice(
                            // DecimalDigit
                            choice(
                              "0",
                              // NonZeroDigit
                              choice(
                                "1",
                                "2",
                                "3",
                                "4",
                                "5",
                                "6",
                                "7",
                                "8",
                                "9",
                              ),
                            ),
                            "_",
                          ),
                        ),
                        // DecimalDigit
                        choice(
                          "0",
                          // NonZeroDigit
                          choice(
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "6",
                            "7",
                            "8",
                            "9",
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
                ".",
                // DecimalDigits
                repeat1(
                  // DecimalDigit
                  choice(
                    "0",
                    // NonZeroDigit
                    choice(
                      "1",
                      "2",
                      "3",
                      "4",
                      "5",
                      "6",
                      "7",
                      "8",
                      "9",
                    ),
                  ),
                ),
              ),
              seq(
                // DecimalDigits
                repeat1(
                  // DecimalDigit
                  choice(
                    "0",
                    // NonZeroDigit
                    choice(
                      "1",
                      "2",
                      "3",
                      "4",
                      "5",
                      "6",
                      "7",
                      "8",
                      "9",
                    ),
                  ),
                ),
                ".",
                // DecimalDigitsNoStartingUS
                seq(
                  // DecimalDigit
                  choice(
                    "0",
                    // NonZeroDigit
                    choice(
                      "1",
                      "2",
                      "3",
                      "4",
                      "5",
                      "6",
                      "7",
                      "8",
                      "9",
                    ),
                  ),
                  optional(
                    // DecimalDigitsUS
                    repeat1(
                      // DecimalDigitUS
                      choice(
                        // DecimalDigit
                        choice(
                          "0",
                          // NonZeroDigit
                          choice(
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "6",
                            "7",
                            "8",
                            "9",
                          ),
                        ),
                        "_",
                      ),
                    ),
                  ),
                ),
                // DecimalExponent
                seq(
                  // DecimalExponentStart
                  choice(
                    "e",
                    "E",
                    "e+",
                    "E+",
                    "e-",
                    "E-",
                  ),
                  // DecimalDigitsNoSingleUS
                  choice(
                    // DecimalDigit
                    choice(
                      "0",
                      // NonZeroDigit
                      choice(
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                      ),
                    ),
                    seq(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      // DecimalDigitsUS
                      repeat1(
                        // DecimalDigitUS
                        choice(
                          // DecimalDigit
                          choice(
                            "0",
                            // NonZeroDigit
                            choice(
                              "1",
                              "2",
                              "3",
                              "4",
                              "5",
                              "6",
                              "7",
                              "8",
                              "9",
                            ),
                          ),
                          "_",
                        ),
                      ),
                    ),
                    seq(
                      // DecimalDigitsUS
                      repeat1(
                        // DecimalDigitUS
                        choice(
                          // DecimalDigit
                          choice(
                            "0",
                            // NonZeroDigit
                            choice(
                              "1",
                              "2",
                              "3",
                              "4",
                              "5",
                              "6",
                              "7",
                              "8",
                              "9",
                            ),
                          ),
                          "_",
                        ),
                      ),
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              seq(
                ".",
                // DecimalInteger
                choice(
                  "0",
                  // NonZeroDigit
                  choice(
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                    "9",
                  ),
                  seq(
                    // NonZeroDigit
                    choice(
                      "1",
                      "2",
                      "3",
                      "4",
                      "5",
                      "6",
                      "7",
                      "8",
                      "9",
                    ),
                    // DecimalDigitsUS
                    repeat1(
                      // DecimalDigitUS
                      choice(
                        // DecimalDigit
                        choice(
                          "0",
                          // NonZeroDigit
                          choice(
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "6",
                            "7",
                            "8",
                            "9",
                          ),
                        ),
                        "_",
                      ),
                    ),
                  ),
                ),
              ),
              seq(
                ".",
                // DecimalInteger
                choice(
                  "0",
                  // NonZeroDigit
                  choice(
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                    "9",
                  ),
                  seq(
                    // NonZeroDigit
                    choice(
                      "1",
                      "2",
                      "3",
                      "4",
                      "5",
                      "6",
                      "7",
                      "8",
                      "9",
                    ),
                    // DecimalDigitsUS
                    repeat1(
                      // DecimalDigitUS
                      choice(
                        // DecimalDigit
                        choice(
                          "0",
                          // NonZeroDigit
                          choice(
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "6",
                            "7",
                            "8",
                            "9",
                          ),
                        ),
                        "_",
                      ),
                    ),
                  ),
                ),
                // DecimalExponent
                seq(
                  // DecimalExponentStart
                  choice(
                    "e",
                    "E",
                    "e+",
                    "E+",
                    "e-",
                    "E-",
                  ),
                  // DecimalDigitsNoSingleUS
                  choice(
                    // DecimalDigit
                    choice(
                      "0",
                      // NonZeroDigit
                      choice(
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                      ),
                    ),
                    seq(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      // DecimalDigitsUS
                      repeat1(
                        // DecimalDigitUS
                        choice(
                          // DecimalDigit
                          choice(
                            "0",
                            // NonZeroDigit
                            choice(
                              "1",
                              "2",
                              "3",
                              "4",
                              "5",
                              "6",
                              "7",
                              "8",
                              "9",
                            ),
                          ),
                          "_",
                        ),
                      ),
                    ),
                    seq(
                      // DecimalDigitsUS
                      repeat1(
                        // DecimalDigitUS
                        choice(
                          // DecimalDigit
                          choice(
                            "0",
                            // NonZeroDigit
                            choice(
                              "1",
                              "2",
                              "3",
                              "4",
                              "5",
                              "6",
                              "7",
                              "8",
                              "9",
                            ),
                          ),
                          "_",
                        ),
                      ),
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              seq(
                // LeadingDecimal
                choice(
                  // DecimalInteger
                  choice(
                    "0",
                    // NonZeroDigit
                    choice(
                      "1",
                      "2",
                      "3",
                      "4",
                      "5",
                      "6",
                      "7",
                      "8",
                      "9",
                    ),
                    seq(
                      // NonZeroDigit
                      choice(
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                      ),
                      // DecimalDigitsUS
                      repeat1(
                        // DecimalDigitUS
                        choice(
                          // DecimalDigit
                          choice(
                            "0",
                            // NonZeroDigit
                            choice(
                              "1",
                              "2",
                              "3",
                              "4",
                              "5",
                              "6",
                              "7",
                              "8",
                              "9",
                            ),
                          ),
                          "_",
                        ),
                      ),
                    ),
                  ),
                  seq(
                    "0",
                    // DecimalDigitsNoSingleUS
                    choice(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      seq(
                        // DecimalDigit
                        choice(
                          "0",
                          // NonZeroDigit
                          choice(
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "6",
                            "7",
                            "8",
                            "9",
                          ),
                        ),
                        // DecimalDigitsUS
                        repeat1(
                          // DecimalDigitUS
                          choice(
                            // DecimalDigit
                            choice(
                              "0",
                              // NonZeroDigit
                              choice(
                                "1",
                                "2",
                                "3",
                                "4",
                                "5",
                                "6",
                                "7",
                                "8",
                                "9",
                              ),
                            ),
                            "_",
                          ),
                        ),
                      ),
                      seq(
                        // DecimalDigitsUS
                        repeat1(
                          // DecimalDigitUS
                          choice(
                            // DecimalDigit
                            choice(
                              "0",
                              // NonZeroDigit
                              choice(
                                "1",
                                "2",
                                "3",
                                "4",
                                "5",
                                "6",
                                "7",
                                "8",
                                "9",
                              ),
                            ),
                            "_",
                          ),
                        ),
                        // DecimalDigit
                        choice(
                          "0",
                          // NonZeroDigit
                          choice(
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "6",
                            "7",
                            "8",
                            "9",
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
                // DecimalExponent
                seq(
                  // DecimalExponentStart
                  choice(
                    "e",
                    "E",
                    "e+",
                    "E+",
                    "e-",
                    "E-",
                  ),
                  // DecimalDigitsNoSingleUS
                  choice(
                    // DecimalDigit
                    choice(
                      "0",
                      // NonZeroDigit
                      choice(
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                      ),
                    ),
                    seq(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      // DecimalDigitsUS
                      repeat1(
                        // DecimalDigitUS
                        choice(
                          // DecimalDigit
                          choice(
                            "0",
                            // NonZeroDigit
                            choice(
                              "1",
                              "2",
                              "3",
                              "4",
                              "5",
                              "6",
                              "7",
                              "8",
                              "9",
                            ),
                          ),
                          "_",
                        ),
                      ),
                    ),
                    seq(
                      // DecimalDigitsUS
                      repeat1(
                        // DecimalDigitUS
                        choice(
                          // DecimalDigit
                          choice(
                            "0",
                            // NonZeroDigit
                            choice(
                              "1",
                              "2",
                              "3",
                              "4",
                              "5",
                              "6",
                              "7",
                              "8",
                              "9",
                            ),
                          ),
                          "_",
                        ),
                      ),
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
            // HexFloat
            choice(
              seq(
                // HexPrefix
                choice(
                  "0x",
                  "0X",
                ),
                // HexDigitsNoSingleUS
                choice(
                  // HexDigit
                  choice(
                    // DecimalDigit
                    choice(
                      "0",
                      // NonZeroDigit
                      choice(
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                      ),
                    ),
                    // HexLetter
                    choice(
                      "a",
                      "b",
                      "c",
                      "d",
                      "e",
                      "f",
                      "A",
                      "B",
                      "C",
                      "D",
                      "E",
                      "F",
                    ),
                  ),
                  seq(
                    // HexDigit
                    choice(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      // HexLetter
                      choice(
                        "a",
                        "b",
                        "c",
                        "d",
                        "e",
                        "f",
                        "A",
                        "B",
                        "C",
                        "D",
                        "E",
                        "F",
                      ),
                    ),
                    // HexDigitsUS
                    repeat1(
                      // HexDigitUS
                      choice(
                        // HexDigit
                        choice(
                          // DecimalDigit
                          choice(
                            "0",
                            // NonZeroDigit
                            choice(
                              "1",
                              "2",
                              "3",
                              "4",
                              "5",
                              "6",
                              "7",
                              "8",
                              "9",
                            ),
                          ),
                          // HexLetter
                          choice(
                            "a",
                            "b",
                            "c",
                            "d",
                            "e",
                            "f",
                            "A",
                            "B",
                            "C",
                            "D",
                            "E",
                            "F",
                          ),
                        ),
                        "_",
                      ),
                    ),
                  ),
                  seq(
                    // HexDigitsUS
                    repeat1(
                      // HexDigitUS
                      choice(
                        // HexDigit
                        choice(
                          // DecimalDigit
                          choice(
                            "0",
                            // NonZeroDigit
                            choice(
                              "1",
                              "2",
                              "3",
                              "4",
                              "5",
                              "6",
                              "7",
                              "8",
                              "9",
                            ),
                          ),
                          // HexLetter
                          choice(
                            "a",
                            "b",
                            "c",
                            "d",
                            "e",
                            "f",
                            "A",
                            "B",
                            "C",
                            "D",
                            "E",
                            "F",
                          ),
                        ),
                        "_",
                      ),
                    ),
                    // HexDigit
                    choice(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      // HexLetter
                      choice(
                        "a",
                        "b",
                        "c",
                        "d",
                        "e",
                        "f",
                        "A",
                        "B",
                        "C",
                        "D",
                        "E",
                        "F",
                      ),
                    ),
                  ),
                ),
                ".",
                // HexDigitsNoStartingUS
                seq(
                  // HexDigit
                  choice(
                    // DecimalDigit
                    choice(
                      "0",
                      // NonZeroDigit
                      choice(
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                      ),
                    ),
                    // HexLetter
                    choice(
                      "a",
                      "b",
                      "c",
                      "d",
                      "e",
                      "f",
                      "A",
                      "B",
                      "C",
                      "D",
                      "E",
                      "F",
                    ),
                  ),
                  optional(
                    // HexDigitsUS
                    repeat1(
                      // HexDigitUS
                      choice(
                        // HexDigit
                        choice(
                          // DecimalDigit
                          choice(
                            "0",
                            // NonZeroDigit
                            choice(
                              "1",
                              "2",
                              "3",
                              "4",
                              "5",
                              "6",
                              "7",
                              "8",
                              "9",
                            ),
                          ),
                          // HexLetter
                          choice(
                            "a",
                            "b",
                            "c",
                            "d",
                            "e",
                            "f",
                            "A",
                            "B",
                            "C",
                            "D",
                            "E",
                            "F",
                          ),
                        ),
                        "_",
                      ),
                    ),
                  ),
                ),
                // HexExponent
                seq(
                  // HexExponentStart
                  choice(
                    "p",
                    "P",
                    "p+",
                    "P+",
                    "p-",
                    "P-",
                  ),
                  // DecimalDigitsNoSingleUS
                  choice(
                    // DecimalDigit
                    choice(
                      "0",
                      // NonZeroDigit
                      choice(
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                      ),
                    ),
                    seq(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      // DecimalDigitsUS
                      repeat1(
                        // DecimalDigitUS
                        choice(
                          // DecimalDigit
                          choice(
                            "0",
                            // NonZeroDigit
                            choice(
                              "1",
                              "2",
                              "3",
                              "4",
                              "5",
                              "6",
                              "7",
                              "8",
                              "9",
                            ),
                          ),
                          "_",
                        ),
                      ),
                    ),
                    seq(
                      // DecimalDigitsUS
                      repeat1(
                        // DecimalDigitUS
                        choice(
                          // DecimalDigit
                          choice(
                            "0",
                            // NonZeroDigit
                            choice(
                              "1",
                              "2",
                              "3",
                              "4",
                              "5",
                              "6",
                              "7",
                              "8",
                              "9",
                            ),
                          ),
                          "_",
                        ),
                      ),
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              seq(
                // HexPrefix
                choice(
                  "0x",
                  "0X",
                ),
                ".",
                // HexDigitsNoStartingUS
                seq(
                  // HexDigit
                  choice(
                    // DecimalDigit
                    choice(
                      "0",
                      // NonZeroDigit
                      choice(
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                      ),
                    ),
                    // HexLetter
                    choice(
                      "a",
                      "b",
                      "c",
                      "d",
                      "e",
                      "f",
                      "A",
                      "B",
                      "C",
                      "D",
                      "E",
                      "F",
                    ),
                  ),
                  optional(
                    // HexDigitsUS
                    repeat1(
                      // HexDigitUS
                      choice(
                        // HexDigit
                        choice(
                          // DecimalDigit
                          choice(
                            "0",
                            // NonZeroDigit
                            choice(
                              "1",
                              "2",
                              "3",
                              "4",
                              "5",
                              "6",
                              "7",
                              "8",
                              "9",
                            ),
                          ),
                          // HexLetter
                          choice(
                            "a",
                            "b",
                            "c",
                            "d",
                            "e",
                            "f",
                            "A",
                            "B",
                            "C",
                            "D",
                            "E",
                            "F",
                          ),
                        ),
                        "_",
                      ),
                    ),
                  ),
                ),
                // HexExponent
                seq(
                  // HexExponentStart
                  choice(
                    "p",
                    "P",
                    "p+",
                    "P+",
                    "p-",
                    "P-",
                  ),
                  // DecimalDigitsNoSingleUS
                  choice(
                    // DecimalDigit
                    choice(
                      "0",
                      // NonZeroDigit
                      choice(
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                      ),
                    ),
                    seq(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      // DecimalDigitsUS
                      repeat1(
                        // DecimalDigitUS
                        choice(
                          // DecimalDigit
                          choice(
                            "0",
                            // NonZeroDigit
                            choice(
                              "1",
                              "2",
                              "3",
                              "4",
                              "5",
                              "6",
                              "7",
                              "8",
                              "9",
                            ),
                          ),
                          "_",
                        ),
                      ),
                    ),
                    seq(
                      // DecimalDigitsUS
                      repeat1(
                        // DecimalDigitUS
                        choice(
                          // DecimalDigit
                          choice(
                            "0",
                            // NonZeroDigit
                            choice(
                              "1",
                              "2",
                              "3",
                              "4",
                              "5",
                              "6",
                              "7",
                              "8",
                              "9",
                            ),
                          ),
                          "_",
                        ),
                      ),
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              seq(
                // HexPrefix
                choice(
                  "0x",
                  "0X",
                ),
                // HexDigitsNoSingleUS
                choice(
                  // HexDigit
                  choice(
                    // DecimalDigit
                    choice(
                      "0",
                      // NonZeroDigit
                      choice(
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                      ),
                    ),
                    // HexLetter
                    choice(
                      "a",
                      "b",
                      "c",
                      "d",
                      "e",
                      "f",
                      "A",
                      "B",
                      "C",
                      "D",
                      "E",
                      "F",
                    ),
                  ),
                  seq(
                    // HexDigit
                    choice(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      // HexLetter
                      choice(
                        "a",
                        "b",
                        "c",
                        "d",
                        "e",
                        "f",
                        "A",
                        "B",
                        "C",
                        "D",
                        "E",
                        "F",
                      ),
                    ),
                    // HexDigitsUS
                    repeat1(
                      // HexDigitUS
                      choice(
                        // HexDigit
                        choice(
                          // DecimalDigit
                          choice(
                            "0",
                            // NonZeroDigit
                            choice(
                              "1",
                              "2",
                              "3",
                              "4",
                              "5",
                              "6",
                              "7",
                              "8",
                              "9",
                            ),
                          ),
                          // HexLetter
                          choice(
                            "a",
                            "b",
                            "c",
                            "d",
                            "e",
                            "f",
                            "A",
                            "B",
                            "C",
                            "D",
                            "E",
                            "F",
                          ),
                        ),
                        "_",
                      ),
                    ),
                  ),
                  seq(
                    // HexDigitsUS
                    repeat1(
                      // HexDigitUS
                      choice(
                        // HexDigit
                        choice(
                          // DecimalDigit
                          choice(
                            "0",
                            // NonZeroDigit
                            choice(
                              "1",
                              "2",
                              "3",
                              "4",
                              "5",
                              "6",
                              "7",
                              "8",
                              "9",
                            ),
                          ),
                          // HexLetter
                          choice(
                            "a",
                            "b",
                            "c",
                            "d",
                            "e",
                            "f",
                            "A",
                            "B",
                            "C",
                            "D",
                            "E",
                            "F",
                          ),
                        ),
                        "_",
                      ),
                    ),
                    // HexDigit
                    choice(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      // HexLetter
                      choice(
                        "a",
                        "b",
                        "c",
                        "d",
                        "e",
                        "f",
                        "A",
                        "B",
                        "C",
                        "D",
                        "E",
                        "F",
                      ),
                    ),
                  ),
                ),
                // HexExponent
                seq(
                  // HexExponentStart
                  choice(
                    "p",
                    "P",
                    "p+",
                    "P+",
                    "p-",
                    "P-",
                  ),
                  // DecimalDigitsNoSingleUS
                  choice(
                    // DecimalDigit
                    choice(
                      "0",
                      // NonZeroDigit
                      choice(
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                      ),
                    ),
                    seq(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      // DecimalDigitsUS
                      repeat1(
                        // DecimalDigitUS
                        choice(
                          // DecimalDigit
                          choice(
                            "0",
                            // NonZeroDigit
                            choice(
                              "1",
                              "2",
                              "3",
                              "4",
                              "5",
                              "6",
                              "7",
                              "8",
                              "9",
                            ),
                          ),
                          "_",
                        ),
                      ),
                    ),
                    seq(
                      // DecimalDigitsUS
                      repeat1(
                        // DecimalDigitUS
                        choice(
                          // DecimalDigit
                          choice(
                            "0",
                            // NonZeroDigit
                            choice(
                              "1",
                              "2",
                              "3",
                              "4",
                              "5",
                              "6",
                              "7",
                              "8",
                              "9",
                            ),
                          ),
                          "_",
                        ),
                      ),
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
          seq(
            // Float
            choice(
              // DecimalFloat
              choice(
                seq(
                  // LeadingDecimal
                  choice(
                    // DecimalInteger
                    choice(
                      "0",
                      // NonZeroDigit
                      choice(
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                      ),
                      seq(
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                        // DecimalDigitsUS
                        repeat1(
                          // DecimalDigitUS
                          choice(
                            // DecimalDigit
                            choice(
                              "0",
                              // NonZeroDigit
                              choice(
                                "1",
                                "2",
                                "3",
                                "4",
                                "5",
                                "6",
                                "7",
                                "8",
                                "9",
                              ),
                            ),
                            "_",
                          ),
                        ),
                      ),
                    ),
                    seq(
                      "0",
                      // DecimalDigitsNoSingleUS
                      choice(
                        // DecimalDigit
                        choice(
                          "0",
                          // NonZeroDigit
                          choice(
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "6",
                            "7",
                            "8",
                            "9",
                          ),
                        ),
                        seq(
                          // DecimalDigit
                          choice(
                            "0",
                            // NonZeroDigit
                            choice(
                              "1",
                              "2",
                              "3",
                              "4",
                              "5",
                              "6",
                              "7",
                              "8",
                              "9",
                            ),
                          ),
                          // DecimalDigitsUS
                          repeat1(
                            // DecimalDigitUS
                            choice(
                              // DecimalDigit
                              choice(
                                "0",
                                // NonZeroDigit
                                choice(
                                  "1",
                                  "2",
                                  "3",
                                  "4",
                                  "5",
                                  "6",
                                  "7",
                                  "8",
                                  "9",
                                ),
                              ),
                              "_",
                            ),
                          ),
                        ),
                        seq(
                          // DecimalDigitsUS
                          repeat1(
                            // DecimalDigitUS
                            choice(
                              // DecimalDigit
                              choice(
                                "0",
                                // NonZeroDigit
                                choice(
                                  "1",
                                  "2",
                                  "3",
                                  "4",
                                  "5",
                                  "6",
                                  "7",
                                  "8",
                                  "9",
                                ),
                              ),
                              "_",
                            ),
                          ),
                          // DecimalDigit
                          choice(
                            "0",
                            // NonZeroDigit
                            choice(
                              "1",
                              "2",
                              "3",
                              "4",
                              "5",
                              "6",
                              "7",
                              "8",
                              "9",
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                  ".",
                ),
                seq(
                  // LeadingDecimal
                  choice(
                    // DecimalInteger
                    choice(
                      "0",
                      // NonZeroDigit
                      choice(
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                      ),
                      seq(
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                        // DecimalDigitsUS
                        repeat1(
                          // DecimalDigitUS
                          choice(
                            // DecimalDigit
                            choice(
                              "0",
                              // NonZeroDigit
                              choice(
                                "1",
                                "2",
                                "3",
                                "4",
                                "5",
                                "6",
                                "7",
                                "8",
                                "9",
                              ),
                            ),
                            "_",
                          ),
                        ),
                      ),
                    ),
                    seq(
                      "0",
                      // DecimalDigitsNoSingleUS
                      choice(
                        // DecimalDigit
                        choice(
                          "0",
                          // NonZeroDigit
                          choice(
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "6",
                            "7",
                            "8",
                            "9",
                          ),
                        ),
                        seq(
                          // DecimalDigit
                          choice(
                            "0",
                            // NonZeroDigit
                            choice(
                              "1",
                              "2",
                              "3",
                              "4",
                              "5",
                              "6",
                              "7",
                              "8",
                              "9",
                            ),
                          ),
                          // DecimalDigitsUS
                          repeat1(
                            // DecimalDigitUS
                            choice(
                              // DecimalDigit
                              choice(
                                "0",
                                // NonZeroDigit
                                choice(
                                  "1",
                                  "2",
                                  "3",
                                  "4",
                                  "5",
                                  "6",
                                  "7",
                                  "8",
                                  "9",
                                ),
                              ),
                              "_",
                            ),
                          ),
                        ),
                        seq(
                          // DecimalDigitsUS
                          repeat1(
                            // DecimalDigitUS
                            choice(
                              // DecimalDigit
                              choice(
                                "0",
                                // NonZeroDigit
                                choice(
                                  "1",
                                  "2",
                                  "3",
                                  "4",
                                  "5",
                                  "6",
                                  "7",
                                  "8",
                                  "9",
                                ),
                              ),
                              "_",
                            ),
                          ),
                          // DecimalDigit
                          choice(
                            "0",
                            // NonZeroDigit
                            choice(
                              "1",
                              "2",
                              "3",
                              "4",
                              "5",
                              "6",
                              "7",
                              "8",
                              "9",
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                  ".",
                  // DecimalDigits
                  repeat1(
                    // DecimalDigit
                    choice(
                      "0",
                      // NonZeroDigit
                      choice(
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                      ),
                    ),
                  ),
                ),
                seq(
                  // DecimalDigits
                  repeat1(
                    // DecimalDigit
                    choice(
                      "0",
                      // NonZeroDigit
                      choice(
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                      ),
                    ),
                  ),
                  ".",
                  // DecimalDigitsNoStartingUS
                  seq(
                    // DecimalDigit
                    choice(
                      "0",
                      // NonZeroDigit
                      choice(
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                      ),
                    ),
                    optional(
                      // DecimalDigitsUS
                      repeat1(
                        // DecimalDigitUS
                        choice(
                          // DecimalDigit
                          choice(
                            "0",
                            // NonZeroDigit
                            choice(
                              "1",
                              "2",
                              "3",
                              "4",
                              "5",
                              "6",
                              "7",
                              "8",
                              "9",
                            ),
                          ),
                          "_",
                        ),
                      ),
                    ),
                  ),
                  // DecimalExponent
                  seq(
                    // DecimalExponentStart
                    choice(
                      "e",
                      "E",
                      "e+",
                      "E+",
                      "e-",
                      "E-",
                    ),
                    // DecimalDigitsNoSingleUS
                    choice(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      seq(
                        // DecimalDigit
                        choice(
                          "0",
                          // NonZeroDigit
                          choice(
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "6",
                            "7",
                            "8",
                            "9",
                          ),
                        ),
                        // DecimalDigitsUS
                        repeat1(
                          // DecimalDigitUS
                          choice(
                            // DecimalDigit
                            choice(
                              "0",
                              // NonZeroDigit
                              choice(
                                "1",
                                "2",
                                "3",
                                "4",
                                "5",
                                "6",
                                "7",
                                "8",
                                "9",
                              ),
                            ),
                            "_",
                          ),
                        ),
                      ),
                      seq(
                        // DecimalDigitsUS
                        repeat1(
                          // DecimalDigitUS
                          choice(
                            // DecimalDigit
                            choice(
                              "0",
                              // NonZeroDigit
                              choice(
                                "1",
                                "2",
                                "3",
                                "4",
                                "5",
                                "6",
                                "7",
                                "8",
                                "9",
                              ),
                            ),
                            "_",
                          ),
                        ),
                        // DecimalDigit
                        choice(
                          "0",
                          // NonZeroDigit
                          choice(
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "6",
                            "7",
                            "8",
                            "9",
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
                seq(
                  ".",
                  // DecimalInteger
                  choice(
                    "0",
                    // NonZeroDigit
                    choice(
                      "1",
                      "2",
                      "3",
                      "4",
                      "5",
                      "6",
                      "7",
                      "8",
                      "9",
                    ),
                    seq(
                      // NonZeroDigit
                      choice(
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                      ),
                      // DecimalDigitsUS
                      repeat1(
                        // DecimalDigitUS
                        choice(
                          // DecimalDigit
                          choice(
                            "0",
                            // NonZeroDigit
                            choice(
                              "1",
                              "2",
                              "3",
                              "4",
                              "5",
                              "6",
                              "7",
                              "8",
                              "9",
                            ),
                          ),
                          "_",
                        ),
                      ),
                    ),
                  ),
                ),
                seq(
                  ".",
                  // DecimalInteger
                  choice(
                    "0",
                    // NonZeroDigit
                    choice(
                      "1",
                      "2",
                      "3",
                      "4",
                      "5",
                      "6",
                      "7",
                      "8",
                      "9",
                    ),
                    seq(
                      // NonZeroDigit
                      choice(
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                      ),
                      // DecimalDigitsUS
                      repeat1(
                        // DecimalDigitUS
                        choice(
                          // DecimalDigit
                          choice(
                            "0",
                            // NonZeroDigit
                            choice(
                              "1",
                              "2",
                              "3",
                              "4",
                              "5",
                              "6",
                              "7",
                              "8",
                              "9",
                            ),
                          ),
                          "_",
                        ),
                      ),
                    ),
                  ),
                  // DecimalExponent
                  seq(
                    // DecimalExponentStart
                    choice(
                      "e",
                      "E",
                      "e+",
                      "E+",
                      "e-",
                      "E-",
                    ),
                    // DecimalDigitsNoSingleUS
                    choice(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      seq(
                        // DecimalDigit
                        choice(
                          "0",
                          // NonZeroDigit
                          choice(
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "6",
                            "7",
                            "8",
                            "9",
                          ),
                        ),
                        // DecimalDigitsUS
                        repeat1(
                          // DecimalDigitUS
                          choice(
                            // DecimalDigit
                            choice(
                              "0",
                              // NonZeroDigit
                              choice(
                                "1",
                                "2",
                                "3",
                                "4",
                                "5",
                                "6",
                                "7",
                                "8",
                                "9",
                              ),
                            ),
                            "_",
                          ),
                        ),
                      ),
                      seq(
                        // DecimalDigitsUS
                        repeat1(
                          // DecimalDigitUS
                          choice(
                            // DecimalDigit
                            choice(
                              "0",
                              // NonZeroDigit
                              choice(
                                "1",
                                "2",
                                "3",
                                "4",
                                "5",
                                "6",
                                "7",
                                "8",
                                "9",
                              ),
                            ),
                            "_",
                          ),
                        ),
                        // DecimalDigit
                        choice(
                          "0",
                          // NonZeroDigit
                          choice(
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "6",
                            "7",
                            "8",
                            "9",
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
                seq(
                  // LeadingDecimal
                  choice(
                    // DecimalInteger
                    choice(
                      "0",
                      // NonZeroDigit
                      choice(
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                      ),
                      seq(
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                        // DecimalDigitsUS
                        repeat1(
                          // DecimalDigitUS
                          choice(
                            // DecimalDigit
                            choice(
                              "0",
                              // NonZeroDigit
                              choice(
                                "1",
                                "2",
                                "3",
                                "4",
                                "5",
                                "6",
                                "7",
                                "8",
                                "9",
                              ),
                            ),
                            "_",
                          ),
                        ),
                      ),
                    ),
                    seq(
                      "0",
                      // DecimalDigitsNoSingleUS
                      choice(
                        // DecimalDigit
                        choice(
                          "0",
                          // NonZeroDigit
                          choice(
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "6",
                            "7",
                            "8",
                            "9",
                          ),
                        ),
                        seq(
                          // DecimalDigit
                          choice(
                            "0",
                            // NonZeroDigit
                            choice(
                              "1",
                              "2",
                              "3",
                              "4",
                              "5",
                              "6",
                              "7",
                              "8",
                              "9",
                            ),
                          ),
                          // DecimalDigitsUS
                          repeat1(
                            // DecimalDigitUS
                            choice(
                              // DecimalDigit
                              choice(
                                "0",
                                // NonZeroDigit
                                choice(
                                  "1",
                                  "2",
                                  "3",
                                  "4",
                                  "5",
                                  "6",
                                  "7",
                                  "8",
                                  "9",
                                ),
                              ),
                              "_",
                            ),
                          ),
                        ),
                        seq(
                          // DecimalDigitsUS
                          repeat1(
                            // DecimalDigitUS
                            choice(
                              // DecimalDigit
                              choice(
                                "0",
                                // NonZeroDigit
                                choice(
                                  "1",
                                  "2",
                                  "3",
                                  "4",
                                  "5",
                                  "6",
                                  "7",
                                  "8",
                                  "9",
                                ),
                              ),
                              "_",
                            ),
                          ),
                          // DecimalDigit
                          choice(
                            "0",
                            // NonZeroDigit
                            choice(
                              "1",
                              "2",
                              "3",
                              "4",
                              "5",
                              "6",
                              "7",
                              "8",
                              "9",
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                  // DecimalExponent
                  seq(
                    // DecimalExponentStart
                    choice(
                      "e",
                      "E",
                      "e+",
                      "E+",
                      "e-",
                      "E-",
                    ),
                    // DecimalDigitsNoSingleUS
                    choice(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      seq(
                        // DecimalDigit
                        choice(
                          "0",
                          // NonZeroDigit
                          choice(
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "6",
                            "7",
                            "8",
                            "9",
                          ),
                        ),
                        // DecimalDigitsUS
                        repeat1(
                          // DecimalDigitUS
                          choice(
                            // DecimalDigit
                            choice(
                              "0",
                              // NonZeroDigit
                              choice(
                                "1",
                                "2",
                                "3",
                                "4",
                                "5",
                                "6",
                                "7",
                                "8",
                                "9",
                              ),
                            ),
                            "_",
                          ),
                        ),
                      ),
                      seq(
                        // DecimalDigitsUS
                        repeat1(
                          // DecimalDigitUS
                          choice(
                            // DecimalDigit
                            choice(
                              "0",
                              // NonZeroDigit
                              choice(
                                "1",
                                "2",
                                "3",
                                "4",
                                "5",
                                "6",
                                "7",
                                "8",
                                "9",
                              ),
                            ),
                            "_",
                          ),
                        ),
                        // DecimalDigit
                        choice(
                          "0",
                          // NonZeroDigit
                          choice(
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "6",
                            "7",
                            "8",
                            "9",
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              // HexFloat
              choice(
                seq(
                  // HexPrefix
                  choice(
                    "0x",
                    "0X",
                  ),
                  // HexDigitsNoSingleUS
                  choice(
                    // HexDigit
                    choice(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      // HexLetter
                      choice(
                        "a",
                        "b",
                        "c",
                        "d",
                        "e",
                        "f",
                        "A",
                        "B",
                        "C",
                        "D",
                        "E",
                        "F",
                      ),
                    ),
                    seq(
                      // HexDigit
                      choice(
                        // DecimalDigit
                        choice(
                          "0",
                          // NonZeroDigit
                          choice(
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "6",
                            "7",
                            "8",
                            "9",
                          ),
                        ),
                        // HexLetter
                        choice(
                          "a",
                          "b",
                          "c",
                          "d",
                          "e",
                          "f",
                          "A",
                          "B",
                          "C",
                          "D",
                          "E",
                          "F",
                        ),
                      ),
                      // HexDigitsUS
                      repeat1(
                        // HexDigitUS
                        choice(
                          // HexDigit
                          choice(
                            // DecimalDigit
                            choice(
                              "0",
                              // NonZeroDigit
                              choice(
                                "1",
                                "2",
                                "3",
                                "4",
                                "5",
                                "6",
                                "7",
                                "8",
                                "9",
                              ),
                            ),
                            // HexLetter
                            choice(
                              "a",
                              "b",
                              "c",
                              "d",
                              "e",
                              "f",
                              "A",
                              "B",
                              "C",
                              "D",
                              "E",
                              "F",
                            ),
                          ),
                          "_",
                        ),
                      ),
                    ),
                    seq(
                      // HexDigitsUS
                      repeat1(
                        // HexDigitUS
                        choice(
                          // HexDigit
                          choice(
                            // DecimalDigit
                            choice(
                              "0",
                              // NonZeroDigit
                              choice(
                                "1",
                                "2",
                                "3",
                                "4",
                                "5",
                                "6",
                                "7",
                                "8",
                                "9",
                              ),
                            ),
                            // HexLetter
                            choice(
                              "a",
                              "b",
                              "c",
                              "d",
                              "e",
                              "f",
                              "A",
                              "B",
                              "C",
                              "D",
                              "E",
                              "F",
                            ),
                          ),
                          "_",
                        ),
                      ),
                      // HexDigit
                      choice(
                        // DecimalDigit
                        choice(
                          "0",
                          // NonZeroDigit
                          choice(
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "6",
                            "7",
                            "8",
                            "9",
                          ),
                        ),
                        // HexLetter
                        choice(
                          "a",
                          "b",
                          "c",
                          "d",
                          "e",
                          "f",
                          "A",
                          "B",
                          "C",
                          "D",
                          "E",
                          "F",
                        ),
                      ),
                    ),
                  ),
                  ".",
                  // HexDigitsNoStartingUS
                  seq(
                    // HexDigit
                    choice(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      // HexLetter
                      choice(
                        "a",
                        "b",
                        "c",
                        "d",
                        "e",
                        "f",
                        "A",
                        "B",
                        "C",
                        "D",
                        "E",
                        "F",
                      ),
                    ),
                    optional(
                      // HexDigitsUS
                      repeat1(
                        // HexDigitUS
                        choice(
                          // HexDigit
                          choice(
                            // DecimalDigit
                            choice(
                              "0",
                              // NonZeroDigit
                              choice(
                                "1",
                                "2",
                                "3",
                                "4",
                                "5",
                                "6",
                                "7",
                                "8",
                                "9",
                              ),
                            ),
                            // HexLetter
                            choice(
                              "a",
                              "b",
                              "c",
                              "d",
                              "e",
                              "f",
                              "A",
                              "B",
                              "C",
                              "D",
                              "E",
                              "F",
                            ),
                          ),
                          "_",
                        ),
                      ),
                    ),
                  ),
                  // HexExponent
                  seq(
                    // HexExponentStart
                    choice(
                      "p",
                      "P",
                      "p+",
                      "P+",
                      "p-",
                      "P-",
                    ),
                    // DecimalDigitsNoSingleUS
                    choice(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      seq(
                        // DecimalDigit
                        choice(
                          "0",
                          // NonZeroDigit
                          choice(
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "6",
                            "7",
                            "8",
                            "9",
                          ),
                        ),
                        // DecimalDigitsUS
                        repeat1(
                          // DecimalDigitUS
                          choice(
                            // DecimalDigit
                            choice(
                              "0",
                              // NonZeroDigit
                              choice(
                                "1",
                                "2",
                                "3",
                                "4",
                                "5",
                                "6",
                                "7",
                                "8",
                                "9",
                              ),
                            ),
                            "_",
                          ),
                        ),
                      ),
                      seq(
                        // DecimalDigitsUS
                        repeat1(
                          // DecimalDigitUS
                          choice(
                            // DecimalDigit
                            choice(
                              "0",
                              // NonZeroDigit
                              choice(
                                "1",
                                "2",
                                "3",
                                "4",
                                "5",
                                "6",
                                "7",
                                "8",
                                "9",
                              ),
                            ),
                            "_",
                          ),
                        ),
                        // DecimalDigit
                        choice(
                          "0",
                          // NonZeroDigit
                          choice(
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "6",
                            "7",
                            "8",
                            "9",
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
                seq(
                  // HexPrefix
                  choice(
                    "0x",
                    "0X",
                  ),
                  ".",
                  // HexDigitsNoStartingUS
                  seq(
                    // HexDigit
                    choice(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      // HexLetter
                      choice(
                        "a",
                        "b",
                        "c",
                        "d",
                        "e",
                        "f",
                        "A",
                        "B",
                        "C",
                        "D",
                        "E",
                        "F",
                      ),
                    ),
                    optional(
                      // HexDigitsUS
                      repeat1(
                        // HexDigitUS
                        choice(
                          // HexDigit
                          choice(
                            // DecimalDigit
                            choice(
                              "0",
                              // NonZeroDigit
                              choice(
                                "1",
                                "2",
                                "3",
                                "4",
                                "5",
                                "6",
                                "7",
                                "8",
                                "9",
                              ),
                            ),
                            // HexLetter
                            choice(
                              "a",
                              "b",
                              "c",
                              "d",
                              "e",
                              "f",
                              "A",
                              "B",
                              "C",
                              "D",
                              "E",
                              "F",
                            ),
                          ),
                          "_",
                        ),
                      ),
                    ),
                  ),
                  // HexExponent
                  seq(
                    // HexExponentStart
                    choice(
                      "p",
                      "P",
                      "p+",
                      "P+",
                      "p-",
                      "P-",
                    ),
                    // DecimalDigitsNoSingleUS
                    choice(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      seq(
                        // DecimalDigit
                        choice(
                          "0",
                          // NonZeroDigit
                          choice(
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "6",
                            "7",
                            "8",
                            "9",
                          ),
                        ),
                        // DecimalDigitsUS
                        repeat1(
                          // DecimalDigitUS
                          choice(
                            // DecimalDigit
                            choice(
                              "0",
                              // NonZeroDigit
                              choice(
                                "1",
                                "2",
                                "3",
                                "4",
                                "5",
                                "6",
                                "7",
                                "8",
                                "9",
                              ),
                            ),
                            "_",
                          ),
                        ),
                      ),
                      seq(
                        // DecimalDigitsUS
                        repeat1(
                          // DecimalDigitUS
                          choice(
                            // DecimalDigit
                            choice(
                              "0",
                              // NonZeroDigit
                              choice(
                                "1",
                                "2",
                                "3",
                                "4",
                                "5",
                                "6",
                                "7",
                                "8",
                                "9",
                              ),
                            ),
                            "_",
                          ),
                        ),
                        // DecimalDigit
                        choice(
                          "0",
                          // NonZeroDigit
                          choice(
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "6",
                            "7",
                            "8",
                            "9",
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
                seq(
                  // HexPrefix
                  choice(
                    "0x",
                    "0X",
                  ),
                  // HexDigitsNoSingleUS
                  choice(
                    // HexDigit
                    choice(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      // HexLetter
                      choice(
                        "a",
                        "b",
                        "c",
                        "d",
                        "e",
                        "f",
                        "A",
                        "B",
                        "C",
                        "D",
                        "E",
                        "F",
                      ),
                    ),
                    seq(
                      // HexDigit
                      choice(
                        // DecimalDigit
                        choice(
                          "0",
                          // NonZeroDigit
                          choice(
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "6",
                            "7",
                            "8",
                            "9",
                          ),
                        ),
                        // HexLetter
                        choice(
                          "a",
                          "b",
                          "c",
                          "d",
                          "e",
                          "f",
                          "A",
                          "B",
                          "C",
                          "D",
                          "E",
                          "F",
                        ),
                      ),
                      // HexDigitsUS
                      repeat1(
                        // HexDigitUS
                        choice(
                          // HexDigit
                          choice(
                            // DecimalDigit
                            choice(
                              "0",
                              // NonZeroDigit
                              choice(
                                "1",
                                "2",
                                "3",
                                "4",
                                "5",
                                "6",
                                "7",
                                "8",
                                "9",
                              ),
                            ),
                            // HexLetter
                            choice(
                              "a",
                              "b",
                              "c",
                              "d",
                              "e",
                              "f",
                              "A",
                              "B",
                              "C",
                              "D",
                              "E",
                              "F",
                            ),
                          ),
                          "_",
                        ),
                      ),
                    ),
                    seq(
                      // HexDigitsUS
                      repeat1(
                        // HexDigitUS
                        choice(
                          // HexDigit
                          choice(
                            // DecimalDigit
                            choice(
                              "0",
                              // NonZeroDigit
                              choice(
                                "1",
                                "2",
                                "3",
                                "4",
                                "5",
                                "6",
                                "7",
                                "8",
                                "9",
                              ),
                            ),
                            // HexLetter
                            choice(
                              "a",
                              "b",
                              "c",
                              "d",
                              "e",
                              "f",
                              "A",
                              "B",
                              "C",
                              "D",
                              "E",
                              "F",
                            ),
                          ),
                          "_",
                        ),
                      ),
                      // HexDigit
                      choice(
                        // DecimalDigit
                        choice(
                          "0",
                          // NonZeroDigit
                          choice(
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "6",
                            "7",
                            "8",
                            "9",
                          ),
                        ),
                        // HexLetter
                        choice(
                          "a",
                          "b",
                          "c",
                          "d",
                          "e",
                          "f",
                          "A",
                          "B",
                          "C",
                          "D",
                          "E",
                          "F",
                        ),
                      ),
                    ),
                  ),
                  // HexExponent
                  seq(
                    // HexExponentStart
                    choice(
                      "p",
                      "P",
                      "p+",
                      "P+",
                      "p-",
                      "P-",
                    ),
                    // DecimalDigitsNoSingleUS
                    choice(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      seq(
                        // DecimalDigit
                        choice(
                          "0",
                          // NonZeroDigit
                          choice(
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "6",
                            "7",
                            "8",
                            "9",
                          ),
                        ),
                        // DecimalDigitsUS
                        repeat1(
                          // DecimalDigitUS
                          choice(
                            // DecimalDigit
                            choice(
                              "0",
                              // NonZeroDigit
                              choice(
                                "1",
                                "2",
                                "3",
                                "4",
                                "5",
                                "6",
                                "7",
                                "8",
                                "9",
                              ),
                            ),
                            "_",
                          ),
                        ),
                      ),
                      seq(
                        // DecimalDigitsUS
                        repeat1(
                          // DecimalDigitUS
                          choice(
                            // DecimalDigit
                            choice(
                              "0",
                              // NonZeroDigit
                              choice(
                                "1",
                                "2",
                                "3",
                                "4",
                                "5",
                                "6",
                                "7",
                                "8",
                                "9",
                              ),
                            ),
                            "_",
                          ),
                        ),
                        // DecimalDigit
                        choice(
                          "0",
                          // NonZeroDigit
                          choice(
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "6",
                            "7",
                            "8",
                            "9",
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
            // Suffix
            choice(
              // FloatSuffix
              choice(
                "f",
                "F",
              ),
              // RealSuffix
              "L",
              // ImaginarySuffix
              "i",
              seq(
                // FloatSuffix
                choice(
                  "f",
                  "F",
                ),
                // ImaginarySuffix
                "i",
              ),
              seq(
                // RealSuffix
                "L",
                // ImaginarySuffix
                "i",
              ),
            ),
          ),
          seq(
            // Integer
            choice(
              // DecimalInteger
              choice(
                "0",
                // NonZeroDigit
                choice(
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                  "8",
                  "9",
                ),
                seq(
                  // NonZeroDigit
                  choice(
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                    "9",
                  ),
                  // DecimalDigitsUS
                  repeat1(
                    // DecimalDigitUS
                    choice(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      "_",
                    ),
                  ),
                ),
              ),
              // BinaryInteger
              seq(
                // BinPrefix
                choice(
                  "0b",
                  "0B",
                ),
                // BinaryDigitsNoSingleUS
                choice(
                  // BinaryDigit
                  choice(
                    "0",
                    "1",
                  ),
                  seq(
                    // BinaryDigit
                    choice(
                      "0",
                      "1",
                    ),
                    // BinaryDigitsUS
                    repeat1(
                      // BinaryDigitUS
                      choice(
                        // BinaryDigit
                        choice(
                          "0",
                          "1",
                        ),
                        "_",
                      ),
                    ),
                  ),
                  seq(
                    // BinaryDigitsUS
                    repeat1(
                      // BinaryDigitUS
                      choice(
                        // BinaryDigit
                        choice(
                          "0",
                          "1",
                        ),
                        "_",
                      ),
                    ),
                    // BinaryDigit
                    choice(
                      "0",
                      "1",
                    ),
                  ),
                  seq(
                    // BinaryDigitsUS
                    repeat1(
                      // BinaryDigitUS
                      choice(
                        // BinaryDigit
                        choice(
                          "0",
                          "1",
                        ),
                        "_",
                      ),
                    ),
                    // BinaryDigit
                    choice(
                      "0",
                      "1",
                    ),
                    // BinaryDigitsUS
                    repeat1(
                      // BinaryDigitUS
                      choice(
                        // BinaryDigit
                        choice(
                          "0",
                          "1",
                        ),
                        "_",
                      ),
                    ),
                  ),
                ),
              ),
              // HexadecimalInteger
              seq(
                // HexPrefix
                choice(
                  "0x",
                  "0X",
                ),
                // HexDigitsNoSingleUS
                choice(
                  // HexDigit
                  choice(
                    // DecimalDigit
                    choice(
                      "0",
                      // NonZeroDigit
                      choice(
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                      ),
                    ),
                    // HexLetter
                    choice(
                      "a",
                      "b",
                      "c",
                      "d",
                      "e",
                      "f",
                      "A",
                      "B",
                      "C",
                      "D",
                      "E",
                      "F",
                    ),
                  ),
                  seq(
                    // HexDigit
                    choice(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      // HexLetter
                      choice(
                        "a",
                        "b",
                        "c",
                        "d",
                        "e",
                        "f",
                        "A",
                        "B",
                        "C",
                        "D",
                        "E",
                        "F",
                      ),
                    ),
                    // HexDigitsUS
                    repeat1(
                      // HexDigitUS
                      choice(
                        // HexDigit
                        choice(
                          // DecimalDigit
                          choice(
                            "0",
                            // NonZeroDigit
                            choice(
                              "1",
                              "2",
                              "3",
                              "4",
                              "5",
                              "6",
                              "7",
                              "8",
                              "9",
                            ),
                          ),
                          // HexLetter
                          choice(
                            "a",
                            "b",
                            "c",
                            "d",
                            "e",
                            "f",
                            "A",
                            "B",
                            "C",
                            "D",
                            "E",
                            "F",
                          ),
                        ),
                        "_",
                      ),
                    ),
                  ),
                  seq(
                    // HexDigitsUS
                    repeat1(
                      // HexDigitUS
                      choice(
                        // HexDigit
                        choice(
                          // DecimalDigit
                          choice(
                            "0",
                            // NonZeroDigit
                            choice(
                              "1",
                              "2",
                              "3",
                              "4",
                              "5",
                              "6",
                              "7",
                              "8",
                              "9",
                            ),
                          ),
                          // HexLetter
                          choice(
                            "a",
                            "b",
                            "c",
                            "d",
                            "e",
                            "f",
                            "A",
                            "B",
                            "C",
                            "D",
                            "E",
                            "F",
                          ),
                        ),
                        "_",
                      ),
                    ),
                    // HexDigit
                    choice(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      // HexLetter
                      choice(
                        "a",
                        "b",
                        "c",
                        "d",
                        "e",
                        "f",
                        "A",
                        "B",
                        "C",
                        "D",
                        "E",
                        "F",
                      ),
                    ),
                  ),
                ),
              ),
            ),
            // FloatSuffix
            choice(
              "f",
              "F",
            ),
          ),
          seq(
            // Integer
            choice(
              // DecimalInteger
              choice(
                "0",
                // NonZeroDigit
                choice(
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                  "8",
                  "9",
                ),
                seq(
                  // NonZeroDigit
                  choice(
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                    "9",
                  ),
                  // DecimalDigitsUS
                  repeat1(
                    // DecimalDigitUS
                    choice(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      "_",
                    ),
                  ),
                ),
              ),
              // BinaryInteger
              seq(
                // BinPrefix
                choice(
                  "0b",
                  "0B",
                ),
                // BinaryDigitsNoSingleUS
                choice(
                  // BinaryDigit
                  choice(
                    "0",
                    "1",
                  ),
                  seq(
                    // BinaryDigit
                    choice(
                      "0",
                      "1",
                    ),
                    // BinaryDigitsUS
                    repeat1(
                      // BinaryDigitUS
                      choice(
                        // BinaryDigit
                        choice(
                          "0",
                          "1",
                        ),
                        "_",
                      ),
                    ),
                  ),
                  seq(
                    // BinaryDigitsUS
                    repeat1(
                      // BinaryDigitUS
                      choice(
                        // BinaryDigit
                        choice(
                          "0",
                          "1",
                        ),
                        "_",
                      ),
                    ),
                    // BinaryDigit
                    choice(
                      "0",
                      "1",
                    ),
                  ),
                  seq(
                    // BinaryDigitsUS
                    repeat1(
                      // BinaryDigitUS
                      choice(
                        // BinaryDigit
                        choice(
                          "0",
                          "1",
                        ),
                        "_",
                      ),
                    ),
                    // BinaryDigit
                    choice(
                      "0",
                      "1",
                    ),
                    // BinaryDigitsUS
                    repeat1(
                      // BinaryDigitUS
                      choice(
                        // BinaryDigit
                        choice(
                          "0",
                          "1",
                        ),
                        "_",
                      ),
                    ),
                  ),
                ),
              ),
              // HexadecimalInteger
              seq(
                // HexPrefix
                choice(
                  "0x",
                  "0X",
                ),
                // HexDigitsNoSingleUS
                choice(
                  // HexDigit
                  choice(
                    // DecimalDigit
                    choice(
                      "0",
                      // NonZeroDigit
                      choice(
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                      ),
                    ),
                    // HexLetter
                    choice(
                      "a",
                      "b",
                      "c",
                      "d",
                      "e",
                      "f",
                      "A",
                      "B",
                      "C",
                      "D",
                      "E",
                      "F",
                    ),
                  ),
                  seq(
                    // HexDigit
                    choice(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      // HexLetter
                      choice(
                        "a",
                        "b",
                        "c",
                        "d",
                        "e",
                        "f",
                        "A",
                        "B",
                        "C",
                        "D",
                        "E",
                        "F",
                      ),
                    ),
                    // HexDigitsUS
                    repeat1(
                      // HexDigitUS
                      choice(
                        // HexDigit
                        choice(
                          // DecimalDigit
                          choice(
                            "0",
                            // NonZeroDigit
                            choice(
                              "1",
                              "2",
                              "3",
                              "4",
                              "5",
                              "6",
                              "7",
                              "8",
                              "9",
                            ),
                          ),
                          // HexLetter
                          choice(
                            "a",
                            "b",
                            "c",
                            "d",
                            "e",
                            "f",
                            "A",
                            "B",
                            "C",
                            "D",
                            "E",
                            "F",
                          ),
                        ),
                        "_",
                      ),
                    ),
                  ),
                  seq(
                    // HexDigitsUS
                    repeat1(
                      // HexDigitUS
                      choice(
                        // HexDigit
                        choice(
                          // DecimalDigit
                          choice(
                            "0",
                            // NonZeroDigit
                            choice(
                              "1",
                              "2",
                              "3",
                              "4",
                              "5",
                              "6",
                              "7",
                              "8",
                              "9",
                            ),
                          ),
                          // HexLetter
                          choice(
                            "a",
                            "b",
                            "c",
                            "d",
                            "e",
                            "f",
                            "A",
                            "B",
                            "C",
                            "D",
                            "E",
                            "F",
                          ),
                        ),
                        "_",
                      ),
                    ),
                    // HexDigit
                    choice(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      // HexLetter
                      choice(
                        "a",
                        "b",
                        "c",
                        "d",
                        "e",
                        "f",
                        "A",
                        "B",
                        "C",
                        "D",
                        "E",
                        "F",
                      ),
                    ),
                  ),
                ),
              ),
            ),
            // ImaginarySuffix
            "i",
          ),
          seq(
            // Integer
            choice(
              // DecimalInteger
              choice(
                "0",
                // NonZeroDigit
                choice(
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                  "8",
                  "9",
                ),
                seq(
                  // NonZeroDigit
                  choice(
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                    "9",
                  ),
                  // DecimalDigitsUS
                  repeat1(
                    // DecimalDigitUS
                    choice(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      "_",
                    ),
                  ),
                ),
              ),
              // BinaryInteger
              seq(
                // BinPrefix
                choice(
                  "0b",
                  "0B",
                ),
                // BinaryDigitsNoSingleUS
                choice(
                  // BinaryDigit
                  choice(
                    "0",
                    "1",
                  ),
                  seq(
                    // BinaryDigit
                    choice(
                      "0",
                      "1",
                    ),
                    // BinaryDigitsUS
                    repeat1(
                      // BinaryDigitUS
                      choice(
                        // BinaryDigit
                        choice(
                          "0",
                          "1",
                        ),
                        "_",
                      ),
                    ),
                  ),
                  seq(
                    // BinaryDigitsUS
                    repeat1(
                      // BinaryDigitUS
                      choice(
                        // BinaryDigit
                        choice(
                          "0",
                          "1",
                        ),
                        "_",
                      ),
                    ),
                    // BinaryDigit
                    choice(
                      "0",
                      "1",
                    ),
                  ),
                  seq(
                    // BinaryDigitsUS
                    repeat1(
                      // BinaryDigitUS
                      choice(
                        // BinaryDigit
                        choice(
                          "0",
                          "1",
                        ),
                        "_",
                      ),
                    ),
                    // BinaryDigit
                    choice(
                      "0",
                      "1",
                    ),
                    // BinaryDigitsUS
                    repeat1(
                      // BinaryDigitUS
                      choice(
                        // BinaryDigit
                        choice(
                          "0",
                          "1",
                        ),
                        "_",
                      ),
                    ),
                  ),
                ),
              ),
              // HexadecimalInteger
              seq(
                // HexPrefix
                choice(
                  "0x",
                  "0X",
                ),
                // HexDigitsNoSingleUS
                choice(
                  // HexDigit
                  choice(
                    // DecimalDigit
                    choice(
                      "0",
                      // NonZeroDigit
                      choice(
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                      ),
                    ),
                    // HexLetter
                    choice(
                      "a",
                      "b",
                      "c",
                      "d",
                      "e",
                      "f",
                      "A",
                      "B",
                      "C",
                      "D",
                      "E",
                      "F",
                    ),
                  ),
                  seq(
                    // HexDigit
                    choice(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      // HexLetter
                      choice(
                        "a",
                        "b",
                        "c",
                        "d",
                        "e",
                        "f",
                        "A",
                        "B",
                        "C",
                        "D",
                        "E",
                        "F",
                      ),
                    ),
                    // HexDigitsUS
                    repeat1(
                      // HexDigitUS
                      choice(
                        // HexDigit
                        choice(
                          // DecimalDigit
                          choice(
                            "0",
                            // NonZeroDigit
                            choice(
                              "1",
                              "2",
                              "3",
                              "4",
                              "5",
                              "6",
                              "7",
                              "8",
                              "9",
                            ),
                          ),
                          // HexLetter
                          choice(
                            "a",
                            "b",
                            "c",
                            "d",
                            "e",
                            "f",
                            "A",
                            "B",
                            "C",
                            "D",
                            "E",
                            "F",
                          ),
                        ),
                        "_",
                      ),
                    ),
                  ),
                  seq(
                    // HexDigitsUS
                    repeat1(
                      // HexDigitUS
                      choice(
                        // HexDigit
                        choice(
                          // DecimalDigit
                          choice(
                            "0",
                            // NonZeroDigit
                            choice(
                              "1",
                              "2",
                              "3",
                              "4",
                              "5",
                              "6",
                              "7",
                              "8",
                              "9",
                            ),
                          ),
                          // HexLetter
                          choice(
                            "a",
                            "b",
                            "c",
                            "d",
                            "e",
                            "f",
                            "A",
                            "B",
                            "C",
                            "D",
                            "E",
                            "F",
                          ),
                        ),
                        "_",
                      ),
                    ),
                    // HexDigit
                    choice(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      // HexLetter
                      choice(
                        "a",
                        "b",
                        "c",
                        "d",
                        "e",
                        "f",
                        "A",
                        "B",
                        "C",
                        "D",
                        "E",
                        "F",
                      ),
                    ),
                  ),
                ),
              ),
            ),
            // FloatSuffix
            choice(
              "f",
              "F",
            ),
            // ImaginarySuffix
            "i",
          ),
          seq(
            // Integer
            choice(
              // DecimalInteger
              choice(
                "0",
                // NonZeroDigit
                choice(
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                  "8",
                  "9",
                ),
                seq(
                  // NonZeroDigit
                  choice(
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                    "9",
                  ),
                  // DecimalDigitsUS
                  repeat1(
                    // DecimalDigitUS
                    choice(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      "_",
                    ),
                  ),
                ),
              ),
              // BinaryInteger
              seq(
                // BinPrefix
                choice(
                  "0b",
                  "0B",
                ),
                // BinaryDigitsNoSingleUS
                choice(
                  // BinaryDigit
                  choice(
                    "0",
                    "1",
                  ),
                  seq(
                    // BinaryDigit
                    choice(
                      "0",
                      "1",
                    ),
                    // BinaryDigitsUS
                    repeat1(
                      // BinaryDigitUS
                      choice(
                        // BinaryDigit
                        choice(
                          "0",
                          "1",
                        ),
                        "_",
                      ),
                    ),
                  ),
                  seq(
                    // BinaryDigitsUS
                    repeat1(
                      // BinaryDigitUS
                      choice(
                        // BinaryDigit
                        choice(
                          "0",
                          "1",
                        ),
                        "_",
                      ),
                    ),
                    // BinaryDigit
                    choice(
                      "0",
                      "1",
                    ),
                  ),
                  seq(
                    // BinaryDigitsUS
                    repeat1(
                      // BinaryDigitUS
                      choice(
                        // BinaryDigit
                        choice(
                          "0",
                          "1",
                        ),
                        "_",
                      ),
                    ),
                    // BinaryDigit
                    choice(
                      "0",
                      "1",
                    ),
                    // BinaryDigitsUS
                    repeat1(
                      // BinaryDigitUS
                      choice(
                        // BinaryDigit
                        choice(
                          "0",
                          "1",
                        ),
                        "_",
                      ),
                    ),
                  ),
                ),
              ),
              // HexadecimalInteger
              seq(
                // HexPrefix
                choice(
                  "0x",
                  "0X",
                ),
                // HexDigitsNoSingleUS
                choice(
                  // HexDigit
                  choice(
                    // DecimalDigit
                    choice(
                      "0",
                      // NonZeroDigit
                      choice(
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                      ),
                    ),
                    // HexLetter
                    choice(
                      "a",
                      "b",
                      "c",
                      "d",
                      "e",
                      "f",
                      "A",
                      "B",
                      "C",
                      "D",
                      "E",
                      "F",
                    ),
                  ),
                  seq(
                    // HexDigit
                    choice(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      // HexLetter
                      choice(
                        "a",
                        "b",
                        "c",
                        "d",
                        "e",
                        "f",
                        "A",
                        "B",
                        "C",
                        "D",
                        "E",
                        "F",
                      ),
                    ),
                    // HexDigitsUS
                    repeat1(
                      // HexDigitUS
                      choice(
                        // HexDigit
                        choice(
                          // DecimalDigit
                          choice(
                            "0",
                            // NonZeroDigit
                            choice(
                              "1",
                              "2",
                              "3",
                              "4",
                              "5",
                              "6",
                              "7",
                              "8",
                              "9",
                            ),
                          ),
                          // HexLetter
                          choice(
                            "a",
                            "b",
                            "c",
                            "d",
                            "e",
                            "f",
                            "A",
                            "B",
                            "C",
                            "D",
                            "E",
                            "F",
                          ),
                        ),
                        "_",
                      ),
                    ),
                  ),
                  seq(
                    // HexDigitsUS
                    repeat1(
                      // HexDigitUS
                      choice(
                        // HexDigit
                        choice(
                          // DecimalDigit
                          choice(
                            "0",
                            // NonZeroDigit
                            choice(
                              "1",
                              "2",
                              "3",
                              "4",
                              "5",
                              "6",
                              "7",
                              "8",
                              "9",
                            ),
                          ),
                          // HexLetter
                          choice(
                            "a",
                            "b",
                            "c",
                            "d",
                            "e",
                            "f",
                            "A",
                            "B",
                            "C",
                            "D",
                            "E",
                            "F",
                          ),
                        ),
                        "_",
                      ),
                    ),
                    // HexDigit
                    choice(
                      // DecimalDigit
                      choice(
                        "0",
                        // NonZeroDigit
                        choice(
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ),
                      ),
                      // HexLetter
                      choice(
                        "a",
                        "b",
                        "c",
                        "d",
                        "e",
                        "f",
                        "A",
                        "B",
                        "C",
                        "D",
                        "E",
                        "F",
                      ),
                    ),
                  ),
                ),
              ),
            ),
            // RealSuffix
            "L",
            // ImaginarySuffix
            "i",
          ),
        ),
      ),

    // ---

    keyword: $ =>
      choice(
        "abstract",
        "alias",
        "align",
        "asm",
        "assert",
        "auto",
        "body",
        "bool",
        "break",
        "byte",
        "case",
        "cast",
        "catch",
        "cdouble",
        "cent",
        "cfloat",
        "char",
        "class",
        "const",
        "continue",
        "creal",
        "dchar",
        "debug",
        "default",
        "delegate",
        "delete",
        "deprecated",
        "do",
        "double",
        "else",
        "enum",
        "export",
        "extern",
        "false",
        "final",
        "finally",
        "float",
        "for",
        "foreach",
        "foreach_reverse",
        "function",
        "goto",
        "idouble",
        "if",
        "ifloat",
        "immutable",
        "import",
        "in",
        "inout",
        "int",
        "interface",
        "invariant",
        "ireal",
        "is",
        "lazy",
        "long",
        "macro",
        "mixin",
        "module",
        "new",
        "nothrow",
        "null",
        "out",
        "override",
        "package",
        "pragma",
        "private",
        "protected",
        "public",
        "pure",
        "real",
        "ref",
        "return",
        "scope",
        "shared",
        "short",
        "static",
        "struct",
        "super",
        "switch",
        "synchronized",
        "template",
        "this",
        "throw",
        "true",
        "try",
        "typeid",
        "typeof",
        "ubyte",
        "ucent",
        "uint",
        "ulong",
        "union",
        "unittest",
        "ushort",
        "version",
        "void",
        "wchar",
        "while",
        "with",
        "__FILE__",
        "__FILE_FULL_PATH__",
        "__MODULE__",
        "__LINE__",
        "__FUNCTION__",
        "__PRETTY_FUNCTION__",
        "__gshared",
        "__traits",
        "__vector",
        "__parameters",
      ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/module.html
    // ------------------------------------------------------------------------

    module: $ =>
      choice(
        seq(
          $.module_declaration,
          $.decl_defs,
        ),
        $.decl_defs,
      ),

    decl_defs: $ =>
      repeat1(
        $.decl_def,
      ),

    decl_def: $ =>
      choice(
        $.attribute_specifier,
        $.declaration,
        $.constructor,
        $.destructor,
        $.postblit,
        $.allocator,
        $.deallocator,
        $.invariant,
        $.unit_test,
        $.alias_this,
        $.static_constructor,
        $.static_destructor,
        $.shared_static_constructor,
        $.shared_static_destructor,
        $.conditional_declaration,
        $.debug_specification,
        $.version_specification,
        $.static_assert,
        $.template_declaration,
        $.template_mixin_declaration,
        $.template_mixin,
        $.mixin_declaration,
        ";",
      ),

    // ---

    module_declaration: $ =>
      seq(
        optional(
          $.module_attributes,
        ),
        "module",
        $.module_fully_qualified_name,
        ";",
      ),

    module_attributes: $ =>
      repeat1(
        $.module_attribute,
      ),

    module_attribute: $ =>
      choice(
        $.deprecated_attribute,
        $.user_defined_attribute,
      ),

    module_fully_qualified_name: $ =>
      choice(
        $.module_name,
        seq(
          $.packages,
          ".",
          $.module_name,
        ),
      ),

    module_name: $ =>
      $.identifier,

    packages: $ =>
      choice(
        $.package_name,
        seq(
          $.packages,
          ".",
          $.package_name,
        ),
      ),

    package_name: $ =>
      $.identifier,

    // ---

    import_declaration: $ =>
      choice(
        seq(
          "import",
          $.import_list,
          ";",
        ),
        seq(
          "static",
          "import",
          $.import_list,
          ";",
        ),
      ),

    import_list: $ =>
      choice(
        $.import,
        $.import_bindings,
        seq(
          $.import,
          ",",
          $.import_list,
        ),
      ),

    import: $ =>
      choice(
        $.module_fully_qualified_name,
        seq(
          $.module_alias_identifier,
          "=",
          $.module_fully_qualified_name,
        ),
      ),

    import_bindings: $ =>
      seq(
        $.import,
        ":",
        $.import_bind_list,
      ),

    import_bind_list: $ =>
      choice(
        $.import_bind,
        seq(
          $.import_bind,
          ",",
          $.import_bind_list,
        ),
      ),

    import_bind: $ =>
      choice(
        $.identifier,
        seq(
          $.identifier,
          "=",
          $.identifier,
        ),
      ),

    module_alias_identifier: $ =>
      $.identifier,

    // ---

    mixin_declaration: $ =>
      seq(
        "mixin",
        "(",
        $.argument_list,
        ")",
        ";",
      ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/declaration.html
    // ------------------------------------------------------------------------

    declaration: $ =>
      choice(
        $.func_declaration,
        $.var_declarations,
        $.alias_declaration,
        $.aggregate_declaration,
        $.enum_declaration,
        $.import_declaration,
        $.conditional_declaration,
        $.static_foreach_declaration,
        $.static_assert,
      ),

    // ---

    var_declarations: $ =>
      choice(
        seq(
          optional(
            $.storage_classes,
          ),
          $.basic_type,
          $.declarators,
          ";",
        ),
        $.auto_declaration,
      ),

    declarators: $ =>
      choice(
        $.declarator_initializer,
        seq(
          $.declarator_initializer,
          ",",
          $.declarator_identifier_list,
        ),
      ),

    declarator_initializer: $ =>
      choice(
        $.var_declarator,
        seq(
          $.var_declarator,
          optional(
            $.template_parameters,
          ),
          "=",
          $.initializer,
        ),
        $.alt_declarator,
        seq(
          $.alt_declarator,
          "=",
          $.initializer,
        ),
      ),

    declarator_identifier_list: $ =>
      choice(
        $.declarator_identifier,
        seq(
          $.declarator_identifier,
          ",",
          $.declarator_identifier_list,
        ),
      ),

    declarator_identifier: $ =>
      choice(
        $.var_declarator_identifier,
        $.alt_declarator_identifier,
      ),

    var_declarator_identifier: $ =>
      choice(
        $.identifier,
        seq(
          $.identifier,
          optional(
            $.template_parameters,
          ),
          "=",
          $.initializer,
        ),
      ),

    alt_declarator_identifier: $ =>
      choice(
        seq(
          $.type_suffixes,
          $.identifier,
          optional(
            $.alt_declarator_suffixes,
          ),
        ),
        seq(
          $.type_suffixes,
          $.identifier,
          optional(
            $.alt_declarator_suffixes,
          ),
          "=",
          $.initializer,
        ),
        seq(
          optional(
            $.type_suffixes,
          ),
          $.identifier,
          $.alt_declarator_suffixes,
        ),
        seq(
          optional(
            $.type_suffixes,
          ),
          $.identifier,
          $.alt_declarator_suffixes,
          "=",
          $.initializer,
        ),
      ),

    declarator: $ =>
      choice(
        $.var_declarator,
        $.alt_declarator,
      ),

    var_declarator: $ =>
      seq(
        optional(
          $.type_suffixes,
        ),
        $.identifier,
      ),

    alt_declarator: $ =>
      choice(
        seq(
          optional(
            $.type_suffixes,
          ),
          $.identifier,
          $.alt_declarator_suffixes,
        ),
        seq(
          optional(
            $.type_suffixes,
          ),
          "(",
          $.alt_declarator_inner,
          ")",
        ),
        seq(
          optional(
            $.type_suffixes,
          ),
          "(",
          $.alt_declarator_inner,
          ")",
          $.alt_func_declarator_suffix,
        ),
        seq(
          optional(
            $.type_suffixes,
          ),
          "(",
          $.alt_declarator_inner,
          ")",
          $.alt_declarator_suffixes,
        ),
      ),

    alt_declarator_inner: $ =>
      choice(
        seq(
          optional(
            $.type_suffixes,
          ),
          $.identifier,
        ),
        seq(
          optional(
            $.type_suffixes,
          ),
          $.identifier,
          $.alt_func_declarator_suffix,
        ),
        $.alt_declarator,
      ),

    alt_declarator_suffixes: $ =>
      repeat1(
        $.alt_declarator_suffix,
      ),

    alt_declarator_suffix: $ =>
      choice(
        seq(
          "[",
          "]",
        ),
        seq(
          "[",
          $.assign_expression,
          "]",
        ),
        seq(
          "[",
          $.type,
          "]",
        ),
      ),

    alt_func_declarator_suffix: $ =>
      seq(
        $.parameters,
        optional(
          $.member_function_attributes,
        ),
      ),

    // ---

    storage_classes: $ =>
      repeat1(
        $.storage_class,
      ),

    storage_class: $ =>
      choice(
        $.linkage_attribute,
        $.align_attribute,
        "enum",
        "static",
        "extern",
        "abstract",
        "final",
        "override",
        "synchronized",
        "auto",
        "scope",
        "const",
        "immutable",
        "inout",
        "shared",
        "__gshared",
        $.property,
        "nothrow",
        "pure",
        "ref",
      ),

    // ---

    initializer: $ =>
      choice(
        $.void_initializer,
        $.non_void_initializer,
      ),

    non_void_initializer: $ =>
      choice(
        $.exp_initializer,
        $.array_initializer,
        $.struct_initializer,
      ),

    exp_initializer: $ =>
      $.assign_expression,

    array_initializer: $ =>
      seq(
        "[",
        optional(
          $.array_member_initializations,
        ),
        "]",
      ),

    array_member_initializations: $ =>
      choice(
        $.array_member_initialization,
        seq(
          $.array_member_initialization,
          ",",
        ),
        seq(
          $.array_member_initialization,
          ",",
          $.array_member_initializations,
        ),
      ),

    array_member_initialization: $ =>
      choice(
        $.non_void_initializer,
        seq(
          $.assign_expression,
          ":",
          $.non_void_initializer,
        ),
      ),

    struct_initializer: $ =>
      seq(
        "{",
        optional(
          $.struct_member_initializers,
        ),
        "}",
      ),

    struct_member_initializers: $ =>
      choice(
        $.struct_member_initializer,
        seq(
          $.struct_member_initializer,
          ",",
        ),
        seq(
          $.struct_member_initializer,
          ",",
          $.struct_member_initializers,
        ),
      ),

    struct_member_initializer: $ =>
      choice(
        $.non_void_initializer,
        seq(
          $.identifier,
          ":",
          $.non_void_initializer,
        ),
      ),

    // ---

    auto_declaration: $ =>
      seq(
        $.storage_classes,
        $.auto_assignments,
        ";",
      ),

    auto_assignments: $ =>
      choice(
        $.auto_assignment,
        seq(
          $.auto_assignments,
          ",",
          $.auto_assignment,
        ),
      ),

    auto_assignment: $ =>
      seq(
        $.identifier,
        optional(
          $.template_parameters,
        ),
        "=",
        $.initializer,
      ),

    // ---

    alias_declaration: $ =>
      choice(
        seq(
          "alias",
          optional(
            $.storage_classes,
          ),
          $.basic_type,
          $.declarators,
          ";",
        ),
        seq(
          "alias",
          optional(
            $.storage_classes,
          ),
          $.basic_type,
          $.func_declarator,
          ";",
        ),
        seq(
          "alias",
          $.alias_assignments,
          ";",
        ),
      ),

    alias_assignments: $ =>
      choice(
        $.alias_assignment,
        seq(
          $.alias_assignments,
          ",",
          $.alias_assignment,
        ),
      ),

    alias_assignment: $ =>
      choice(
        seq(
          $.identifier,
          optional(
            $.template_parameters,
          ),
          "=",
          optional(
            $.storage_classes,
          ),
          $.type,
        ),
        seq(
          $.identifier,
          optional(
            $.template_parameters,
          ),
          "=",
          $.function_literal,
        ),
        seq(
          $.identifier,
          optional(
            $.template_parameters,
          ),
          "=",
          optional(
            $.storage_classes,
          ),
          $.basic_type,
          $.parameters,
          optional(
            $.member_function_attributes,
          ),
        ),
      ),

    // ---

    void_initializer: $ =>
      "void",

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/type.html
    // ------------------------------------------------------------------------

    type: $ =>
      seq(
        optional(
          $.type_ctors,
        ),
        $.basic_type,
        optional(
          $.type_suffixes,
        ),
      ),

    type_ctors: $ =>
      repeat1(
        $.type_ctor,
      ),

    type_ctor: $ =>
      choice(
        "const",
        "immutable",
        "inout",
        "shared",
      ),

    basic_type: $ =>
      choice(
        $.fundamental_type,
        seq(
          ".",
          $.qualified_identifier,
        ),
        $.qualified_identifier,
        $.typeof,
        seq(
          $.typeof,
          ".",
          $.qualified_identifier,
        ),
        seq(
          $.type_ctor,
          "(",
          $.type,
          ")",
        ),
        $.vector,
        $.traits_expression,
        $.mixin_type,
      ),

    vector: $ =>
      seq(
        "__vector",
        "(",
        $.vector_base_type,
        ")",
      ),

    vector_base_type: $ =>
      $.type,

    fundamental_type: $ =>
      choice(
        "bool",
        "byte",
        "ubyte",
        "short",
        "ushort",
        "int",
        "uint",
        "long",
        "ulong",
        "cent",
        "ucent",
        "char",
        "wchar",
        "dchar",
        "float",
        "double",
        "real",
        "ifloat",
        "idouble",
        "ireal",
        "cfloat",
        "cdouble",
        "creal",
        "void",
      ),

    type_suffixes: $ =>
      repeat1(
        $.type_suffix,
      ),

    type_suffix: $ =>
      choice(
        "*",
        seq(
          "[",
          "]",
        ),
        seq(
          "[",
          $.assign_expression,
          "]",
        ),
        seq(
          "[",
          $.assign_expression,
          "..",
          $.assign_expression,
          "]",
        ),
        seq(
          "[",
          $.type,
          "]",
        ),
        seq(
          "delegate",
          $.parameters,
          optional(
            $.member_function_attributes,
          ),
        ),
        seq(
          "function",
          $.parameters,
          optional(
            $.function_attributes,
          ),
        ),
      ),

    qualified_identifier: $ =>
      choice(
        $.identifier,
        seq(
          $.identifier,
          ".",
          $.qualified_identifier,
        ),
        $.template_instance,
        seq(
          $.template_instance,
          ".",
          $.qualified_identifier,
        ),
        seq(
          $.identifier,
          "[",
          $.assign_expression,
          "]",
        ),
        seq(
          $.identifier,
          "[",
          $.assign_expression,
          "]",
          ".",
          $.qualified_identifier,
        ),
      ),

    // ---

    typeof: $ =>
      choice(
        seq(
          "typeof",
          "(",
          $.expression,
          ")",
        ),
        seq(
          "typeof",
          "(",
          "return",
          ")",
        ),
      ),

    // ---

    mixin_type: $ =>
      seq(
        "mixin",
        "(",
        $.argument_list,
        ")",
      ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/attribute.html
    // ------------------------------------------------------------------------

    attribute_specifier: $ =>
      choice(
        seq(
          $.attribute,
          ":",
        ),
        seq(
          $.attribute,
          $.declaration_block,
        ),
      ),

    attribute: $ =>
      choice(
        $.linkage_attribute,
        $.align_attribute,
        $.deprecated_attribute,
        $.visibility_attribute,
        $.pragma,
        "static",
        "extern",
        "abstract",
        "final",
        "override",
        "synchronized",
        "auto",
        "scope",
        "const",
        "immutable",
        "inout",
        "shared",
        "__gshared",
        $.at_attribute,
        $.function_attribute_kwd,
        "ref",
        "return",
      ),

    function_attribute_kwd: $ =>
      choice(
        "nothrow",
        "pure",
      ),

    at_attribute: $ =>
      choice(
        seq(
          "@",
          "disable",
        ),
        seq(
          "@",
          "nogc",
        ),
        seq(
          "@",
          "live",
        ),
        $.property,
        seq(
          "@",
          "safe",
        ),
        seq(
          "@",
          "system",
        ),
        seq(
          "@",
          "trusted",
        ),
        $.user_defined_attribute,
      ),

    property: $ =>
      seq(
        "@",
        "property",
      ),

    declaration_block: $ =>
      choice(
        $.decl_def,
        seq(
          "{",
          optional(
            $.decl_defs,
          ),
          "}",
        ),
      ),

    // ---

    linkage_attribute: $ =>
      choice(
        seq(
          "extern",
          "(",
          $.linkage_type,
          ")",
        ),
        seq(
          "extern",
          "(",
          "C++",
          ",",
          $.qualified_identifier,
          ")",
        ),
        seq(
          "extern",
          "(",
          "C++",
          ",",
          $.namespace_list,
          ")",
        ),
      ),

    linkage_type: $ =>
      choice(
        "C",
        "C++",
        "D",
        "Windows",
        "System",
        "Objective-C",
      ),

    namespace_list: $ =>
      choice(
        $.conditional_expression,
        seq(
          $.conditional_expression,
          ",",
        ),
        seq(
          $.conditional_expression,
          ",",
          $.namespace_list,
        ),
      ),

    // ---

    align_attribute: $ =>
      choice(
        "align",
        seq(
          "align",
          "(",
          $.assign_expression,
          ")",
        ),
      ),

    // ---

    deprecated_attribute: $ =>
      choice(
        "deprecated",
        seq(
          "deprecated",
          "(",
          $.assign_expression,
          ")",
        ),
      ),

    // ---

    visibility_attribute: $ =>
      choice(
        "private",
        "package",
        seq(
          "package",
          "(",
          $.qualified_identifier,
          ")",
        ),
        "protected",
        "public",
        "export",
      ),

    // ---

    user_defined_attribute: $ =>
      choice(
        seq(
          "@",
          "(",
          $.argument_list,
          ")",
        ),
        seq(
          "@",
          $.identifier,
        ),
        seq(
          "@",
          $.identifier,
          "(",
          optional(
            $.argument_list,
          ),
          ")",
        ),
        seq(
          "@",
          $.template_instance,
        ),
        seq(
          "@",
          $.template_instance,
          "(",
          optional(
            $.argument_list,
          ),
          ")",
        ),
      ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/pragma.html
    // ------------------------------------------------------------------------

    pragma_statement: $ =>
      choice(
        seq(
          $.pragma,
          ";",
        ),
        seq(
          $.pragma,
          $.no_scope_statement,
        ),
      ),

    pragma: $ =>
      choice(
        seq(
          "pragma",
          "(",
          $.identifier,
          ")",
        ),
        seq(
          "pragma",
          "(",
          $.identifier,
          ",",
          $.argument_list,
          ")",
        ),
      ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/expression.html
    // ------------------------------------------------------------------------

    expression: $ =>
      $.comma_expression,

    comma_expression: $ =>
      choice(
        $.assign_expression,
        seq(
          $.comma_expression,
          ",",
          $.assign_expression,
        ),
      ),

    // ---

    assign_expression: $ =>
      choice(
        $.conditional_expression,
        seq(
          $.conditional_expression,
          "=",
          $.assign_expression,
        ),
        seq(
          $.conditional_expression,
          "+=",
          $.assign_expression,
        ),
        seq(
          $.conditional_expression,
          "-=",
          $.assign_expression,
        ),
        seq(
          $.conditional_expression,
          "*=",
          $.assign_expression,
        ),
        seq(
          $.conditional_expression,
          "/=",
          $.assign_expression,
        ),
        seq(
          $.conditional_expression,
          "%=",
          $.assign_expression,
        ),
        seq(
          $.conditional_expression,
          "&=",
          $.assign_expression,
        ),
        seq(
          $.conditional_expression,
          "|=",
          $.assign_expression,
        ),
        seq(
          $.conditional_expression,
          "^=",
          $.assign_expression,
        ),
        seq(
          $.conditional_expression,
          "~=",
          $.assign_expression,
        ),
        seq(
          $.conditional_expression,
          "<<=",
          $.assign_expression,
        ),
        seq(
          $.conditional_expression,
          ">>=",
          $.assign_expression,
        ),
        seq(
          $.conditional_expression,
          ">>>=",
          $.assign_expression,
        ),
        seq(
          $.conditional_expression,
          "^^=",
          $.assign_expression,
        ),
      ),

    // ---

    conditional_expression: $ =>
      choice(
        $.or_or_expression,
        seq(
          $.or_or_expression,
          "?",
          $.expression,
          ":",
          $.conditional_expression,
        ),
      ),

    // ---

    or_or_expression: $ =>
      choice(
        $.and_and_expression,
        seq(
          $.or_or_expression,
          "||",
          $.and_and_expression,
        ),
      ),

    // ---

    and_and_expression: $ =>
      choice(
        $.or_expression,
        seq(
          $.and_and_expression,
          "&&",
          $.or_expression,
        ),
      ),

    // ---

    or_expression: $ =>
      choice(
        $.xor_expression,
        seq(
          $.or_expression,
          "|",
          $.xor_expression,
        ),
      ),

    // ---

    xor_expression: $ =>
      choice(
        $.and_expression,
        seq(
          $.xor_expression,
          "^",
          $.and_expression,
        ),
      ),

    // ---

    and_expression: $ =>
      choice(
        $.cmp_expression,
        seq(
          $.and_expression,
          "&",
          $.cmp_expression,
        ),
      ),

    // ---

    cmp_expression: $ =>
      choice(
        $.shift_expression,
        $.equal_expression,
        $.identity_expression,
        $.rel_expression,
        $.in_expression,
      ),

    // ---

    equal_expression: $ =>
      choice(
        seq(
          $.shift_expression,
          "==",
          $.shift_expression,
        ),
        seq(
          $.shift_expression,
          "!=",
          $.shift_expression,
        ),
      ),

    // ---

    identity_expression: $ =>
      choice(
        seq(
          $.shift_expression,
          "is",
          $.shift_expression,
        ),
        seq(
          $.shift_expression,
          "!",
          "is",
          $.shift_expression,
        ),
      ),

    // ---

    rel_expression: $ =>
      choice(
        seq(
          $.shift_expression,
          "<",
          $.shift_expression,
        ),
        seq(
          $.shift_expression,
          "<",
          "=",
          $.shift_expression,
        ),
        seq(
          $.shift_expression,
          ">",
          $.shift_expression,
        ),
        seq(
          $.shift_expression,
          ">=",
          $.shift_expression,
        ),
      ),

    // ---

    in_expression: $ =>
      choice(
        seq(
          $.shift_expression,
          "in",
          $.shift_expression,
        ),
        seq(
          $.shift_expression,
          "!",
          "in",
          $.shift_expression,
        ),
      ),

    // ---

    shift_expression: $ =>
      choice(
        $.add_expression,
        seq(
          $.shift_expression,
          "<",
          "<",
          $.add_expression,
        ),
        seq(
          $.shift_expression,
          ">",
          ">",
          $.add_expression,
        ),
        seq(
          $.shift_expression,
          ">",
          ">",
          ">",
          $.add_expression,
        ),
      ),

    // ---

    add_expression: $ =>
      choice(
        $.mul_expression,
        seq(
          $.add_expression,
          "+",
          $.mul_expression,
        ),
        seq(
          $.add_expression,
          "-",
          $.mul_expression,
        ),
        $.cat_expression,
      ),

    // ---

    cat_expression: $ =>
      seq(
        $.add_expression,
        "~",
        $.mul_expression,
      ),

    // ---

    mul_expression: $ =>
      choice(
        $.unary_expression,
        seq(
          $.mul_expression,
          "*",
          $.unary_expression,
        ),
        seq(
          $.mul_expression,
          "/",
          $.unary_expression,
        ),
        seq(
          $.mul_expression,
          "%",
          $.unary_expression,
        ),
      ),

    // ---

    unary_expression: $ =>
      choice(
        seq(
          "&",
          $.unary_expression,
        ),
        seq(
          "++",
          $.unary_expression,
        ),
        seq(
          "--",
          $.unary_expression,
        ),
        seq(
          "*",
          $.unary_expression,
        ),
        seq(
          "-",
          $.unary_expression,
        ),
        seq(
          "+",
          $.unary_expression,
        ),
        seq(
          "!",
          $.unary_expression,
        ),
        $.complement_expression,
        seq(
          "(",
          $.type,
          ")",
          ".",
          $.identifier,
        ),
        seq(
          "(",
          $.type,
          ")",
          ".",
          $.template_instance,
        ),
        $.delete_expression,
        $.cast_expression,
        $.pow_expression,
      ),

    // ---

    complement_expression: $ =>
      seq(
        "~",
        $.unary_expression,
      ),

    // ---

    new_expression: $ =>
      choice(
        seq(
          "new",
          optional(
            $.allocator_arguments,
          ),
          $.type,
        ),
        seq(
          "new",
          optional(
            $.allocator_arguments,
          ),
          $.type,
          "[",
          $.assign_expression,
          "]",
        ),
        seq(
          "new",
          optional(
            $.allocator_arguments,
          ),
          $.type,
          "(",
          optional(
            $.argument_list,
          ),
          ")",
        ),
        $.new_anon_class_expression,
      ),

    allocator_arguments: $ =>
      seq(
        "(",
        optional(
          $.argument_list,
        ),
        ")",
      ),

    argument_list: $ =>
      choice(
        $.assign_expression,
        seq(
          $.assign_expression,
          ",",
        ),
        seq(
          $.assign_expression,
          ",",
          $.argument_list,
        ),
      ),

    // ---

    delete_expression: $ =>
      seq(
        "delete",
        $.unary_expression,
      ),

    // ---

    cast_expression: $ =>
      choice(
        seq(
          "cast",
          "(",
          $.type,
          ")",
          $.unary_expression,
        ),
        seq(
          "cast",
          "(",
          optional(
            $.type_ctors,
          ),
          ")",
          $.unary_expression,
        ),
      ),

    // ---

    pow_expression: $ =>
      choice(
        $.postfix_expression,
        seq(
          $.postfix_expression,
          "^^",
          $.unary_expression,
        ),
      ),

    // ---

    postfix_expression: $ =>
      choice(
        $.primary_expression,
        seq(
          $.postfix_expression,
          ".",
          $.identifier,
        ),
        seq(
          $.postfix_expression,
          ".",
          $.template_instance,
        ),
        seq(
          $.postfix_expression,
          ".",
          $.new_expression,
        ),
        seq(
          $.postfix_expression,
          "++",
        ),
        seq(
          $.postfix_expression,
          "--",
        ),
        seq(
          $.postfix_expression,
          "(",
          optional(
            $.argument_list,
          ),
          ")",
        ),
        seq(
          optional(
            $.type_ctors,
          ),
          $.basic_type,
          "(",
          optional(
            $.argument_list,
          ),
          ")",
        ),
        $.index_expression,
        $.slice_expression,
      ),

    // ---

    index_expression: $ =>
      seq(
        $.postfix_expression,
        "[",
        $.argument_list,
        "]",
      ),

    // ---

    slice_expression: $ =>
      choice(
        seq(
          $.postfix_expression,
          "[",
          "]",
        ),
        seq(
          $.postfix_expression,
          "[",
          $.slice,
          optional(
            ",",
          ),
          "]",
        ),
      ),

    slice: $ =>
      choice(
        $.assign_expression,
        seq(
          $.assign_expression,
          ",",
          $.slice,
        ),
        seq(
          $.assign_expression,
          "..",
          $.assign_expression,
        ),
        seq(
          $.assign_expression,
          "..",
          $.assign_expression,
          ",",
          $.slice,
        ),
      ),

    // ---

    primary_expression: $ =>
      choice(
        $.identifier,
        seq(
          ".",
          $.identifier,
        ),
        $.template_instance,
        seq(
          ".",
          $.template_instance,
        ),
        "this",
        "super",
        "null",
        "true",
        "false",
        "$",
        $.integer_literal,
        $.float_literal,
        $.character_literal,
        $.string_literals,
        $.array_literal,
        $.assoc_array_literal,
        $.function_literal,
        $.assert_expression,
        $.mixin_expression,
        $.import_expression,
        $.new_expression,
        seq(
          $.fundamental_type,
          ".",
          $.identifier,
        ),
        seq(
          $.fundamental_type,
          "(",
          optional(
            $.argument_list,
          ),
          ")",
        ),
        seq(
          $.type_ctor,
          "(",
          $.type,
          ")",
          ".",
          $.identifier,
        ),
        seq(
          $.type_ctor,
          "(",
          $.type,
          ")",
          "(",
          optional(
            $.argument_list,
          ),
          ")",
        ),
        $.typeof,
        $.typeid_expression,
        $.is_expression,
        seq(
          "(",
          $.expression,
          ")",
        ),
        $.special_keyword,
        $.traits_expression,
      ),

    // ---

    string_literals: $ =>
      choice(
        $.string_literal,
        seq(
          $.string_literals,
          $.string_literal,
        ),
      ),

    // ---

    array_literal: $ =>
      seq(
        "[",
        optional(
          $.argument_list,
        ),
        "]",
      ),

    // ---

    assoc_array_literal: $ =>
      seq(
        "[",
        $.key_value_pairs,
        "]",
      ),

    key_value_pairs: $ =>
      choice(
        $.key_value_pair,
        seq(
          $.key_value_pair,
          ",",
          $.key_value_pairs,
        ),
      ),

    key_value_pair: $ =>
      seq(
        $.key_expression,
        ":",
        $.value_expression,
      ),

    key_expression: $ =>
      $.assign_expression,

    value_expression: $ =>
      $.assign_expression,

    // ---

    function_literal: $ =>
      choice(
        seq(
          "function",
          optional(
            "ref",
          ),
          optional(
            $.type,
          ),
          optional(
            $.parameter_with_attributes,
          ),
          $.function_literal_body2,
        ),
        seq(
          "delegate",
          optional(
            "ref",
          ),
          optional(
            $.type,
          ),
          optional(
            $.parameter_with_member_attributes,
          ),
          $.function_literal_body2,
        ),
        seq(
          optional(
            "ref",
          ),
          $.parameter_with_member_attributes,
          $.function_literal_body2,
        ),
        $.function_literal_body,
        seq(
          $.identifier,
          "=>",
          $.assign_expression,
        ),
      ),

    parameter_with_attributes: $ =>
      seq(
        $.parameters,
        optional(
          $.function_attributes,
        ),
      ),

    parameter_with_member_attributes: $ =>
      seq(
        $.parameters,
        optional(
          $.member_function_attributes,
        ),
      ),

    function_literal_body2: $ =>
      choice(
        seq(
          "=>",
          $.assign_expression,
        ),
        $.function_literal_body,
      ),

    // ---

    assert_expression: $ =>
      seq(
        "assert",
        "(",
        $.assert_arguments,
        ")",
      ),

    assert_arguments: $ =>
      choice(
        seq(
          $.assign_expression,
          optional(
            ",",
          ),
        ),
        seq(
          $.assign_expression,
          ",",
          $.assign_expression,
          optional(
            ",",
          ),
        ),
      ),

    // ---

    mixin_expression: $ =>
      seq(
        "mixin",
        "(",
        $.argument_list,
        ")",
      ),

    // ---

    import_expression: $ =>
      seq(
        "import",
        "(",
        $.assign_expression,
        ")",
      ),

    // ---

    typeid_expression: $ =>
      choice(
        seq(
          "typeid",
          "(",
          $.type,
          ")",
        ),
        seq(
          "typeid",
          "(",
          $.expression,
          ")",
        ),
      ),

    // ---

    is_expression: $ =>
      choice(
        seq(
          "is",
          "(",
          $.type,
          ")",
        ),
        seq(
          "is",
          "(",
          $.type,
          ":",
          $.type_specialization,
          ")",
        ),
        seq(
          "is",
          "(",
          $.type,
          "==",
          $.type_specialization,
          ")",
        ),
        seq(
          "is",
          "(",
          $.type,
          ":",
          $.type_specialization,
          ",",
          $.template_parameter_list,
          ")",
        ),
        seq(
          "is",
          "(",
          $.type,
          "==",
          $.type_specialization,
          ",",
          $.template_parameter_list,
          ")",
        ),
        seq(
          "is",
          "(",
          $.type,
          $.identifier,
          ")",
        ),
        seq(
          "is",
          "(",
          $.type,
          $.identifier,
          ":",
          $.type_specialization,
          ")",
        ),
        seq(
          "is",
          "(",
          $.type,
          $.identifier,
          "==",
          $.type_specialization,
          ")",
        ),
        seq(
          "is",
          "(",
          $.type,
          $.identifier,
          ":",
          $.type_specialization,
          ",",
          $.template_parameter_list,
          ")",
        ),
        seq(
          "is",
          "(",
          $.type,
          $.identifier,
          "==",
          $.type_specialization,
          ",",
          $.template_parameter_list,
          ")",
        ),
      ),

    type_specialization: $ =>
      choice(
        $.type,
        "struct",
        "union",
        "class",
        "interface",
        "enum",
        "__vector",
        "function",
        "delegate",
        "super",
        "const",
        "immutable",
        "inout",
        "shared",
        "return",
        "__parameters",
        "module",
        "package",
      ),

    // ---

    special_keyword: $ =>
      choice(
        "__FILE__",
        "__FILE_FULL_PATH__",
        "__MODULE__",
        "__LINE__",
        "__FUNCTION__",
        "__PRETTY_FUNCTION__",
      ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/statement.html
    // ------------------------------------------------------------------------

    statement: $ =>
      choice(
        ";",
        $.non_empty_statement,
        $.scope_block_statement,
      ),

    no_scope_non_empty_statement: $ =>
      choice(
        $.non_empty_statement,
        $.block_statement,
      ),

    no_scope_statement: $ =>
      choice(
        ";",
        $.non_empty_statement,
        $.block_statement,
      ),

    non_empty_or_scope_block_statement: $ =>
      choice(
        $.non_empty_statement,
        $.scope_block_statement,
      ),

    non_empty_statement: $ =>
      choice(
        $.non_empty_statement_no_case_no_default,
        $.case_statement,
        $.case_range_statement,
        $.default_statement,
      ),

    non_empty_statement_no_case_no_default: $ =>
      choice(
        $.labeled_statement,
        $.expression_statement,
        $.declaration_statement,
        $.if_statement,
        $.while_statement,
        $.do_statement,
        $.for_statement,
        $.foreach_statement,
        $.switch_statement,
        $.final_switch_statement,
        $.continue_statement,
        $.break_statement,
        $.return_statement,
        $.goto_statement,
        $.with_statement,
        $.synchronized_statement,
        $.try_statement,
        $.scope_guard_statement,
        $.throw_statement,
        $.asm_statement,
        $.mixin_statement,
        $.foreach_range_statement,
        $.pragma_statement,
        $.conditional_statement,
        $.static_foreach_statement,
        $.static_assert,
        $.template_mixin,
        $.import_declaration,
      ),

    // ---

    scope_statement: $ =>
      choice(
        $.non_empty_statement,
        $.block_statement,
      ),

    // ---

    scope_block_statement: $ =>
      $.block_statement,

    // ---

    labeled_statement: $ =>
      choice(
        seq(
          $.identifier,
          ":",
        ),
        seq(
          $.identifier,
          ":",
          $.statement,
        ),
      ),

    // ---

    block_statement: $ =>
      choice(
        seq(
          "{",
          "}",
        ),
        seq(
          "{",
          $.statement_list,
          "}",
        ),
      ),

    statement_list: $ =>
      repeat1(
        $.statement,
      ),

    // ---

    expression_statement: $ =>
      seq(
        $.expression,
        ";",
      ),

    // ---

    declaration_statement: $ =>
      $.declaration,

    // ---

    if_statement: $ =>
      choice(
        seq(
          "if",
          "(",
          $.if_condition,
          ")",
          $.then_statement,
        ),
        seq(
          "if",
          "(",
          $.if_condition,
          ")",
          $.then_statement,
          "else",
          $.else_statement,
        ),
      ),

    if_condition: $ =>
      choice(
        $.expression,
        seq(
          "auto",
          $.identifier,
          "=",
          $.expression,
        ),
        seq(
          $.type_ctors,
          $.identifier,
          "=",
          $.expression,
        ),
        seq(
          optional(
            $.type_ctors,
          ),
          $.basic_type,
          $.declarator,
          "=",
          $.expression,
        ),
      ),

    then_statement: $ =>
      $.scope_statement,

    else_statement: $ =>
      $.scope_statement,

    // ---

    while_statement: $ =>
      seq(
        "while",
        "(",
        $.if_condition,
        ")",
        $.scope_statement,
      ),

    // ---

    do_statement: $ =>
      seq(
        "do",
        $.scope_statement,
        "while",
        "(",
        $.expression,
        ")",
        ";",
      ),

    // ---

    for_statement: $ =>
      seq(
        "for",
        "(",
        $.initialize,
        optional(
          $.test,
        ),
        ";",
        optional(
          $.increment,
        ),
        ")",
        $.scope_statement,
      ),

    initialize: $ =>
      choice(
        ";",
        $.no_scope_non_empty_statement,
      ),

    test: $ =>
      $.expression,

    increment: $ =>
      $.expression,

    // ---

    aggregate_foreach: $ =>
      seq(
        $.foreach,
        "(",
        $.foreach_type_list,
        ";",
        $.foreach_aggregate,
        ")",
      ),

    foreach_statement: $ =>
      seq(
        $.aggregate_foreach,
        $.no_scope_non_empty_statement,
      ),

    foreach: $ =>
      choice(
        "foreach",
        "foreach_reverse",
      ),

    foreach_type_list: $ =>
      choice(
        $.foreach_type,
        seq(
          $.foreach_type,
          ",",
          $.foreach_type_list,
        ),
      ),

    foreach_type: $ =>
      choice(
        seq(
          optional(
            $.foreach_type_attributes,
          ),
          $.basic_type,
          $.declarator,
        ),
        seq(
          optional(
            $.foreach_type_attributes,
          ),
          $.identifier,
        ),
        seq(
          optional(
            $.foreach_type_attributes,
          ),
          "alias",
          $.identifier,
        ),
      ),

    foreach_type_attributes: $ =>
      seq(
        $.foreach_type_attribute,
        optional(
          optional(
            $.foreach_type_attributes,
          ),
        ),
      ),

    foreach_type_attribute: $ =>
      choice(
        "ref",
        $.type_ctor,
        "enum",
      ),

    foreach_aggregate: $ =>
      $.expression,

    // ---

    range_foreach: $ =>
      seq(
        $.foreach,
        "(",
        $.foreach_type,
        ";",
        $.lwr_expression,
        "..",
        $.upr_expression,
        ")",
      ),

    lwr_expression: $ =>
      $.expression,

    upr_expression: $ =>
      $.expression,

    foreach_range_statement: $ =>
      seq(
        $.range_foreach,
        $.scope_statement,
      ),

    // ---

    switch_statement: $ =>
      seq(
        "switch",
        "(",
        $.expression,
        ")",
        $.scope_statement,
      ),

    case_statement: $ =>
      seq(
        "case",
        $.argument_list,
        ":",
        $.scope_statement_list,
      ),

    case_range_statement: $ =>
      seq(
        "case",
        $.first_exp,
        ":",
        "..",
        "case",
        $.last_exp,
        ":",
        $.scope_statement_list,
      ),

    first_exp: $ =>
      $.assign_expression,

    last_exp: $ =>
      $.assign_expression,

    default_statement: $ =>
      seq(
        "default",
        ":",
        $.scope_statement_list,
      ),

    scope_statement_list: $ =>
      $.statement_list_no_case_no_default,

    statement_list_no_case_no_default: $ =>
      repeat1(
        $.statement_no_case_no_default,
      ),

    statement_no_case_no_default: $ =>
      choice(
        ";",
        $.non_empty_statement_no_case_no_default,
        $.scope_block_statement,
      ),

    // ---

    final_switch_statement: $ =>
      seq(
        "final",
        "switch",
        "(",
        $.expression,
        ")",
        $.scope_statement,
      ),

    // ---

    continue_statement: $ =>
      seq(
        "continue",
        optional(
          $.identifier,
        ),
        ";",
      ),

    // ---

    break_statement: $ =>
      seq(
        "break",
        optional(
          $.identifier,
        ),
        ";",
      ),

    // ---

    return_statement: $ =>
      seq(
        "return",
        optional(
          $.expression,
        ),
        ";",
      ),

    // ---

    goto_statement: $ =>
      choice(
        seq(
          "goto",
          $.identifier,
          ";",
        ),
        seq(
          "goto",
          "default",
          ";",
        ),
        seq(
          "goto",
          "case",
          ";",
        ),
        seq(
          "goto",
          "case",
          $.expression,
          ";",
        ),
      ),

    // ---

    with_statement: $ =>
      choice(
        seq(
          "with",
          "(",
          $.expression,
          ")",
          $.scope_statement,
        ),
        seq(
          "with",
          "(",
          $.symbol,
          ")",
          $.scope_statement,
        ),
        seq(
          "with",
          "(",
          $.template_instance,
          ")",
          $.scope_statement,
        ),
      ),

    // ---

    synchronized_statement: $ =>
      choice(
        seq(
          "synchronized",
          $.scope_statement,
        ),
        seq(
          "synchronized",
          "(",
          $.expression,
          ")",
          $.scope_statement,
        ),
      ),

    // ---

    try_statement: $ =>
      choice(
        seq(
          "try",
          $.scope_statement,
          $.catches,
        ),
        seq(
          "try",
          $.scope_statement,
          $.catches,
          $.finally_statement,
        ),
        seq(
          "try",
          $.scope_statement,
          $.finally_statement,
        ),
      ),

    catches: $ =>
      repeat1(
        $.catch,
      ),

    catch: $ =>
      seq(
        "catch",
        "(",
        $.catch_parameter,
        ")",
        $.no_scope_non_empty_statement,
      ),

    catch_parameter: $ =>
      seq(
        $.basic_type,
        optional(
          $.identifier,
        ),
      ),

    finally_statement: $ =>
      seq(
        "finally",
        $.no_scope_non_empty_statement,
      ),

    // ---

    throw_statement: $ =>
      seq(
        "throw",
        $.expression,
        ";",
      ),

    // ---

    scope_guard_statement: $ =>
      choice(
        seq(
          "scope",
          "(",
          "exit",
          ")",
          $.non_empty_or_scope_block_statement,
        ),
        seq(
          "scope",
          "(",
          "success",
          ")",
          $.non_empty_or_scope_block_statement,
        ),
        seq(
          "scope",
          "(",
          "failure",
          ")",
          $.non_empty_or_scope_block_statement,
        ),
      ),

    // ---

    asm_statement: $ =>
      seq(
        "asm",
        optional(
          $.function_attributes,
        ),
        "{",
        optional(
          $.asm_instruction_list,
        ),
        "}",
      ),

    asm_instruction_list: $ =>
      choice(
        seq(
          $.asm_instruction,
          ";",
        ),
        seq(
          $.asm_instruction,
          ";",
          $.asm_instruction_list,
        ),
      ),

    // ---

    mixin_statement: $ =>
      seq(
        "mixin",
        "(",
        $.argument_list,
        ")",
        ";",
      ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/struct.html
    // ------------------------------------------------------------------------

    aggregate_declaration: $ =>
      choice(
        $.class_declaration,
        $.interface_declaration,
        $.struct_declaration,
        $.union_declaration,
      ),

    struct_declaration: $ =>
      choice(
        seq(
          "struct",
          $.identifier,
          ";",
        ),
        seq(
          "struct",
          $.identifier,
          $.aggregate_body,
        ),
        $.struct_template_declaration,
        $.anon_struct_declaration,
      ),

    anon_struct_declaration: $ =>
      seq(
        "struct",
        $.aggregate_body,
      ),

    union_declaration: $ =>
      choice(
        seq(
          "union",
          $.identifier,
          ";",
        ),
        seq(
          "union",
          $.identifier,
          $.aggregate_body,
        ),
        $.union_template_declaration,
        $.anon_union_declaration,
      ),

    anon_union_declaration: $ =>
      seq(
        "union",
        $.aggregate_body,
      ),

    aggregate_body: $ =>
      seq(
        "{",
        optional(
          $.decl_defs,
        ),
        "}",
      ),

    // ---

    postblit: $ =>
      choice(
        seq(
          "this",
          "(",
          "this",
          ")",
          optional(
            $.member_function_attributes,
          ),
          ";",
        ),
        seq(
          "this",
          "(",
          "this",
          ")",
          optional(
            $.member_function_attributes,
          ),
          $.function_body,
        ),
      ),

    // ---

    invariant: $ =>
      choice(
        seq(
          "invariant",
          "(",
          ")",
          $.block_statement,
        ),
        seq(
          "invariant",
          $.block_statement,
        ),
        seq(
          "invariant",
          "(",
          $.assert_arguments,
          ")",
          ";",
        ),
      ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/class.html
    // ------------------------------------------------------------------------

    class_declaration: $ =>
      choice(
        seq(
          "class",
          $.identifier,
          ";",
        ),
        seq(
          "class",
          $.identifier,
          optional(
            $.base_class_list,
          ),
          $.aggregate_body,
        ),
        $.class_template_declaration,
      ),

    base_class_list: $ =>
      choice(
        seq(
          ":",
          $.super_class_or_interface,
        ),
        seq(
          ":",
          $.super_class_or_interface,
          ",",
          $.interfaces,
        ),
      ),

    super_class_or_interface: $ =>
      $.basic_type,

    interfaces: $ =>
      choice(
        $.interface,
        seq(
          $.interface,
          ",",
          $.interfaces,
        ),
      ),

    interface: $ =>
      $.basic_type,

    // ---

    constructor: $ =>
      choice(
        seq(
          "this",
          $.parameters,
          optional(
            $.member_function_attributes,
          ),
          $.function_body,
        ),
        $.constructor_template,
      ),

    // ---

    destructor: $ =>
      seq(
        "~",
        "this",
        "(",
        ")",
        optional(
          $.member_function_attributes,
        ),
        $.function_body,
      ),

    // ---

    static_constructor: $ =>
      choice(
        seq(
          "static",
          "this",
          "(",
          ")",
          optional(
            $.member_function_attributes,
          ),
          ";",
        ),
        seq(
          "static",
          "this",
          "(",
          ")",
          optional(
            $.member_function_attributes,
          ),
          $.function_body,
        ),
      ),

    // ---

    static_destructor: $ =>
      choice(
        seq(
          "static",
          "~",
          "this",
          "(",
          ")",
          optional(
            $.member_function_attributes,
          ),
          ";",
        ),
        seq(
          "static",
          "~",
          "this",
          "(",
          ")",
          optional(
            $.member_function_attributes,
          ),
          $.function_body,
        ),
      ),

    // ---

    shared_static_constructor: $ =>
      choice(
        seq(
          "shared",
          "static",
          "this",
          "(",
          ")",
          optional(
            $.member_function_attributes,
          ),
          ";",
        ),
        seq(
          "shared",
          "static",
          "this",
          "(",
          ")",
          optional(
            $.member_function_attributes,
          ),
          $.function_body,
        ),
      ),

    // ---

    shared_static_destructor: $ =>
      choice(
        seq(
          "shared",
          "static",
          "~",
          "this",
          "(",
          ")",
          optional(
            $.member_function_attributes,
          ),
          ";",
        ),
        seq(
          "shared",
          "static",
          "~",
          "this",
          "(",
          ")",
          optional(
            $.member_function_attributes,
          ),
          $.function_body,
        ),
      ),

    // ---

    allocator: $ =>
      seq(
        "new",
        $.parameters,
        $.function_body,
      ),

    // ---

    deallocator: $ =>
      seq(
        "delete",
        $.parameters,
        $.function_body,
      ),

    // ---

    alias_this: $ =>
      seq(
        "alias",
        $.identifier,
        "this",
        ";",
      ),

    // ---

    new_anon_class_expression: $ =>
      seq(
        "new",
        optional(
          $.allocator_arguments,
        ),
        "class",
        optional(
          $.constructor_args,
        ),
        optional(
          $.super_class_or_interface,
        ),
        optional(
          $.interfaces,
        ),
        $.aggregate_body,
      ),

    constructor_args: $ =>
      seq(
        "(",
        optional(
          $.argument_list,
        ),
        ")",
      ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/interface.html
    // ------------------------------------------------------------------------

    interface_declaration: $ =>
      choice(
        seq(
          "interface",
          $.identifier,
          ";",
        ),
        seq(
          "interface",
          $.identifier,
          optional(
            $.base_interface_list,
          ),
          $.aggregate_body,
        ),
        $.interface_template_declaration,
      ),

    base_interface_list: $ =>
      seq(
        ":",
        $.interfaces,
      ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/enum.html
    // ------------------------------------------------------------------------

    enum_declaration: $ =>
      choice(
        seq(
          "enum",
          $.identifier,
          $.enum_body,
        ),
        seq(
          "enum",
          $.identifier,
          ":",
          $.enum_base_type,
          $.enum_body,
        ),
        $.anonymous_enum_declaration,
      ),

    enum_base_type: $ =>
      $.type,

    enum_body: $ =>
      choice(
        seq(
          "{",
          $.enum_members,
          "}",
        ),
        ";",
      ),

    enum_members: $ =>
      choice(
        $.enum_member,
        seq(
          $.enum_member,
          ",",
        ),
        seq(
          $.enum_member,
          ",",
          $.enum_members,
        ),
      ),

    enum_member_attributes: $ =>
      repeat1(
        $.enum_member_attribute,
      ),

    enum_member_attribute: $ =>
      choice(
        $.deprecated_attribute,
        $.user_defined_attribute,
        seq(
          "@",
          "disable",
        ),
      ),

    enum_member: $ =>
      choice(
        seq(
          optional(
            $.enum_member_attributes,
          ),
          $.identifier,
        ),
        seq(
          optional(
            $.enum_member_attributes,
          ),
          $.identifier,
          "=",
          $.assign_expression,
        ),
      ),

    anonymous_enum_declaration: $ =>
      choice(
        seq(
          "enum",
          ":",
          $.enum_base_type,
          "{",
          $.enum_members,
          "}",
        ),
        seq(
          "enum",
          "{",
          $.enum_members,
          "}",
        ),
        seq(
          "enum",
          "{",
          $.anonymous_enum_members,
          "}",
        ),
      ),

    anonymous_enum_members: $ =>
      choice(
        $.anonymous_enum_member,
        seq(
          $.anonymous_enum_member,
          ",",
        ),
        seq(
          $.anonymous_enum_member,
          ",",
          $.anonymous_enum_members,
        ),
      ),

    anonymous_enum_member: $ =>
      choice(
        $.enum_member,
        seq(
          $.type,
          $.identifier,
          "=",
          $.assign_expression,
        ),
      ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/function.html
    // ------------------------------------------------------------------------

    func_declaration: $ =>
      choice(
        seq(
          optional(
            $.storage_classes,
          ),
          $.basic_type,
          $.func_declarator,
          $.function_body,
        ),
        $.auto_func_declaration,
      ),

    auto_func_declaration: $ =>
      seq(
        $.storage_classes,
        $.identifier,
        $.func_declarator_suffix,
        $.function_body,
      ),

    func_declarator: $ =>
      seq(
        optional(
          $.type_suffixes,
        ),
        $.identifier,
        $.func_declarator_suffix,
      ),

    func_declarator_suffix: $ =>
      choice(
        seq(
          $.parameters,
          optional(
            $.member_function_attributes,
          ),
        ),
        seq(
          $.template_parameters,
          $.parameters,
          optional(
            $.member_function_attributes,
          ),
          optional(
            $.constraint,
          ),
        ),
      ),

    // ---

    parameters: $ =>
      seq(
        "(",
        optional(
          $.parameter_list,
        ),
        ")",
      ),

    parameter_list: $ =>
      choice(
        $.parameter,
        seq(
          $.parameter,
          ",",
          $.parameter_list,
        ),
        seq(
          $.variadic_arguments_attributes,
          "...",
        ),
      ),

    parameter: $ =>
      choice(
        seq(
          optional(
            $.parameter_attributes,
          ),
          $.basic_type,
          $.declarator,
        ),
        seq(
          optional(
            $.parameter_attributes,
          ),
          $.basic_type,
          $.declarator,
          "...",
        ),
        seq(
          optional(
            $.parameter_attributes,
          ),
          $.basic_type,
          $.declarator,
          "=",
          $.assign_expression,
        ),
        seq(
          optional(
            $.parameter_attributes,
          ),
          $.type,
        ),
        seq(
          optional(
            $.parameter_attributes,
          ),
          $.type,
          "...",
        ),
      ),

    parameter_attributes: $ =>
      choice(
        $.in_out,
        $.user_defined_attribute,
        seq(
          $.parameter_attributes,
          $.in_out,
        ),
        seq(
          $.parameter_attributes,
          $.user_defined_attribute,
        ),
        $.parameter_attributes,
      ),

    in_out: $ =>
      choice(
        "auto",
        $.type_ctor,
        "final",
        "in",
        "lazy",
        "out",
        "ref",
        seq(
          "return",
          "ref",
        ),
        "scope",
      ),

    variadic_arguments_attributes: $ =>
      repeat1(
        $.variadic_arguments_attribute,
      ),

    variadic_arguments_attribute: $ =>
      choice(
        "const",
        "immutable",
        "return",
        "scope",
        "shared",
      ),

    // ---

    function_attributes: $ =>
      repeat1(
        $.function_attribute,
      ),

    function_attribute: $ =>
      choice(
        $.function_attribute_kwd,
        $.property,
      ),

    member_function_attributes: $ =>
      repeat1(
        $.member_function_attribute,
      ),

    member_function_attribute: $ =>
      choice(
        "const",
        "immutable",
        "inout",
        "return",
        "shared",
        $.function_attribute,
      ),

    // ---

    function_body: $ =>
      choice(
        $.specified_function_body,
        $.missing_function_body,
        $.shortened_function_body,
      ),

    function_literal_body: $ =>
      $.block_statement,

    specified_function_body: $ =>
      choice(
        seq(
          optional(
            "do",
          ),
          $.block_statement,
        ),
        seq(
          optional(
            $.function_contracts,
          ),
          $.in_out_contract_expression,
          optional(
            "do",
          ),
          $.block_statement,
        ),
        seq(
          optional(
            $.function_contracts,
          ),
          $.in_out_statement,
          "do",
          $.block_statement,
        ),
      ),

    missing_function_body: $ =>
      choice(
        ";",
        seq(
          optional(
            $.function_contracts,
          ),
          $.in_out_contract_expression,
          ";",
        ),
        seq(
          optional(
            $.function_contracts,
          ),
          $.in_out_statement,
        ),
      ),

    shortened_function_body: $ =>
      seq(
        "=>",
        $.assign_expression,
        ";",
      ),

    // ---

    function_contracts: $ =>
      repeat1(
        $.function_contract,
      ),

    function_contract: $ =>
      choice(
        $.in_out_contract_expression,
        $.in_out_statement,
      ),

    in_out_contract_expression: $ =>
      choice(
        $.in_contract_expression,
        $.out_contract_expression,
      ),

    in_out_statement: $ =>
      choice(
        $.in_statement,
        $.out_statement,
      ),

    in_contract_expression: $ =>
      seq(
        "in",
        "(",
        $.assert_arguments,
        ")",
      ),

    out_contract_expression: $ =>
      choice(
        seq(
          "out",
          "(",
          ";",
          $.assert_arguments,
          ")",
        ),
        seq(
          "out",
          "(",
          $.identifier,
          ";",
          $.assert_arguments,
          ")",
        ),
      ),

    in_statement: $ =>
      seq(
        "in",
        $.block_statement,
      ),

    out_statement: $ =>
      choice(
        seq(
          "out",
          $.block_statement,
        ),
        seq(
          "out",
          "(",
          $.identifier,
          ")",
          $.block_statement,
        ),
      ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/template.html
    // ------------------------------------------------------------------------

    template_declaration: $ =>
      seq(
        "template",
        $.identifier,
        $.template_parameters,
        optional(
          $.constraint,
        ),
        "{",
        optional(
          $.decl_defs,
        ),
        "}",
      ),

    template_parameters: $ =>
      seq(
        "(",
        optional(
          $.template_parameter_list,
        ),
        ")",
      ),

    template_parameter_list: $ =>
      choice(
        $.template_parameter,
        seq(
          $.template_parameter,
          ",",
        ),
        seq(
          $.template_parameter,
          ",",
          $.template_parameter_list,
        ),
      ),

    template_parameter: $ =>
      choice(
        $.template_type_parameter,
        $.template_value_parameter,
        $.template_alias_parameter,
        $.template_sequence_parameter,
        $.template_this_parameter,
      ),

    // ---

    template_instance: $ =>
      seq(
        $.identifier,
        $.template_arguments,
      ),

    template_arguments: $ =>
      choice(
        seq(
          "!",
          "(",
          optional(
            $.template_argument_list,
          ),
          ")",
        ),
        seq(
          "!",
          $.template_single_argument,
        ),
      ),

    template_argument_list: $ =>
      choice(
        $.template_argument,
        seq(
          $.template_argument,
          ",",
        ),
        seq(
          $.template_argument,
          ",",
          $.template_argument_list,
        ),
      ),

    template_argument: $ =>
      choice(
        $.type,
        $.assign_expression,
        $.symbol,
      ),

    symbol: $ =>
      choice(
        $.symbol_tail,
        seq(
          ".",
          $.symbol_tail,
        ),
      ),

    symbol_tail: $ =>
      choice(
        $.identifier,
        seq(
          $.identifier,
          ".",
          $.symbol_tail,
        ),
        $.template_instance,
        seq(
          $.template_instance,
          ".",
          $.symbol_tail,
        ),
      ),

    template_single_argument: $ =>
      choice(
        $.identifier,
        $.fundamental_type,
        $.character_literal,
        $.string_literal,
        $.integer_literal,
        $.float_literal,
        "true",
        "false",
        "null",
        "this",
        $.special_keyword,
      ),

    // ---

    template_type_parameter: $ =>
      choice(
        $.identifier,
        seq(
          $.identifier,
          $.template_type_parameter_specialization,
        ),
        seq(
          $.identifier,
          $.template_type_parameter_default,
        ),
        seq(
          $.identifier,
          $.template_type_parameter_specialization,
          $.template_type_parameter_default,
        ),
      ),

    template_type_parameter_specialization: $ =>
      seq(
        ":",
        $.type,
      ),

    template_type_parameter_default: $ =>
      seq(
        "=",
        $.type,
      ),

    // ---

    template_this_parameter: $ =>
      seq(
        "this",
        $.template_type_parameter,
      ),

    // ---

    template_value_parameter: $ =>
      choice(
        seq(
          $.basic_type,
          $.declarator,
        ),
        seq(
          $.basic_type,
          $.declarator,
          $.template_value_parameter_specialization,
        ),
        seq(
          $.basic_type,
          $.declarator,
          $.template_value_parameter_default,
        ),
        seq(
          $.basic_type,
          $.declarator,
          $.template_value_parameter_specialization,
          $.template_value_parameter_default,
        ),
      ),

    template_value_parameter_specialization: $ =>
      seq(
        ":",
        $.conditional_expression,
      ),

    template_value_parameter_default: $ =>
      choice(
        seq(
          "=",
          $.assign_expression,
        ),
        seq(
          "=",
          $.special_keyword,
        ),
      ),

    // ---

    template_alias_parameter: $ =>
      choice(
        seq(
          "alias",
          $.identifier,
          optional(
            $.template_alias_parameter_specialization,
          ),
          optional(
            $.template_alias_parameter_default,
          ),
        ),
        seq(
          "alias",
          $.basic_type,
          $.declarator,
          optional(
            $.template_alias_parameter_specialization,
          ),
          optional(
            $.template_alias_parameter_default,
          ),
        ),
      ),

    template_alias_parameter_specialization: $ =>
      choice(
        seq(
          ":",
          $.type,
        ),
        seq(
          ":",
          $.conditional_expression,
        ),
      ),

    template_alias_parameter_default: $ =>
      choice(
        seq(
          "=",
          $.type,
        ),
        seq(
          "=",
          $.conditional_expression,
        ),
      ),

    // ---

    template_sequence_parameter: $ =>
      seq(
        $.identifier,
        "...",
      ),

    // ---

    constructor_template: $ =>
      choice(
        seq(
          "this",
          $.template_parameters,
          $.parameters,
          optional(
            $.member_function_attributes,
          ),
          optional(
            $.constraint,
          ),
          ":",
        ),
        seq(
          "this",
          $.template_parameters,
          $.parameters,
          optional(
            $.member_function_attributes,
          ),
          optional(
            $.constraint,
          ),
          $.function_body,
        ),
      ),

    // ---

    class_template_declaration: $ =>
      choice(
        seq(
          "class",
          $.identifier,
          $.template_parameters,
          ";",
        ),
        seq(
          "class",
          $.identifier,
          $.template_parameters,
          optional(
            $.constraint,
          ),
          optional(
            $.base_class_list,
          ),
          $.aggregate_body,
        ),
        seq(
          "class",
          $.identifier,
          $.template_parameters,
          optional(
            $.base_class_list,
          ),
          optional(
            $.constraint,
          ),
          $.aggregate_body,
        ),
      ),

    interface_template_declaration: $ =>
      choice(
        seq(
          "interface",
          $.identifier,
          $.template_parameters,
          ";",
        ),
        seq(
          "interface",
          $.identifier,
          $.template_parameters,
          optional(
            $.constraint,
          ),
          optional(
            $.base_interface_list,
          ),
          $.aggregate_body,
        ),
        seq(
          "interface",
          $.identifier,
          $.template_parameters,
          $.base_interface_list,
          $.constraint,
          $.aggregate_body,
        ),
      ),

    struct_template_declaration: $ =>
      choice(
        seq(
          "struct",
          $.identifier,
          $.template_parameters,
          ";",
        ),
        seq(
          "struct",
          $.identifier,
          $.template_parameters,
          optional(
            $.constraint,
          ),
          $.aggregate_body,
        ),
      ),

    union_template_declaration: $ =>
      choice(
        seq(
          "union",
          $.identifier,
          $.template_parameters,
          ";",
        ),
        seq(
          "union",
          $.identifier,
          $.template_parameters,
          optional(
            $.constraint,
          ),
          $.aggregate_body,
        ),
      ),

    // ---

    constraint: $ =>
      seq(
        "if",
        "(",
        $.expression,
        ")",
      ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/template-mixin.html
    // ------------------------------------------------------------------------

    template_mixin_declaration: $ =>
      seq(
        "mixin",
        "template",
        $.identifier,
        $.template_parameters,
        optional(
          $.constraint,
        ),
        "{",
        optional(
          $.decl_defs,
        ),
        "}",
      ),

    template_mixin: $ =>
      seq(
        "mixin",
        $.mixin_template_name,
        optional(
          $.template_arguments,
        ),
        optional(
          $.identifier,
        ),
        ";",
      ),

    mixin_template_name: $ =>
      choice(
        seq(
          ".",
          $.mixin_qualified_identifier,
        ),
        $.mixin_qualified_identifier,
        seq(
          $.typeof,
          ".",
          $.mixin_qualified_identifier,
        ),
      ),

    mixin_qualified_identifier: $ =>
      choice(
        $.identifier,
        seq(
          $.identifier,
          ".",
          $.mixin_qualified_identifier,
        ),
        seq(
          $.template_instance,
          ".",
          $.mixin_qualified_identifier,
        ),
      ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/version.html
    // ------------------------------------------------------------------------

    conditional_declaration: $ =>
      choice(
        seq(
          $.condition,
          $.declaration_block,
        ),
        seq(
          $.condition,
          $.declaration_block,
          "else",
          $.declaration_block,
        ),
        seq(
          $.condition,
          ":",
          optional(
            $.decl_defs,
          ),
        ),
        seq(
          $.condition,
          $.declaration_block,
          "else",
          ":",
          optional(
            $.decl_defs,
          ),
        ),
      ),

    conditional_statement: $ =>
      choice(
        seq(
          $.condition,
          $.no_scope_non_empty_statement,
        ),
        seq(
          $.condition,
          $.no_scope_non_empty_statement,
          "else",
          $.no_scope_non_empty_statement,
        ),
      ),

    // ---

    condition: $ =>
      choice(
        $.version_condition,
        $.debug_condition,
        $.static_if_condition,
      ),

    // ---

    version_condition: $ =>
      choice(
        seq(
          "version",
          "(",
          $.integer_literal,
          ")",
        ),
        seq(
          "version",
          "(",
          $.identifier,
          ")",
        ),
        seq(
          "version",
          "(",
          "unittest",
          ")",
        ),
        seq(
          "version",
          "(",
          "assert",
          ")",
        ),
      ),

    // ---

    version_specification: $ =>
      choice(
        seq(
          "version",
          "=",
          $.identifier,
          ";",
        ),
        seq(
          "version",
          "=",
          $.integer_literal,
          ";",
        ),
      ),

    // ---

    debug_condition: $ =>
      choice(
        "debug",
        seq(
          "debug",
          "(",
          $.integer_literal,
          ")",
        ),
        seq(
          "debug",
          "(",
          $.identifier,
          ")",
        ),
      ),

    // ---

    debug_specification: $ =>
      choice(
        seq(
          "debug",
          "=",
          $.identifier,
          ";",
        ),
        seq(
          "debug",
          "=",
          $.integer_literal,
          ";",
        ),
      ),

    // ---

    static_if_condition: $ =>
      seq(
        "static",
        "if",
        "(",
        $.assign_expression,
        ")",
      ),

    // ---

    static_foreach: $ =>
      choice(
        seq(
          "static",
          $.aggregate_foreach,
        ),
        seq(
          "static",
          $.range_foreach,
        ),
      ),

    static_foreach_declaration: $ =>
      choice(
        seq(
          $.static_foreach,
          $.declaration_block,
        ),
        seq(
          $.static_foreach,
          ":",
          optional(
            $.decl_defs,
          ),
        ),
      ),

    static_foreach_statement: $ =>
      seq(
        $.static_foreach,
        $.no_scope_non_empty_statement,
      ),

    // ---

    static_assert: $ =>
      seq(
        "static",
        "assert",
        "(",
        $.assert_arguments,
        ")",
        ";",
      ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/traits.html
    // ------------------------------------------------------------------------

    traits_expression: $ =>
      seq(
        "__traits",
        "(",
        $.traits_keyword,
        ",",
        $.traits_arguments,
        ")",
      ),

    traits_keyword: $ =>
      choice(
        "isAbstractClass",
        "isArithmetic",
        "isAssociativeArray",
        "isFinalClass",
        "isPOD",
        "isNested",
        "isFuture",
        "isDeprecated",
        "isFloating",
        "isIntegral",
        "isScalar",
        "isStaticArray",
        "isUnsigned",
        "isDisabled",
        "isVirtualFunction",
        "isVirtualMethod",
        "isAbstractFunction",
        "isFinalFunction",
        "isStaticFunction",
        "isOverrideFunction",
        "isTemplate",
        "isRef",
        "isOut",
        "isLazy",
        "isReturnOnStack",
        "isZeroInit",
        "isModule",
        "isPackage",
        "hasMember",
        "hasCopyConstructor",
        "hasPostblit",
        "identifier",
        "getAliasThis",
        "getAttributes",
        "getFunctionAttributes",
        "getFunctionVariadicStyle",
        "getLinkage",
        "getLocation",
        "getMember",
        "getOverloads",
        "getParameterStorageClasses",
        "getPointerBitmap",
        "getCppNamespaces",
        "getVisibility",
        "getProtection",
        "getTargetInfo",
        "getVirtualFunctions",
        "getVirtualMethods",
        "getUnitTests",
        "parent",
        "child",
        "classInstanceSize",
        "getVirtualIndex",
        "allMembers",
        "derivedMembers",
        "isSame",
        "compiles",
        "toType",
      ),

    traits_arguments: $ =>
      choice(
        $.traits_argument,
        seq(
          $.traits_argument,
          ",",
          $.traits_arguments,
        ),
      ),

    traits_argument: $ =>
      choice(
        $.assign_expression,
        $.type,
      ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/unittest.html
    // ------------------------------------------------------------------------

    unit_test: $ =>
      seq(
        "unittest",
        $.block_statement,
      ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/iasm.html
    // ------------------------------------------------------------------------

    asm_instruction: $ =>
      choice(
        seq(
          $.identifier,
          ":",
          $.asm_instruction,
        ),
        seq(
          "align",
          $.integer_expression,
        ),
        "even",
        "naked",
        seq(
          "db",
          $.operands,
        ),
        seq(
          "ds",
          $.operands,
        ),
        seq(
          "di",
          $.operands,
        ),
        seq(
          "dl",
          $.operands,
        ),
        seq(
          "df",
          $.operands,
        ),
        seq(
          "dd",
          $.operands,
        ),
        seq(
          "de",
          $.operands,
        ),
        seq(
          "db",
          $.string_literal,
        ),
        seq(
          "ds",
          $.string_literal,
        ),
        seq(
          "di",
          $.string_literal,
        ),
        seq(
          "dl",
          $.string_literal,
        ),
        seq(
          "dw",
          $.string_literal,
        ),
        seq(
          "dq",
          $.string_literal,
        ),
        $.opcode,
        seq(
          $.opcode,
          $.operands,
        ),
      ),

    opcode: $ =>
      $.identifier,

    operands: $ =>
      choice(
        $.operand,
        seq(
          $.operand,
          ",",
          $.operands,
        ),
      ),

    // ---

    integer_expression: $ =>
      choice(
        $.integer_literal,
        $.identifier,
      ),

    // ---

    register: $ =>
      choice(
        seq(
          "AL",
          "AH",
          "AX",
          "EAX",
        ),
        seq(
          "BL",
          "BH",
          "BX",
          "EBX",
        ),
        seq(
          "CL",
          "CH",
          "CX",
          "ECX",
        ),
        seq(
          "DL",
          "DH",
          "DX",
          "EDX",
        ),
        seq(
          "BP",
          "EBP",
        ),
        seq(
          "SP",
          "ESP",
        ),
        seq(
          "DI",
          "EDI",
        ),
        seq(
          "SI",
          "ESI",
        ),
        seq(
          "ES",
          "CS",
          "SS",
          "DS",
          "GS",
          "FS",
        ),
        seq(
          "CR0",
          "CR2",
          "CR3",
          "CR4",
        ),
        seq(
          "DR0",
          "DR1",
          "DR2",
          "DR3",
          "DR6",
          "DR7",
        ),
        seq(
          "TR3",
          "TR4",
          "TR5",
          "TR6",
          "TR7",
        ),
        "ST",
        seq(
          "ST(0)",
          "ST(1)",
          "ST(2)",
          "ST(3)",
          "ST(4)",
          "ST(5)",
          "ST(6)",
          "ST(7)",
        ),
        seq(
          "MM0",
          "MM1",
          "MM2",
          "MM3",
          "MM4",
          "MM5",
          "MM6",
          "MM7",
        ),
        seq(
          "XMM0",
          "XMM1",
          "XMM2",
          "XMM3",
          "XMM4",
          "XMM5",
          "XMM6",
          "XMM7",
        ),
      ),

    // ---

    register64: $ =>
      choice(
        seq(
          "RAX",
          "RBX",
          "RCX",
          "RDX",
        ),
        seq(
          "BPL",
          "RBP",
        ),
        seq(
          "SPL",
          "RSP",
        ),
        seq(
          "DIL",
          "RDI",
        ),
        seq(
          "SIL",
          "RSI",
        ),
        seq(
          "R8B",
          "R8W",
          "R8D",
          "R8",
        ),
        seq(
          "R9B",
          "R9W",
          "R9D",
          "R9",
        ),
        seq(
          "R10B",
          "R10W",
          "R10D",
          "R10",
        ),
        seq(
          "R11B",
          "R11W",
          "R11D",
          "R11",
        ),
        seq(
          "R12B",
          "R12W",
          "R12D",
          "R12",
        ),
        seq(
          "R13B",
          "R13W",
          "R13D",
          "R13",
        ),
        seq(
          "R14B",
          "R14W",
          "R14D",
          "R14",
        ),
        seq(
          "R15B",
          "R15W",
          "R15D",
          "R15",
        ),
        seq(
          "XMM8",
          "XMM9",
          "XMM10",
          "XMM11",
          "XMM12",
          "XMM13",
          "XMM14",
          "XMM15",
        ),
        seq(
          "YMM0",
          "YMM1",
          "YMM2",
          "YMM3",
          "YMM4",
          "YMM5",
          "YMM6",
          "YMM7",
        ),
        seq(
          "YMM8",
          "YMM9",
          "YMM10",
          "YMM11",
          "YMM12",
          "YMM13",
          "YMM14",
          "YMM15",
        ),
      ),

    // ---

    operand: $ =>
      $.asm_exp,

    asm_exp: $ =>
      choice(
        $.asm_log_or_exp,
        seq(
          $.asm_log_or_exp,
          "?",
          $.asm_exp,
          ":",
          $.asm_exp,
        ),
      ),

    asm_log_or_exp: $ =>
      choice(
        $.asm_log_and_exp,
        seq(
          $.asm_log_or_exp,
          "||",
          $.asm_log_and_exp,
        ),
      ),

    asm_log_and_exp: $ =>
      choice(
        $.asm_or_exp,
        seq(
          $.asm_log_and_exp,
          "&&",
          $.asm_or_exp,
        ),
      ),

    asm_or_exp: $ =>
      choice(
        $.asm_xor_exp,
        seq(
          $.asm_or_exp,
          "|",
          $.asm_xor_exp,
        ),
      ),

    asm_xor_exp: $ =>
      choice(
        $.asm_and_exp,
        seq(
          $.asm_xor_exp,
          "^",
          $.asm_and_exp,
        ),
      ),

    asm_and_exp: $ =>
      choice(
        $.asm_equal_exp,
        seq(
          $.asm_and_exp,
          "&",
          $.asm_equal_exp,
        ),
      ),

    asm_equal_exp: $ =>
      choice(
        $.asm_rel_exp,
        seq(
          $.asm_equal_exp,
          "==",
          $.asm_rel_exp,
        ),
        seq(
          $.asm_equal_exp,
          "!=",
          $.asm_rel_exp,
        ),
      ),

    asm_rel_exp: $ =>
      choice(
        $.asm_shift_exp,
        seq(
          $.asm_rel_exp,
          "<",
          $.asm_shift_exp,
        ),
        seq(
          $.asm_rel_exp,
          "<",
          "=",
          $.asm_shift_exp,
        ),
        seq(
          $.asm_rel_exp,
          ">",
          $.asm_shift_exp,
        ),
        seq(
          $.asm_rel_exp,
          ">=",
          $.asm_shift_exp,
        ),
      ),

    asm_shift_exp: $ =>
      choice(
        $.asm_add_exp,
        seq(
          $.asm_shift_exp,
          "<",
          "<",
          $.asm_add_exp,
        ),
        seq(
          $.asm_shift_exp,
          ">>",
          $.asm_add_exp,
        ),
        seq(
          $.asm_shift_exp,
          ">>>",
          $.asm_add_exp,
        ),
      ),

    asm_add_exp: $ =>
      choice(
        $.asm_mul_exp,
        seq(
          $.asm_add_exp,
          "+",
          $.asm_mul_exp,
        ),
        seq(
          $.asm_add_exp,
          "-",
          $.asm_mul_exp,
        ),
      ),

    asm_mul_exp: $ =>
      choice(
        $.asm_br_exp,
        seq(
          $.asm_mul_exp,
          "*",
          $.asm_br_exp,
        ),
        seq(
          $.asm_mul_exp,
          "/",
          $.asm_br_exp,
        ),
        seq(
          $.asm_mul_exp,
          "%",
          $.asm_br_exp,
        ),
      ),

    asm_br_exp: $ =>
      choice(
        $.asm_una_exp,
        seq(
          $.asm_br_exp,
          "[",
          $.asm_exp,
          "]",
        ),
      ),

    asm_una_exp: $ =>
      choice(
        seq(
          $.asm_type_prefix,
          $.asm_exp,
        ),
        seq(
          "offsetof",
          $.asm_exp,
        ),
        seq(
          "seg",
          $.asm_exp,
        ),
        seq(
          "+",
          $.asm_una_exp,
        ),
        seq(
          "-",
          $.asm_una_exp,
        ),
        seq(
          "!",
          $.asm_una_exp,
        ),
        seq(
          "~",
          $.asm_una_exp,
        ),
        $.asm_primary_exp,
      ),

    asm_primary_exp: $ =>
      choice(
        $.integer_literal,
        $.float_literal,
        "__LOCAL_SIZE",
        "$",
        $.register,
        seq(
          $.register,
          ":",
          $.asm_exp,
        ),
        $.register64,
        seq(
          $.register64,
          ":",
          $.asm_exp,
        ),
        $.dot_identifier,
        "this",
      ),

    dot_identifier: $ =>
      choice(
        $.identifier,
        seq(
          $.identifier,
          ".",
          $.dot_identifier,
        ),
        seq(
          $.fundamental_type,
          ".",
          $.identifier,
        ),
      ),

    // ---

    asm_type_prefix: $ =>
      choice(
        seq(
          "near",
          "ptr",
        ),
        seq(
          "far",
          "ptr",
        ),
        seq(
          "word",
          "ptr",
        ),
        seq(
          "dword",
          "ptr",
        ),
        seq(
          "qword",
          "ptr",
        ),
        seq(
          $.fundamental_type,
          "ptr",
        ),
      ),
  }
});
