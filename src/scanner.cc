#include <tree_sitter/parser.h>

enum TokenType {
  NESTING_BLOCK_COMMENT,
};

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
