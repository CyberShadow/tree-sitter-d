#include <tree_sitter/parser.h>
#include <vector>

enum TokenType {
  NESTING_BLOCK_COMMENT,
  DELIMITED_STRING,
};

// This is only an approximation of the exact definition.
static bool is_identifier_char(int32_t c) {
  return
    (c >= 'a' && c <= 'z') ||
    (c >= 'A' && c <= 'Z') ||
    (c >= '0' && c <= '9') ||
    c == '_';
}

extern "C" {

void *tree_sitter_d_external_scanner_create() {
  return NULL;
}

bool tree_sitter_d_external_scanner_scan(void *payload, TSLexer *lexer,
                                         const bool *valid_symbols) {
  if (lexer->lookahead == '/' && valid_symbols[NESTING_BLOCK_COMMENT]) {
    lexer->advance(lexer, false);
    if (lexer->lookahead != '+') {
      return false;
    }
    lexer->advance(lexer, false);

    size_t depth = 1;
    int32_t last = 0;
    while (depth > 0) {
      last = lexer->lookahead;
      lexer->advance(lexer, false);
      if (last == '/' && lexer->lookahead == '+') {
        depth++;
        last = 0;
        lexer->advance(lexer, false);
      } else if (last == '+' && lexer->lookahead == '/') {
        depth--;
        last = 0;
        lexer->advance(lexer, false);
      } else if (lexer->lookahead == 0) {
        return false; // EOF
      }
    }
    lexer->advance(lexer, false);
    lexer->result_symbol = NESTING_BLOCK_COMMENT;
    return true;
  }

  if (lexer->lookahead == 'q' && valid_symbols[DELIMITED_STRING]) {
    lexer->advance(lexer, false);
    if (lexer->lookahead != '"') {
      return false;
    }
    lexer->advance(lexer, false);
    lexer->result_symbol = DELIMITED_STRING;

    int32_t opener = lexer->lookahead, closer;
    switch (opener) {
      case '(': closer = ')'; break;
      case '[': closer = ']'; break;
      case '{': closer = '}'; break;
      case '<': closer = '>'; break;
      default:
      {
        // Handle the identifier case
        std::vector<int32_t> delimiter;
        delimiter.push_back('\n');
        while (lexer->lookahead != '\n') {
          if (!is_identifier_char(lexer->lookahead))
            return false; // bad syntax or EOF
          delimiter.push_back(lexer->lookahead);
          lexer->advance(lexer, false);
        }
        delimiter.push_back('"');

        size_t delimiter_pos = 0;
        while (true) {
          if (lexer->lookahead == 0)
            return false; // EOF
          if (delimiter_pos == delimiter.size())
            return true;
          if (lexer->lookahead == delimiter.at(delimiter_pos))
            delimiter_pos++;
          else
            delimiter_pos = lexer->lookahead == delimiter.at(0) ? 1 : 0;
          lexer->advance(lexer, false);
        }
      }
    }

    // Handle the punctuation case
    size_t depth = 1;
    while (depth > 0) {
      lexer->advance(lexer, false);
      if (lexer->lookahead == opener) {
        depth++;
      } else if (lexer->lookahead == closer) {
        depth--;
      } else if (lexer->lookahead == 0) {
        return false; // EOF
      }
    }
    lexer->advance(lexer, false); // last closer
    if (lexer->lookahead != '"')
      return false;
    lexer->advance(lexer, false); // "
    return true;
  }

  return false;
}

unsigned tree_sitter_d_external_scanner_serialize(void *payload, char *buffer) {
  return 0;
}

void tree_sitter_d_external_scanner_deserialize(void *payload, const char *buffer, unsigned length) {
}

void tree_sitter_d_external_scanner_destroy(void *payload) {
}

}
