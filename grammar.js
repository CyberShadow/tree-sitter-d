module.exports = grammar({
  name: 'd',

  rules: {
    source_file: $ => $._module,

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/lex.html
    // ------------------------------------------------------------------------

    _character: $ =>
      /* any Unicode character */,

    // ---

    _end_of_file: $ =>
      choice(
        /* physical end of the file */,
        "\0",
        "\x1A",
      ),

    // ---

    _end_of_line: $ =>
      choice(
        "\r",
        "\n",
        seq(
          "\r",
          "\n",
        ),
        "\u2028",
        "\u2029",
        $._end_of_file,
      ),

    // ---

    _white_space: $ =>
      choice(
        $._space,
        seq(
          $._space,
          $._white_space,
        ),
      ),

    _space: $ =>
      choice(
        " ",
        "\t",
        "\v",
        "\f",
      ),

    // ---

    _comment: $ =>
      choice(
        $._block_comment,
        $._line_comment,
        $._nesting_block_comment,
      ),

    _block_comment: $ =>
      seq(
        "/*",
        optional(
          $._characters,
        ),
        "*/",
      ),

    _line_comment: $ =>
      seq(
        "//",
        optional(
          $._characters,
        ),
        $._end_of_line,
      ),

    _nesting_block_comment: $ =>
      seq(
        "/+",
        optional(
          $._nesting_block_comment_characters,
        ),
        "+/",
      ),

    _nesting_block_comment_characters: $ =>
      choice(
        $._nesting_block_comment_character,
        seq(
          $._nesting_block_comment_character,
          $._nesting_block_comment_characters,
        ),
      ),

    _nesting_block_comment_character: $ =>
      choice(
        $._character,
        $._nesting_block_comment,
      ),

    _characters: $ =>
      choice(
        $._character,
        seq(
          $._character,
          $._characters,
        ),
      ),

    // ---

    _tokens: $ =>
      choice(
        $._token,
        seq(
          $._token,
          $._tokens,
        ),
      ),

    _token: $ =>
      choice(
        $._identifier,
        $._string_literal,
        $._character_literal,
        $._integer_literal,
        $._float_literal,
        $._keyword,
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
        ">",
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
      ),

    // ---

    _identifier: $ =>
      choice(
        $._identifier_start,
        seq(
          $._identifier_start,
          $._identifier_chars,
        ),
      ),

    _identifier_chars: $ =>
      choice(
        $._identifier_char,
        seq(
          $._identifier_char,
          $._identifier_chars,
        ),
      ),

    _identifier_start: $ =>
      choice(
        "_",
        /* Letter */,
        /* UniversalAlpha */,
      ),

    _identifier_char: $ =>
      choice(
        $._identifier_start,
        "0",
        $._non_zero_digit,
      ),

    // ---

    _string_literal: $ =>
      choice(
        $._wysiwyg_string,
        $._alternate_wysiwyg_string,
        $._double_quoted_string,
        $._hex_string,
        $._delimited_string,
        $._token_string,
      ),

    _wysiwyg_string: $ =>
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

    _alternate_wysiwyg_string: $ =>
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

    _wysiwyg_characters: $ =>
      choice(
        $._wysiwyg_character,
        seq(
          $._wysiwyg_character,
          $._wysiwyg_characters,
        ),
      ),

    _wysiwyg_character: $ =>
      choice(
        $._character,
        $._end_of_line,
      ),

    _double_quoted_string: $ =>
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

    _double_quoted_characters: $ =>
      choice(
        $._double_quoted_character,
        seq(
          $._double_quoted_character,
          $._double_quoted_characters,
        ),
      ),

    _double_quoted_character: $ =>
      choice(
        $._character,
        $._escape_sequence,
        $._end_of_line,
      ),

    _escape_sequence: $ =>
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

    _hex_string: $ =>
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

    _hex_string_chars: $ =>
      choice(
        $._hex_string_char,
        seq(
          $._hex_string_char,
          $._hex_string_chars,
        ),
      ),

    _hex_string_char: $ =>
      choice(
        $._hex_digit,
        $._white_space,
        $._end_of_line,
      ),

    _string_postfix: $ =>
      choice(
        "c",
        "w",
        "d",
      ),

    _delimited_string: $ =>
      seq(
        "q\"",
        $._delimiter,
        optional(
          $._wysiwyg_characters,
        ),
        $._matching_delimiter,
        "\"",
      ),

    _delimiter: $ =>
      choice(
        "(",
        "{",
        "[",
        "<",
        $._identifier,
      ),

    _matching_delimiter: $ =>
      choice(
        ")",
        "}",
        "]",
        ">",
        $._identifier,
      ),

    _token_string: $ =>
      seq(
        "q",
        "{",
        optional(
          $._tokens,
        ),
        "}",
      ),

    // ---

    _character_literal: $ =>
      seq(
        "'",
        $._single_quoted_character,
        "'",
      ),

    _single_quoted_character: $ =>
      choice(
        $._character,
        $._escape_sequence,
      ),

    // ---

    _integer_literal: $ =>
      choice(
        $._integer,
        seq(
          $._integer,
          $._integer_suffix,
        ),
      ),

    _integer: $ =>
      choice(
        $._decimal_integer,
        $._binary_integer,
        $._hexadecimal_integer,
      ),

    _integer_suffix: $ =>
      choice(
        "L",
        "u",
        "U",
        "Lu",
        "LU",
        "uL",
        "UL",
      ),

    _decimal_integer: $ =>
      choice(
        "0",
        $._non_zero_digit,
        seq(
          $._non_zero_digit,
          $._decimal_digits_us,
        ),
      ),

    _binary_integer: $ =>
      seq(
        $._bin_prefix,
        $._binary_digits_no_single_us,
      ),

    _bin_prefix: $ =>
      choice(
        "0b",
        "0B",
      ),

    _hexadecimal_integer: $ =>
      seq(
        $._hex_prefix,
        $._hex_digits_no_single_us,
      ),

    _non_zero_digit: $ =>
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

    _decimal_digits: $ =>
      choice(
        $._decimal_digit,
        seq(
          $._decimal_digit,
          $._decimal_digits,
        ),
      ),

    _decimal_digits_us: $ =>
      choice(
        $._decimal_digit_us,
        seq(
          $._decimal_digit_us,
          $._decimal_digits_us,
        ),
      ),

    _decimal_digits_no_single_us: $ =>
      choice(
        $._decimal_digit,
        seq(
          $._decimal_digit,
          $._decimal_digits_us,
        ),
        seq(
          $._decimal_digits_us,
          $._decimal_digit,
        ),
      ),

    _decimal_digits_no_starting_us: $ =>
      choice(
        $._decimal_digit,
        seq(
          $._decimal_digit,
          $._decimal_digits_us,
        ),
      ),

    _decimal_digit: $ =>
      choice(
        "0",
        $._non_zero_digit,
      ),

    _decimal_digit_us: $ =>
      choice(
        $._decimal_digit,
        "_",
      ),

    _binary_digits_no_single_us: $ =>
      choice(
        $._binary_digit,
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

    _binary_digits_us: $ =>
      choice(
        $._binary_digit_us,
        seq(
          $._binary_digit_us,
          $._binary_digits_us,
        ),
      ),

    _binary_digit: $ =>
      choice(
        "0",
        "1",
      ),

    _binary_digit_us: $ =>
      choice(
        $._binary_digit,
        "_",
      ),

    _octal_digit: $ =>
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

    _hex_digits: $ =>
      choice(
        $._hex_digit,
        seq(
          $._hex_digit,
          $._hex_digits,
        ),
      ),

    _hex_digits_us: $ =>
      choice(
        $._hex_digit_us,
        seq(
          $._hex_digit_us,
          $._hex_digits_us,
        ),
      ),

    _hex_digits_no_single_us: $ =>
      choice(
        $._hex_digit,
        seq(
          $._hex_digit,
          $._hex_digits_us,
        ),
        seq(
          $._hex_digits_us,
          $._hex_digit,
        ),
      ),

    _hex_digits_no_starting_us: $ =>
      choice(
        $._hex_digit,
        seq(
          $._hex_digit,
          $._hex_digits_us,
        ),
      ),

    _hex_digit: $ =>
      choice(
        $._decimal_digit,
        $._hex_letter,
      ),

    _hex_digit_us: $ =>
      choice(
        $._hex_digit,
        "_",
      ),

    _hex_letter: $ =>
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

    // ---

    _float_literal: $ =>
      choice(
        $._float,
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

    _float: $ =>
      choice(
        $._decimal_float,
        $._hex_float,
      ),

    _decimal_float: $ =>
      choice(
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

    _decimal_exponent: $ =>
      seq(
        $._decimal_exponent_start,
        $._decimal_digits_no_single_us,
      ),

    _decimal_exponent_start: $ =>
      choice(
        "e",
        "E",
        "e+",
        "E+",
        "e-",
        "E-",
      ),

    _hex_float: $ =>
      choice(
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

    _hex_prefix: $ =>
      choice(
        "0x",
        "0X",
      ),

    _hex_exponent: $ =>
      seq(
        $._hex_exponent_start,
        $._decimal_digits_no_single_us,
      ),

    _hex_exponent_start: $ =>
      choice(
        "p",
        "P",
        "p+",
        "P+",
        "p-",
        "P-",
      ),

    _suffix: $ =>
      choice(
        $._float_suffix,
        $._real_suffix,
        $._imaginary_suffix,
        seq(
          $._float_suffix,
          $._imaginary_suffix,
        ),
        seq(
          $._real_suffix,
          $._imaginary_suffix,
        ),
      ),

    _float_suffix: $ =>
      choice(
        "f",
        "F",
      ),

    _real_suffix: $ =>
      "L",

    _imaginary_suffix: $ =>
      "i",

    _leading_decimal: $ =>
      choice(
        $._decimal_integer,
        seq(
          "0",
          $._decimal_digits_no_single_us,
        ),
      ),

    // ---

    _keyword: $ =>
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

    // ---

    _special_token_sequence: $ =>
      choice(
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

    _filespec: $ =>
      seq(
        "\"",
        optional(
          $._characters,
        ),
        "\"",
      ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/module.html
    // ------------------------------------------------------------------------

    _module: $ =>
      choice(
        seq(
          $._module_declaration,
          $._decl_defs,
        ),
        $._decl_defs,
      ),

    _decl_defs: $ =>
      choice(
        $._decl_def,
        seq(
          $._decl_def,
          $._decl_defs,
        ),
      ),

    _decl_def: $ =>
      choice(
        $._attribute_specifier,
        $._declaration,
        $._constructor,
        $._destructor,
        $._postblit,
        $._allocator,
        $._deallocator,
        $._class_invariant,
        $._struct_invariant,
        $._unit_test,
        $._alias_this,
        $._static_constructor,
        $._static_destructor,
        $._shared_static_constructor,
        $._shared_static_destructor,
        $._conditional_declaration,
        $._debug_specification,
        $._version_specification,
        $._static_assert,
        $._template_declaration,
        $._template_mixin_declaration,
        $._template_mixin,
        $._mixin_declaration,
        ";",
      ),

    // ---

    _module_declaration: $ =>
      seq(
        optional(
          $._module_attributes,
        ),
        "module",
        $._module_fully_qualified_name,
        ";",
      ),

    _module_attributes: $ =>
      choice(
        $._module_attribute,
        seq(
          $._module_attribute,
          $._module_attributes,
        ),
      ),

    _module_attribute: $ =>
      choice(
        $._deprecated_attribute,
        $._user_defined_attribute,
      ),

    _module_fully_qualified_name: $ =>
      choice(
        $._module_name,
        seq(
          $._packages,
          ".",
          $._module_name,
        ),
      ),

    _module_name: $ =>
      $._identifier,

    _packages: $ =>
      choice(
        $._package_name,
        seq(
          $._packages,
          ".",
          $._package_name,
        ),
      ),

    _package_name: $ =>
      $._identifier,

    // ---

    _import_declaration: $ =>
      choice(
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

    _import_list: $ =>
      choice(
        $._import,
        $._import_bindings,
        seq(
          $._import,
          ",",
          $._import_list,
        ),
      ),

    _import: $ =>
      choice(
        $._module_fully_qualified_name,
        seq(
          $._module_alias_identifier,
          "=",
          $._module_fully_qualified_name,
        ),
      ),

    _import_bindings: $ =>
      seq(
        $._import,
        ":",
        $._import_bind_list,
      ),

    _import_bind_list: $ =>
      choice(
        $._import_bind,
        seq(
          $._import_bind,
          ",",
          $._import_bind_list,
        ),
      ),

    _import_bind: $ =>
      choice(
        $._identifier,
        seq(
          $._identifier,
          "=",
          $._identifier,
        ),
      ),

    _module_alias_identifier: $ =>
      $._identifier,

    // ---

    _mixin_declaration: $ =>
      seq(
        "mixin",
        "(",
        $._argument_list,
        ")",
        ";",
      ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/declaration.html
    // ------------------------------------------------------------------------

    _declaration: $ =>
      choice(
        $._func_declaration,
        $._var_declarations,
        $._alias_declaration,
        $._aggregate_declaration,
        $._enum_declaration,
        $._import_declaration,
        $._conditional_declaration,
        $._static_foreach_declaration,
        $._static_assert,
      ),

    // ---

    _var_declarations: $ =>
      choice(
        seq(
          optional(
            $._storage_classes,
          ),
          $._basic_type,
          $._declarators,
          ";",
        ),
        $._auto_declaration,
      ),

    _declarators: $ =>
      choice(
        $._declarator_initializer,
        seq(
          $._declarator_initializer,
          ",",
          $._declarator_identifier_list,
        ),
      ),

    _declarator_initializer: $ =>
      choice(
        $._var_declarator,
        seq(
          $._var_declarator,
          optional(
            $._template_parameters,
          ),
          "=",
          $._initializer,
        ),
        $._alt_declarator,
        seq(
          $._alt_declarator,
          "=",
          $._initializer,
        ),
      ),

    _declarator_identifier_list: $ =>
      choice(
        $._declarator_identifier,
        seq(
          $._declarator_identifier,
          ",",
          $._declarator_identifier_list,
        ),
      ),

    _declarator_identifier: $ =>
      choice(
        $._var_declarator_identifier,
        $._alt_declarator_identifier,
      ),

    _var_declarator_identifier: $ =>
      choice(
        $._identifier,
        seq(
          $._identifier,
          optional(
            $._template_parameters,
          ),
          "=",
          $._initializer,
        ),
      ),

    _alt_declarator_identifier: $ =>
      choice(
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

    _declarator: $ =>
      choice(
        $._var_declarator,
        $._alt_declarator,
      ),

    _var_declarator: $ =>
      seq(
        optional(
          $._type_suffixes,
        ),
        $._identifier,
      ),

    _alt_declarator: $ =>
      choice(
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

    _alt_declarator_inner: $ =>
      choice(
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
        $._alt_declarator,
      ),

    _alt_declarator_suffixes: $ =>
      choice(
        $._alt_declarator_suffix,
        seq(
          $._alt_declarator_suffix,
          $._alt_declarator_suffixes,
        ),
      ),

    _alt_declarator_suffix: $ =>
      choice(
        "[ ]",
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

    _alt_func_declarator_suffix: $ =>
      seq(
        $._parameters,
        optional(
          $._member_function_attributes,
        ),
      ),

    // ---

    _storage_classes: $ =>
      choice(
        $._storage_class,
        seq(
          $._storage_class,
          $._storage_classes,
        ),
      ),

    _storage_class: $ =>
      choice(
        $._linkage_attribute,
        $._align_attribute,
        "deprecated",
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
        $._property,
        "nothrow",
        "pure",
        "ref",
      ),

    // ---

    _initializer: $ =>
      choice(
        $._void_initializer,
        $._non_void_initializer,
      ),

    _non_void_initializer: $ =>
      choice(
        $._exp_initializer,
        $._array_initializer,
        $._struct_initializer,
      ),

    _exp_initializer: $ =>
      $._assign_expression,

    _array_initializer: $ =>
      seq(
        "[",
        optional(
          $._array_member_initializations,
        ),
        "]",
      ),

    _array_member_initializations: $ =>
      choice(
        $._array_member_initialization,
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

    _array_member_initialization: $ =>
      choice(
        $._non_void_initializer,
        seq(
          $._assign_expression,
          ":",
          $._non_void_initializer,
        ),
      ),

    _struct_initializer: $ =>
      seq(
        "{",
        optional(
          $._struct_member_initializers,
        ),
        "}",
      ),

    _struct_member_initializers: $ =>
      choice(
        $._struct_member_initializer,
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

    _struct_member_initializer: $ =>
      choice(
        $._non_void_initializer,
        seq(
          $._identifier,
          ":",
          $._non_void_initializer,
        ),
      ),

    // ---

    _auto_declaration: $ =>
      seq(
        $._storage_classes,
        $._auto_assignments,
        ";",
      ),

    _auto_assignments: $ =>
      choice(
        $._auto_assignment,
        seq(
          $._auto_assignments,
          ",",
          $._auto_assignment,
        ),
      ),

    _auto_assignment: $ =>
      seq(
        $._identifier,
        optional(
          $._template_parameters,
        ),
        "=",
        $._initializer,
      ),

    // ---

    _alias_declaration: $ =>
      choice(
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

    _alias_assignments: $ =>
      choice(
        $._alias_assignment,
        seq(
          $._alias_assignments,
          ",",
          $._alias_assignment,
        ),
      ),

    _alias_assignment: $ =>
      choice(
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

    _void_initializer: $ =>
      "void",

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/type.html
    // ------------------------------------------------------------------------

    _type: $ =>
      seq(
        optional(
          $._type_ctors,
        ),
        $._basic_type,
        optional(
          $._type_suffixes,
        ),
      ),

    _type_ctors: $ =>
      choice(
        $._type_ctor,
        seq(
          $._type_ctor,
          $._type_ctors,
        ),
      ),

    _type_ctor: $ =>
      choice(
        "const",
        "immutable",
        "inout",
        "shared",
      ),

    _basic_type: $ =>
      choice(
        $._fundamental_type,
        seq(
          ".",
          $._qualified_identifier,
        ),
        $._qualified_identifier,
        $._typeof,
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
        $._vector,
        $._traits_expression,
        $._mixin_type,
      ),

    _vector: $ =>
      seq(
        "__vector",
        "(",
        $._vector_base_type,
        ")",
      ),

    _vector_base_type: $ =>
      $._type,

    _fundamental_type: $ =>
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

    _type_suffixes: $ =>
      seq(
        $._type_suffix,
        optional(
          $._type_suffixes,
        ),
      ),

    _type_suffix: $ =>
      choice(
        "*",
        "[ ]",
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

    _qualified_identifier: $ =>
      choice(
        $._identifier,
        seq(
          $._identifier,
          ".",
          $._qualified_identifier,
        ),
        $._template_instance,
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

    _typeof: $ =>
      choice(
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

    _mixin_type: $ =>
      seq(
        "mixin (",
        $._argument_list,
        ")",
      ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/attribute.html
    // ------------------------------------------------------------------------

    _attribute_specifier: $ =>
      choice(
        seq(
          $._attribute,
          ":",
        ),
        seq(
          $._attribute,
          $._declaration_block,
        ),
      ),

    _attribute: $ =>
      choice(
        $._linkage_attribute,
        $._align_attribute,
        $._deprecated_attribute,
        $._visibility_attribute,
        $._pragma,
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
        $._at_attribute,
        $._function_attribute_kwd,
        "ref",
        "return",
      ),

    _function_attribute_kwd: $ =>
      choice(
        "nothrow",
        "pure",
      ),

    _at_attribute: $ =>
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
        $._property,
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
        $._user_defined_attribute,
      ),

    _property: $ =>
      seq(
        "@",
        "property",
      ),

    _declaration_block: $ =>
      choice(
        $._decl_def,
        seq(
          "{",
          optional(
            $._decl_defs,
          ),
          "}",
        ),
      ),

    // ---

    _linkage_attribute: $ =>
      choice(
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

    _linkage_type: $ =>
      choice(
        "C",
        "C++",
        "D",
        "Windows",
        "System",
        "Objective-C",
      ),

    _namespace_list: $ =>
      choice(
        $._conditional_expression,
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

    _align_attribute: $ =>
      choice(
        "align",
        seq(
          "align",
          "(",
          $._assign_expression,
          ")",
        ),
      ),

    // ---

    _deprecated_attribute: $ =>
      choice(
        "deprecated",
        seq(
          "deprecated (",
          $._assign_expression,
          ")",
        ),
      ),

    // ---

    _visibility_attribute: $ =>
      choice(
        "private",
        "package",
        seq(
          "package",
          "(",
          $._qualified_identifier,
          ")",
        ),
        "protected",
        "public",
        "export",
      ),

    // ---

    _user_defined_attribute: $ =>
      choice(
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

    _pragma_declaration: $ =>
      choice(
        seq(
          $._pragma,
          ";",
        ),
        seq(
          $._pragma,
          $._declaration_block,
        ),
      ),

    _pragma_statement: $ =>
      choice(
        seq(
          $._pragma,
          ";",
        ),
        seq(
          $._pragma,
          $._no_scope_statement,
        ),
      ),

    _pragma: $ =>
      choice(
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

    _expression: $ =>
      $._comma_expression,

    _comma_expression: $ =>
      choice(
        $._assign_expression,
        seq(
          $._comma_expression,
          ",",
          $._assign_expression,
        ),
      ),

    // ---

    _assign_expression: $ =>
      choice(
        $._conditional_expression,
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

    _conditional_expression: $ =>
      choice(
        $._or_or_expression,
        seq(
          $._or_or_expression,
          "?",
          $._expression,
          ":",
          $._conditional_expression,
        ),
      ),

    // ---

    _or_or_expression: $ =>
      choice(
        $._and_and_expression,
        seq(
          $._or_or_expression,
          "||",
          $._and_and_expression,
        ),
      ),

    // ---

    _and_and_expression: $ =>
      choice(
        $._or_expression,
        seq(
          $._and_and_expression,
          "&&",
          $._or_expression,
        ),
      ),

    // ---

    _or_expression: $ =>
      choice(
        $._xor_expression,
        seq(
          $._or_expression,
          "|",
          $._xor_expression,
        ),
      ),

    // ---

    _xor_expression: $ =>
      choice(
        $._and_expression,
        seq(
          $._xor_expression,
          "^",
          $._and_expression,
        ),
      ),

    // ---

    _and_expression: $ =>
      choice(
        $._cmp_expression,
        seq(
          $._and_expression,
          "&",
          $._cmp_expression,
        ),
      ),

    // ---

    _cmp_expression: $ =>
      choice(
        $._shift_expression,
        $._equal_expression,
        $._identity_expression,
        $._rel_expression,
        $._in_expression,
      ),

    // ---

    _equal_expression: $ =>
      choice(
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

    _identity_expression: $ =>
      choice(
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

    _rel_expression: $ =>
      choice(
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

    _in_expression: $ =>
      choice(
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

    _shift_expression: $ =>
      choice(
        $._add_expression,
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

    _add_expression: $ =>
      choice(
        $._mul_expression,
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
        $._cat_expression,
      ),

    // ---

    _cat_expression: $ =>
      seq(
        $._add_expression,
        "~",
        $._mul_expression,
      ),

    // ---

    _mul_expression: $ =>
      choice(
        $._unary_expression,
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

    _unary_expression: $ =>
      choice(
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
        $._complement_expression,
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
        $._delete_expression,
        $._cast_expression,
        $._pow_expression,
      ),

    // ---

    _complement_expression: $ =>
      seq(
        "~",
        $._unary_expression,
      ),

    // ---

    _new_expression: $ =>
      choice(
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
        $._new_anon_class_expression,
      ),

    _allocator_arguments: $ =>
      seq(
        "(",
        optional(
          $._argument_list,
        ),
        ")",
      ),

    _argument_list: $ =>
      choice(
        $._assign_expression,
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

    _delete_expression: $ =>
      seq(
        "delete",
        $._unary_expression,
      ),

    // ---

    _cast_expression: $ =>
      choice(
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

    _pow_expression: $ =>
      choice(
        $._postfix_expression,
        seq(
          $._postfix_expression,
          "^^",
          $._unary_expression,
        ),
      ),

    // ---

    _postfix_expression: $ =>
      choice(
        $._primary_expression,
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
        $._index_expression,
        $._slice_expression,
      ),

    // ---

    _index_expression: $ =>
      seq(
        $._postfix_expression,
        "[",
        $._argument_list,
        "]",
      ),

    // ---

    _slice_expression: $ =>
      choice(
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

    _slice: $ =>
      choice(
        $._assign_expression,
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

    _primary_expression: $ =>
      choice(
        $._identifier,
        seq(
          ".",
          $._identifier,
        ),
        $._template_instance,
        seq(
          ".",
          $._template_instance,
        ),
        "this",
        "super",
        "null",
        "true",
        "false",
        "$",
        $._integer_literal,
        $._float_literal,
        $._character_literal,
        $._string_literals,
        $._array_literal,
        $._assoc_array_literal,
        $._function_literal,
        $._assert_expression,
        $._mixin_expression,
        $._import_expression,
        $._new_expression,
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
        $._typeof,
        $._typeid_expression,
        $._is_expression,
        seq(
          "(",
          $._expression,
          ")",
        ),
        $._special_keyword,
        $._traits_expression,
      ),

    // ---

    _string_literals: $ =>
      choice(
        $._string_literal,
        seq(
          $._string_literals,
          $._string_literal,
        ),
      ),

    // ---

    _array_literal: $ =>
      seq(
        "[",
        optional(
          $._argument_list,
        ),
        "]",
      ),

    // ---

    _assoc_array_literal: $ =>
      seq(
        "[",
        $._key_value_pairs,
        "]",
      ),

    _key_value_pairs: $ =>
      choice(
        $._key_value_pair,
        seq(
          $._key_value_pair,
          ",",
          $._key_value_pairs,
        ),
      ),

    _key_value_pair: $ =>
      seq(
        $._key_expression,
        ":",
        $._value_expression,
      ),

    _key_expression: $ =>
      $._assign_expression,

    _value_expression: $ =>
      $._assign_expression,

    // ---

    _function_literal: $ =>
      choice(
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
        $._function_literal_body,
        seq(
          $._identifier,
          "=>",
          $._assign_expression,
        ),
      ),

    _parameter_with_attributes: $ =>
      seq(
        $._parameters,
        optional(
          $._function_attributes,
        ),
      ),

    _parameter_with_member_attributes: $ =>
      seq(
        $._parameters,
        optional(
          $._member_function_attributes,
        ),
      ),

    _function_literal_body2: $ =>
      choice(
        seq(
          "=>",
          $._assign_expression,
        ),
        $._function_literal_body,
      ),

    // ---

    _assert_expression: $ =>
      seq(
        "assert (",
        $._assert_arguments,
        ")",
      ),

    _assert_arguments: $ =>
      choice(
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

    _mixin_expression: $ =>
      seq(
        "mixin (",
        $._argument_list,
        ")",
      ),

    // ---

    _import_expression: $ =>
      seq(
        "import (",
        $._assign_expression,
        ")",
      ),

    // ---

    _typeid_expression: $ =>
      choice(
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

    _is_expression: $ =>
      choice(
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

    _type_specialization: $ =>
      choice(
        $._type,
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

    _special_keyword: $ =>
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

    _statement: $ =>
      choice(
        ";",
        $._non_empty_statement,
        $._scope_block_statement,
      ),

    _no_scope_non_empty_statement: $ =>
      choice(
        $._non_empty_statement,
        $._block_statement,
      ),

    _no_scope_statement: $ =>
      choice(
        ";",
        $._non_empty_statement,
        $._block_statement,
      ),

    _non_empty_or_scope_block_statement: $ =>
      choice(
        $._non_empty_statement,
        $._scope_block_statement,
      ),

    _non_empty_statement: $ =>
      choice(
        $._non_empty_statement_no_case_no_default,
        $._case_statement,
        $._case_range_statement,
        $._default_statement,
      ),

    _non_empty_statement_no_case_no_default: $ =>
      choice(
        $._labeled_statement,
        $._expression_statement,
        $._declaration_statement,
        $._if_statement,
        $._while_statement,
        $._do_statement,
        $._for_statement,
        $._foreach_statement,
        $._switch_statement,
        $._final_switch_statement,
        $._continue_statement,
        $._break_statement,
        $._return_statement,
        $._goto_statement,
        $._with_statement,
        $._synchronized_statement,
        $._try_statement,
        $._scope_guard_statement,
        $._throw_statement,
        $._asm_statement,
        $._mixin_statement,
        $._foreach_range_statement,
        $._pragma_statement,
        $._conditional_statement,
        $._static_foreach_statement,
        $._static_assert,
        $._template_mixin,
        $._import_declaration,
      ),

    // ---

    _scope_statement: $ =>
      choice(
        $._non_empty_statement,
        $._block_statement,
      ),

    // ---

    _scope_block_statement: $ =>
      $._block_statement,

    // ---

    _labeled_statement: $ =>
      choice(
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

    _block_statement: $ =>
      choice(
        "{ }",
        seq(
          "{",
          $._statement_list,
          "}",
        ),
      ),

    _statement_list: $ =>
      choice(
        $._statement,
        seq(
          $._statement,
          $._statement_list,
        ),
      ),

    // ---

    _expression_statement: $ =>
      seq(
        $._expression,
        ";",
      ),

    // ---

    _declaration_statement: $ =>
      seq(
        optional(
          $._storage_classes,
        ),
        $._declaration,
      ),

    // ---

    _if_statement: $ =>
      choice(
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

    _if_condition: $ =>
      choice(
        $._expression,
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

    _then_statement: $ =>
      $._scope_statement,

    _else_statement: $ =>
      $._scope_statement,

    // ---

    _while_statement: $ =>
      seq(
        "while (",
        $._if_condition,
        ")",
        $._scope_statement,
      ),

    // ---

    _do_statement: $ =>
      seq(
        "do",
        $._scope_statement,
        " while (",
        $._expression,
        ")",
        ";",
      ),

    // ---

    _for_statement: $ =>
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

    _initialize: $ =>
      choice(
        ";",
        $._no_scope_non_empty_statement,
      ),

    _test: $ =>
      $._expression,

    _increment: $ =>
      $._expression,

    // ---

    _aggregate_foreach: $ =>
      seq(
        $._foreach,
        "(",
        $._foreach_type_list,
        ";",
        $._foreach_aggregate,
        ")",
      ),

    _foreach_statement: $ =>
      seq(
        $._aggregate_foreach,
        $._no_scope_non_empty_statement,
      ),

    _foreach: $ =>
      choice(
        "foreach",
        "foreach_reverse",
      ),

    _foreach_type_list: $ =>
      choice(
        $._foreach_type,
        seq(
          $._foreach_type,
          ",",
          $._foreach_type_list,
        ),
      ),

    _foreach_type: $ =>
      choice(
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

    _foreach_type_attributes: $ =>
      choice(
        $._foreach_type_attribute,
        seq(
          $._foreach_type_attribute,
          optional(
            $._foreach_type_attributes,
          ),
        ),
      ),

    _foreach_type_attribute: $ =>
      choice(
        "ref",
        $._type_ctor,
        "enum",
      ),

    _foreach_aggregate: $ =>
      $._expression,

    // ---

    _range_foreach: $ =>
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

    _lwr_expression: $ =>
      $._expression,

    _upr_expression: $ =>
      $._expression,

    _foreach_range_statement: $ =>
      seq(
        $._range_foreach,
        $._scope_statement,
      ),

    // ---

    _switch_statement: $ =>
      seq(
        "switch (",
        $._expression,
        ")",
        $._scope_statement,
      ),

    _case_statement: $ =>
      seq(
        "case",
        $._argument_list,
        ":",
        $._scope_statement_list,
      ),

    _case_range_statement: $ =>
      seq(
        "case",
        $._first_exp,
        ": .. case",
        $._last_exp,
        ":",
        $._scope_statement_list,
      ),

    _first_exp: $ =>
      $._assign_expression,

    _last_exp: $ =>
      $._assign_expression,

    _default_statement: $ =>
      seq(
        "default :",
        $._scope_statement_list,
      ),

    _scope_statement_list: $ =>
      $._statement_list_no_case_no_default,

    _statement_list_no_case_no_default: $ =>
      choice(
        $._statement_no_case_no_default,
        seq(
          $._statement_no_case_no_default,
          $._statement_list_no_case_no_default,
        ),
      ),

    _statement_no_case_no_default: $ =>
      choice(
        ";",
        $._non_empty_statement_no_case_no_default,
        $._scope_block_statement,
      ),

    // ---

    _final_switch_statement: $ =>
      seq(
        "final switch (",
        $._expression,
        ")",
        $._scope_statement,
      ),

    // ---

    _continue_statement: $ =>
      seq(
        "continue",
        optional(
          $._identifier,
        ),
        ";",
      ),

    // ---

    _break_statement: $ =>
      seq(
        "break",
        optional(
          $._identifier,
        ),
        ";",
      ),

    // ---

    _return_statement: $ =>
      seq(
        "return",
        optional(
          $._expression,
        ),
        ";",
      ),

    // ---

    _goto_statement: $ =>
      choice(
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

    _with_statement: $ =>
      choice(
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

    _synchronized_statement: $ =>
      choice(
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

    _try_statement: $ =>
      choice(
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

    _catches: $ =>
      choice(
        $._catch,
        seq(
          $._catch,
          $._catches,
        ),
      ),

    _catch: $ =>
      seq(
        "catch (",
        $._catch_parameter,
        ")",
        $._no_scope_non_empty_statement,
      ),

    _catch_parameter: $ =>
      seq(
        $._basic_type,
        optional(
          $._identifier,
        ),
      ),

    _finally_statement: $ =>
      seq(
        "finally",
        $._no_scope_non_empty_statement,
      ),

    // ---

    _throw_statement: $ =>
      seq(
        "throw",
        $._expression,
        ";",
      ),

    // ---

    _scope_guard_statement: $ =>
      choice(
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

    _asm_statement: $ =>
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

    _asm_instruction_list: $ =>
      choice(
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

    _mixin_statement: $ =>
      seq(
        "mixin",
        "(",
        $._argument_list,
        ")",
        ";",
      ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/struct.html
    // ------------------------------------------------------------------------

    _aggregate_declaration: $ =>
      choice(
        $._class_declaration,
        $._interface_declaration,
        $._struct_declaration,
        $._union_declaration,
      ),

    _struct_declaration: $ =>
      choice(
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
        $._struct_template_declaration,
        $._anon_struct_declaration,
      ),

    _anon_struct_declaration: $ =>
      seq(
        "struct",
        $._aggregate_body,
      ),

    _union_declaration: $ =>
      choice(
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
        $._union_template_declaration,
        $._anon_union_declaration,
      ),

    _anon_union_declaration: $ =>
      seq(
        "union",
        $._aggregate_body,
      ),

    _aggregate_body: $ =>
      seq(
        "{",
        optional(
          $._decl_defs,
        ),
        "}",
      ),

    // ---

    _postblit: $ =>
      choice(
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

    _struct_invariant: $ =>
      choice(
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

    _class_declaration: $ =>
      choice(
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
        $._class_template_declaration,
      ),

    _base_class_list: $ =>
      choice(
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

    _super_class: $ =>
      $._basic_type,

    _interfaces: $ =>
      choice(
        $._interface,
        seq(
          $._interface,
          ",",
          $._interfaces,
        ),
      ),

    _interface: $ =>
      $._basic_type,

    // ---

    _constructor: $ =>
      choice(
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
        $._constructor_template,
      ),

    // ---

    _destructor: $ =>
      choice(
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

    _static_constructor: $ =>
      choice(
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

    _static_destructor: $ =>
      choice(
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

    _shared_static_constructor: $ =>
      choice(
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

    _shared_static_destructor: $ =>
      choice(
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

    _class_invariant: $ =>
      choice(
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

    _allocator: $ =>
      choice(
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

    _deallocator: $ =>
      choice(
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

    _alias_this: $ =>
      seq(
        "alias",
        $._identifier,
        "this ;",
      ),

    // ---

    _new_anon_class_expression: $ =>
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

    _constructor_args: $ =>
      seq(
        "(",
        optional(
          $._argument_list,
        ),
        ")",
      ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/interface.html
    // ------------------------------------------------------------------------

    _interface_declaration: $ =>
      choice(
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
        $._interface_template_declaration,
      ),

    _base_interface_list: $ =>
      seq(
        ":",
        $._interfaces,
      ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/enum.html
    // ------------------------------------------------------------------------

    _enum_declaration: $ =>
      choice(
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
        $._anonymous_enum_declaration,
      ),

    _enum_base_type: $ =>
      $._type,

    _enum_body: $ =>
      choice(
        seq(
          "{",
          $._enum_members,
          "}",
        ),
        ";",
      ),

    _enum_members: $ =>
      choice(
        $._enum_member,
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

    _enum_member_attributes: $ =>
      choice(
        $._enum_member_attribute,
        seq(
          $._enum_member_attribute,
          $._enum_member_attributes,
        ),
      ),

    _enum_member_attribute: $ =>
      choice(
        $._deprecated_attribute,
        $._user_defined_attribute,
        seq(
          "@",
          "disable",
        ),
      ),

    _enum_member: $ =>
      choice(
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

    _anonymous_enum_declaration: $ =>
      choice(
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

    _anonymous_enum_members: $ =>
      choice(
        $._anonymous_enum_member,
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

    _anonymous_enum_member: $ =>
      choice(
        $._enum_member,
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

    _func_declaration: $ =>
      choice(
        seq(
          optional(
            $._storage_classes,
          ),
          $._basic_type,
          $._func_declarator,
          $._function_body,
        ),
        $._auto_func_declaration,
      ),

    _auto_func_declaration: $ =>
      seq(
        $._storage_classes,
        $._identifier,
        $._func_declarator_suffix,
        $._function_body,
      ),

    _func_declarator: $ =>
      seq(
        optional(
          $._type_suffixes,
        ),
        $._identifier,
        $._func_declarator_suffix,
      ),

    _func_declarator_suffix: $ =>
      choice(
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

    _parameters: $ =>
      seq(
        "(",
        optional(
          $._parameter_list,
        ),
        ")",
      ),

    _parameter_list: $ =>
      choice(
        $._parameter,
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

    _parameter: $ =>
      choice(
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

    _parameter_attributes: $ =>
      choice(
        $._in_out,
        $._user_defined_attribute,
        seq(
          $._parameter_attributes,
          $._in_out,
        ),
        seq(
          $._parameter_attributes,
          $._user_defined_attribute,
        ),
        $._parameter_attributes,
      ),

    _in_out: $ =>
      choice(
        "auto",
        $._type_ctor,
        "final",
        "in",
        "lazy",
        "out",
        "ref",
        "return ref",
        "scope",
      ),

    _variadic_arguments_attributes: $ =>
      choice(
        $._variadic_arguments_attribute,
        seq(
          $._variadic_arguments_attribute,
          $._variadic_arguments_attributes,
        ),
      ),

    _variadic_arguments_attribute: $ =>
      choice(
        "const",
        "immutable",
        "return",
        "scope",
        "shared",
      ),

    // ---

    _function_attributes: $ =>
      choice(
        $._function_attribute,
        seq(
          $._function_attribute,
          $._function_attributes,
        ),
      ),

    _function_attribute: $ =>
      choice(
        $._function_attribute_kwd,
        $._property,
      ),

    _member_function_attributes: $ =>
      choice(
        $._member_function_attribute,
        seq(
          $._member_function_attribute,
          $._member_function_attributes,
        ),
      ),

    _member_function_attribute: $ =>
      choice(
        "const",
        "immutable",
        "inout",
        "return",
        "shared",
        $._function_attribute,
      ),

    // ---

    _function_body: $ =>
      choice(
        $._specified_function_body,
        $._missing_function_body,
        $._shortened_function_body,
      ),

    _function_literal_body: $ =>
      $._specified_function_body,

    _specified_function_body: $ =>
      choice(
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

    _missing_function_body: $ =>
      choice(
        ";",
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

    _shortened_function_body: $ =>
      seq(
        "=>",
        $._assign_expression,
        ";",
      ),

    // ---

    _function_contracts: $ =>
      choice(
        $._function_contract,
        seq(
          $._function_contract,
          $._function_contracts,
        ),
      ),

    _function_contract: $ =>
      choice(
        $._in_out_contract_expression,
        $._in_out_statement,
      ),

    _in_out_contract_expression: $ =>
      choice(
        $._in_contract_expression,
        $._out_contract_expression,
      ),

    _in_out_statement: $ =>
      choice(
        $._in_statement,
        $._out_statement,
      ),

    _in_contract_expression: $ =>
      seq(
        "in (",
        $._assert_arguments,
        ")",
      ),

    _out_contract_expression: $ =>
      choice(
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

    _in_statement: $ =>
      seq(
        "in",
        $._block_statement,
      ),

    _out_statement: $ =>
      choice(
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

    _template_declaration: $ =>
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

    _template_parameters: $ =>
      seq(
        "(",
        optional(
          $._template_parameter_list,
        ),
        ")",
      ),

    _template_parameter_list: $ =>
      choice(
        $._template_parameter,
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

    _template_parameter: $ =>
      choice(
        $._template_type_parameter,
        $._template_value_parameter,
        $._template_alias_parameter,
        $._template_sequence_parameter,
        $._template_this_parameter,
      ),

    // ---

    _template_instance: $ =>
      seq(
        $._identifier,
        $._template_arguments,
      ),

    _template_arguments: $ =>
      choice(
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

    _template_argument_list: $ =>
      choice(
        $._template_argument,
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

    _template_argument: $ =>
      choice(
        $._type,
        $._assign_expression,
        $._symbol,
      ),

    _symbol: $ =>
      choice(
        $._symbol_tail,
        seq(
          ".",
          $._symbol_tail,
        ),
      ),

    _symbol_tail: $ =>
      choice(
        $._identifier,
        seq(
          $._identifier,
          ".",
          $._symbol_tail,
        ),
        $._template_instance,
        seq(
          $._template_instance,
          ".",
          $._symbol_tail,
        ),
      ),

    _template_single_argument: $ =>
      choice(
        $._identifier,
        $._fundamental_type,
        $._character_literal,
        $._string_literal,
        $._integer_literal,
        $._float_literal,
        "true",
        "false",
        "null",
        "this",
        $._special_keyword,
      ),

    // ---

    _template_type_parameter: $ =>
      choice(
        $._identifier,
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

    _template_type_parameter_specialization: $ =>
      seq(
        ":",
        $._type,
      ),

    _template_type_parameter_default: $ =>
      seq(
        "=",
        $._type,
      ),

    // ---

    _template_this_parameter: $ =>
      seq(
        "this",
        $._template_type_parameter,
      ),

    // ---

    _template_value_parameter: $ =>
      choice(
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

    _template_value_parameter_specialization: $ =>
      seq(
        ":",
        $._conditional_expression,
      ),

    _template_value_parameter_default: $ =>
      choice(
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

    _template_alias_parameter: $ =>
      choice(
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

    _template_alias_parameter_specialization: $ =>
      choice(
        seq(
          ":",
          $._type,
        ),
        seq(
          ":",
          $._conditional_expression,
        ),
      ),

    _template_alias_parameter_default: $ =>
      choice(
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

    _template_sequence_parameter: $ =>
      seq(
        $._identifier,
        "...",
      ),

    // ---

    _constructor_template: $ =>
      choice(
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

    _class_template_declaration: $ =>
      choice(
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

    _interface_template_declaration: $ =>
      choice(
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

    _struct_template_declaration: $ =>
      choice(
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

    _union_template_declaration: $ =>
      choice(
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

    _constraint: $ =>
      seq(
        "if",
        "(",
        $._expression,
        ")",
      ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/template-mixin.html
    // ------------------------------------------------------------------------

    _template_mixin_declaration: $ =>
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

    _template_mixin: $ =>
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

    _mixin_template_name: $ =>
      choice(
        seq(
          ".",
          $._mixin_qualified_identifier,
        ),
        $._mixin_qualified_identifier,
        seq(
          $._typeof,
          ".",
          $._mixin_qualified_identifier,
        ),
      ),

    _mixin_qualified_identifier: $ =>
      choice(
        $._identifier,
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

    _conditional_declaration: $ =>
      choice(
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

    _conditional_statement: $ =>
      choice(
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

    _condition: $ =>
      choice(
        $._version_condition,
        $._debug_condition,
        $._static_if_condition,
      ),

    // ---

    _version_condition: $ =>
      choice(
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

    _version_specification: $ =>
      choice(
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

    _debug_condition: $ =>
      choice(
        "debug",
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

    _debug_specification: $ =>
      choice(
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

    _static_if_condition: $ =>
      seq(
        "static if (",
        $._assign_expression,
        ")",
      ),

    // ---

    _static_foreach: $ =>
      choice(
        seq(
          "static",
          $._aggregate_foreach,
        ),
        seq(
          "static",
          $._range_foreach,
        ),
      ),

    _static_foreach_declaration: $ =>
      choice(
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

    _static_foreach_statement: $ =>
      seq(
        $._static_foreach,
        $._no_scope_non_empty_statement,
      ),

    // ---

    _static_assert: $ =>
      seq(
        "static assert (",
        $._assert_arguments,
        ");",
      ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/traits.html
    // ------------------------------------------------------------------------

    _traits_expression: $ =>
      seq(
        "__traits",
        "(",
        $._traits_keyword,
        ",",
        $._traits_arguments,
        ")",
      ),

    _traits_keyword: $ =>
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

    _traits_arguments: $ =>
      choice(
        $._traits_argument,
        seq(
          $._traits_argument,
          ",",
          $._traits_arguments,
        ),
      ),

    _traits_argument: $ =>
      choice(
        $._assign_expression,
        $._type,
      ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/unittest.html
    // ------------------------------------------------------------------------

    _unit_test: $ =>
      seq(
        "unittest",
        $._block_statement,
      ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/iasm.html
    // ------------------------------------------------------------------------

    _asm_instruction: $ =>
      choice(
        seq(
          $._identifier,
          ":",
          $._asm_instruction,
        ),
        seq(
          "align",
          $._integer_expression,
        ),
        "even",
        "naked",
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
        $._opcode,
        seq(
          $._opcode,
          $._operands,
        ),
      ),

    _opcode: $ =>
      $._identifier,

    _operands: $ =>
      choice(
        $._operand,
        seq(
          $._operand,
          ",",
          $._operands,
        ),
      ),

    // ---

    _integer_expression: $ =>
      choice(
        $._integer_literal,
        $._identifier,
      ),

    // ---

    _register: $ =>
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

    _register64: $ =>
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

    _operand: $ =>
      $._asm_exp,

    _asm_exp: $ =>
      choice(
        $._asm_log_or_exp,
        seq(
          $._asm_log_or_exp,
          "?",
          $._asm_exp,
          ":",
          $._asm_exp,
        ),
      ),

    _asm_log_or_exp: $ =>
      choice(
        $._asm_log_and_exp,
        seq(
          $._asm_log_or_exp,
          "||",
          $._asm_log_and_exp,
        ),
      ),

    _asm_log_and_exp: $ =>
      choice(
        $._asm_or_exp,
        seq(
          $._asm_log_and_exp,
          "&&",
          $._asm_or_exp,
        ),
      ),

    _asm_or_exp: $ =>
      choice(
        $._asm_xor_exp,
        seq(
          $._asm_or_exp,
          "|",
          $._asm_xor_exp,
        ),
      ),

    _asm_xor_exp: $ =>
      choice(
        $._asm_and_exp,
        seq(
          $._asm_xor_exp,
          "^",
          $._asm_and_exp,
        ),
      ),

    _asm_and_exp: $ =>
      choice(
        $._asm_equal_exp,
        seq(
          $._asm_and_exp,
          "&",
          $._asm_equal_exp,
        ),
      ),

    _asm_equal_exp: $ =>
      choice(
        $._asm_rel_exp,
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

    _asm_rel_exp: $ =>
      choice(
        $._asm_shift_exp,
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

    _asm_shift_exp: $ =>
      choice(
        $._asm_add_exp,
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

    _asm_add_exp: $ =>
      choice(
        $._asm_mul_exp,
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

    _asm_mul_exp: $ =>
      choice(
        $._asm_br_exp,
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

    _asm_br_exp: $ =>
      choice(
        $._asm_una_exp,
        seq(
          $._asm_br_exp,
          "[",
          $._asm_exp,
          "]",
        ),
      ),

    _asm_una_exp: $ =>
      choice(
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
        $._asm_primary_exp,
      ),

    _asm_primary_exp: $ =>
      choice(
        $._integer_literal,
        $._float_literal,
        "__LOCAL_SIZE",
        "$",
        $._register,
        seq(
          $._register,
          ":",
          $._asm_exp,
        ),
        $._register64,
        seq(
          $._register64,
          ":",
          $._asm_exp,
        ),
        $._dot_identifier,
        "this",
      ),

    _dot_identifier: $ =>
      choice(
        $._identifier,
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

    _asm_type_prefix: $ =>
      choice(
        "near ptr",
        "far ptr",
        "word ptr",
        "dword ptr",
        "qword ptr",
        seq(
          $._fundamental_type,
          "ptr",
        ),
      ),

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/entity.html
    // ------------------------------------------------------------------------

    _named_character_entity: $ =>
      seq(
        "&",
        $._identifier,
        ";",
      ),
  }
});
