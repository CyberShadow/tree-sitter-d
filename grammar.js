module.exports = grammar({
  name: 'd',

  rules: {
    source_file: $ => $._module,

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/lex.html
    // ------------------------------------------------------------------------

    _character: $ => choice(
      seq(
        /* any Unicode character */,
      ),
    ),

    // ---

    _end_of_file: $ => choice(
      seq(
        /* physical end of the file */,
      ),
      seq(
        "\0",
      ),
      seq(
        "\x1A",
      ),
    ),

    // ---

    _end_of_line: $ => choice(
      seq(
        "\r",
      ),
      seq(
        "\n",
      ),
      seq(
        "\r",
        "\n",
      ),
      seq(
        "\u2028",
      ),
      seq(
        "\u2029",
      ),
      seq(
        $._end_of_file,
      ),
    ),

    // ---

    _white_space: $ => choice(
      seq(
        $._space,
      ),
      seq(
        $._space,
        $._white_space,
      ),
    ),

    _space: $ => choice(
      seq(
        " ",
      ),
      seq(
        "\t",
      ),
      seq(
        "\v",
      ),
      seq(
        "\f",
      ),
    ),

    // ---

    _comment: $ => choice(
      seq(
        $._block_comment,
      ),
      seq(
        $._line_comment,
      ),
      seq(
        $._nesting_block_comment,
      ),
    ),

    _block_comment: $ => choice(
      seq(
        "/*",
        optional(
          $._characters,
        ),
        "*/",
      ),
    ),

    _line_comment: $ => choice(
      seq(
        "//",
        optional(
          $._characters,
        ),
        $._end_of_line,
      ),
    ),

    _nesting_block_comment: $ => choice(
      seq(
        "/+",
        optional(
          $._nesting_block_comment_characters,
        ),
        "+/",
      ),
    ),

    _nesting_block_comment_characters: $ => choice(
      seq(
        $._nesting_block_comment_character,
      ),
      seq(
        $._nesting_block_comment_character,
        $._nesting_block_comment_characters,
      ),
    ),

    _nesting_block_comment_character: $ => choice(
      seq(
        $._character,
      ),
      seq(
        $._nesting_block_comment,
      ),
    ),

    _characters: $ => choice(
      seq(
        $._character,
      ),
      seq(
        $._character,
        $._characters,
      ),
    ),

    // ---

    _tokens: $ => choice(
      seq(
        $._token,
      ),
      seq(
        $._token,
        $._tokens,
      ),
    ),

    _token: $ => choice(
      seq(
        $._identifier,
      ),
      seq(
        $._string_literal,
      ),
      seq(
        $._character_literal,
      ),
      seq(
        $._integer_literal,
      ),
      seq(
        $._float_literal,
      ),
      seq(
        $._keyword,
      ),
      seq(
        "/",
      ),
      seq(
        "/=",
      ),
      seq(
        ".",
      ),
      seq(
        "..",
      ),
      seq(
        "...",
      ),
      seq(
        "&",
      ),
      seq(
        "&=",
      ),
      seq(
        "&&",
      ),
      seq(
        "|",
      ),
      seq(
        "|=",
      ),
      seq(
        "||",
      ),
      seq(
        "-",
      ),
      seq(
        "-=",
      ),
      seq(
        "--",
      ),
      seq(
        "+",
      ),
      seq(
        "+=",
      ),
      seq(
        "++",
      ),
      seq(
        "<",
      ),
      seq(
        "<",
        "=",
      ),
      seq(
        "<",
        "<",
      ),
      seq(
        "<",
        "<",
        "=",
      ),
      seq(
        ">",
      ),
      seq(
        ">",
        "=",
      ),
      seq(
        ">",
        ">",
        "=",
      ),
      seq(
        ">",
        ">",
        ">",
        "=",
      ),
      seq(
        ">",
        ">",
      ),
      seq(
        ">",
        ">",
        ">",
      ),
      seq(
        "!",
      ),
      seq(
        "!=",
      ),
      seq(
        "(",
      ),
      seq(
        ")",
      ),
      seq(
        "[",
      ),
      seq(
        "]",
      ),
      seq(
        "{",
      ),
      seq(
        "}",
      ),
      seq(
        "?",
      ),
      seq(
        ",",
      ),
      seq(
        ";",
      ),
      seq(
        ":",
      ),
      seq(
        "$",
      ),
      seq(
        "=",
      ),
      seq(
        "==",
      ),
      seq(
        "*",
      ),
      seq(
        "*=",
      ),
      seq(
        "%",
      ),
      seq(
        "%=",
      ),
      seq(
        "^",
      ),
      seq(
        "^=",
      ),
      seq(
        "^^",
      ),
      seq(
        "^^=",
      ),
      seq(
        "~",
      ),
      seq(
        "~=",
      ),
      seq(
        "@",
      ),
      seq(
        "=>",
      ),
      seq(
        "#",
      ),
    ),

    // ---

    _identifier: $ => choice(
      seq(
        $._identifier_start,
      ),
      seq(
        $._identifier_start,
        $._identifier_chars,
      ),
    ),

    _identifier_chars: $ => choice(
      seq(
        $._identifier_char,
      ),
      seq(
        $._identifier_char,
        $._identifier_chars,
      ),
    ),

    _identifier_start: $ => choice(
      seq(
        "_",
      ),
      seq(
        /* Letter */,
      ),
      seq(
        /* UniversalAlpha */,
      ),
    ),

    _identifier_char: $ => choice(
      seq(
        $._identifier_start,
      ),
      seq(
        "0",
      ),
      seq(
        $._non_zero_digit,
      ),
    ),

    // ---

    _string_literal: $ => choice(
      seq(
        $._wysiwyg_string,
      ),
      seq(
        $._alternate_wysiwyg_string,
      ),
      seq(
        $._double_quoted_string,
      ),
      seq(
        $._hex_string,
      ),
      seq(
        $._delimited_string,
      ),
      seq(
        $._token_string,
      ),
    ),

    _wysiwyg_string: $ => choice(
      seq(
        "r\"",
        optional(
          $._wysiwyg_characters,
        ),
        "\"",
        optional(
          $._string_postfix,
        ),
      ),
    ),

    _alternate_wysiwyg_string: $ => choice(
      seq(
        "`",
        optional(
          $._wysiwyg_characters,
        ),
        "`",
        optional(
          $._string_postfix,
        ),
      ),
    ),

    _wysiwyg_characters: $ => choice(
      seq(
        $._wysiwyg_character,
      ),
      seq(
        $._wysiwyg_character,
        $._wysiwyg_characters,
      ),
    ),

    _wysiwyg_character: $ => choice(
      seq(
        $._character,
      ),
      seq(
        $._end_of_line,
      ),
    ),

    _double_quoted_string: $ => choice(
      seq(
        "\"",
        optional(
          $._double_quoted_characters,
        ),
        "\"",
        optional(
          $._string_postfix,
        ),
      ),
    ),

    _double_quoted_characters: $ => choice(
      seq(
        $._double_quoted_character,
      ),
      seq(
        $._double_quoted_character,
        $._double_quoted_characters,
      ),
    ),

    _double_quoted_character: $ => choice(
      seq(
        $._character,
      ),
      seq(
        $._escape_sequence,
      ),
      seq(
        $._end_of_line,
      ),
    ),

    _escape_sequence: $ => choice(
      seq(
        "\\\\'",
      ),
      seq(
        "\\\\\"",
      ),
      seq(
        "\\\\?",
      ),
      seq(
        "\\\\\\\\",
      ),
      seq(
        "\\0",
      ),
      seq(
        "\\a",
      ),
      seq(
        "\\b",
      ),
      seq(
        "\\f",
      ),
      seq(
        "\\n",
      ),
      seq(
        "\\r",
      ),
      seq(
        "\\t",
      ),
      seq(
        "\\v",
      ),
      seq(
        "\\x",
        $._hex_digit,
        $._hex_digit,
      ),
      seq(
        "\\\\",
        $._octal_digit,
      ),
      seq(
        "\\\\",
        $._octal_digit,
        $._octal_digit,
      ),
      seq(
        "\\\\",
        $._octal_digit,
        $._octal_digit,
        $._octal_digit,
      ),
      seq(
        "\\u",
        $._hex_digit,
        $._hex_digit,
        $._hex_digit,
        $._hex_digit,
      ),
      seq(
        "\\U",
        $._hex_digit,
        $._hex_digit,
        $._hex_digit,
        $._hex_digit,
        $._hex_digit,
        $._hex_digit,
        $._hex_digit,
        $._hex_digit,
      ),
      seq(
        "\\\\",
        $._named_character_entity,
      ),
    ),

    _hex_string: $ => choice(
      seq(
        "x\"",
        optional(
          $._hex_string_chars,
        ),
        "\"",
        optional(
          $._string_postfix,
        ),
      ),
    ),

    _hex_string_chars: $ => choice(
      seq(
        $._hex_string_char,
      ),
      seq(
        $._hex_string_char,
        $._hex_string_chars,
      ),
    ),

    _hex_string_char: $ => choice(
      seq(
        $._hex_digit,
      ),
      seq(
        $._white_space,
      ),
      seq(
        $._end_of_line,
      ),
    ),

    _string_postfix: $ => choice(
      seq(
        "c",
      ),
      seq(
        "w",
      ),
      seq(
        "d",
      ),
    ),

    _delimited_string: $ => choice(
      seq(
        "q\"",
        $._delimiter,
        optional(
          $._wysiwyg_characters,
        ),
        $._matching_delimiter,
        "\"",
      ),
    ),

    _delimiter: $ => choice(
      seq(
        "(",
      ),
      seq(
        "{",
      ),
      seq(
        "[",
      ),
      seq(
        "<",
      ),
      seq(
        $._identifier,
      ),
    ),

    _matching_delimiter: $ => choice(
      seq(
        ")",
      ),
      seq(
        "}",
      ),
      seq(
        "]",
      ),
      seq(
        ">",
      ),
      seq(
        $._identifier,
      ),
    ),

    _token_string: $ => choice(
      seq(
        "q",
        "{",
        optional(
          $._tokens,
        ),
        "}",
      ),
    ),

    // ---

    _character_literal: $ => choice(
      seq(
        "'",
        $._single_quoted_character,
        "'",
      ),
    ),

    _single_quoted_character: $ => choice(
      seq(
        $._character,
      ),
      seq(
        $._escape_sequence,
      ),
    ),

    // ---

    _integer_literal: $ => choice(
      seq(
        $._integer,
      ),
      seq(
        $._integer,
        $._integer_suffix,
      ),
    ),

    _integer: $ => choice(
      seq(
        $._decimal_integer,
      ),
      seq(
        $._binary_integer,
      ),
      seq(
        $._hexadecimal_integer,
      ),
    ),

    _integer_suffix: $ => choice(
      seq(
        "L",
      ),
      seq(
        "u",
      ),
      seq(
        "U",
      ),
      seq(
        "Lu",
      ),
      seq(
        "LU",
      ),
      seq(
        "uL",
      ),
      seq(
        "UL",
      ),
    ),

    _decimal_integer: $ => choice(
      seq(
        "0",
      ),
      seq(
        $._non_zero_digit,
      ),
      seq(
        $._non_zero_digit,
        $._decimal_digits_us,
      ),
    ),

    _binary_integer: $ => choice(
      seq(
        $._bin_prefix,
        $._binary_digits_no_single_us,
      ),
    ),

    _bin_prefix: $ => choice(
      seq(
        "0b",
      ),
      seq(
        "0B",
      ),
    ),

    _hexadecimal_integer: $ => choice(
      seq(
        $._hex_prefix,
        $._hex_digits_no_single_us,
      ),
    ),

    _non_zero_digit: $ => choice(
      seq(
        "1",
      ),
      seq(
        "2",
      ),
      seq(
        "3",
      ),
      seq(
        "4",
      ),
      seq(
        "5",
      ),
      seq(
        "6",
      ),
      seq(
        "7",
      ),
      seq(
        "8",
      ),
      seq(
        "9",
      ),
    ),

    _decimal_digits: $ => choice(
      seq(
        $._decimal_digit,
      ),
      seq(
        $._decimal_digit,
        $._decimal_digits,
      ),
    ),

    _decimal_digits_us: $ => choice(
      seq(
        $._decimal_digit_us,
      ),
      seq(
        $._decimal_digit_us,
        $._decimal_digits_us,
      ),
    ),

    _decimal_digits_no_single_us: $ => choice(
      seq(
        $._decimal_digit,
      ),
      seq(
        $._decimal_digit,
        $._decimal_digits_us,
      ),
      seq(
        $._decimal_digits_us,
        $._decimal_digit,
      ),
    ),

    _decimal_digits_no_starting_us: $ => choice(
      seq(
        $._decimal_digit,
      ),
      seq(
        $._decimal_digit,
        $._decimal_digits_us,
      ),
    ),

    _decimal_digit: $ => choice(
      seq(
        "0",
      ),
      seq(
        $._non_zero_digit,
      ),
    ),

    _decimal_digit_us: $ => choice(
      seq(
        $._decimal_digit,
      ),
      seq(
        "_",
      ),
    ),

    _binary_digits_no_single_us: $ => choice(
      seq(
        $._binary_digit,
      ),
      seq(
        $._binary_digit,
        $._binary_digits_us,
      ),
      seq(
        $._binary_digits_us,
        $._binary_digit,
      ),
      seq(
        $._binary_digits_us,
        $._binary_digit,
        $._binary_digits_us,
      ),
    ),

    _binary_digits_us: $ => choice(
      seq(
        $._binary_digit_us,
      ),
      seq(
        $._binary_digit_us,
        $._binary_digits_us,
      ),
    ),

    _binary_digit: $ => choice(
      seq(
        "0",
      ),
      seq(
        "1",
      ),
    ),

    _binary_digit_us: $ => choice(
      seq(
        $._binary_digit,
      ),
      seq(
        "_",
      ),
    ),

    _octal_digit: $ => choice(
      seq(
        "0",
      ),
      seq(
        "1",
      ),
      seq(
        "2",
      ),
      seq(
        "3",
      ),
      seq(
        "4",
      ),
      seq(
        "5",
      ),
      seq(
        "6",
      ),
      seq(
        "7",
      ),
    ),

    _hex_digits: $ => choice(
      seq(
        $._hex_digit,
      ),
      seq(
        $._hex_digit,
        $._hex_digits,
      ),
    ),

    _hex_digits_us: $ => choice(
      seq(
        $._hex_digit_us,
      ),
      seq(
        $._hex_digit_us,
        $._hex_digits_us,
      ),
    ),

    _hex_digits_no_single_us: $ => choice(
      seq(
        $._hex_digit,
      ),
      seq(
        $._hex_digit,
        $._hex_digits_us,
      ),
      seq(
        $._hex_digits_us,
        $._hex_digit,
      ),
    ),

    _hex_digits_no_starting_us: $ => choice(
      seq(
        $._hex_digit,
      ),
      seq(
        $._hex_digit,
        $._hex_digits_us,
      ),
    ),

    _hex_digit: $ => choice(
      seq(
        $._decimal_digit,
      ),
      seq(
        $._hex_letter,
      ),
    ),

    _hex_digit_us: $ => choice(
      seq(
        $._hex_digit,
      ),
      seq(
        "_",
      ),
    ),

    _hex_letter: $ => choice(
      seq(
        "a",
      ),
      seq(
        "b",
      ),
      seq(
        "c",
      ),
      seq(
        "d",
      ),
      seq(
        "e",
      ),
      seq(
        "f",
      ),
      seq(
        "A",
      ),
      seq(
        "B",
      ),
      seq(
        "C",
      ),
      seq(
        "D",
      ),
      seq(
        "E",
      ),
      seq(
        "F",
      ),
    ),

    // ---

    _float_literal: $ => choice(
      seq(
        $._float,
      ),
      seq(
        $._float,
        $._suffix,
      ),
      seq(
        $._integer,
        $._float_suffix,
      ),
      seq(
        $._integer,
        $._imaginary_suffix,
      ),
      seq(
        $._integer,
        $._float_suffix,
        $._imaginary_suffix,
      ),
      seq(
        $._integer,
        $._real_suffix,
        $._imaginary_suffix,
      ),
    ),

    _float: $ => choice(
      seq(
        $._decimal_float,
      ),
      seq(
        $._hex_float,
      ),
    ),

    _decimal_float: $ => choice(
      seq(
        $._leading_decimal,
        ".",
      ),
      seq(
        $._leading_decimal,
        ".",
        $._decimal_digits,
      ),
      seq(
        $._decimal_digits,
        ".",
        $._decimal_digits_no_starting_us,
        $._decimal_exponent,
      ),
      seq(
        ".",
        $._decimal_integer,
      ),
      seq(
        ".",
        $._decimal_integer,
        $._decimal_exponent,
      ),
      seq(
        $._leading_decimal,
        $._decimal_exponent,
      ),
    ),

    _decimal_exponent: $ => choice(
      seq(
        $._decimal_exponent_start,
        $._decimal_digits_no_single_us,
      ),
    ),

    _decimal_exponent_start: $ => choice(
      seq(
        "e",
      ),
      seq(
        "E",
      ),
      seq(
        "e+",
      ),
      seq(
        "E+",
      ),
      seq(
        "e-",
      ),
      seq(
        "E-",
      ),
    ),

    _hex_float: $ => choice(
      seq(
        $._hex_prefix,
        $._hex_digits_no_single_us,
        ".",
        $._hex_digits_no_starting_us,
        $._hex_exponent,
      ),
      seq(
        $._hex_prefix,
        ".",
        $._hex_digits_no_starting_us,
        $._hex_exponent,
      ),
      seq(
        $._hex_prefix,
        $._hex_digits_no_single_us,
        $._hex_exponent,
      ),
    ),

    _hex_prefix: $ => choice(
      seq(
        "0x",
      ),
      seq(
        "0X",
      ),
    ),

    _hex_exponent: $ => choice(
      seq(
        $._hex_exponent_start,
        $._decimal_digits_no_single_us,
      ),
    ),

    _hex_exponent_start: $ => choice(
      seq(
        "p",
      ),
      seq(
        "P",
      ),
      seq(
        "p+",
      ),
      seq(
        "P+",
      ),
      seq(
        "p-",
      ),
      seq(
        "P-",
      ),
    ),

    _suffix: $ => choice(
      seq(
        $._float_suffix,
      ),
      seq(
        $._real_suffix,
      ),
      seq(
        $._imaginary_suffix,
      ),
      seq(
        $._float_suffix,
        $._imaginary_suffix,
      ),
      seq(
        $._real_suffix,
        $._imaginary_suffix,
      ),
    ),

    _float_suffix: $ => choice(
      seq(
        "f",
      ),
      seq(
        "F",
      ),
    ),

    _real_suffix: $ => choice(
      seq(
        "L",
      ),
    ),

    _imaginary_suffix: $ => choice(
      seq(
        "i",
      ),
    ),

    _leading_decimal: $ => choice(
      seq(
        $._decimal_integer,
      ),
      seq(
        "0",
        $._decimal_digits_no_single_us,
      ),
    ),

    // ---

    _keyword: $ => choice(
      seq(
        "abstract",
      ),
      seq(
        "alias",
      ),
      seq(
        "align",
      ),
      seq(
        "asm",
      ),
      seq(
        "assert",
      ),
      seq(
        "auto",
      ),
      seq(
        "body",
      ),
      seq(
        "bool",
      ),
      seq(
        "break",
      ),
      seq(
        "byte",
      ),
      seq(
        "case",
      ),
      seq(
        "cast",
      ),
      seq(
        "catch",
      ),
      seq(
        "cdouble",
      ),
      seq(
        "cent",
      ),
      seq(
        "cfloat",
      ),
      seq(
        "char",
      ),
      seq(
        "class",
      ),
      seq(
        "const",
      ),
      seq(
        "continue",
      ),
      seq(
        "creal",
      ),
      seq(
        "dchar",
      ),
      seq(
        "debug",
      ),
      seq(
        "default",
      ),
      seq(
        "delegate",
      ),
      seq(
        "delete",
      ),
      seq(
        "deprecated",
      ),
      seq(
        "do",
      ),
      seq(
        "double",
      ),
      seq(
        "else",
      ),
      seq(
        "enum",
      ),
      seq(
        "export",
      ),
      seq(
        "extern",
      ),
      seq(
        "false",
      ),
      seq(
        "final",
      ),
      seq(
        "finally",
      ),
      seq(
        "float",
      ),
      seq(
        "for",
      ),
      seq(
        "foreach",
      ),
      seq(
        "foreach_reverse",
      ),
      seq(
        "function",
      ),
      seq(
        "goto",
      ),
      seq(
        "idouble",
      ),
      seq(
        "if",
      ),
      seq(
        "ifloat",
      ),
      seq(
        "immutable",
      ),
      seq(
        "import",
      ),
      seq(
        "in",
      ),
      seq(
        "inout",
      ),
      seq(
        "int",
      ),
      seq(
        "interface",
      ),
      seq(
        "invariant",
      ),
      seq(
        "ireal",
      ),
      seq(
        "is",
      ),
      seq(
        "lazy",
      ),
      seq(
        "long",
      ),
      seq(
        "macro",
      ),
      seq(
        "mixin",
      ),
      seq(
        "module",
      ),
      seq(
        "new",
      ),
      seq(
        "nothrow",
      ),
      seq(
        "null",
      ),
      seq(
        "out",
      ),
      seq(
        "override",
      ),
      seq(
        "package",
      ),
      seq(
        "pragma",
      ),
      seq(
        "private",
      ),
      seq(
        "protected",
      ),
      seq(
        "public",
      ),
      seq(
        "pure",
      ),
      seq(
        "real",
      ),
      seq(
        "ref",
      ),
      seq(
        "return",
      ),
      seq(
        "scope",
      ),
      seq(
        "shared",
      ),
      seq(
        "short",
      ),
      seq(
        "static",
      ),
      seq(
        "struct",
      ),
      seq(
        "super",
      ),
      seq(
        "switch",
      ),
      seq(
        "synchronized",
      ),
      seq(
        "template",
      ),
      seq(
        "this",
      ),
      seq(
        "throw",
      ),
      seq(
        "true",
      ),
      seq(
        "try",
      ),
      seq(
        "typeid",
      ),
      seq(
        "typeof",
      ),
      seq(
        "ubyte",
      ),
      seq(
        "ucent",
      ),
      seq(
        "uint",
      ),
      seq(
        "ulong",
      ),
      seq(
        "union",
      ),
      seq(
        "unittest",
      ),
      seq(
        "ushort",
      ),
      seq(
        "version",
      ),
      seq(
        "void",
      ),
      seq(
        "wchar",
      ),
      seq(
        "while",
      ),
      seq(
        "with",
      ),
      seq(
        "__FILE__",
      ),
      seq(
        "__FILE_FULL_PATH__",
      ),
      seq(
        "__MODULE__",
      ),
      seq(
        "__LINE__",
      ),
      seq(
        "__FUNCTION__",
      ),
      seq(
        "__PRETTY_FUNCTION__",
      ),
      seq(
        "__gshared",
      ),
      seq(
        "__traits",
      ),
      seq(
        "__vector",
      ),
      seq(
        "__parameters",
      ),
    ),

    // ---

    _special_token_sequence: $ => choice(
      seq(
        "# line",
        $._integer_literal,
        $._end_of_line,
      ),
      seq(
        "# line",
        $._integer_literal,
        $._filespec,
        $._end_of_line,
      ),
    ),

    _filespec: $ => choice(
      seq(
        "\"",
        optional(
          $._characters,
        ),
        "\"",
      ),
    ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/module.html
    // ------------------------------------------------------------------------

    _module: $ => choice(
      seq(
        $._module_declaration,
        $._decl_defs,
      ),
      seq(
        $._decl_defs,
      ),
    ),

    _decl_defs: $ => choice(
      seq(
        $._decl_def,
      ),
      seq(
        $._decl_def,
        $._decl_defs,
      ),
    ),

    _decl_def: $ => choice(
      seq(
        $._attribute_specifier,
      ),
      seq(
        $._declaration,
      ),
      seq(
        $._constructor,
      ),
      seq(
        $._destructor,
      ),
      seq(
        $._postblit,
      ),
      seq(
        $._allocator,
      ),
      seq(
        $._deallocator,
      ),
      seq(
        $._class_invariant,
      ),
      seq(
        $._struct_invariant,
      ),
      seq(
        $._unit_test,
      ),
      seq(
        $._alias_this,
      ),
      seq(
        $._static_constructor,
      ),
      seq(
        $._static_destructor,
      ),
      seq(
        $._shared_static_constructor,
      ),
      seq(
        $._shared_static_destructor,
      ),
      seq(
        $._conditional_declaration,
      ),
      seq(
        $._debug_specification,
      ),
      seq(
        $._version_specification,
      ),
      seq(
        $._static_assert,
      ),
      seq(
        $._template_declaration,
      ),
      seq(
        $._template_mixin_declaration,
      ),
      seq(
        $._template_mixin,
      ),
      seq(
        $._mixin_declaration,
      ),
      seq(
        ";",
      ),
    ),

    // ---

    _module_declaration: $ => choice(
      seq(
        optional(
          $._module_attributes,
        ),
        "module",
        $._module_fully_qualified_name,
        ";",
      ),
    ),

    _module_attributes: $ => choice(
      seq(
        $._module_attribute,
      ),
      seq(
        $._module_attribute,
        $._module_attributes,
      ),
    ),

    _module_attribute: $ => choice(
      seq(
        $._deprecated_attribute,
      ),
      seq(
        $._user_defined_attribute,
      ),
    ),

    _module_fully_qualified_name: $ => choice(
      seq(
        $._module_name,
      ),
      seq(
        $._packages,
        ".",
        $._module_name,
      ),
    ),

    _module_name: $ => choice(
      seq(
        $._identifier,
      ),
    ),

    _packages: $ => choice(
      seq(
        $._package_name,
      ),
      seq(
        $._packages,
        ".",
        $._package_name,
      ),
    ),

    _package_name: $ => choice(
      seq(
        $._identifier,
      ),
    ),

    // ---

    _import_declaration: $ => choice(
      seq(
        "import",
        $._import_list,
        ";",
      ),
      seq(
        "static import",
        $._import_list,
        ";",
      ),
    ),

    _import_list: $ => choice(
      seq(
        $._import,
      ),
      seq(
        $._import_bindings,
      ),
      seq(
        $._import,
        ",",
        $._import_list,
      ),
    ),

    _import: $ => choice(
      seq(
        $._module_fully_qualified_name,
      ),
      seq(
        $._module_alias_identifier,
        "=",
        $._module_fully_qualified_name,
      ),
    ),

    _import_bindings: $ => choice(
      seq(
        $._import,
        ":",
        $._import_bind_list,
      ),
    ),

    _import_bind_list: $ => choice(
      seq(
        $._import_bind,
      ),
      seq(
        $._import_bind,
        ",",
        $._import_bind_list,
      ),
    ),

    _import_bind: $ => choice(
      seq(
        $._identifier,
      ),
      seq(
        $._identifier,
        "=",
        $._identifier,
      ),
    ),

    _module_alias_identifier: $ => choice(
      seq(
        $._identifier,
      ),
    ),

    // ---

    _mixin_declaration: $ => choice(
      seq(
        "mixin",
        "(",
        $._argument_list,
        ")",
        ";",
      ),
    ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/declaration.html
    // ------------------------------------------------------------------------

    _declaration: $ => choice(
      seq(
        $._func_declaration,
      ),
      seq(
        $._var_declarations,
      ),
      seq(
        $._alias_declaration,
      ),
      seq(
        $._aggregate_declaration,
      ),
      seq(
        $._enum_declaration,
      ),
      seq(
        $._import_declaration,
      ),
      seq(
        $._conditional_declaration,
      ),
      seq(
        $._static_foreach_declaration,
      ),
      seq(
        $._static_assert,
      ),
    ),

    // ---

    _var_declarations: $ => choice(
      seq(
        optional(
          $._storage_classes,
        ),
        $._basic_type,
        $._declarators,
        ";",
      ),
      seq(
        $._auto_declaration,
      ),
    ),

    _declarators: $ => choice(
      seq(
        $._declarator_initializer,
      ),
      seq(
        $._declarator_initializer,
        ",",
        $._declarator_identifier_list,
      ),
    ),

    _declarator_initializer: $ => choice(
      seq(
        $._var_declarator,
      ),
      seq(
        $._var_declarator,
        optional(
          $._template_parameters,
        ),
        "=",
        $._initializer,
      ),
      seq(
        $._alt_declarator,
      ),
      seq(
        $._alt_declarator,
        "=",
        $._initializer,
      ),
    ),

    _declarator_identifier_list: $ => choice(
      seq(
        $._declarator_identifier,
      ),
      seq(
        $._declarator_identifier,
        ",",
        $._declarator_identifier_list,
      ),
    ),

    _declarator_identifier: $ => choice(
      seq(
        $._var_declarator_identifier,
      ),
      seq(
        $._alt_declarator_identifier,
      ),
    ),

    _var_declarator_identifier: $ => choice(
      seq(
        $._identifier,
      ),
      seq(
        $._identifier,
        optional(
          $._template_parameters,
        ),
        "=",
        $._initializer,
      ),
    ),

    _alt_declarator_identifier: $ => choice(
      seq(
        $._type_suffixes,
        $._identifier,
        optional(
          $._alt_declarator_suffixes,
        ),
      ),
      seq(
        $._type_suffixes,
        $._identifier,
        optional(
          $._alt_declarator_suffixes,
        ),
        "=",
        $._initializer,
      ),
      seq(
        optional(
          $._type_suffixes,
        ),
        $._identifier,
        $._alt_declarator_suffixes,
      ),
      seq(
        optional(
          $._type_suffixes,
        ),
        $._identifier,
        $._alt_declarator_suffixes,
        "=",
        $._initializer,
      ),
    ),

    _declarator: $ => choice(
      seq(
        $._var_declarator,
      ),
      seq(
        $._alt_declarator,
      ),
    ),

    _var_declarator: $ => choice(
      seq(
        optional(
          $._type_suffixes,
        ),
        $._identifier,
      ),
    ),

    _alt_declarator: $ => choice(
      seq(
        optional(
          $._type_suffixes,
        ),
        $._identifier,
        $._alt_declarator_suffixes,
      ),
      seq(
        optional(
          $._type_suffixes,
        ),
        "(",
        $._alt_declarator_inner,
        ")",
      ),
      seq(
        optional(
          $._type_suffixes,
        ),
        "(",
        $._alt_declarator_inner,
        ")",
        $._alt_func_declarator_suffix,
      ),
      seq(
        optional(
          $._type_suffixes,
        ),
        "(",
        $._alt_declarator_inner,
        ")",
        $._alt_declarator_suffixes,
      ),
    ),

    _alt_declarator_inner: $ => choice(
      seq(
        optional(
          $._type_suffixes,
        ),
        $._identifier,
      ),
      seq(
        optional(
          $._type_suffixes,
        ),
        $._identifier,
        $._alt_func_declarator_suffix,
      ),
      seq(
        $._alt_declarator,
      ),
    ),

    _alt_declarator_suffixes: $ => choice(
      seq(
        $._alt_declarator_suffix,
      ),
      seq(
        $._alt_declarator_suffix,
        $._alt_declarator_suffixes,
      ),
    ),

    _alt_declarator_suffix: $ => choice(
      seq(
        "[ ]",
      ),
      seq(
        "[",
        $._assign_expression,
        "]",
      ),
      seq(
        "[",
        $._type,
        "]",
      ),
    ),

    _alt_func_declarator_suffix: $ => choice(
      seq(
        $._parameters,
        optional(
          $._member_function_attributes,
        ),
      ),
    ),

    // ---

    _storage_classes: $ => choice(
      seq(
        $._storage_class,
      ),
      seq(
        $._storage_class,
        $._storage_classes,
      ),
    ),

    _storage_class: $ => choice(
      seq(
        $._linkage_attribute,
      ),
      seq(
        $._align_attribute,
      ),
      seq(
        "deprecated",
      ),
      seq(
        "enum",
      ),
      seq(
        "static",
      ),
      seq(
        "extern",
      ),
      seq(
        "abstract",
      ),
      seq(
        "final",
      ),
      seq(
        "override",
      ),
      seq(
        "synchronized",
      ),
      seq(
        "auto",
      ),
      seq(
        "scope",
      ),
      seq(
        "const",
      ),
      seq(
        "immutable",
      ),
      seq(
        "inout",
      ),
      seq(
        "shared",
      ),
      seq(
        "__gshared",
      ),
      seq(
        $._property,
      ),
      seq(
        "nothrow",
      ),
      seq(
        "pure",
      ),
      seq(
        "ref",
      ),
    ),

    // ---

    _initializer: $ => choice(
      seq(
        $._void_initializer,
      ),
      seq(
        $._non_void_initializer,
      ),
    ),

    _non_void_initializer: $ => choice(
      seq(
        $._exp_initializer,
      ),
      seq(
        $._array_initializer,
      ),
      seq(
        $._struct_initializer,
      ),
    ),

    _exp_initializer: $ => choice(
      seq(
        $._assign_expression,
      ),
    ),

    _array_initializer: $ => choice(
      seq(
        "[",
        optional(
          $._array_member_initializations,
        ),
        "]",
      ),
    ),

    _array_member_initializations: $ => choice(
      seq(
        $._array_member_initialization,
      ),
      seq(
        $._array_member_initialization,
        ",",
      ),
      seq(
        $._array_member_initialization,
        ",",
        $._array_member_initializations,
      ),
    ),

    _array_member_initialization: $ => choice(
      seq(
        $._non_void_initializer,
      ),
      seq(
        $._assign_expression,
        ":",
        $._non_void_initializer,
      ),
    ),

    _struct_initializer: $ => choice(
      seq(
        "{",
        optional(
          $._struct_member_initializers,
        ),
        "}",
      ),
    ),

    _struct_member_initializers: $ => choice(
      seq(
        $._struct_member_initializer,
      ),
      seq(
        $._struct_member_initializer,
        ",",
      ),
      seq(
        $._struct_member_initializer,
        ",",
        $._struct_member_initializers,
      ),
    ),

    _struct_member_initializer: $ => choice(
      seq(
        $._non_void_initializer,
      ),
      seq(
        $._identifier,
        ":",
        $._non_void_initializer,
      ),
    ),

    // ---

    _auto_declaration: $ => choice(
      seq(
        $._storage_classes,
        $._auto_assignments,
        ";",
      ),
    ),

    _auto_assignments: $ => choice(
      seq(
        $._auto_assignment,
      ),
      seq(
        $._auto_assignments,
        ",",
        $._auto_assignment,
      ),
    ),

    _auto_assignment: $ => choice(
      seq(
        $._identifier,
        optional(
          $._template_parameters,
        ),
        "=",
        $._initializer,
      ),
    ),

    // ---

    _alias_declaration: $ => choice(
      seq(
        "alias",
        optional(
          $._storage_classes,
        ),
        $._basic_type,
        $._declarators,
        ";",
      ),
      seq(
        "alias",
        optional(
          $._storage_classes,
        ),
        $._basic_type,
        $._func_declarator,
        ";",
      ),
      seq(
        "alias",
        $._alias_assignments,
        ";",
      ),
    ),

    _alias_assignments: $ => choice(
      seq(
        $._alias_assignment,
      ),
      seq(
        $._alias_assignments,
        ",",
        $._alias_assignment,
      ),
    ),

    _alias_assignment: $ => choice(
      seq(
        $._identifier,
        optional(
          $._template_parameters,
        ),
        "=",
        optional(
          $._storage_classes,
        ),
        $._type,
      ),
      seq(
        $._identifier,
        optional(
          $._template_parameters,
        ),
        "=",
        $._function_literal,
      ),
      seq(
        $._identifier,
        optional(
          $._template_parameters,
        ),
        "=",
        optional(
          $._storage_classes,
        ),
        $._basic_type,
        $._parameters,
        optional(
          $._member_function_attributes,
        ),
      ),
    ),

    // ---

    _void_initializer: $ => choice(
      seq(
        "void",
      ),
    ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/type.html
    // ------------------------------------------------------------------------

    _type: $ => choice(
      seq(
        optional(
          $._type_ctors,
        ),
        $._basic_type,
        optional(
          $._type_suffixes,
        ),
      ),
    ),

    _type_ctors: $ => choice(
      seq(
        $._type_ctor,
      ),
      seq(
        $._type_ctor,
        $._type_ctors,
      ),
    ),

    _type_ctor: $ => choice(
      seq(
        "const",
      ),
      seq(
        "immutable",
      ),
      seq(
        "inout",
      ),
      seq(
        "shared",
      ),
    ),

    _basic_type: $ => choice(
      seq(
        $._fundamental_type,
      ),
      seq(
        ".",
        $._qualified_identifier,
      ),
      seq(
        $._qualified_identifier,
      ),
      seq(
        $._typeof,
      ),
      seq(
        $._typeof,
        ".",
        $._qualified_identifier,
      ),
      seq(
        $._type_ctor,
        "(",
        $._type,
        ")",
      ),
      seq(
        $._vector,
      ),
      seq(
        $._traits_expression,
      ),
      seq(
        $._mixin_type,
      ),
    ),

    _vector: $ => choice(
      seq(
        "__vector",
        "(",
        $._vector_base_type,
        ")",
      ),
    ),

    _vector_base_type: $ => choice(
      seq(
        $._type,
      ),
    ),

    _fundamental_type: $ => choice(
      seq(
        "bool",
      ),
      seq(
        "byte",
      ),
      seq(
        "ubyte",
      ),
      seq(
        "short",
      ),
      seq(
        "ushort",
      ),
      seq(
        "int",
      ),
      seq(
        "uint",
      ),
      seq(
        "long",
      ),
      seq(
        "ulong",
      ),
      seq(
        "cent",
      ),
      seq(
        "ucent",
      ),
      seq(
        "char",
      ),
      seq(
        "wchar",
      ),
      seq(
        "dchar",
      ),
      seq(
        "float",
      ),
      seq(
        "double",
      ),
      seq(
        "real",
      ),
      seq(
        "ifloat",
      ),
      seq(
        "idouble",
      ),
      seq(
        "ireal",
      ),
      seq(
        "cfloat",
      ),
      seq(
        "cdouble",
      ),
      seq(
        "creal",
      ),
      seq(
        "void",
      ),
    ),

    _type_suffixes: $ => choice(
      seq(
        $._type_suffix,
        optional(
          $._type_suffixes,
        ),
      ),
    ),

    _type_suffix: $ => choice(
      seq(
        "*",
      ),
      seq(
        "[ ]",
      ),
      seq(
        "[",
        $._assign_expression,
        "]",
      ),
      seq(
        "[",
        $._assign_expression,
        "..",
        $._assign_expression,
        "]",
      ),
      seq(
        "[",
        $._type,
        "]",
      ),
      seq(
        "delegate",
        $._parameters,
        optional(
          $._member_function_attributes,
        ),
      ),
      seq(
        "function",
        $._parameters,
        optional(
          $._function_attributes,
        ),
      ),
    ),

    _qualified_identifier: $ => choice(
      seq(
        $._identifier,
      ),
      seq(
        $._identifier,
        ".",
        $._qualified_identifier,
      ),
      seq(
        $._template_instance,
      ),
      seq(
        $._template_instance,
        ".",
        $._qualified_identifier,
      ),
      seq(
        $._identifier,
        "[",
        $._assign_expression,
        "]",
      ),
      seq(
        $._identifier,
        "[",
        $._assign_expression,
        "].",
        $._qualified_identifier,
      ),
    ),

    // ---

    _typeof: $ => choice(
      seq(
        "typeof (",
        $._expression,
        ")",
      ),
      seq(
        "typeof (",
        "return",
        ")",
      ),
    ),

    // ---

    _mixin_type: $ => choice(
      seq(
        "mixin (",
        $._argument_list,
        ")",
      ),
    ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/attribute.html
    // ------------------------------------------------------------------------

    _attribute_specifier: $ => choice(
      seq(
        $._attribute,
        ":",
      ),
      seq(
        $._attribute,
        $._declaration_block,
      ),
    ),

    _attribute: $ => choice(
      seq(
        $._linkage_attribute,
      ),
      seq(
        $._align_attribute,
      ),
      seq(
        $._deprecated_attribute,
      ),
      seq(
        $._visibility_attribute,
      ),
      seq(
        $._pragma,
      ),
      seq(
        "static",
      ),
      seq(
        "extern",
      ),
      seq(
        "abstract",
      ),
      seq(
        "final",
      ),
      seq(
        "override",
      ),
      seq(
        "synchronized",
      ),
      seq(
        "auto",
      ),
      seq(
        "scope",
      ),
      seq(
        "const",
      ),
      seq(
        "immutable",
      ),
      seq(
        "inout",
      ),
      seq(
        "shared",
      ),
      seq(
        "__gshared",
      ),
      seq(
        $._at_attribute,
      ),
      seq(
        $._function_attribute_kwd,
      ),
      seq(
        "ref",
      ),
      seq(
        "return",
      ),
    ),

    _function_attribute_kwd: $ => choice(
      seq(
        "nothrow",
      ),
      seq(
        "pure",
      ),
    ),

    _at_attribute: $ => choice(
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
      seq(
        $._property,
      ),
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
      seq(
        $._user_defined_attribute,
      ),
    ),

    _property: $ => choice(
      seq(
        "@",
        "property",
      ),
    ),

    _declaration_block: $ => choice(
      seq(
        $._decl_def,
      ),
      seq(
        "{",
        optional(
          $._decl_defs,
        ),
        "}",
      ),
    ),

    // ---

    _linkage_attribute: $ => choice(
      seq(
        "extern",
        "(",
        $._linkage_type,
        ")",
      ),
      seq(
        "extern",
        "(",
        "C++",
        ",",
        $._qualified_identifier,
        ")",
      ),
      seq(
        "extern",
        "(",
        "C++",
        ",",
        $._namespace_list,
        ")",
      ),
    ),

    _linkage_type: $ => choice(
      seq(
        "C",
      ),
      seq(
        "C++",
      ),
      seq(
        "D",
      ),
      seq(
        "Windows",
      ),
      seq(
        "System",
      ),
      seq(
        "Objective-C",
      ),
    ),

    _namespace_list: $ => choice(
      seq(
        $._conditional_expression,
      ),
      seq(
        $._conditional_expression,
        ",",
      ),
      seq(
        $._conditional_expression,
        ",",
        $._namespace_list,
      ),
    ),

    // ---

    _align_attribute: $ => choice(
      seq(
        "align",
      ),
      seq(
        "align",
        "(",
        $._assign_expression,
        ")",
      ),
    ),

    // ---

    _deprecated_attribute: $ => choice(
      seq(
        "deprecated",
      ),
      seq(
        "deprecated (",
        $._assign_expression,
        ")",
      ),
    ),

    // ---

    _visibility_attribute: $ => choice(
      seq(
        "private",
      ),
      seq(
        "package",
      ),
      seq(
        "package",
        "(",
        $._qualified_identifier,
        ")",
      ),
      seq(
        "protected",
      ),
      seq(
        "public",
      ),
      seq(
        "export",
      ),
    ),

    // ---

    _user_defined_attribute: $ => choice(
      seq(
        "@ (",
        $._argument_list,
        ")",
      ),
      seq(
        "@",
        $._identifier,
      ),
      seq(
        "@",
        $._identifier,
        "(",
        optional(
          $._argument_list,
        ),
        ")",
      ),
      seq(
        "@",
        $._template_instance,
      ),
      seq(
        "@",
        $._template_instance,
        "(",
        optional(
          $._argument_list,
        ),
        ")",
      ),
    ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/pragma.html
    // ------------------------------------------------------------------------

    _pragma_declaration: $ => choice(
      seq(
        $._pragma,
        ";",
      ),
      seq(
        $._pragma,
        $._declaration_block,
      ),
    ),

    _pragma_statement: $ => choice(
      seq(
        $._pragma,
        ";",
      ),
      seq(
        $._pragma,
        $._no_scope_statement,
      ),
    ),

    _pragma: $ => choice(
      seq(
        "pragma",
        "(",
        $._identifier,
        ")",
      ),
      seq(
        "pragma",
        "(",
        $._identifier,
        ",",
        $._argument_list,
        ")",
      ),
    ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/expression.html
    // ------------------------------------------------------------------------

    _expression: $ => choice(
      seq(
        $._comma_expression,
      ),
    ),

    _comma_expression: $ => choice(
      seq(
        $._assign_expression,
      ),
      seq(
        $._comma_expression,
        ",",
        $._assign_expression,
      ),
    ),

    // ---

    _assign_expression: $ => choice(
      seq(
        $._conditional_expression,
      ),
      seq(
        $._conditional_expression,
        "=",
        $._assign_expression,
      ),
      seq(
        $._conditional_expression,
        "+=",
        $._assign_expression,
      ),
      seq(
        $._conditional_expression,
        "-=",
        $._assign_expression,
      ),
      seq(
        $._conditional_expression,
        "*=",
        $._assign_expression,
      ),
      seq(
        $._conditional_expression,
        "/=",
        $._assign_expression,
      ),
      seq(
        $._conditional_expression,
        "%=",
        $._assign_expression,
      ),
      seq(
        $._conditional_expression,
        "&=",
        $._assign_expression,
      ),
      seq(
        $._conditional_expression,
        "|=",
        $._assign_expression,
      ),
      seq(
        $._conditional_expression,
        "^=",
        $._assign_expression,
      ),
      seq(
        $._conditional_expression,
        "~=",
        $._assign_expression,
      ),
      seq(
        $._conditional_expression,
        "<",
        "<",
        "=",
        $._assign_expression,
      ),
      seq(
        $._conditional_expression,
        ">>=",
        $._assign_expression,
      ),
      seq(
        $._conditional_expression,
        ">>>=",
        $._assign_expression,
      ),
      seq(
        $._conditional_expression,
        "^^=",
        $._assign_expression,
      ),
    ),

    // ---

    _conditional_expression: $ => choice(
      seq(
        $._or_or_expression,
      ),
      seq(
        $._or_or_expression,
        "?",
        $._expression,
        ":",
        $._conditional_expression,
      ),
    ),

    // ---

    _or_or_expression: $ => choice(
      seq(
        $._and_and_expression,
      ),
      seq(
        $._or_or_expression,
        "||",
        $._and_and_expression,
      ),
    ),

    // ---

    _and_and_expression: $ => choice(
      seq(
        $._or_expression,
      ),
      seq(
        $._and_and_expression,
        "&&",
        $._or_expression,
      ),
    ),

    // ---

    _or_expression: $ => choice(
      seq(
        $._xor_expression,
      ),
      seq(
        $._or_expression,
        "|",
        $._xor_expression,
      ),
    ),

    // ---

    _xor_expression: $ => choice(
      seq(
        $._and_expression,
      ),
      seq(
        $._xor_expression,
        "^",
        $._and_expression,
      ),
    ),

    // ---

    _and_expression: $ => choice(
      seq(
        $._cmp_expression,
      ),
      seq(
        $._and_expression,
        "&",
        $._cmp_expression,
      ),
    ),

    // ---

    _cmp_expression: $ => choice(
      seq(
        $._shift_expression,
      ),
      seq(
        $._equal_expression,
      ),
      seq(
        $._identity_expression,
      ),
      seq(
        $._rel_expression,
      ),
      seq(
        $._in_expression,
      ),
    ),

    // ---

    _equal_expression: $ => choice(
      seq(
        $._shift_expression,
        "==",
        $._shift_expression,
      ),
      seq(
        $._shift_expression,
        "!=",
        $._shift_expression,
      ),
    ),

    // ---

    _identity_expression: $ => choice(
      seq(
        $._shift_expression,
        "is",
        $._shift_expression,
      ),
      seq(
        $._shift_expression,
        "!is",
        $._shift_expression,
      ),
    ),

    // ---

    _rel_expression: $ => choice(
      seq(
        $._shift_expression,
        "<",
        $._shift_expression,
      ),
      seq(
        $._shift_expression,
        "<",
        "=",
        $._shift_expression,
      ),
      seq(
        $._shift_expression,
        ">",
        $._shift_expression,
      ),
      seq(
        $._shift_expression,
        ">=",
        $._shift_expression,
      ),
    ),

    // ---

    _in_expression: $ => choice(
      seq(
        $._shift_expression,
        "in",
        $._shift_expression,
      ),
      seq(
        $._shift_expression,
        "!in",
        $._shift_expression,
      ),
    ),

    // ---

    _shift_expression: $ => choice(
      seq(
        $._add_expression,
      ),
      seq(
        $._shift_expression,
        "<",
        "<",
        $._add_expression,
      ),
      seq(
        $._shift_expression,
        ">",
        ">",
        $._add_expression,
      ),
      seq(
        $._shift_expression,
        ">",
        ">",
        ">",
        $._add_expression,
      ),
    ),

    // ---

    _add_expression: $ => choice(
      seq(
        $._mul_expression,
      ),
      seq(
        $._add_expression,
        "+",
        $._mul_expression,
      ),
      seq(
        $._add_expression,
        "-",
        $._mul_expression,
      ),
      seq(
        $._cat_expression,
      ),
    ),

    // ---

    _cat_expression: $ => choice(
      seq(
        $._add_expression,
        "~",
        $._mul_expression,
      ),
    ),

    // ---

    _mul_expression: $ => choice(
      seq(
        $._unary_expression,
      ),
      seq(
        $._mul_expression,
        "*",
        $._unary_expression,
      ),
      seq(
        $._mul_expression,
        "/",
        $._unary_expression,
      ),
      seq(
        $._mul_expression,
        "%",
        $._unary_expression,
      ),
    ),

    // ---

    _unary_expression: $ => choice(
      seq(
        "&",
        $._unary_expression,
      ),
      seq(
        "++",
        $._unary_expression,
      ),
      seq(
        "--",
        $._unary_expression,
      ),
      seq(
        "*",
        $._unary_expression,
      ),
      seq(
        "-",
        $._unary_expression,
      ),
      seq(
        "+",
        $._unary_expression,
      ),
      seq(
        "!",
        $._unary_expression,
      ),
      seq(
        $._complement_expression,
      ),
      seq(
        "(",
        $._type,
        ") .",
        $._identifier,
      ),
      seq(
        "(",
        $._type,
        ") .",
        $._template_instance,
      ),
      seq(
        $._delete_expression,
      ),
      seq(
        $._cast_expression,
      ),
      seq(
        $._pow_expression,
      ),
    ),

    // ---

    _complement_expression: $ => choice(
      seq(
        "~",
        $._unary_expression,
      ),
    ),

    // ---

    _new_expression: $ => choice(
      seq(
        "new",
        optional(
          $._allocator_arguments,
        ),
        $._type,
      ),
      seq(
        "new",
        optional(
          $._allocator_arguments,
        ),
        $._type,
        "[",
        $._assign_expression,
        "]",
      ),
      seq(
        "new",
        optional(
          $._allocator_arguments,
        ),
        $._type,
        "(",
        optional(
          $._argument_list,
        ),
        ")",
      ),
      seq(
        $._new_anon_class_expression,
      ),
    ),

    _allocator_arguments: $ => choice(
      seq(
        "(",
        optional(
          $._argument_list,
        ),
        ")",
      ),
    ),

    _argument_list: $ => choice(
      seq(
        $._assign_expression,
      ),
      seq(
        $._assign_expression,
        ",",
      ),
      seq(
        $._assign_expression,
        ",",
        $._argument_list,
      ),
    ),

    // ---

    _delete_expression: $ => choice(
      seq(
        "delete",
        $._unary_expression,
      ),
    ),

    // ---

    _cast_expression: $ => choice(
      seq(
        "cast (",
        $._type,
        ")",
        $._unary_expression,
      ),
      seq(
        "cast (",
        optional(
          $._type_ctors,
        ),
        ")",
        $._unary_expression,
      ),
    ),

    // ---

    _pow_expression: $ => choice(
      seq(
        $._postfix_expression,
      ),
      seq(
        $._postfix_expression,
        "^^",
        $._unary_expression,
      ),
    ),

    // ---

    _postfix_expression: $ => choice(
      seq(
        $._primary_expression,
      ),
      seq(
        $._postfix_expression,
        ".",
        $._identifier,
      ),
      seq(
        $._postfix_expression,
        ".",
        $._template_instance,
      ),
      seq(
        $._postfix_expression,
        ".",
        $._new_expression,
      ),
      seq(
        $._postfix_expression,
        "++",
      ),
      seq(
        $._postfix_expression,
        "--",
      ),
      seq(
        $._postfix_expression,
        "(",
        optional(
          $._argument_list,
        ),
        ")",
      ),
      seq(
        optional(
          $._type_ctors,
        ),
        $._basic_type,
        "(",
        optional(
          $._argument_list,
        ),
        ")",
      ),
      seq(
        $._index_expression,
      ),
      seq(
        $._slice_expression,
      ),
    ),

    // ---

    _index_expression: $ => choice(
      seq(
        $._postfix_expression,
        "[",
        $._argument_list,
        "]",
      ),
    ),

    // ---

    _slice_expression: $ => choice(
      seq(
        $._postfix_expression,
        "[ ]",
      ),
      seq(
        $._postfix_expression,
        "[",
        $._slice,
        optional(
          ",",
        ),
        "]",
      ),
    ),

    _slice: $ => choice(
      seq(
        $._assign_expression,
      ),
      seq(
        $._assign_expression,
        ",",
        $._slice,
      ),
      seq(
        $._assign_expression,
        "..",
        $._assign_expression,
      ),
      seq(
        $._assign_expression,
        "..",
        $._assign_expression,
        ",",
        $._slice,
      ),
    ),

    // ---

    _primary_expression: $ => choice(
      seq(
        $._identifier,
      ),
      seq(
        ".",
        $._identifier,
      ),
      seq(
        $._template_instance,
      ),
      seq(
        ".",
        $._template_instance,
      ),
      seq(
        "this",
      ),
      seq(
        "super",
      ),
      seq(
        "null",
      ),
      seq(
        "true",
      ),
      seq(
        "false",
      ),
      seq(
        "$",
      ),
      seq(
        $._integer_literal,
      ),
      seq(
        $._float_literal,
      ),
      seq(
        $._character_literal,
      ),
      seq(
        $._string_literals,
      ),
      seq(
        $._array_literal,
      ),
      seq(
        $._assoc_array_literal,
      ),
      seq(
        $._function_literal,
      ),
      seq(
        $._assert_expression,
      ),
      seq(
        $._mixin_expression,
      ),
      seq(
        $._import_expression,
      ),
      seq(
        $._new_expression,
      ),
      seq(
        $._fundamental_type,
        ".",
        $._identifier,
      ),
      seq(
        $._fundamental_type,
        "(",
        optional(
          $._argument_list,
        ),
        ")",
      ),
      seq(
        $._type_ctor,
        "(",
        $._type,
        ")",
        ".",
        $._identifier,
      ),
      seq(
        $._type_ctor,
        "(",
        $._type,
        ")",
        "(",
        optional(
          $._argument_list,
        ),
        ")",
      ),
      seq(
        $._typeof,
      ),
      seq(
        $._typeid_expression,
      ),
      seq(
        $._is_expression,
      ),
      seq(
        "(",
        $._expression,
        ")",
      ),
      seq(
        $._special_keyword,
      ),
      seq(
        $._traits_expression,
      ),
    ),

    // ---

    _string_literals: $ => choice(
      seq(
        $._string_literal,
      ),
      seq(
        $._string_literals,
        $._string_literal,
      ),
    ),

    // ---

    _array_literal: $ => choice(
      seq(
        "[",
        optional(
          $._argument_list,
        ),
        "]",
      ),
    ),

    // ---

    _assoc_array_literal: $ => choice(
      seq(
        "[",
        $._key_value_pairs,
        "]",
      ),
    ),

    _key_value_pairs: $ => choice(
      seq(
        $._key_value_pair,
      ),
      seq(
        $._key_value_pair,
        ",",
        $._key_value_pairs,
      ),
    ),

    _key_value_pair: $ => choice(
      seq(
        $._key_expression,
        ":",
        $._value_expression,
      ),
    ),

    _key_expression: $ => choice(
      seq(
        $._assign_expression,
      ),
    ),

    _value_expression: $ => choice(
      seq(
        $._assign_expression,
      ),
    ),

    // ---

    _function_literal: $ => choice(
      seq(
        "function",
        optional(
          "ref",
        ),
        optional(
          $._type,
        ),
        optional(
          $._parameter_with_attributes,
        ),
        $._function_literal_body2,
      ),
      seq(
        "delegate",
        optional(
          "ref",
        ),
        optional(
          $._type,
        ),
        optional(
          $._parameter_with_member_attributes,
        ),
        $._function_literal_body2,
      ),
      seq(
        optional(
          "ref",
        ),
        $._parameter_with_member_attributes,
        $._function_literal_body2,
      ),
      seq(
        $._function_literal_body,
      ),
      seq(
        $._identifier,
        "=>",
        $._assign_expression,
      ),
    ),

    _parameter_with_attributes: $ => choice(
      seq(
        $._parameters,
        optional(
          $._function_attributes,
        ),
      ),
    ),

    _parameter_with_member_attributes: $ => choice(
      seq(
        $._parameters,
        optional(
          $._member_function_attributes,
        ),
      ),
    ),

    _function_literal_body2: $ => choice(
      seq(
        "=>",
        $._assign_expression,
      ),
      seq(
        $._function_literal_body,
      ),
    ),

    // ---

    _assert_expression: $ => choice(
      seq(
        "assert (",
        $._assert_arguments,
        ")",
      ),
    ),

    _assert_arguments: $ => choice(
      seq(
        $._assign_expression,
        optional(
          ",",
        ),
      ),
      seq(
        $._assign_expression,
        ",",
        $._assign_expression,
        optional(
          ",",
        ),
      ),
    ),

    // ---

    _mixin_expression: $ => choice(
      seq(
        "mixin (",
        $._argument_list,
        ")",
      ),
    ),

    // ---

    _import_expression: $ => choice(
      seq(
        "import (",
        $._assign_expression,
        ")",
      ),
    ),

    // ---

    _typeid_expression: $ => choice(
      seq(
        "typeid (",
        $._type,
        ")",
      ),
      seq(
        "typeid (",
        $._expression,
        ")",
      ),
    ),

    // ---

    _is_expression: $ => choice(
      seq(
        "is (",
        $._type,
        ")",
      ),
      seq(
        "is (",
        $._type,
        ":",
        $._type_specialization,
        ")",
      ),
      seq(
        "is (",
        $._type,
        "==",
        $._type_specialization,
        ")",
      ),
      seq(
        "is (",
        $._type,
        ":",
        $._type_specialization,
        ",",
        $._template_parameter_list,
        ")",
      ),
      seq(
        "is (",
        $._type,
        "==",
        $._type_specialization,
        ",",
        $._template_parameter_list,
        ")",
      ),
      seq(
        "is (",
        $._type,
        $._identifier,
        ")",
      ),
      seq(
        "is (",
        $._type,
        $._identifier,
        ":",
        $._type_specialization,
        ")",
      ),
      seq(
        "is (",
        $._type,
        $._identifier,
        "==",
        $._type_specialization,
        ")",
      ),
      seq(
        "is (",
        $._type,
        $._identifier,
        ":",
        $._type_specialization,
        ",",
        $._template_parameter_list,
        ")",
      ),
      seq(
        "is (",
        $._type,
        $._identifier,
        "==",
        $._type_specialization,
        ",",
        $._template_parameter_list,
        ")",
      ),
    ),

    _type_specialization: $ => choice(
      seq(
        $._type,
      ),
      seq(
        "struct",
      ),
      seq(
        "union",
      ),
      seq(
        "class",
      ),
      seq(
        "interface",
      ),
      seq(
        "enum",
      ),
      seq(
        "__vector",
      ),
      seq(
        "function",
      ),
      seq(
        "delegate",
      ),
      seq(
        "super",
      ),
      seq(
        "const",
      ),
      seq(
        "immutable",
      ),
      seq(
        "inout",
      ),
      seq(
        "shared",
      ),
      seq(
        "return",
      ),
      seq(
        "__parameters",
      ),
      seq(
        "module",
      ),
      seq(
        "package",
      ),
    ),

    // ---

    _special_keyword: $ => choice(
      seq(
        "__FILE__",
      ),
      seq(
        "__FILE_FULL_PATH__",
      ),
      seq(
        "__MODULE__",
      ),
      seq(
        "__LINE__",
      ),
      seq(
        "__FUNCTION__",
      ),
      seq(
        "__PRETTY_FUNCTION__",
      ),
    ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/statement.html
    // ------------------------------------------------------------------------

    _statement: $ => choice(
      seq(
        ";",
      ),
      seq(
        $._non_empty_statement,
      ),
      seq(
        $._scope_block_statement,
      ),
    ),

    _no_scope_non_empty_statement: $ => choice(
      seq(
        $._non_empty_statement,
      ),
      seq(
        $._block_statement,
      ),
    ),

    _no_scope_statement: $ => choice(
      seq(
        ";",
      ),
      seq(
        $._non_empty_statement,
      ),
      seq(
        $._block_statement,
      ),
    ),

    _non_empty_or_scope_block_statement: $ => choice(
      seq(
        $._non_empty_statement,
      ),
      seq(
        $._scope_block_statement,
      ),
    ),

    _non_empty_statement: $ => choice(
      seq(
        $._non_empty_statement_no_case_no_default,
      ),
      seq(
        $._case_statement,
      ),
      seq(
        $._case_range_statement,
      ),
      seq(
        $._default_statement,
      ),
    ),

    _non_empty_statement_no_case_no_default: $ => choice(
      seq(
        $._labeled_statement,
      ),
      seq(
        $._expression_statement,
      ),
      seq(
        $._declaration_statement,
      ),
      seq(
        $._if_statement,
      ),
      seq(
        $._while_statement,
      ),
      seq(
        $._do_statement,
      ),
      seq(
        $._for_statement,
      ),
      seq(
        $._foreach_statement,
      ),
      seq(
        $._switch_statement,
      ),
      seq(
        $._final_switch_statement,
      ),
      seq(
        $._continue_statement,
      ),
      seq(
        $._break_statement,
      ),
      seq(
        $._return_statement,
      ),
      seq(
        $._goto_statement,
      ),
      seq(
        $._with_statement,
      ),
      seq(
        $._synchronized_statement,
      ),
      seq(
        $._try_statement,
      ),
      seq(
        $._scope_guard_statement,
      ),
      seq(
        $._throw_statement,
      ),
      seq(
        $._asm_statement,
      ),
      seq(
        $._mixin_statement,
      ),
      seq(
        $._foreach_range_statement,
      ),
      seq(
        $._pragma_statement,
      ),
      seq(
        $._conditional_statement,
      ),
      seq(
        $._static_foreach_statement,
      ),
      seq(
        $._static_assert,
      ),
      seq(
        $._template_mixin,
      ),
      seq(
        $._import_declaration,
      ),
    ),

    // ---

    _scope_statement: $ => choice(
      seq(
        $._non_empty_statement,
      ),
      seq(
        $._block_statement,
      ),
    ),

    // ---

    _scope_block_statement: $ => choice(
      seq(
        $._block_statement,
      ),
    ),

    // ---

    _labeled_statement: $ => choice(
      seq(
        $._identifier,
        ":",
      ),
      seq(
        $._identifier,
        ":",
        $._no_scope_statement,
      ),
      seq(
        $._identifier,
        ":",
        $._statement,
      ),
    ),

    // ---

    _block_statement: $ => choice(
      seq(
        "{ }",
      ),
      seq(
        "{",
        $._statement_list,
        "}",
      ),
    ),

    _statement_list: $ => choice(
      seq(
        $._statement,
      ),
      seq(
        $._statement,
        $._statement_list,
      ),
    ),

    // ---

    _expression_statement: $ => choice(
      seq(
        $._expression,
        ";",
      ),
    ),

    // ---

    _declaration_statement: $ => choice(
      seq(
        optional(
          $._storage_classes,
        ),
        $._declaration,
      ),
    ),

    // ---

    _if_statement: $ => choice(
      seq(
        "if (",
        $._if_condition,
        ")",
        $._then_statement,
      ),
      seq(
        "if (",
        $._if_condition,
        ")",
        $._then_statement,
        "else",
        $._else_statement,
      ),
    ),

    _if_condition: $ => choice(
      seq(
        $._expression,
      ),
      seq(
        "auto",
        $._identifier,
        "=",
        $._expression,
      ),
      seq(
        $._type_ctors,
        $._identifier,
        "=",
        $._expression,
      ),
      seq(
        optional(
          $._type_ctors,
        ),
        $._basic_type,
        $._declarator,
        "=",
        $._expression,
      ),
    ),

    _then_statement: $ => choice(
      seq(
        $._scope_statement,
      ),
    ),

    _else_statement: $ => choice(
      seq(
        $._scope_statement,
      ),
    ),

    // ---

    _while_statement: $ => choice(
      seq(
        "while (",
        $._if_condition,
        ")",
        $._scope_statement,
      ),
    ),

    // ---

    _do_statement: $ => choice(
      seq(
        "do",
        $._scope_statement,
        " while (",
        $._expression,
        ")",
        ";",
      ),
    ),

    // ---

    _for_statement: $ => choice(
      seq(
        "for (",
        $._initialize,
        optional(
          $._test,
        ),
        ";",
        optional(
          $._increment,
        ),
        ")",
        $._scope_statement,
      ),
    ),

    _initialize: $ => choice(
      seq(
        ";",
      ),
      seq(
        $._no_scope_non_empty_statement,
      ),
    ),

    _test: $ => choice(
      seq(
        $._expression,
      ),
    ),

    _increment: $ => choice(
      seq(
        $._expression,
      ),
    ),

    // ---

    _aggregate_foreach: $ => choice(
      seq(
        $._foreach,
        "(",
        $._foreach_type_list,
        ";",
        $._foreach_aggregate,
        ")",
      ),
    ),

    _foreach_statement: $ => choice(
      seq(
        $._aggregate_foreach,
        $._no_scope_non_empty_statement,
      ),
    ),

    _foreach: $ => choice(
      seq(
        "foreach",
      ),
      seq(
        "foreach_reverse",
      ),
    ),

    _foreach_type_list: $ => choice(
      seq(
        $._foreach_type,
      ),
      seq(
        $._foreach_type,
        ",",
        $._foreach_type_list,
      ),
    ),

    _foreach_type: $ => choice(
      seq(
        optional(
          $._foreach_type_attributes,
        ),
        $._basic_type,
        $._declarator,
      ),
      seq(
        optional(
          $._foreach_type_attributes,
        ),
        $._identifier,
      ),
      seq(
        optional(
          $._foreach_type_attributes,
        ),
        "alias",
        $._identifier,
      ),
    ),

    _foreach_type_attributes: $ => choice(
      seq(
        $._foreach_type_attribute,
      ),
      seq(
        $._foreach_type_attribute,
        optional(
          $._foreach_type_attributes,
        ),
      ),
    ),

    _foreach_type_attribute: $ => choice(
      seq(
        "ref",
      ),
      seq(
        $._type_ctor,
      ),
      seq(
        "enum",
      ),
    ),

    _foreach_aggregate: $ => choice(
      seq(
        $._expression,
      ),
    ),

    // ---

    _range_foreach: $ => choice(
      seq(
        $._foreach,
        "(",
        $._foreach_type,
        ";",
        $._lwr_expression,
        "..",
        $._upr_expression,
        ")",
      ),
    ),

    _lwr_expression: $ => choice(
      seq(
        $._expression,
      ),
    ),

    _upr_expression: $ => choice(
      seq(
        $._expression,
      ),
    ),

    _foreach_range_statement: $ => choice(
      seq(
        $._range_foreach,
        $._scope_statement,
      ),
    ),

    // ---

    _switch_statement: $ => choice(
      seq(
        "switch (",
        $._expression,
        ")",
        $._scope_statement,
      ),
    ),

    _case_statement: $ => choice(
      seq(
        "case",
        $._argument_list,
        ":",
        $._scope_statement_list,
      ),
    ),

    _case_range_statement: $ => choice(
      seq(
        "case",
        $._first_exp,
        ": .. case",
        $._last_exp,
        ":",
        $._scope_statement_list,
      ),
    ),

    _first_exp: $ => choice(
      seq(
        $._assign_expression,
      ),
    ),

    _last_exp: $ => choice(
      seq(
        $._assign_expression,
      ),
    ),

    _default_statement: $ => choice(
      seq(
        "default :",
        $._scope_statement_list,
      ),
    ),

    _scope_statement_list: $ => choice(
      seq(
        $._statement_list_no_case_no_default,
      ),
    ),

    _statement_list_no_case_no_default: $ => choice(
      seq(
        $._statement_no_case_no_default,
      ),
      seq(
        $._statement_no_case_no_default,
        $._statement_list_no_case_no_default,
      ),
    ),

    _statement_no_case_no_default: $ => choice(
      seq(
        ";",
      ),
      seq(
        $._non_empty_statement_no_case_no_default,
      ),
      seq(
        $._scope_block_statement,
      ),
    ),

    // ---

    _final_switch_statement: $ => choice(
      seq(
        "final switch (",
        $._expression,
        ")",
        $._scope_statement,
      ),
    ),

    // ---

    _continue_statement: $ => choice(
      seq(
        "continue",
        optional(
          $._identifier,
        ),
        ";",
      ),
    ),

    // ---

    _break_statement: $ => choice(
      seq(
        "break",
        optional(
          $._identifier,
        ),
        ";",
      ),
    ),

    // ---

    _return_statement: $ => choice(
      seq(
        "return",
        optional(
          $._expression,
        ),
        ";",
      ),
    ),

    // ---

    _goto_statement: $ => choice(
      seq(
        "goto",
        $._identifier,
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
        $._expression,
        ";",
      ),
    ),

    // ---

    _with_statement: $ => choice(
      seq(
        "with",
        "(",
        $._expression,
        ")",
        $._scope_statement,
      ),
      seq(
        "with",
        "(",
        $._symbol,
        ")",
        $._scope_statement,
      ),
      seq(
        "with",
        "(",
        $._template_instance,
        ")",
        $._scope_statement,
      ),
    ),

    // ---

    _synchronized_statement: $ => choice(
      seq(
        "synchronized",
        $._scope_statement,
      ),
      seq(
        "synchronized (",
        $._expression,
        ")",
        $._scope_statement,
      ),
    ),

    // ---

    _try_statement: $ => choice(
      seq(
        "try",
        $._scope_statement,
        $._catches,
      ),
      seq(
        "try",
        $._scope_statement,
        $._catches,
        $._finally_statement,
      ),
      seq(
        "try",
        $._scope_statement,
        $._finally_statement,
      ),
    ),

    _catches: $ => choice(
      seq(
        $._catch,
      ),
      seq(
        $._catch,
        $._catches,
      ),
    ),

    _catch: $ => choice(
      seq(
        "catch (",
        $._catch_parameter,
        ")",
        $._no_scope_non_empty_statement,
      ),
    ),

    _catch_parameter: $ => choice(
      seq(
        $._basic_type,
        optional(
          $._identifier,
        ),
      ),
    ),

    _finally_statement: $ => choice(
      seq(
        "finally",
        $._no_scope_non_empty_statement,
      ),
    ),

    // ---

    _throw_statement: $ => choice(
      seq(
        "throw",
        $._expression,
        ";",
      ),
    ),

    // ---

    _scope_guard_statement: $ => choice(
      seq(
        "scope(exit)",
        $._non_empty_or_scope_block_statement,
      ),
      seq(
        "scope(success)",
        $._non_empty_or_scope_block_statement,
      ),
      seq(
        "scope(failure)",
        $._non_empty_or_scope_block_statement,
      ),
    ),

    // ---

    _asm_statement: $ => choice(
      seq(
        "asm",
        optional(
          $._function_attributes,
        ),
        "{",
        optional(
          $._asm_instruction_list,
        ),
        "}",
      ),
    ),

    _asm_instruction_list: $ => choice(
      seq(
        $._asm_instruction,
        ";",
      ),
      seq(
        $._asm_instruction,
        ";",
        $._asm_instruction_list,
      ),
    ),

    // ---

    _mixin_statement: $ => choice(
      seq(
        "mixin",
        "(",
        $._argument_list,
        ")",
        ";",
      ),
    ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/struct.html
    // ------------------------------------------------------------------------

    _aggregate_declaration: $ => choice(
      seq(
        $._class_declaration,
      ),
      seq(
        $._interface_declaration,
      ),
      seq(
        $._struct_declaration,
      ),
      seq(
        $._union_declaration,
      ),
    ),

    _struct_declaration: $ => choice(
      seq(
        "struct",
        $._identifier,
        ";",
      ),
      seq(
        "struct",
        $._identifier,
        $._aggregate_body,
      ),
      seq(
        $._struct_template_declaration,
      ),
      seq(
        $._anon_struct_declaration,
      ),
    ),

    _anon_struct_declaration: $ => choice(
      seq(
        "struct",
        $._aggregate_body,
      ),
    ),

    _union_declaration: $ => choice(
      seq(
        "union",
        $._identifier,
        ";",
      ),
      seq(
        "union",
        $._identifier,
        $._aggregate_body,
      ),
      seq(
        $._union_template_declaration,
      ),
      seq(
        $._anon_union_declaration,
      ),
    ),

    _anon_union_declaration: $ => choice(
      seq(
        "union",
        $._aggregate_body,
      ),
    ),

    _aggregate_body: $ => choice(
      seq(
        "{",
        optional(
          $._decl_defs,
        ),
        "}",
      ),
    ),

    // ---

    _postblit: $ => choice(
      seq(
        "this ( this )",
        optional(
          $._member_function_attributes,
        ),
        ";",
      ),
      seq(
        "this ( this )",
        optional(
          $._member_function_attributes,
        ),
        $._function_body,
      ),
    ),

    // ---

    _struct_invariant: $ => choice(
      seq(
        "invariant ( )",
        $._block_statement,
      ),
      seq(
        "invariant",
        $._block_statement,
      ),
      seq(
        "invariant (",
        $._assert_arguments,
        ") ;",
      ),
    ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/class.html
    // ------------------------------------------------------------------------

    _class_declaration: $ => choice(
      seq(
        "class",
        $._identifier,
        ";",
      ),
      seq(
        "class",
        $._identifier,
        optional(
          $._base_class_list,
        ),
        $._aggregate_body,
      ),
      seq(
        $._class_template_declaration,
      ),
    ),

    _base_class_list: $ => choice(
      seq(
        ":",
        $._super_class,
      ),
      seq(
        ":",
        $._super_class,
        ",",
        $._interfaces,
      ),
      seq(
        ":",
        $._interfaces,
      ),
    ),

    _super_class: $ => choice(
      seq(
        $._basic_type,
      ),
    ),

    _interfaces: $ => choice(
      seq(
        $._interface,
      ),
      seq(
        $._interface,
        ",",
        $._interfaces,
      ),
    ),

    _interface: $ => choice(
      seq(
        $._basic_type,
      ),
    ),

    // ---

    _constructor: $ => choice(
      seq(
        "this",
        $._parameters,
        optional(
          $._member_function_attributes,
        ),
        ";",
      ),
      seq(
        "this",
        $._parameters,
        optional(
          $._member_function_attributes,
        ),
        $._function_body,
      ),
      seq(
        $._constructor_template,
      ),
    ),

    // ---

    _destructor: $ => choice(
      seq(
        "~ this ( )",
        optional(
          $._member_function_attributes,
        ),
        ";",
      ),
      seq(
        "~ this ( )",
        optional(
          $._member_function_attributes,
        ),
        $._function_body,
      ),
    ),

    // ---

    _static_constructor: $ => choice(
      seq(
        "static this ( )",
        optional(
          $._member_function_attributes,
        ),
        ";",
      ),
      seq(
        "static this ( )",
        optional(
          $._member_function_attributes,
        ),
        $._function_body,
      ),
    ),

    // ---

    _static_destructor: $ => choice(
      seq(
        "static ~ this ( )",
        optional(
          $._member_function_attributes,
        ),
        ";",
      ),
      seq(
        "static ~ this ( )",
        optional(
          $._member_function_attributes,
        ),
        $._function_body,
      ),
    ),

    // ---

    _shared_static_constructor: $ => choice(
      seq(
        "shared static this ( )",
        optional(
          $._member_function_attributes,
        ),
        ";",
      ),
      seq(
        "shared static this ( )",
        optional(
          $._member_function_attributes,
        ),
        $._function_body,
      ),
    ),

    // ---

    _shared_static_destructor: $ => choice(
      seq(
        "shared static ~ this ( )",
        optional(
          $._member_function_attributes,
        ),
        ";",
      ),
      seq(
        "shared static ~ this ( )",
        optional(
          $._member_function_attributes,
        ),
        $._function_body,
      ),
    ),

    // ---

    _class_invariant: $ => choice(
      seq(
        "invariant ( )",
        $._block_statement,
      ),
      seq(
        "invariant",
        $._block_statement,
      ),
      seq(
        "invariant (",
        $._assert_arguments,
        ") ;",
      ),
    ),

    // ---

    _allocator: $ => choice(
      seq(
        "new",
        $._parameters,
        ";",
      ),
      seq(
        "new",
        $._parameters,
        $._function_body,
      ),
    ),

    // ---

    _deallocator: $ => choice(
      seq(
        "delete",
        $._parameters,
        ";",
      ),
      seq(
        "delete",
        $._parameters,
        $._function_body,
      ),
    ),

    // ---

    _alias_this: $ => choice(
      seq(
        "alias",
        $._identifier,
        "this ;",
      ),
    ),

    // ---

    _new_anon_class_expression: $ => choice(
      seq(
        "new",
        optional(
          $._allocator_arguments,
        ),
        "class",
        optional(
          $._constructor_args,
        ),
        optional(
          $._super_class,
        ),
        optional(
          $._interfaces,
        ),
        $._aggregate_body,
      ),
    ),

    _constructor_args: $ => choice(
      seq(
        "(",
        optional(
          $._argument_list,
        ),
        ")",
      ),
    ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/interface.html
    // ------------------------------------------------------------------------

    _interface_declaration: $ => choice(
      seq(
        "interface",
        $._identifier,
        ";",
      ),
      seq(
        "interface",
        $._identifier,
        optional(
          $._base_interface_list,
        ),
        $._aggregate_body,
      ),
      seq(
        $._interface_template_declaration,
      ),
    ),

    _base_interface_list: $ => choice(
      seq(
        ":",
        $._interfaces,
      ),
    ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/enum.html
    // ------------------------------------------------------------------------

    _enum_declaration: $ => choice(
      seq(
        "enum",
        $._identifier,
        $._enum_body,
      ),
      seq(
        "enum",
        $._identifier,
        ":",
        $._enum_base_type,
        $._enum_body,
      ),
      seq(
        $._anonymous_enum_declaration,
      ),
    ),

    _enum_base_type: $ => choice(
      seq(
        $._type,
      ),
    ),

    _enum_body: $ => choice(
      seq(
        "{",
        $._enum_members,
        "}",
      ),
      seq(
        ";",
      ),
    ),

    _enum_members: $ => choice(
      seq(
        $._enum_member,
      ),
      seq(
        $._enum_member,
        ",",
      ),
      seq(
        $._enum_member,
        ",",
        $._enum_members,
      ),
    ),

    _enum_member_attributes: $ => choice(
      seq(
        $._enum_member_attribute,
      ),
      seq(
        $._enum_member_attribute,
        $._enum_member_attributes,
      ),
    ),

    _enum_member_attribute: $ => choice(
      seq(
        $._deprecated_attribute,
      ),
      seq(
        $._user_defined_attribute,
      ),
      seq(
        "@",
        "disable",
      ),
    ),

    _enum_member: $ => choice(
      seq(
        optional(
          $._enum_member_attributes,
        ),
        $._identifier,
      ),
      seq(
        optional(
          $._enum_member_attributes,
        ),
        $._identifier,
        "=",
        $._assign_expression,
      ),
    ),

    _anonymous_enum_declaration: $ => choice(
      seq(
        "enum",
        ":",
        $._enum_base_type,
        "{",
        $._enum_members,
        "}",
      ),
      seq(
        "enum",
        "{",
        $._enum_members,
        "}",
      ),
      seq(
        "enum",
        "{",
        $._anonymous_enum_members,
        "}",
      ),
    ),

    _anonymous_enum_members: $ => choice(
      seq(
        $._anonymous_enum_member,
      ),
      seq(
        $._anonymous_enum_member,
        ",",
      ),
      seq(
        $._anonymous_enum_member,
        ",",
        $._anonymous_enum_members,
      ),
    ),

    _anonymous_enum_member: $ => choice(
      seq(
        $._enum_member,
      ),
      seq(
        $._type,
        $._identifier,
        "=",
        $._assign_expression,
      ),
    ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/function.html
    // ------------------------------------------------------------------------

    _func_declaration: $ => choice(
      seq(
        optional(
          $._storage_classes,
        ),
        $._basic_type,
        $._func_declarator,
        $._function_body,
      ),
      seq(
        $._auto_func_declaration,
      ),
    ),

    _auto_func_declaration: $ => choice(
      seq(
        $._storage_classes,
        $._identifier,
        $._func_declarator_suffix,
        $._function_body,
      ),
    ),

    _func_declarator: $ => choice(
      seq(
        optional(
          $._type_suffixes,
        ),
        $._identifier,
        $._func_declarator_suffix,
      ),
    ),

    _func_declarator_suffix: $ => choice(
      seq(
        $._parameters,
        optional(
          $._member_function_attributes,
        ),
      ),
      seq(
        $._template_parameters,
        $._parameters,
        optional(
          $._member_function_attributes,
        ),
        optional(
          $._constraint,
        ),
      ),
    ),

    // ---

    _parameters: $ => choice(
      seq(
        "(",
        optional(
          $._parameter_list,
        ),
        ")",
      ),
    ),

    _parameter_list: $ => choice(
      seq(
        $._parameter,
      ),
      seq(
        $._parameter,
        ",",
        $._parameter_list,
      ),
      seq(
        $._variadic_arguments_attributes,
        "...",
      ),
    ),

    _parameter: $ => choice(
      seq(
        optional(
          $._parameter_attributes,
        ),
        $._basic_type,
        $._declarator,
      ),
      seq(
        optional(
          $._parameter_attributes,
        ),
        $._basic_type,
        $._declarator,
        "...",
      ),
      seq(
        optional(
          $._parameter_attributes,
        ),
        $._basic_type,
        $._declarator,
        "=",
        $._assign_expression,
      ),
      seq(
        optional(
          $._parameter_attributes,
        ),
        $._type,
      ),
      seq(
        optional(
          $._parameter_attributes,
        ),
        $._type,
        "...",
      ),
    ),

    _parameter_attributes: $ => choice(
      seq(
        $._in_out,
      ),
      seq(
        $._user_defined_attribute,
      ),
      seq(
        $._parameter_attributes,
        $._in_out,
      ),
      seq(
        $._parameter_attributes,
        $._user_defined_attribute,
      ),
      seq(
        $._parameter_attributes,
      ),
    ),

    _in_out: $ => choice(
      seq(
        "auto",
      ),
      seq(
        $._type_ctor,
      ),
      seq(
        "final",
      ),
      seq(
        "in",
      ),
      seq(
        "lazy",
      ),
      seq(
        "out",
      ),
      seq(
        "ref",
      ),
      seq(
        "return ref",
      ),
      seq(
        "scope",
      ),
    ),

    _variadic_arguments_attributes: $ => choice(
      seq(
        $._variadic_arguments_attribute,
      ),
      seq(
        $._variadic_arguments_attribute,
        $._variadic_arguments_attributes,
      ),
    ),

    _variadic_arguments_attribute: $ => choice(
      seq(
        "const",
      ),
      seq(
        "immutable",
      ),
      seq(
        "return",
      ),
      seq(
        "scope",
      ),
      seq(
        "shared",
      ),
    ),

    // ---

    _function_attributes: $ => choice(
      seq(
        $._function_attribute,
      ),
      seq(
        $._function_attribute,
        $._function_attributes,
      ),
    ),

    _function_attribute: $ => choice(
      seq(
        $._function_attribute_kwd,
      ),
      seq(
        $._property,
      ),
    ),

    _member_function_attributes: $ => choice(
      seq(
        $._member_function_attribute,
      ),
      seq(
        $._member_function_attribute,
        $._member_function_attributes,
      ),
    ),

    _member_function_attribute: $ => choice(
      seq(
        "const",
      ),
      seq(
        "immutable",
      ),
      seq(
        "inout",
      ),
      seq(
        "return",
      ),
      seq(
        "shared",
      ),
      seq(
        $._function_attribute,
      ),
    ),

    // ---

    _function_body: $ => choice(
      seq(
        $._specified_function_body,
      ),
      seq(
        $._missing_function_body,
      ),
      seq(
        $._shortened_function_body,
      ),
    ),

    _function_literal_body: $ => choice(
      seq(
        $._specified_function_body,
      ),
    ),

    _specified_function_body: $ => choice(
      seq(
        optional(
          "do",
        ),
        $._block_statement,
      ),
      seq(
        optional(
          $._function_contracts,
        ),
        $._in_out_contract_expression,
        optional(
          "do",
        ),
        $._block_statement,
      ),
      seq(
        optional(
          $._function_contracts,
        ),
        $._in_out_statement,
        "do",
        $._block_statement,
      ),
    ),

    _missing_function_body: $ => choice(
      seq(
        ";",
      ),
      seq(
        optional(
          $._function_contracts,
        ),
        $._in_out_contract_expression,
        ";",
      ),
      seq(
        optional(
          $._function_contracts,
        ),
        $._in_out_statement,
      ),
    ),

    _shortened_function_body: $ => choice(
      seq(
        "=>",
        $._assign_expression,
        ";",
      ),
    ),

    // ---

    _function_contracts: $ => choice(
      seq(
        $._function_contract,
      ),
      seq(
        $._function_contract,
        $._function_contracts,
      ),
    ),

    _function_contract: $ => choice(
      seq(
        $._in_out_contract_expression,
      ),
      seq(
        $._in_out_statement,
      ),
    ),

    _in_out_contract_expression: $ => choice(
      seq(
        $._in_contract_expression,
      ),
      seq(
        $._out_contract_expression,
      ),
    ),

    _in_out_statement: $ => choice(
      seq(
        $._in_statement,
      ),
      seq(
        $._out_statement,
      ),
    ),

    _in_contract_expression: $ => choice(
      seq(
        "in (",
        $._assert_arguments,
        ")",
      ),
    ),

    _out_contract_expression: $ => choice(
      seq(
        "out ( ;",
        $._assert_arguments,
        ")",
      ),
      seq(
        "out (",
        $._identifier,
        ";",
        $._assert_arguments,
        ")",
      ),
    ),

    _in_statement: $ => choice(
      seq(
        "in",
        $._block_statement,
      ),
    ),

    _out_statement: $ => choice(
      seq(
        "out",
        $._block_statement,
      ),
      seq(
        "out",
        "(",
        $._identifier,
        ")",
        $._block_statement,
      ),
    ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/template.html
    // ------------------------------------------------------------------------

    _template_declaration: $ => choice(
      seq(
        "template",
        $._identifier,
        $._template_parameters,
        optional(
          $._constraint,
        ),
        "{",
        optional(
          $._decl_defs,
        ),
        "}",
      ),
    ),

    _template_parameters: $ => choice(
      seq(
        "(",
        optional(
          $._template_parameter_list,
        ),
        ")",
      ),
    ),

    _template_parameter_list: $ => choice(
      seq(
        $._template_parameter,
      ),
      seq(
        $._template_parameter,
        ",",
      ),
      seq(
        $._template_parameter,
        ",",
        $._template_parameter_list,
      ),
    ),

    _template_parameter: $ => choice(
      seq(
        $._template_type_parameter,
      ),
      seq(
        $._template_value_parameter,
      ),
      seq(
        $._template_alias_parameter,
      ),
      seq(
        $._template_sequence_parameter,
      ),
      seq(
        $._template_this_parameter,
      ),
    ),

    // ---

    _template_instance: $ => choice(
      seq(
        $._identifier,
        $._template_arguments,
      ),
    ),

    _template_arguments: $ => choice(
      seq(
        "! (",
        optional(
          $._template_argument_list,
        ),
        ")",
      ),
      seq(
        "!",
        $._template_single_argument,
      ),
    ),

    _template_argument_list: $ => choice(
      seq(
        $._template_argument,
      ),
      seq(
        $._template_argument,
        ",",
      ),
      seq(
        $._template_argument,
        ",",
        $._template_argument_list,
      ),
    ),

    _template_argument: $ => choice(
      seq(
        $._type,
      ),
      seq(
        $._assign_expression,
      ),
      seq(
        $._symbol,
      ),
    ),

    _symbol: $ => choice(
      seq(
        $._symbol_tail,
      ),
      seq(
        ".",
        $._symbol_tail,
      ),
    ),

    _symbol_tail: $ => choice(
      seq(
        $._identifier,
      ),
      seq(
        $._identifier,
        ".",
        $._symbol_tail,
      ),
      seq(
        $._template_instance,
      ),
      seq(
        $._template_instance,
        ".",
        $._symbol_tail,
      ),
    ),

    _template_single_argument: $ => choice(
      seq(
        $._identifier,
      ),
      seq(
        $._fundamental_type,
      ),
      seq(
        $._character_literal,
      ),
      seq(
        $._string_literal,
      ),
      seq(
        $._integer_literal,
      ),
      seq(
        $._float_literal,
      ),
      seq(
        "true",
      ),
      seq(
        "false",
      ),
      seq(
        "null",
      ),
      seq(
        "this",
      ),
      seq(
        $._special_keyword,
      ),
    ),

    // ---

    _template_type_parameter: $ => choice(
      seq(
        $._identifier,
      ),
      seq(
        $._identifier,
        $._template_type_parameter_specialization,
      ),
      seq(
        $._identifier,
        $._template_type_parameter_default,
      ),
      seq(
        $._identifier,
        $._template_type_parameter_specialization,
        $._template_type_parameter_default,
      ),
    ),

    _template_type_parameter_specialization: $ => choice(
      seq(
        ":",
        $._type,
      ),
    ),

    _template_type_parameter_default: $ => choice(
      seq(
        "=",
        $._type,
      ),
    ),

    // ---

    _template_this_parameter: $ => choice(
      seq(
        "this",
        $._template_type_parameter,
      ),
    ),

    // ---

    _template_value_parameter: $ => choice(
      seq(
        $._basic_type,
        $._declarator,
      ),
      seq(
        $._basic_type,
        $._declarator,
        $._template_value_parameter_specialization,
      ),
      seq(
        $._basic_type,
        $._declarator,
        $._template_value_parameter_default,
      ),
      seq(
        $._basic_type,
        $._declarator,
        $._template_value_parameter_specialization,
        $._template_value_parameter_default,
      ),
    ),

    _template_value_parameter_specialization: $ => choice(
      seq(
        ":",
        $._conditional_expression,
      ),
    ),

    _template_value_parameter_default: $ => choice(
      seq(
        "=",
        $._assign_expression,
      ),
      seq(
        "=",
        $._special_keyword,
      ),
    ),

    // ---

    _template_alias_parameter: $ => choice(
      seq(
        "alias",
        $._identifier,
        optional(
          $._template_alias_parameter_specialization,
        ),
        optional(
          $._template_alias_parameter_default,
        ),
      ),
      seq(
        "alias",
        $._basic_type,
        $._declarator,
        optional(
          $._template_alias_parameter_specialization,
        ),
        optional(
          $._template_alias_parameter_default,
        ),
      ),
    ),

    _template_alias_parameter_specialization: $ => choice(
      seq(
        ":",
        $._type,
      ),
      seq(
        ":",
        $._conditional_expression,
      ),
    ),

    _template_alias_parameter_default: $ => choice(
      seq(
        "=",
        $._type,
      ),
      seq(
        "=",
        $._conditional_expression,
      ),
    ),

    // ---

    _template_sequence_parameter: $ => choice(
      seq(
        $._identifier,
        "...",
      ),
    ),

    // ---

    _constructor_template: $ => choice(
      seq(
        "this",
        $._template_parameters,
        $._parameters,
        optional(
          $._member_function_attributes,
        ),
        optional(
          $._constraint,
        ),
        ":",
      ),
      seq(
        "this",
        $._template_parameters,
        $._parameters,
        optional(
          $._member_function_attributes,
        ),
        optional(
          $._constraint,
        ),
        $._function_body,
      ),
    ),

    // ---

    _class_template_declaration: $ => choice(
      seq(
        "class",
        $._identifier,
        $._template_parameters,
        ";",
      ),
      seq(
        "class",
        $._identifier,
        $._template_parameters,
        optional(
          $._constraint,
        ),
        optional(
          $._base_class_list,
        ),
        $._aggregate_body,
      ),
      seq(
        "class",
        $._identifier,
        $._template_parameters,
        optional(
          $._base_class_list,
        ),
        optional(
          $._constraint,
        ),
        $._aggregate_body,
      ),
    ),

    _interface_template_declaration: $ => choice(
      seq(
        "interface",
        $._identifier,
        $._template_parameters,
        ";",
      ),
      seq(
        "interface",
        $._identifier,
        $._template_parameters,
        optional(
          $._constraint,
        ),
        optional(
          $._base_interface_list,
        ),
        $._aggregate_body,
      ),
      seq(
        "interface",
        $._identifier,
        $._template_parameters,
        $._base_interface_list,
        $._constraint,
        $._aggregate_body,
      ),
    ),

    _struct_template_declaration: $ => choice(
      seq(
        "struct",
        $._identifier,
        $._template_parameters,
        ";",
      ),
      seq(
        "struct",
        $._identifier,
        $._template_parameters,
        optional(
          $._constraint,
        ),
        $._aggregate_body,
      ),
    ),

    _union_template_declaration: $ => choice(
      seq(
        "union",
        $._identifier,
        $._template_parameters,
        ";",
      ),
      seq(
        "union",
        $._identifier,
        $._template_parameters,
        optional(
          $._constraint,
        ),
        $._aggregate_body,
      ),
    ),

    // ---

    _constraint: $ => choice(
      seq(
        "if",
        "(",
        $._expression,
        ")",
      ),
    ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/template-mixin.html
    // ------------------------------------------------------------------------

    _template_mixin_declaration: $ => choice(
      seq(
        "mixin",
        "template",
        $._identifier,
        $._template_parameters,
        optional(
          $._constraint,
        ),
        "{",
        optional(
          $._decl_defs,
        ),
        "}",
      ),
    ),

    _template_mixin: $ => choice(
      seq(
        "mixin",
        $._mixin_template_name,
        optional(
          $._template_arguments,
        ),
        optional(
          $._identifier,
        ),
        ";",
      ),
    ),

    _mixin_template_name: $ => choice(
      seq(
        ".",
        $._mixin_qualified_identifier,
      ),
      seq(
        $._mixin_qualified_identifier,
      ),
      seq(
        $._typeof,
        ".",
        $._mixin_qualified_identifier,
      ),
    ),

    _mixin_qualified_identifier: $ => choice(
      seq(
        $._identifier,
      ),
      seq(
        $._identifier,
        ".",
        $._mixin_qualified_identifier,
      ),
      seq(
        $._template_instance,
        ".",
        $._mixin_qualified_identifier,
      ),
    ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/version.html
    // ------------------------------------------------------------------------

    _conditional_declaration: $ => choice(
      seq(
        $._condition,
        $._declaration_block,
      ),
      seq(
        $._condition,
        $._declaration_block,
        "else",
        $._declaration_block,
      ),
      seq(
        $._condition,
        ":",
        optional(
          $._decl_defs,
        ),
      ),
      seq(
        $._condition,
        $._declaration_block,
        "else",
        ":",
        optional(
          $._decl_defs,
        ),
      ),
    ),

    _conditional_statement: $ => choice(
      seq(
        $._condition,
        $._no_scope_non_empty_statement,
      ),
      seq(
        $._condition,
        $._no_scope_non_empty_statement,
        "else",
        $._no_scope_non_empty_statement,
      ),
    ),

    // ---

    _condition: $ => choice(
      seq(
        $._version_condition,
      ),
      seq(
        $._debug_condition,
      ),
      seq(
        $._static_if_condition,
      ),
    ),

    // ---

    _version_condition: $ => choice(
      seq(
        "version (",
        $._integer_literal,
        ")",
      ),
      seq(
        "version (",
        $._identifier,
        ")",
      ),
      seq(
        "version (",
        "unittest",
        ")",
      ),
      seq(
        "version (",
        "assert",
        ")",
      ),
    ),

    // ---

    _version_specification: $ => choice(
      seq(
        "version =",
        $._identifier,
        ";",
      ),
      seq(
        "version =",
        $._integer_literal,
        ";",
      ),
    ),

    // ---

    _debug_condition: $ => choice(
      seq(
        "debug",
      ),
      seq(
        "debug (",
        $._integer_literal,
        ")",
      ),
      seq(
        "debug (",
        $._identifier,
        ")",
      ),
    ),

    // ---

    _debug_specification: $ => choice(
      seq(
        "debug =",
        $._identifier,
        ";",
      ),
      seq(
        "debug =",
        $._integer_literal,
        ";",
      ),
    ),

    // ---

    _static_if_condition: $ => choice(
      seq(
        "static if (",
        $._assign_expression,
        ")",
      ),
    ),

    // ---

    _static_foreach: $ => choice(
      seq(
        "static",
        $._aggregate_foreach,
      ),
      seq(
        "static",
        $._range_foreach,
      ),
    ),

    _static_foreach_declaration: $ => choice(
      seq(
        $._static_foreach,
        $._declaration_block,
      ),
      seq(
        $._static_foreach,
        ":",
        optional(
          $._decl_defs,
        ),
      ),
    ),

    _static_foreach_statement: $ => choice(
      seq(
        $._static_foreach,
        $._no_scope_non_empty_statement,
      ),
    ),

    // ---

    _static_assert: $ => choice(
      seq(
        "static assert (",
        $._assert_arguments,
        ");",
      ),
    ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/traits.html
    // ------------------------------------------------------------------------

    _traits_expression: $ => choice(
      seq(
        "__traits",
        "(",
        $._traits_keyword,
        ",",
        $._traits_arguments,
        ")",
      ),
    ),

    _traits_keyword: $ => choice(
      seq(
        "isAbstractClass",
      ),
      seq(
        "isArithmetic",
      ),
      seq(
        "isAssociativeArray",
      ),
      seq(
        "isFinalClass",
      ),
      seq(
        "isPOD",
      ),
      seq(
        "isNested",
      ),
      seq(
        "isFuture",
      ),
      seq(
        "isDeprecated",
      ),
      seq(
        "isFloating",
      ),
      seq(
        "isIntegral",
      ),
      seq(
        "isScalar",
      ),
      seq(
        "isStaticArray",
      ),
      seq(
        "isUnsigned",
      ),
      seq(
        "isDisabled",
      ),
      seq(
        "isVirtualFunction",
      ),
      seq(
        "isVirtualMethod",
      ),
      seq(
        "isAbstractFunction",
      ),
      seq(
        "isFinalFunction",
      ),
      seq(
        "isStaticFunction",
      ),
      seq(
        "isOverrideFunction",
      ),
      seq(
        "isTemplate",
      ),
      seq(
        "isRef",
      ),
      seq(
        "isOut",
      ),
      seq(
        "isLazy",
      ),
      seq(
        "isReturnOnStack",
      ),
      seq(
        "isZeroInit",
      ),
      seq(
        "isModule",
      ),
      seq(
        "isPackage",
      ),
      seq(
        "hasMember",
      ),
      seq(
        "hasCopyConstructor",
      ),
      seq(
        "hasPostblit",
      ),
      seq(
        "identifier",
      ),
      seq(
        "getAliasThis",
      ),
      seq(
        "getAttributes",
      ),
      seq(
        "getFunctionAttributes",
      ),
      seq(
        "getFunctionVariadicStyle",
      ),
      seq(
        "getLinkage",
      ),
      seq(
        "getLocation",
      ),
      seq(
        "getMember",
      ),
      seq(
        "getOverloads",
      ),
      seq(
        "getParameterStorageClasses",
      ),
      seq(
        "getPointerBitmap",
      ),
      seq(
        "getCppNamespaces",
      ),
      seq(
        "getVisibility",
      ),
      seq(
        "getProtection",
      ),
      seq(
        "getTargetInfo",
      ),
      seq(
        "getVirtualFunctions",
      ),
      seq(
        "getVirtualMethods",
      ),
      seq(
        "getUnitTests",
      ),
      seq(
        "parent",
      ),
      seq(
        "child",
      ),
      seq(
        "classInstanceSize",
      ),
      seq(
        "getVirtualIndex",
      ),
      seq(
        "allMembers",
      ),
      seq(
        "derivedMembers",
      ),
      seq(
        "isSame",
      ),
      seq(
        "compiles",
      ),
      seq(
        "toType",
      ),
    ),

    _traits_arguments: $ => choice(
      seq(
        $._traits_argument,
      ),
      seq(
        $._traits_argument,
        ",",
        $._traits_arguments,
      ),
    ),

    _traits_argument: $ => choice(
      seq(
        $._assign_expression,
      ),
      seq(
        $._type,
      ),
    ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/unittest.html
    // ------------------------------------------------------------------------

    _unit_test: $ => choice(
      seq(
        "unittest",
        $._block_statement,
      ),
    ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/iasm.html
    // ------------------------------------------------------------------------

    _asm_instruction: $ => choice(
      seq(
        $._identifier,
        ":",
        $._asm_instruction,
      ),
      seq(
        "align",
        $._integer_expression,
      ),
      seq(
        "even",
      ),
      seq(
        "naked",
      ),
      seq(
        "db",
        $._operands,
      ),
      seq(
        "ds",
        $._operands,
      ),
      seq(
        "di",
        $._operands,
      ),
      seq(
        "dl",
        $._operands,
      ),
      seq(
        "df",
        $._operands,
      ),
      seq(
        "dd",
        $._operands,
      ),
      seq(
        "de",
        $._operands,
      ),
      seq(
        "db",
        $._string_literal,
      ),
      seq(
        "ds",
        $._string_literal,
      ),
      seq(
        "di",
        $._string_literal,
      ),
      seq(
        "dl",
        $._string_literal,
      ),
      seq(
        "dw",
        $._string_literal,
      ),
      seq(
        "dq",
        $._string_literal,
      ),
      seq(
        $._opcode,
      ),
      seq(
        $._opcode,
        $._operands,
      ),
    ),

    _opcode: $ => choice(
      seq(
        $._identifier,
      ),
    ),

    _operands: $ => choice(
      seq(
        $._operand,
      ),
      seq(
        $._operand,
        ",",
        $._operands,
      ),
    ),

    // ---

    _integer_expression: $ => choice(
      seq(
        $._integer_literal,
      ),
      seq(
        $._identifier,
      ),
    ),

    // ---

    _register: $ => choice(
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
      seq(
        "ST",
      ),
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

    _register64: $ => choice(
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

    _operand: $ => choice(
      seq(
        $._asm_exp,
      ),
    ),

    _asm_exp: $ => choice(
      seq(
        $._asm_log_or_exp,
      ),
      seq(
        $._asm_log_or_exp,
        "?",
        $._asm_exp,
        ":",
        $._asm_exp,
      ),
    ),

    _asm_log_or_exp: $ => choice(
      seq(
        $._asm_log_and_exp,
      ),
      seq(
        $._asm_log_or_exp,
        "||",
        $._asm_log_and_exp,
      ),
    ),

    _asm_log_and_exp: $ => choice(
      seq(
        $._asm_or_exp,
      ),
      seq(
        $._asm_log_and_exp,
        "&&",
        $._asm_or_exp,
      ),
    ),

    _asm_or_exp: $ => choice(
      seq(
        $._asm_xor_exp,
      ),
      seq(
        $._asm_or_exp,
        "|",
        $._asm_xor_exp,
      ),
    ),

    _asm_xor_exp: $ => choice(
      seq(
        $._asm_and_exp,
      ),
      seq(
        $._asm_xor_exp,
        "^",
        $._asm_and_exp,
      ),
    ),

    _asm_and_exp: $ => choice(
      seq(
        $._asm_equal_exp,
      ),
      seq(
        $._asm_and_exp,
        "&",
        $._asm_equal_exp,
      ),
    ),

    _asm_equal_exp: $ => choice(
      seq(
        $._asm_rel_exp,
      ),
      seq(
        $._asm_equal_exp,
        "==",
        $._asm_rel_exp,
      ),
      seq(
        $._asm_equal_exp,
        "!=",
        $._asm_rel_exp,
      ),
    ),

    _asm_rel_exp: $ => choice(
      seq(
        $._asm_shift_exp,
      ),
      seq(
        $._asm_rel_exp,
        "<",
        $._asm_shift_exp,
      ),
      seq(
        $._asm_rel_exp,
        "<",
        "=",
        $._asm_shift_exp,
      ),
      seq(
        $._asm_rel_exp,
        ">",
        $._asm_shift_exp,
      ),
      seq(
        $._asm_rel_exp,
        ">=",
        $._asm_shift_exp,
      ),
    ),

    _asm_shift_exp: $ => choice(
      seq(
        $._asm_add_exp,
      ),
      seq(
        $._asm_shift_exp,
        "<",
        "<",
        $._asm_add_exp,
      ),
      seq(
        $._asm_shift_exp,
        ">>",
        $._asm_add_exp,
      ),
      seq(
        $._asm_shift_exp,
        ">>>",
        $._asm_add_exp,
      ),
    ),

    _asm_add_exp: $ => choice(
      seq(
        $._asm_mul_exp,
      ),
      seq(
        $._asm_add_exp,
        "+",
        $._asm_mul_exp,
      ),
      seq(
        $._asm_add_exp,
        "-",
        $._asm_mul_exp,
      ),
    ),

    _asm_mul_exp: $ => choice(
      seq(
        $._asm_br_exp,
      ),
      seq(
        $._asm_mul_exp,
        "*",
        $._asm_br_exp,
      ),
      seq(
        $._asm_mul_exp,
        "/",
        $._asm_br_exp,
      ),
      seq(
        $._asm_mul_exp,
        "%",
        $._asm_br_exp,
      ),
    ),

    _asm_br_exp: $ => choice(
      seq(
        $._asm_una_exp,
      ),
      seq(
        $._asm_br_exp,
        "[",
        $._asm_exp,
        "]",
      ),
    ),

    _asm_una_exp: $ => choice(
      seq(
        $._asm_type_prefix,
        $._asm_exp,
      ),
      seq(
        "offsetof",
        $._asm_exp,
      ),
      seq(
        "seg",
        $._asm_exp,
      ),
      seq(
        "+",
        $._asm_una_exp,
      ),
      seq(
        "-",
        $._asm_una_exp,
      ),
      seq(
        "!",
        $._asm_una_exp,
      ),
      seq(
        "~",
        $._asm_una_exp,
      ),
      seq(
        $._asm_primary_exp,
      ),
    ),

    _asm_primary_exp: $ => choice(
      seq(
        $._integer_literal,
      ),
      seq(
        $._float_literal,
      ),
      seq(
        "__LOCAL_SIZE",
      ),
      seq(
        "$",
      ),
      seq(
        $._register,
      ),
      seq(
        $._register,
        ":",
        $._asm_exp,
      ),
      seq(
        $._register64,
      ),
      seq(
        $._register64,
        ":",
        $._asm_exp,
      ),
      seq(
        $._dot_identifier,
      ),
      seq(
        "this",
      ),
    ),

    _dot_identifier: $ => choice(
      seq(
        $._identifier,
      ),
      seq(
        $._identifier,
        ".",
        $._dot_identifier,
      ),
      seq(
        $._fundamental_type,
        ".",
        $._identifier,
      ),
    ),

    // ---

    _asm_type_prefix: $ => choice(
      seq(
        "near ptr",
      ),
      seq(
        "far ptr",
      ),
      seq(
        "word ptr",
      ),
      seq(
        "dword ptr",
      ),
      seq(
        "qword ptr",
      ),
      seq(
        $._fundamental_type,
        "ptr",
      ),
    ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/entity.html
    // ------------------------------------------------------------------------

    _named_character_entity: $ => choice(
      seq(
        "&",
        $._identifier,
        ";",
      ),
    ),
  }
});
