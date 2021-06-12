module.exports = grammar({
  name: 'd',

  word: $ => $.identifier,

  extras: $ => [
    $._white_space,
    $._end_of_line,
    $.comment,
    $.special_token_sequence,
  ],

  conflicts: $ => [
    // These are probably correct:

    // CaseStatement / CaseRangeStatement disambiguation requires lookahead:
    [$.argument_list, $._first_exp],

    // ---------------------------
    // TODO review grammar:

    [$.qualified_identifier],

    [$.storage_class, $.attribute],
    [$.storage_class, $.enum_declaration],
    [$.storage_class, $.function_attribute_kwd],
    [$.storage_class, $.at_attribute],
    [$.storage_class, $.type_ctor],
    [$.storage_class, $.type_ctor, $.attribute],
    [$.storage_class, $.attribute, $.synchronized_statement],

    [$.attribute, $.storage_class, $.shared_static_constructor, $.shared_static_destructor],
    [$.attribute, $.static_destructor],
    [$.attribute, $.import_declaration],
    [$.attribute, $.static_constructor],
    [$.attribute, $._module_attribute],
    [$.at_attribute, $._module_attribute],
    [$.attribute, $.synchronized_statement],

    [$._decl_def, $._declaration],
    [$.alias_assignment, $.qualified_identifier],
    [$.template_instance, $.mixin_qualified_identifier],

    [$.auto_assignment, $.qualified_identifier, $.auto_func_declaration],
    [$.var_declarator, $.func_declarator],

    [$.primary_expression, $.qualified_identifier],
    [$.primary_expression, $.qualified_identifier, $.symbol_tail],
    [$.primary_expression, $.template_instance],
    [$.primary_expression, $.basic_type],

    [$.type_ctor, $.variadic_arguments_attribute],
    [$.in_out, $.variadic_arguments_attribute],
    [$.parameter, $.parameter_attributes],
    [$.parameter_attributes],

    [$.enum_members, $.anonymous_enum_member],

    [$.storage_class, $.synchronized_statement],

    [$._declaration, $._non_empty_statement_no_case_no_default], // ???

    [$.qualified_identifier, $.template_sequence_parameter],
    [$.qualified_identifier, $.template_type_parameter],
    [$.qualified_identifier, $.template_instance],

    [$.unary_expression, $.parameter],

    [$.new_expression],
    [$.type],
    [$.basic_type],

    [$.attribute, $.pragma_statement],

    [$.attribute, $.return_statement],

    [$.primary_expression, $.postblit, $.constructor, $.constructor_template],

    // TODO fix grammar?
    [$._decl_def, $._declaration_statement],
    [$._decl_def, $._non_empty_statement_no_case_no_default],
    [$._decl_def, $._non_empty_statement_no_case_no_default, $._declaration],

    [$.foreach_type_list, $.range_foreach], // TODO fix grammar
    [$.foreach_type_attributes],

    [$.parameter, $.template_value_parameter],

    [$.conditional_declaration], // TODO else precedence

    [$.assign_expression], // TODO precedence
    [$.conditional_expression, $.or_or_expression], // TODO precedence
    [$.conditional_expression], // TODO precedence
    [$.or_or_expression, $.and_and_expression], // TODO precedence
    [$.and_and_expression, $.or_expression], // TODO precedence

    // TODO review these
    [$.or_expression, $.xor_expression],
    [$.xor_expression, $.and_expression],
    [$._cmp_expression, $.rel_expression, $.shift_expression],
    [$._cmp_expression, $.rel_expression],
    [$._cmp_expression, $.identity_expression, $.in_expression],
    [$._cmp_expression, $.equal_expression],
    [$._cmp_expression, $.in_expression],
    [$._cmp_expression, $.identity_expression],
    [$.shift_expression, $.add_expression],
    [$.shift_expression, $.cat_expression],
    [$.add_expression, $.mul_expression],
    [$.pow_expression, $.postfix_expression],
    [$.pow_expression, $.index_expression, $.slice_expression],
    [$.pow_expression],
    [$._super_class_or_interface, $._interface],
    [$.postfix_expression, $.template_instance],
    [$.argument_list, $.slice],
    [$.primary_expression, $.symbol_tail],
    [$.primary_expression, $.with_statement, $.symbol_tail],
    [$.type_suffix, $.unary_expression],
    [$.alt_declarator_inner, $.qualified_identifier, $.primary_expression],
    [$.alt_declarator_inner, $.primary_expression],
    [$.alt_declarator, $.qualified_identifier, $.primary_expression],
    [$.specified_function_body, $.missing_function_body],
    [$.primary_expression, $.destructor],
    [$.declaration_block, $.block_statement],
    [$.parameter_with_member_attributes, $.deallocator],
    [$.conditional_statement],
    [$.static_constructor, $.missing_function_body],
    [$.postblit, $.missing_function_body],
    [$.array_initializer, $.array_literal],
    [$._exp_initializer, $.argument_list],
    [$.array_member_initialization, $._key_expression],
    [$.struct_initializer, $.block_statement],
    [$._exp_initializer, $.comma_expression],
    [$.mixin_type, $.mixin_expression],
    [$.qualified_identifier, $.symbol_tail],
    [$.asm_rel_exp, $.asm_shift_exp],
    [$.mixin_expression, $.mixin_statement],
    [$.primary_expression, $.synchronized_statement],
    [$.try_statement],
    [$.type_suffix, $.array_literal],
    [$.type_suffix, $.argument_list],
    [$.shared_static_constructor, $.missing_function_body],
    [$.static_destructor, $.missing_function_body],
    [$.parameter, $.template_value_parameter_default],
    [$.primary_expression, $.template_value_parameter_default],
    [$.unary_expression, $.template_instance],
    [$.rel_expression, $.shift_expression],
    [$.equal_expression, $.shift_expression],
    [$.in_expression, $.shift_expression],
    [$.identity_expression, $.shift_expression],
    [$.cat_expression, $.mul_expression],
    [$.slice],
    [$.asm_exp, $.asm_log_or_exp],
    [$.asm_exp],
    [$.asm_log_or_exp, $.asm_log_and_exp],
    [$.asm_log_and_exp, $.asm_or_exp],
    [$.asm_or_exp, $.asm_xor_exp],
    [$.asm_xor_exp, $.asm_and_exp],
    [$.asm_and_exp, $.asm_equal_exp],
    [$.asm_equal_exp, $.asm_rel_exp],
    [$.asm_shift_exp, $.asm_add_exp],
    [$.asm_add_exp, $.asm_mul_exp],
    [$.asm_mul_exp, $.asm_br_exp],
    [$.mixin_declaration, $.mixin_expression, $.mixin_statement],
    [$.shared_static_destructor, $.missing_function_body],
    [$.asm_primary_exp],
    [$.if_statement],
    [$.mixin_declaration, $.mixin_statement],
    [$.alt_declarator_suffix, $.qualified_identifier],

    [$.storage_classes],
    [$.type_ctors],
    [$.type_ctors, $.in_out],
    [$.function_contracts],
    [$.decl_defs],
    [$.type_suffixes],
    [$.statement_list_no_case_no_default],
    [$.catches],

    [$.pragma_statement, $.empty_statement],
    [$.empty_declaration, $.empty_statement],

    [$.static_foreach_declaration],
    [$.debug_condition],
    [$._scope_block_statement, $._function_literal_body],
    [$.labeled_statement],
    [$._scope_statement, $._function_literal_body],
    [$._no_scope_statement, $._function_literal_body],
    [$._no_scope_non_empty_statement, $._function_literal_body],
    [$.struct_member_initializer, $.labeled_statement],
  ],

  rules: {

    // ------------------------------------------------------------------------
    // https://dlang.org/spec/lex.html
    // ------------------------------------------------------------------------

    source_file: $ =>
      choice(
        seq(
          $.byte_order_mark,
          optional(
            $.module,
          ),
        ),
        seq(
          $.shebang,
          optional(
            $.module,
          ),
        ),
        optional(
          $.module,
        ),
      ),

    // ---

    byte_order_mark: $ =>
      token(
        // ByteOrderMark
        "\uFEFF",
      ),

    shebang: $ =>
      token(
        // Shebang
        seq(
          "#!",
          optional(
            // Characters
            repeat1(
              // Character
              /[\s\S]/,
            ),
          ),
          // EndOfShebang
          choice(
            "\n",
            // EndOfFile
            choice(
              // /$/m,
              "\0",
              "\x1A",
            ),
          ),
        ),
      ),

    // ---

    _end_of_line: $ =>
      token(
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
            // /$/m,
            "\0",
            "\x1A",
          ),
        ),
      ),

    // ---

    _white_space: $ =>
      token(
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
      ),

    // ---

    comment: $ =>
      token(
        // Comment
        choice(
          // BlockComment
          seq(
            "/*",
            optional(
              // Characters
              repeat1(
                // Character
                /[\s\S]/,
              ),
            ),
            "*/",
          ),
          // LineComment
          seq(
            "//",
            optional(
              // Characters
              repeat1(
                // Character
                /[\s\S]/,
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
                // /$/m,
                "\0",
                "\x1A",
              ),
            ),
          ),
          // NestingBlockComment
          seq(
            "/+",
            optional(
              // NestingBlockCommentCharacters
              repeat1(
                // NestingBlockCommentCharacter
                choice(
                  // Character
                  /[\s\S]/,
                  // /* recursion */, // TODO
                ),
              ),
            ),
            "+/",
          ),
        ),
      ),

    // ---

    token_no_braces: $ =>
      choice(
        $.identifier,
        $._string_literal,
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
            /[A-Za-z]/,
            /[\u00aa\u00b5\u00b7\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u01f5\u01fa-\u0217\u0250-\u02a8\u02b0-\u02b8\u02bb\u02bd-\u02c1\u02d0-\u02d1\u02e0-\u02e4\u037a\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03ce\u03d0-\u03d6\u03da\u03dc\u03de\u03e0\u03e2-\u03f3\u0401-\u040c\u040e-\u044f\u0451-\u045c\u045e-\u0481\u0490-\u04c4\u04c7-\u04c8\u04cb-\u04cc\u04d0-\u04eb\u04ee-\u04f5\u04f8-\u04f9\u0531-\u0556\u0559\u0561-\u0587\u05b0-\u05b9\u05bb-\u05bd\u05bf\u05c1-\u05c2\u05d0-\u05ea\u05f0-\u05f2\u0621-\u063a\u0640-\u0652\u0660-\u0669\u0670-\u06b7\u06ba-\u06be\u06c0-\u06ce\u06d0-\u06dc\u06e5-\u06e8\u06ea-\u06ed\u06f0-\u06f9\u0901-\u0903\u0905-\u0939\u093d-\u094d\u0950-\u0952\u0958-\u0963\u0966-\u096f\u0981-\u0983\u0985-\u098c\u098f-\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09be-\u09c4\u09c7-\u09c8\u09cb-\u09cd\u09dc-\u09dd\u09df-\u09e3\u09e6-\u09f1\u0a02\u0a05-\u0a0a\u0a0f-\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32-\u0a33\u0a35-\u0a36\u0a38-\u0a39\u0a3e-\u0a42\u0a47-\u0a48\u0a4b-\u0a4d\u0a59-\u0a5c\u0a5e\u0a66-\u0a6f\u0a74\u0a81-\u0a83\u0a85-\u0a8b\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2-\u0ab3\u0ab5-\u0ab9\u0abd-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ad0\u0ae0\u0ae6-\u0aef\u0b01-\u0b03\u0b05-\u0b0c\u0b0f-\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32-\u0b33\u0b36-\u0b39\u0b3d-\u0b43\u0b47-\u0b48\u0b4b-\u0b4d\u0b5c-\u0b5d\u0b5f-\u0b61\u0b66-\u0b6f\u0b82-\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99-\u0b9a\u0b9c\u0b9e-\u0b9f\u0ba3-\u0ba4\u0ba8-\u0baa\u0bae-\u0bb5\u0bb7-\u0bb9\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0be7-\u0bef\u0c01-\u0c03\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3e-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c60-\u0c61\u0c66-\u0c6f\u0c82-\u0c83\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cde\u0ce0-\u0ce1\u0ce6-\u0cef\u0d02-\u0d03\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d28\u0d2a-\u0d39\u0d3e-\u0d43\u0d46-\u0d48\u0d4a-\u0d4d\u0d60-\u0d61\u0d66-\u0d6f\u0e01-\u0e3a\u0e40-\u0e5b\u0e81-\u0e82\u0e84\u0e87-\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa-\u0eab\u0ead-\u0eae\u0eb0-\u0eb9\u0ebb-\u0ebd\u0ec0-\u0ec4\u0ec6\u0ec8-\u0ecd\u0ed0-\u0ed9\u0edc-\u0edd\u0f00\u0f18-\u0f19\u0f20-\u0f33\u0f35\u0f37\u0f39\u0f3e-\u0f47\u0f49-\u0f69\u0f71-\u0f84\u0f86-\u0f8b\u0f90-\u0f95\u0f97\u0f99-\u0fad\u0fb1-\u0fb7\u0fb9\u10a0-\u10c5\u10d0-\u10f6\u1e00-\u1e9b\u1ea0-\u1ef9\u1f00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u203f-\u2040\u207f\u2102\u2107\u210a-\u2113\u2115\u2118-\u211d\u2124\u2126\u2128\u212a-\u2131\u2133-\u2138\u2160-\u2182\u3005-\u3007\u3021-\u3029\u3041-\u3093\u309b-\u309c\u30a1-\u30f6\u30fb-\u30fc\u3105-\u312c\u4e00-\u9fa5\uac00-\ud7a3]/,
          ),
          optional(
            // IdentifierChars
            repeat1(
              // IdentifierChar
              choice(
                // IdentifierStart
                choice(
                  "_",
                  /[A-Za-z]/,
                  /[\u00aa\u00b5\u00b7\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u01f5\u01fa-\u0217\u0250-\u02a8\u02b0-\u02b8\u02bb\u02bd-\u02c1\u02d0-\u02d1\u02e0-\u02e4\u037a\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03ce\u03d0-\u03d6\u03da\u03dc\u03de\u03e0\u03e2-\u03f3\u0401-\u040c\u040e-\u044f\u0451-\u045c\u045e-\u0481\u0490-\u04c4\u04c7-\u04c8\u04cb-\u04cc\u04d0-\u04eb\u04ee-\u04f5\u04f8-\u04f9\u0531-\u0556\u0559\u0561-\u0587\u05b0-\u05b9\u05bb-\u05bd\u05bf\u05c1-\u05c2\u05d0-\u05ea\u05f0-\u05f2\u0621-\u063a\u0640-\u0652\u0660-\u0669\u0670-\u06b7\u06ba-\u06be\u06c0-\u06ce\u06d0-\u06dc\u06e5-\u06e8\u06ea-\u06ed\u06f0-\u06f9\u0901-\u0903\u0905-\u0939\u093d-\u094d\u0950-\u0952\u0958-\u0963\u0966-\u096f\u0981-\u0983\u0985-\u098c\u098f-\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09be-\u09c4\u09c7-\u09c8\u09cb-\u09cd\u09dc-\u09dd\u09df-\u09e3\u09e6-\u09f1\u0a02\u0a05-\u0a0a\u0a0f-\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32-\u0a33\u0a35-\u0a36\u0a38-\u0a39\u0a3e-\u0a42\u0a47-\u0a48\u0a4b-\u0a4d\u0a59-\u0a5c\u0a5e\u0a66-\u0a6f\u0a74\u0a81-\u0a83\u0a85-\u0a8b\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2-\u0ab3\u0ab5-\u0ab9\u0abd-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ad0\u0ae0\u0ae6-\u0aef\u0b01-\u0b03\u0b05-\u0b0c\u0b0f-\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32-\u0b33\u0b36-\u0b39\u0b3d-\u0b43\u0b47-\u0b48\u0b4b-\u0b4d\u0b5c-\u0b5d\u0b5f-\u0b61\u0b66-\u0b6f\u0b82-\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99-\u0b9a\u0b9c\u0b9e-\u0b9f\u0ba3-\u0ba4\u0ba8-\u0baa\u0bae-\u0bb5\u0bb7-\u0bb9\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0be7-\u0bef\u0c01-\u0c03\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3e-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c60-\u0c61\u0c66-\u0c6f\u0c82-\u0c83\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cde\u0ce0-\u0ce1\u0ce6-\u0cef\u0d02-\u0d03\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d28\u0d2a-\u0d39\u0d3e-\u0d43\u0d46-\u0d48\u0d4a-\u0d4d\u0d60-\u0d61\u0d66-\u0d6f\u0e01-\u0e3a\u0e40-\u0e5b\u0e81-\u0e82\u0e84\u0e87-\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa-\u0eab\u0ead-\u0eae\u0eb0-\u0eb9\u0ebb-\u0ebd\u0ec0-\u0ec4\u0ec6\u0ec8-\u0ecd\u0ed0-\u0ed9\u0edc-\u0edd\u0f00\u0f18-\u0f19\u0f20-\u0f33\u0f35\u0f37\u0f39\u0f3e-\u0f47\u0f49-\u0f69\u0f71-\u0f84\u0f86-\u0f8b\u0f90-\u0f95\u0f97\u0f99-\u0fad\u0fb1-\u0fb7\u0fb9\u10a0-\u10c5\u10d0-\u10f6\u1e00-\u1e9b\u1ea0-\u1ef9\u1f00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u203f-\u2040\u207f\u2102\u2107\u210a-\u2113\u2115\u2118-\u211d\u2124\u2126\u2128\u212a-\u2131\u2133-\u2138\u2160-\u2182\u3005-\u3007\u3021-\u3029\u3041-\u3093\u309b-\u309c\u30a1-\u30f6\u30fb-\u30fc\u3105-\u312c\u4e00-\u9fa5\uac00-\ud7a3]/,
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

    _string_literal: $ =>
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
                    // /$/m,
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
                    // /$/m,
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
                          /[A-Za-z]/,
                          /[\u00aa\u00b5\u00b7\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u01f5\u01fa-\u0217\u0250-\u02a8\u02b0-\u02b8\u02bb\u02bd-\u02c1\u02d0-\u02d1\u02e0-\u02e4\u037a\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03ce\u03d0-\u03d6\u03da\u03dc\u03de\u03e0\u03e2-\u03f3\u0401-\u040c\u040e-\u044f\u0451-\u045c\u045e-\u0481\u0490-\u04c4\u04c7-\u04c8\u04cb-\u04cc\u04d0-\u04eb\u04ee-\u04f5\u04f8-\u04f9\u0531-\u0556\u0559\u0561-\u0587\u05b0-\u05b9\u05bb-\u05bd\u05bf\u05c1-\u05c2\u05d0-\u05ea\u05f0-\u05f2\u0621-\u063a\u0640-\u0652\u0660-\u0669\u0670-\u06b7\u06ba-\u06be\u06c0-\u06ce\u06d0-\u06dc\u06e5-\u06e8\u06ea-\u06ed\u06f0-\u06f9\u0901-\u0903\u0905-\u0939\u093d-\u094d\u0950-\u0952\u0958-\u0963\u0966-\u096f\u0981-\u0983\u0985-\u098c\u098f-\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09be-\u09c4\u09c7-\u09c8\u09cb-\u09cd\u09dc-\u09dd\u09df-\u09e3\u09e6-\u09f1\u0a02\u0a05-\u0a0a\u0a0f-\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32-\u0a33\u0a35-\u0a36\u0a38-\u0a39\u0a3e-\u0a42\u0a47-\u0a48\u0a4b-\u0a4d\u0a59-\u0a5c\u0a5e\u0a66-\u0a6f\u0a74\u0a81-\u0a83\u0a85-\u0a8b\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2-\u0ab3\u0ab5-\u0ab9\u0abd-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ad0\u0ae0\u0ae6-\u0aef\u0b01-\u0b03\u0b05-\u0b0c\u0b0f-\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32-\u0b33\u0b36-\u0b39\u0b3d-\u0b43\u0b47-\u0b48\u0b4b-\u0b4d\u0b5c-\u0b5d\u0b5f-\u0b61\u0b66-\u0b6f\u0b82-\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99-\u0b9a\u0b9c\u0b9e-\u0b9f\u0ba3-\u0ba4\u0ba8-\u0baa\u0bae-\u0bb5\u0bb7-\u0bb9\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0be7-\u0bef\u0c01-\u0c03\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3e-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c60-\u0c61\u0c66-\u0c6f\u0c82-\u0c83\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cde\u0ce0-\u0ce1\u0ce6-\u0cef\u0d02-\u0d03\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d28\u0d2a-\u0d39\u0d3e-\u0d43\u0d46-\u0d48\u0d4a-\u0d4d\u0d60-\u0d61\u0d66-\u0d6f\u0e01-\u0e3a\u0e40-\u0e5b\u0e81-\u0e82\u0e84\u0e87-\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa-\u0eab\u0ead-\u0eae\u0eb0-\u0eb9\u0ebb-\u0ebd\u0ec0-\u0ec4\u0ec6\u0ec8-\u0ecd\u0ed0-\u0ed9\u0edc-\u0edd\u0f00\u0f18-\u0f19\u0f20-\u0f33\u0f35\u0f37\u0f39\u0f3e-\u0f47\u0f49-\u0f69\u0f71-\u0f84\u0f86-\u0f8b\u0f90-\u0f95\u0f97\u0f99-\u0fad\u0fb1-\u0fb7\u0fb9\u10a0-\u10c5\u10d0-\u10f6\u1e00-\u1e9b\u1ea0-\u1ef9\u1f00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u203f-\u2040\u207f\u2102\u2107\u210a-\u2113\u2115\u2118-\u211d\u2124\u2126\u2128\u212a-\u2131\u2133-\u2138\u2160-\u2182\u3005-\u3007\u3021-\u3029\u3041-\u3093\u309b-\u309c\u30a1-\u30f6\u30fb-\u30fc\u3105-\u312c\u4e00-\u9fa5\uac00-\ud7a3]/,
                        ),
                        optional(
                          // IdentifierChars
                          repeat1(
                            // IdentifierChar
                            choice(
                              // IdentifierStart
                              choice(
                                "_",
                                /[A-Za-z]/,
                                /[\u00aa\u00b5\u00b7\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u01f5\u01fa-\u0217\u0250-\u02a8\u02b0-\u02b8\u02bb\u02bd-\u02c1\u02d0-\u02d1\u02e0-\u02e4\u037a\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03ce\u03d0-\u03d6\u03da\u03dc\u03de\u03e0\u03e2-\u03f3\u0401-\u040c\u040e-\u044f\u0451-\u045c\u045e-\u0481\u0490-\u04c4\u04c7-\u04c8\u04cb-\u04cc\u04d0-\u04eb\u04ee-\u04f5\u04f8-\u04f9\u0531-\u0556\u0559\u0561-\u0587\u05b0-\u05b9\u05bb-\u05bd\u05bf\u05c1-\u05c2\u05d0-\u05ea\u05f0-\u05f2\u0621-\u063a\u0640-\u0652\u0660-\u0669\u0670-\u06b7\u06ba-\u06be\u06c0-\u06ce\u06d0-\u06dc\u06e5-\u06e8\u06ea-\u06ed\u06f0-\u06f9\u0901-\u0903\u0905-\u0939\u093d-\u094d\u0950-\u0952\u0958-\u0963\u0966-\u096f\u0981-\u0983\u0985-\u098c\u098f-\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09be-\u09c4\u09c7-\u09c8\u09cb-\u09cd\u09dc-\u09dd\u09df-\u09e3\u09e6-\u09f1\u0a02\u0a05-\u0a0a\u0a0f-\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32-\u0a33\u0a35-\u0a36\u0a38-\u0a39\u0a3e-\u0a42\u0a47-\u0a48\u0a4b-\u0a4d\u0a59-\u0a5c\u0a5e\u0a66-\u0a6f\u0a74\u0a81-\u0a83\u0a85-\u0a8b\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2-\u0ab3\u0ab5-\u0ab9\u0abd-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ad0\u0ae0\u0ae6-\u0aef\u0b01-\u0b03\u0b05-\u0b0c\u0b0f-\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32-\u0b33\u0b36-\u0b39\u0b3d-\u0b43\u0b47-\u0b48\u0b4b-\u0b4d\u0b5c-\u0b5d\u0b5f-\u0b61\u0b66-\u0b6f\u0b82-\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99-\u0b9a\u0b9c\u0b9e-\u0b9f\u0ba3-\u0ba4\u0ba8-\u0baa\u0bae-\u0bb5\u0bb7-\u0bb9\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0be7-\u0bef\u0c01-\u0c03\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3e-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c60-\u0c61\u0c66-\u0c6f\u0c82-\u0c83\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cde\u0ce0-\u0ce1\u0ce6-\u0cef\u0d02-\u0d03\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d28\u0d2a-\u0d39\u0d3e-\u0d43\u0d46-\u0d48\u0d4a-\u0d4d\u0d60-\u0d61\u0d66-\u0d6f\u0e01-\u0e3a\u0e40-\u0e5b\u0e81-\u0e82\u0e84\u0e87-\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa-\u0eab\u0ead-\u0eae\u0eb0-\u0eb9\u0ebb-\u0ebd\u0ec0-\u0ec4\u0ec6\u0ec8-\u0ecd\u0ed0-\u0ed9\u0edc-\u0edd\u0f00\u0f18-\u0f19\u0f20-\u0f33\u0f35\u0f37\u0f39\u0f3e-\u0f47\u0f49-\u0f69\u0f71-\u0f84\u0f86-\u0f8b\u0f90-\u0f95\u0f97\u0f99-\u0fad\u0fb1-\u0fb7\u0fb9\u10a0-\u10c5\u10d0-\u10f6\u1e00-\u1e9b\u1ea0-\u1ef9\u1f00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u203f-\u2040\u207f\u2102\u2107\u210a-\u2113\u2115\u2118-\u211d\u2124\u2126\u2128\u212a-\u2131\u2133-\u2138\u2160-\u2182\u3005-\u3007\u3021-\u3029\u3041-\u3093\u309b-\u309c\u30a1-\u30f6\u30fb-\u30fc\u3105-\u312c\u4e00-\u9fa5\uac00-\ud7a3]/,
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
                    // /$/m,
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
                    // /$/m,
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
                /[A-Za-z]/,
                /[\u00aa\u00b5\u00b7\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u01f5\u01fa-\u0217\u0250-\u02a8\u02b0-\u02b8\u02bb\u02bd-\u02c1\u02d0-\u02d1\u02e0-\u02e4\u037a\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03ce\u03d0-\u03d6\u03da\u03dc\u03de\u03e0\u03e2-\u03f3\u0401-\u040c\u040e-\u044f\u0451-\u045c\u045e-\u0481\u0490-\u04c4\u04c7-\u04c8\u04cb-\u04cc\u04d0-\u04eb\u04ee-\u04f5\u04f8-\u04f9\u0531-\u0556\u0559\u0561-\u0587\u05b0-\u05b9\u05bb-\u05bd\u05bf\u05c1-\u05c2\u05d0-\u05ea\u05f0-\u05f2\u0621-\u063a\u0640-\u0652\u0660-\u0669\u0670-\u06b7\u06ba-\u06be\u06c0-\u06ce\u06d0-\u06dc\u06e5-\u06e8\u06ea-\u06ed\u06f0-\u06f9\u0901-\u0903\u0905-\u0939\u093d-\u094d\u0950-\u0952\u0958-\u0963\u0966-\u096f\u0981-\u0983\u0985-\u098c\u098f-\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09be-\u09c4\u09c7-\u09c8\u09cb-\u09cd\u09dc-\u09dd\u09df-\u09e3\u09e6-\u09f1\u0a02\u0a05-\u0a0a\u0a0f-\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32-\u0a33\u0a35-\u0a36\u0a38-\u0a39\u0a3e-\u0a42\u0a47-\u0a48\u0a4b-\u0a4d\u0a59-\u0a5c\u0a5e\u0a66-\u0a6f\u0a74\u0a81-\u0a83\u0a85-\u0a8b\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2-\u0ab3\u0ab5-\u0ab9\u0abd-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ad0\u0ae0\u0ae6-\u0aef\u0b01-\u0b03\u0b05-\u0b0c\u0b0f-\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32-\u0b33\u0b36-\u0b39\u0b3d-\u0b43\u0b47-\u0b48\u0b4b-\u0b4d\u0b5c-\u0b5d\u0b5f-\u0b61\u0b66-\u0b6f\u0b82-\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99-\u0b9a\u0b9c\u0b9e-\u0b9f\u0ba3-\u0ba4\u0ba8-\u0baa\u0bae-\u0bb5\u0bb7-\u0bb9\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0be7-\u0bef\u0c01-\u0c03\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3e-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c60-\u0c61\u0c66-\u0c6f\u0c82-\u0c83\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cde\u0ce0-\u0ce1\u0ce6-\u0cef\u0d02-\u0d03\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d28\u0d2a-\u0d39\u0d3e-\u0d43\u0d46-\u0d48\u0d4a-\u0d4d\u0d60-\u0d61\u0d66-\u0d6f\u0e01-\u0e3a\u0e40-\u0e5b\u0e81-\u0e82\u0e84\u0e87-\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa-\u0eab\u0ead-\u0eae\u0eb0-\u0eb9\u0ebb-\u0ebd\u0ec0-\u0ec4\u0ec6\u0ec8-\u0ecd\u0ed0-\u0ed9\u0edc-\u0edd\u0f00\u0f18-\u0f19\u0f20-\u0f33\u0f35\u0f37\u0f39\u0f3e-\u0f47\u0f49-\u0f69\u0f71-\u0f84\u0f86-\u0f8b\u0f90-\u0f95\u0f97\u0f99-\u0fad\u0fb1-\u0fb7\u0fb9\u10a0-\u10c5\u10d0-\u10f6\u1e00-\u1e9b\u1ea0-\u1ef9\u1f00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u203f-\u2040\u207f\u2102\u2107\u210a-\u2113\u2115\u2118-\u211d\u2124\u2126\u2128\u212a-\u2131\u2133-\u2138\u2160-\u2182\u3005-\u3007\u3021-\u3029\u3041-\u3093\u309b-\u309c\u30a1-\u30f6\u30fb-\u30fc\u3105-\u312c\u4e00-\u9fa5\uac00-\ud7a3]/,
              ),
              optional(
                // IdentifierChars
                repeat1(
                  // IdentifierChar
                  choice(
                    // IdentifierStart
                    choice(
                      "_",
                      /[A-Za-z]/,
                      /[\u00aa\u00b5\u00b7\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u01f5\u01fa-\u0217\u0250-\u02a8\u02b0-\u02b8\u02bb\u02bd-\u02c1\u02d0-\u02d1\u02e0-\u02e4\u037a\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03ce\u03d0-\u03d6\u03da\u03dc\u03de\u03e0\u03e2-\u03f3\u0401-\u040c\u040e-\u044f\u0451-\u045c\u045e-\u0481\u0490-\u04c4\u04c7-\u04c8\u04cb-\u04cc\u04d0-\u04eb\u04ee-\u04f5\u04f8-\u04f9\u0531-\u0556\u0559\u0561-\u0587\u05b0-\u05b9\u05bb-\u05bd\u05bf\u05c1-\u05c2\u05d0-\u05ea\u05f0-\u05f2\u0621-\u063a\u0640-\u0652\u0660-\u0669\u0670-\u06b7\u06ba-\u06be\u06c0-\u06ce\u06d0-\u06dc\u06e5-\u06e8\u06ea-\u06ed\u06f0-\u06f9\u0901-\u0903\u0905-\u0939\u093d-\u094d\u0950-\u0952\u0958-\u0963\u0966-\u096f\u0981-\u0983\u0985-\u098c\u098f-\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09be-\u09c4\u09c7-\u09c8\u09cb-\u09cd\u09dc-\u09dd\u09df-\u09e3\u09e6-\u09f1\u0a02\u0a05-\u0a0a\u0a0f-\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32-\u0a33\u0a35-\u0a36\u0a38-\u0a39\u0a3e-\u0a42\u0a47-\u0a48\u0a4b-\u0a4d\u0a59-\u0a5c\u0a5e\u0a66-\u0a6f\u0a74\u0a81-\u0a83\u0a85-\u0a8b\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2-\u0ab3\u0ab5-\u0ab9\u0abd-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ad0\u0ae0\u0ae6-\u0aef\u0b01-\u0b03\u0b05-\u0b0c\u0b0f-\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32-\u0b33\u0b36-\u0b39\u0b3d-\u0b43\u0b47-\u0b48\u0b4b-\u0b4d\u0b5c-\u0b5d\u0b5f-\u0b61\u0b66-\u0b6f\u0b82-\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99-\u0b9a\u0b9c\u0b9e-\u0b9f\u0ba3-\u0ba4\u0ba8-\u0baa\u0bae-\u0bb5\u0bb7-\u0bb9\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0be7-\u0bef\u0c01-\u0c03\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3e-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c60-\u0c61\u0c66-\u0c6f\u0c82-\u0c83\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cde\u0ce0-\u0ce1\u0ce6-\u0cef\u0d02-\u0d03\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d28\u0d2a-\u0d39\u0d3e-\u0d43\u0d46-\u0d48\u0d4a-\u0d4d\u0d60-\u0d61\u0d66-\u0d6f\u0e01-\u0e3a\u0e40-\u0e5b\u0e81-\u0e82\u0e84\u0e87-\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa-\u0eab\u0ead-\u0eae\u0eb0-\u0eb9\u0ebb-\u0ebd\u0ec0-\u0ec4\u0ec6\u0ec8-\u0ecd\u0ed0-\u0ed9\u0edc-\u0edd\u0f00\u0f18-\u0f19\u0f20-\u0f33\u0f35\u0f37\u0f39\u0f3e-\u0f47\u0f49-\u0f69\u0f71-\u0f84\u0f86-\u0f8b\u0f90-\u0f95\u0f97\u0f99-\u0fad\u0fb1-\u0fb7\u0fb9\u10a0-\u10c5\u10d0-\u10f6\u1e00-\u1e9b\u1ea0-\u1ef9\u1f00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u203f-\u2040\u207f\u2102\u2107\u210a-\u2113\u2115\u2118-\u211d\u2124\u2126\u2128\u212a-\u2131\u2133-\u2138\u2160-\u2182\u3005-\u3007\u3021-\u3029\u3041-\u3093\u309b-\u309c\u30a1-\u30f6\u30fb-\u30fc\u3105-\u312c\u4e00-\u9fa5\uac00-\ud7a3]/,
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
                    // /$/m,
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
                /[A-Za-z]/,
                /[\u00aa\u00b5\u00b7\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u01f5\u01fa-\u0217\u0250-\u02a8\u02b0-\u02b8\u02bb\u02bd-\u02c1\u02d0-\u02d1\u02e0-\u02e4\u037a\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03ce\u03d0-\u03d6\u03da\u03dc\u03de\u03e0\u03e2-\u03f3\u0401-\u040c\u040e-\u044f\u0451-\u045c\u045e-\u0481\u0490-\u04c4\u04c7-\u04c8\u04cb-\u04cc\u04d0-\u04eb\u04ee-\u04f5\u04f8-\u04f9\u0531-\u0556\u0559\u0561-\u0587\u05b0-\u05b9\u05bb-\u05bd\u05bf\u05c1-\u05c2\u05d0-\u05ea\u05f0-\u05f2\u0621-\u063a\u0640-\u0652\u0660-\u0669\u0670-\u06b7\u06ba-\u06be\u06c0-\u06ce\u06d0-\u06dc\u06e5-\u06e8\u06ea-\u06ed\u06f0-\u06f9\u0901-\u0903\u0905-\u0939\u093d-\u094d\u0950-\u0952\u0958-\u0963\u0966-\u096f\u0981-\u0983\u0985-\u098c\u098f-\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09be-\u09c4\u09c7-\u09c8\u09cb-\u09cd\u09dc-\u09dd\u09df-\u09e3\u09e6-\u09f1\u0a02\u0a05-\u0a0a\u0a0f-\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32-\u0a33\u0a35-\u0a36\u0a38-\u0a39\u0a3e-\u0a42\u0a47-\u0a48\u0a4b-\u0a4d\u0a59-\u0a5c\u0a5e\u0a66-\u0a6f\u0a74\u0a81-\u0a83\u0a85-\u0a8b\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2-\u0ab3\u0ab5-\u0ab9\u0abd-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ad0\u0ae0\u0ae6-\u0aef\u0b01-\u0b03\u0b05-\u0b0c\u0b0f-\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32-\u0b33\u0b36-\u0b39\u0b3d-\u0b43\u0b47-\u0b48\u0b4b-\u0b4d\u0b5c-\u0b5d\u0b5f-\u0b61\u0b66-\u0b6f\u0b82-\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99-\u0b9a\u0b9c\u0b9e-\u0b9f\u0ba3-\u0ba4\u0ba8-\u0baa\u0bae-\u0bb5\u0bb7-\u0bb9\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0be7-\u0bef\u0c01-\u0c03\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3e-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c60-\u0c61\u0c66-\u0c6f\u0c82-\u0c83\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cde\u0ce0-\u0ce1\u0ce6-\u0cef\u0d02-\u0d03\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d28\u0d2a-\u0d39\u0d3e-\u0d43\u0d46-\u0d48\u0d4a-\u0d4d\u0d60-\u0d61\u0d66-\u0d6f\u0e01-\u0e3a\u0e40-\u0e5b\u0e81-\u0e82\u0e84\u0e87-\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa-\u0eab\u0ead-\u0eae\u0eb0-\u0eb9\u0ebb-\u0ebd\u0ec0-\u0ec4\u0ec6\u0ec8-\u0ecd\u0ed0-\u0ed9\u0edc-\u0edd\u0f00\u0f18-\u0f19\u0f20-\u0f33\u0f35\u0f37\u0f39\u0f3e-\u0f47\u0f49-\u0f69\u0f71-\u0f84\u0f86-\u0f8b\u0f90-\u0f95\u0f97\u0f99-\u0fad\u0fb1-\u0fb7\u0fb9\u10a0-\u10c5\u10d0-\u10f6\u1e00-\u1e9b\u1ea0-\u1ef9\u1f00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u203f-\u2040\u207f\u2102\u2107\u210a-\u2113\u2115\u2118-\u211d\u2124\u2126\u2128\u212a-\u2131\u2133-\u2138\u2160-\u2182\u3005-\u3007\u3021-\u3029\u3041-\u3093\u309b-\u309c\u30a1-\u30f6\u30fb-\u30fc\u3105-\u312c\u4e00-\u9fa5\uac00-\ud7a3]/,
              ),
              optional(
                // IdentifierChars
                repeat1(
                  // IdentifierChar
                  choice(
                    // IdentifierStart
                    choice(
                      "_",
                      /[A-Za-z]/,
                      /[\u00aa\u00b5\u00b7\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u01f5\u01fa-\u0217\u0250-\u02a8\u02b0-\u02b8\u02bb\u02bd-\u02c1\u02d0-\u02d1\u02e0-\u02e4\u037a\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03ce\u03d0-\u03d6\u03da\u03dc\u03de\u03e0\u03e2-\u03f3\u0401-\u040c\u040e-\u044f\u0451-\u045c\u045e-\u0481\u0490-\u04c4\u04c7-\u04c8\u04cb-\u04cc\u04d0-\u04eb\u04ee-\u04f5\u04f8-\u04f9\u0531-\u0556\u0559\u0561-\u0587\u05b0-\u05b9\u05bb-\u05bd\u05bf\u05c1-\u05c2\u05d0-\u05ea\u05f0-\u05f2\u0621-\u063a\u0640-\u0652\u0660-\u0669\u0670-\u06b7\u06ba-\u06be\u06c0-\u06ce\u06d0-\u06dc\u06e5-\u06e8\u06ea-\u06ed\u06f0-\u06f9\u0901-\u0903\u0905-\u0939\u093d-\u094d\u0950-\u0952\u0958-\u0963\u0966-\u096f\u0981-\u0983\u0985-\u098c\u098f-\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09be-\u09c4\u09c7-\u09c8\u09cb-\u09cd\u09dc-\u09dd\u09df-\u09e3\u09e6-\u09f1\u0a02\u0a05-\u0a0a\u0a0f-\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32-\u0a33\u0a35-\u0a36\u0a38-\u0a39\u0a3e-\u0a42\u0a47-\u0a48\u0a4b-\u0a4d\u0a59-\u0a5c\u0a5e\u0a66-\u0a6f\u0a74\u0a81-\u0a83\u0a85-\u0a8b\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2-\u0ab3\u0ab5-\u0ab9\u0abd-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ad0\u0ae0\u0ae6-\u0aef\u0b01-\u0b03\u0b05-\u0b0c\u0b0f-\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32-\u0b33\u0b36-\u0b39\u0b3d-\u0b43\u0b47-\u0b48\u0b4b-\u0b4d\u0b5c-\u0b5d\u0b5f-\u0b61\u0b66-\u0b6f\u0b82-\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99-\u0b9a\u0b9c\u0b9e-\u0b9f\u0ba3-\u0ba4\u0ba8-\u0baa\u0bae-\u0bb5\u0bb7-\u0bb9\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0be7-\u0bef\u0c01-\u0c03\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3e-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c60-\u0c61\u0c66-\u0c6f\u0c82-\u0c83\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cde\u0ce0-\u0ce1\u0ce6-\u0cef\u0d02-\u0d03\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d28\u0d2a-\u0d39\u0d3e-\u0d43\u0d46-\u0d48\u0d4a-\u0d4d\u0d60-\u0d61\u0d66-\u0d6f\u0e01-\u0e3a\u0e40-\u0e5b\u0e81-\u0e82\u0e84\u0e87-\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa-\u0eab\u0ead-\u0eae\u0eb0-\u0eb9\u0ebb-\u0ebd\u0ec0-\u0ec4\u0ec6\u0ec8-\u0ecd\u0ed0-\u0ed9\u0edc-\u0edd\u0f00\u0f18-\u0f19\u0f20-\u0f33\u0f35\u0f37\u0f39\u0f3e-\u0f47\u0f49-\u0f69\u0f71-\u0f84\u0f86-\u0f8b\u0f90-\u0f95\u0f97\u0f99-\u0fad\u0fb1-\u0fb7\u0fb9\u10a0-\u10c5\u10d0-\u10f6\u1e00-\u1e9b\u1ea0-\u1ef9\u1f00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u203f-\u2040\u207f\u2102\u2107\u210a-\u2113\u2115\u2118-\u211d\u2124\u2126\u2128\u212a-\u2131\u2133-\u2138\u2160-\u2182\u3005-\u3007\u3021-\u3029\u3041-\u3093\u309b-\u309c\u30a1-\u30f6\u30fb-\u30fc\u3105-\u312c\u4e00-\u9fa5\uac00-\ud7a3]/,
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
                      /[A-Za-z]/,
                      /[\u00aa\u00b5\u00b7\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u01f5\u01fa-\u0217\u0250-\u02a8\u02b0-\u02b8\u02bb\u02bd-\u02c1\u02d0-\u02d1\u02e0-\u02e4\u037a\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03ce\u03d0-\u03d6\u03da\u03dc\u03de\u03e0\u03e2-\u03f3\u0401-\u040c\u040e-\u044f\u0451-\u045c\u045e-\u0481\u0490-\u04c4\u04c7-\u04c8\u04cb-\u04cc\u04d0-\u04eb\u04ee-\u04f5\u04f8-\u04f9\u0531-\u0556\u0559\u0561-\u0587\u05b0-\u05b9\u05bb-\u05bd\u05bf\u05c1-\u05c2\u05d0-\u05ea\u05f0-\u05f2\u0621-\u063a\u0640-\u0652\u0660-\u0669\u0670-\u06b7\u06ba-\u06be\u06c0-\u06ce\u06d0-\u06dc\u06e5-\u06e8\u06ea-\u06ed\u06f0-\u06f9\u0901-\u0903\u0905-\u0939\u093d-\u094d\u0950-\u0952\u0958-\u0963\u0966-\u096f\u0981-\u0983\u0985-\u098c\u098f-\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09be-\u09c4\u09c7-\u09c8\u09cb-\u09cd\u09dc-\u09dd\u09df-\u09e3\u09e6-\u09f1\u0a02\u0a05-\u0a0a\u0a0f-\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32-\u0a33\u0a35-\u0a36\u0a38-\u0a39\u0a3e-\u0a42\u0a47-\u0a48\u0a4b-\u0a4d\u0a59-\u0a5c\u0a5e\u0a66-\u0a6f\u0a74\u0a81-\u0a83\u0a85-\u0a8b\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2-\u0ab3\u0ab5-\u0ab9\u0abd-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ad0\u0ae0\u0ae6-\u0aef\u0b01-\u0b03\u0b05-\u0b0c\u0b0f-\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32-\u0b33\u0b36-\u0b39\u0b3d-\u0b43\u0b47-\u0b48\u0b4b-\u0b4d\u0b5c-\u0b5d\u0b5f-\u0b61\u0b66-\u0b6f\u0b82-\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99-\u0b9a\u0b9c\u0b9e-\u0b9f\u0ba3-\u0ba4\u0ba8-\u0baa\u0bae-\u0bb5\u0bb7-\u0bb9\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0be7-\u0bef\u0c01-\u0c03\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3e-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c60-\u0c61\u0c66-\u0c6f\u0c82-\u0c83\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cde\u0ce0-\u0ce1\u0ce6-\u0cef\u0d02-\u0d03\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d28\u0d2a-\u0d39\u0d3e-\u0d43\u0d46-\u0d48\u0d4a-\u0d4d\u0d60-\u0d61\u0d66-\u0d6f\u0e01-\u0e3a\u0e40-\u0e5b\u0e81-\u0e82\u0e84\u0e87-\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa-\u0eab\u0ead-\u0eae\u0eb0-\u0eb9\u0ebb-\u0ebd\u0ec0-\u0ec4\u0ec6\u0ec8-\u0ecd\u0ed0-\u0ed9\u0edc-\u0edd\u0f00\u0f18-\u0f19\u0f20-\u0f33\u0f35\u0f37\u0f39\u0f3e-\u0f47\u0f49-\u0f69\u0f71-\u0f84\u0f86-\u0f8b\u0f90-\u0f95\u0f97\u0f99-\u0fad\u0fb1-\u0fb7\u0fb9\u10a0-\u10c5\u10d0-\u10f6\u1e00-\u1e9b\u1ea0-\u1ef9\u1f00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u203f-\u2040\u207f\u2102\u2107\u210a-\u2113\u2115\u2118-\u211d\u2124\u2126\u2128\u212a-\u2131\u2133-\u2138\u2160-\u2182\u3005-\u3007\u3021-\u3029\u3041-\u3093\u309b-\u309c\u30a1-\u30f6\u30fb-\u30fc\u3105-\u312c\u4e00-\u9fa5\uac00-\ud7a3]/,
                    ),
                    optional(
                      // IdentifierChars
                      repeat1(
                        // IdentifierChar
                        choice(
                          // IdentifierStart
                          choice(
                            "_",
                            /[A-Za-z]/,
                            /[\u00aa\u00b5\u00b7\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u01f5\u01fa-\u0217\u0250-\u02a8\u02b0-\u02b8\u02bb\u02bd-\u02c1\u02d0-\u02d1\u02e0-\u02e4\u037a\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03ce\u03d0-\u03d6\u03da\u03dc\u03de\u03e0\u03e2-\u03f3\u0401-\u040c\u040e-\u044f\u0451-\u045c\u045e-\u0481\u0490-\u04c4\u04c7-\u04c8\u04cb-\u04cc\u04d0-\u04eb\u04ee-\u04f5\u04f8-\u04f9\u0531-\u0556\u0559\u0561-\u0587\u05b0-\u05b9\u05bb-\u05bd\u05bf\u05c1-\u05c2\u05d0-\u05ea\u05f0-\u05f2\u0621-\u063a\u0640-\u0652\u0660-\u0669\u0670-\u06b7\u06ba-\u06be\u06c0-\u06ce\u06d0-\u06dc\u06e5-\u06e8\u06ea-\u06ed\u06f0-\u06f9\u0901-\u0903\u0905-\u0939\u093d-\u094d\u0950-\u0952\u0958-\u0963\u0966-\u096f\u0981-\u0983\u0985-\u098c\u098f-\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09be-\u09c4\u09c7-\u09c8\u09cb-\u09cd\u09dc-\u09dd\u09df-\u09e3\u09e6-\u09f1\u0a02\u0a05-\u0a0a\u0a0f-\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32-\u0a33\u0a35-\u0a36\u0a38-\u0a39\u0a3e-\u0a42\u0a47-\u0a48\u0a4b-\u0a4d\u0a59-\u0a5c\u0a5e\u0a66-\u0a6f\u0a74\u0a81-\u0a83\u0a85-\u0a8b\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2-\u0ab3\u0ab5-\u0ab9\u0abd-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ad0\u0ae0\u0ae6-\u0aef\u0b01-\u0b03\u0b05-\u0b0c\u0b0f-\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32-\u0b33\u0b36-\u0b39\u0b3d-\u0b43\u0b47-\u0b48\u0b4b-\u0b4d\u0b5c-\u0b5d\u0b5f-\u0b61\u0b66-\u0b6f\u0b82-\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99-\u0b9a\u0b9c\u0b9e-\u0b9f\u0ba3-\u0ba4\u0ba8-\u0baa\u0bae-\u0bb5\u0bb7-\u0bb9\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0be7-\u0bef\u0c01-\u0c03\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3e-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c60-\u0c61\u0c66-\u0c6f\u0c82-\u0c83\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cde\u0ce0-\u0ce1\u0ce6-\u0cef\u0d02-\u0d03\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d28\u0d2a-\u0d39\u0d3e-\u0d43\u0d46-\u0d48\u0d4a-\u0d4d\u0d60-\u0d61\u0d66-\u0d6f\u0e01-\u0e3a\u0e40-\u0e5b\u0e81-\u0e82\u0e84\u0e87-\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa-\u0eab\u0ead-\u0eae\u0eb0-\u0eb9\u0ebb-\u0ebd\u0ec0-\u0ec4\u0ec6\u0ec8-\u0ecd\u0ed0-\u0ed9\u0edc-\u0edd\u0f00\u0f18-\u0f19\u0f20-\u0f33\u0f35\u0f37\u0f39\u0f3e-\u0f47\u0f49-\u0f69\u0f71-\u0f84\u0f86-\u0f8b\u0f90-\u0f95\u0f97\u0f99-\u0fad\u0fb1-\u0fb7\u0fb9\u10a0-\u10c5\u10d0-\u10f6\u1e00-\u1e9b\u1ea0-\u1ef9\u1f00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u203f-\u2040\u207f\u2102\u2107\u210a-\u2113\u2115\u2118-\u211d\u2124\u2126\u2128\u212a-\u2131\u2133-\u2138\u2160-\u2182\u3005-\u3007\u3021-\u3029\u3041-\u3093\u309b-\u309c\u30a1-\u30f6\u30fb-\u30fc\u3105-\u312c\u4e00-\u9fa5\uac00-\ud7a3]/,
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

    // ---

    special_token_sequence: $ =>
      choice(
        seq(
          "#",
          "line",
          $.integer_literal,
          $._end_of_line,
        ),
        seq(
          "#",
          "line",
          $.integer_literal,
          $.filespec,
          $._end_of_line,
        ),
      ),

    // ---

    filespec: $ =>
      token(
        // Filespec
        seq(
          "\"",
          optional(
            // Characters
            repeat1(
              // Character
              /[\s\S]/,
            ),
          ),
          "\"",
        ),
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
        $._decl_def,
      ),

    _decl_def: $ =>
      choice(
        $.attribute_specifier,
        $._declaration,
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
        $.empty_declaration,
      ),

    empty_declaration: $ =>
      ";",

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
        $._module_attribute,
      ),

    _module_attribute: $ =>
      choice(
        $.deprecated_attribute,
        $.user_defined_attribute,
      ),

    module_fully_qualified_name: $ =>
      choice(
        $._module_name,
        seq(
          $.packages,
          ".",
          $._module_name,
        ),
      ),

    _module_name: $ =>
      $.identifier,

    packages: $ =>
      choice(
        $._package_name,
        seq(
          $.packages,
          ".",
          $._package_name,
        ),
      ),

    _package_name: $ =>
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
          $._module_alias_identifier,
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

    _module_alias_identifier: $ =>
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

    _declaration: $ =>
      choice(
        $.func_declaration,
        $.var_declarations,
        $.alias_declaration,
        $._aggregate_declaration,
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
          $._initializer,
        ),
        $.alt_declarator,
        seq(
          $.alt_declarator,
          "=",
          $._initializer,
        ),
      ),

    declarator_identifier_list: $ =>
      choice(
        $._declarator_identifier,
        seq(
          $._declarator_identifier,
          ",",
          $.declarator_identifier_list,
        ),
      ),

    _declarator_identifier: $ =>
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
          $._initializer,
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
          $._initializer,
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
          $._initializer,
        ),
      ),

    _declarator: $ =>
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

    _initializer: $ =>
      choice(
        $.void_initializer,
        $._non_void_initializer,
      ),

    _non_void_initializer: $ =>
      choice(
        $._exp_initializer,
        $.array_initializer,
        $.struct_initializer,
      ),

    _exp_initializer: $ =>
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
        $._non_void_initializer,
        seq(
          $.assign_expression,
          ":",
          $._non_void_initializer,
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
        $._non_void_initializer,
        seq(
          $.identifier,
          ":",
          $._non_void_initializer,
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
        $._initializer,
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
        $._vector_base_type,
        ")",
      ),

    _vector_base_type: $ =>
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
          $._expression,
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
        $._decl_def,
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
          $._no_scope_statement,
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

    _expression: $ =>
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
          $._expression,
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
        $._cmp_expression,
        seq(
          $.and_expression,
          "&",
          $._cmp_expression,
        ),
      ),

    // ---

    _cmp_expression: $ =>
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
          $._expression,
          ")",
        ),
        $.special_keyword,
        $.traits_expression,
      ),

    // ---

    string_literals: $ =>
      choice(
        $._string_literal,
        seq(
          $.string_literals,
          $._string_literal,
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
        $._key_expression,
        ":",
        $._value_expression,
      ),

    _key_expression: $ =>
      $.assign_expression,

    _value_expression: $ =>
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
        $._function_literal_body,
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
        $._function_literal_body,
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
          $._expression,
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

    _statement: $ =>
      choice(
        $.empty_statement,
        $._non_empty_statement,
        $._scope_block_statement,
      ),

    empty_statement: $ =>
      ";",

    _no_scope_non_empty_statement: $ =>
      choice(
        $._non_empty_statement,
        $.block_statement,
      ),

    _no_scope_statement: $ =>
      choice(
        $.empty_statement,
        $._non_empty_statement,
        $.block_statement,
      ),

    _non_empty_or_scope_block_statement: $ =>
      choice(
        $._non_empty_statement,
        $._scope_block_statement,
      ),

    _non_empty_statement: $ =>
      choice(
        $._non_empty_statement_no_case_no_default,
        $.case_statement,
        $.case_range_statement,
        $.default_statement,
      ),

    _non_empty_statement_no_case_no_default: $ =>
      choice(
        $.labeled_statement,
        $.expression_statement,
        $._declaration_statement,
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

    _scope_statement: $ =>
      choice(
        $._non_empty_statement,
        $.block_statement,
      ),

    // ---

    _scope_block_statement: $ =>
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
          $._statement,
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
        $._statement,
      ),

    // ---

    expression_statement: $ =>
      seq(
        $._expression,
        ";",
      ),

    // ---

    _declaration_statement: $ =>
      $._declaration,

    // ---

    if_statement: $ =>
      choice(
        seq(
          "if",
          "(",
          $.if_condition,
          ")",
          $._then_statement,
        ),
        seq(
          "if",
          "(",
          $.if_condition,
          ")",
          $._then_statement,
          "else",
          $._else_statement,
        ),
      ),

    if_condition: $ =>
      choice(
        $._expression,
        seq(
          "auto",
          $.identifier,
          "=",
          $._expression,
        ),
        seq(
          $.type_ctors,
          $.identifier,
          "=",
          $._expression,
        ),
        seq(
          optional(
            $.type_ctors,
          ),
          $.basic_type,
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

    while_statement: $ =>
      seq(
        "while",
        "(",
        $.if_condition,
        ")",
        $._scope_statement,
      ),

    // ---

    do_statement: $ =>
      seq(
        "do",
        $._scope_statement,
        "while",
        "(",
        $._expression,
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
          $._test,
        ),
        ";",
        optional(
          $._increment,
        ),
        ")",
        $._scope_statement,
      ),

    initialize: $ =>
      choice(
        ";",
        $._no_scope_non_empty_statement,
      ),

    _test: $ =>
      $._expression,

    _increment: $ =>
      $._expression,

    // ---

    aggregate_foreach: $ =>
      seq(
        $.foreach,
        "(",
        $.foreach_type_list,
        ";",
        $._foreach_aggregate,
        ")",
      ),

    foreach_statement: $ =>
      seq(
        $.aggregate_foreach,
        $._no_scope_non_empty_statement,
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
          $._declarator,
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

    _foreach_aggregate: $ =>
      $._expression,

    // ---

    range_foreach: $ =>
      seq(
        $.foreach,
        "(",
        $.foreach_type,
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

    foreach_range_statement: $ =>
      seq(
        $.range_foreach,
        $._scope_statement,
      ),

    // ---

    switch_statement: $ =>
      seq(
        "switch",
        "(",
        $._expression,
        ")",
        $._scope_statement,
      ),

    case_statement: $ =>
      seq(
        "case",
        $.argument_list,
        ":",
        $._scope_statement_list,
      ),

    case_range_statement: $ =>
      seq(
        "case",
        $._first_exp,
        ":",
        "..",
        "case",
        $._last_exp,
        ":",
        $._scope_statement_list,
      ),

    _first_exp: $ =>
      $.assign_expression,

    _last_exp: $ =>
      $.assign_expression,

    default_statement: $ =>
      seq(
        "default",
        ":",
        $._scope_statement_list,
      ),

    _scope_statement_list: $ =>
      $.statement_list_no_case_no_default,

    statement_list_no_case_no_default: $ =>
      repeat1(
        $._statement_no_case_no_default,
      ),

    _statement_no_case_no_default: $ =>
      choice(
        $.empty_statement,
        $._non_empty_statement_no_case_no_default,
        $._scope_block_statement,
      ),

    // ---

    final_switch_statement: $ =>
      seq(
        "final",
        "switch",
        "(",
        $._expression,
        ")",
        $._scope_statement,
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
          $._expression,
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
          $._expression,
          ";",
        ),
      ),

    // ---

    with_statement: $ =>
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
          $.symbol,
          ")",
          $._scope_statement,
        ),
        seq(
          "with",
          "(",
          $.template_instance,
          ")",
          $._scope_statement,
        ),
      ),

    // ---

    synchronized_statement: $ =>
      choice(
        seq(
          "synchronized",
          $._scope_statement,
        ),
        seq(
          "synchronized",
          "(",
          $._expression,
          ")",
          $._scope_statement,
        ),
      ),

    // ---

    try_statement: $ =>
      choice(
        seq(
          "try",
          $._scope_statement,
          $.catches,
        ),
        seq(
          "try",
          $._scope_statement,
          $.catches,
          $.finally_statement,
        ),
        seq(
          "try",
          $._scope_statement,
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
        $._no_scope_non_empty_statement,
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
        $._no_scope_non_empty_statement,
      ),

    // ---

    throw_statement: $ =>
      seq(
        "throw",
        $._expression,
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
          $._non_empty_or_scope_block_statement,
        ),
        seq(
          "scope",
          "(",
          "success",
          ")",
          $._non_empty_or_scope_block_statement,
        ),
        seq(
          "scope",
          "(",
          "failure",
          ")",
          $._non_empty_or_scope_block_statement,
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

    _aggregate_declaration: $ =>
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
          $._function_body,
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
          $._super_class_or_interface,
        ),
        seq(
          ":",
          $._super_class_or_interface,
          ",",
          $.interfaces,
        ),
      ),

    _super_class_or_interface: $ =>
      $.basic_type,

    interfaces: $ =>
      choice(
        $._interface,
        seq(
          $._interface,
          ",",
          $.interfaces,
        ),
      ),

    _interface: $ =>
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
          $._function_body,
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
        $._function_body,
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
          $._function_body,
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
          $._function_body,
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
          $._function_body,
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
          $._function_body,
        ),
      ),

    // ---

    allocator: $ =>
      seq(
        "new",
        $.parameters,
        $._function_body,
      ),

    // ---

    deallocator: $ =>
      seq(
        "delete",
        $.parameters,
        $._function_body,
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
          $._super_class_or_interface,
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
          $._enum_base_type,
          $.enum_body,
        ),
        $.anonymous_enum_declaration,
      ),

    _enum_base_type: $ =>
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
          $._enum_base_type,
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
          $._function_body,
        ),
        $.auto_func_declaration,
      ),

    auto_func_declaration: $ =>
      seq(
        $.storage_classes,
        $.identifier,
        $.func_declarator_suffix,
        $._function_body,
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
          $._declarator,
        ),
        seq(
          optional(
            $.parameter_attributes,
          ),
          $.basic_type,
          $._declarator,
          "...",
        ),
        seq(
          optional(
            $.parameter_attributes,
          ),
          $.basic_type,
          $._declarator,
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
        $._function_attribute,
      ),

    _function_attribute: $ =>
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
        $._function_attribute,
      ),

    // ---

    _function_body: $ =>
      choice(
        $.specified_function_body,
        $.missing_function_body,
        $.shortened_function_body,
      ),

    _function_literal_body: $ =>
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
          $._in_out_contract_expression,
          optional(
            "do",
          ),
          $.block_statement,
        ),
        seq(
          optional(
            $.function_contracts,
          ),
          $._in_out_statement,
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
          $._in_out_contract_expression,
          ";",
        ),
        seq(
          optional(
            $.function_contracts,
          ),
          $._in_out_statement,
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
        $._function_contract,
      ),

    _function_contract: $ =>
      choice(
        $._in_out_contract_expression,
        $._in_out_statement,
      ),

    _in_out_contract_expression: $ =>
      choice(
        $.in_contract_expression,
        $.out_contract_expression,
      ),

    _in_out_statement: $ =>
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
        $._template_parameter,
        seq(
          $._template_parameter,
          ",",
        ),
        seq(
          $._template_parameter,
          ",",
          $.template_parameter_list,
        ),
      ),

    _template_parameter: $ =>
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
        $._template_argument,
        seq(
          $._template_argument,
          ",",
        ),
        seq(
          $._template_argument,
          ",",
          $.template_argument_list,
        ),
      ),

    _template_argument: $ =>
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
        $._string_literal,
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
          $._declarator,
        ),
        seq(
          $.basic_type,
          $._declarator,
          $.template_value_parameter_specialization,
        ),
        seq(
          $.basic_type,
          $._declarator,
          $.template_value_parameter_default,
        ),
        seq(
          $.basic_type,
          $._declarator,
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
          $._declarator,
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
          $._function_body,
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
        $._expression,
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
          $._condition,
          $.declaration_block,
        ),
        seq(
          $._condition,
          $.declaration_block,
          "else",
          $.declaration_block,
        ),
        seq(
          $._condition,
          ":",
          optional(
            $.decl_defs,
          ),
        ),
        seq(
          $._condition,
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
        $._no_scope_non_empty_statement,
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
        $._traits_argument,
        seq(
          $._traits_argument,
          ",",
          $.traits_arguments,
        ),
      ),

    _traits_argument: $ =>
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
          $._integer_expression,
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
          $.operands,
        ),
      ),

    _opcode: $ =>
      $.identifier,

    operands: $ =>
      choice(
        $._operand,
        seq(
          $._operand,
          ",",
          $.operands,
        ),
      ),

    // ---

    _integer_expression: $ =>
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

    _operand: $ =>
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
