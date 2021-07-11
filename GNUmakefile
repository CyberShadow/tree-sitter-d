# Configuration

TREE_SITTER=node_modules/.bin/tree-sitter
DOCKER_FLAG=--docker
SO_SUFFIX=.so

# Constants

PARSER=src/parser.c
XDG_CACHE_HOME=$(HOME)/.cache
SO=$(XDG_CACHE_HOME)/tree-sitter/lib/d$(SO_SUFFIX)
WASM=tree-sitter-d.wasm
TEST_TS_FILES=$(shell find test/corpus -type f)
TEST_TS_OK=test/tmp/tree-sitter-test.ok
TEST_PARSE_SUCCESS_OK=test/tmp/parse-success.ok
TEST_PARSE_SUCCESS_XFAIL_OK=$(addsuffix .ok,$(subst test/parse-success-xfail/,test/tmp/parse-success-xfail/,$(shell find test/parse-success-xfail -type f)))

# Entry points

all : compile
parser : $(PARSER)
compile : $(SO)
wasm : $(WASM)

test : test-ts test-parse-success test-parse-success-xfail
test-ts : $(TEST_TS_OK)
test-parse-success : $(TEST_PARSE_SUCCESS_OK)
test-parse-success-xfail : $(TEST_PARSE_SUCCESS_XFAIL_OK)

# Implementation

.PHONY : all parser compile wasm test test-ts test-parse-success test-parse-success-xfail web-ui

# The default is to use the tree-sitter version which would be
# installed by npm (according to package.json / package-lock.json).
# If it hasn't been installed yet, do so automatically.
node_modules/.bin/tree-sitter :
	npm install

# Build the grammar (grammar.json, parser.c etc.)
$(PARSER) : grammar.js src/scanner.cc $(TREE_SITTER)
	$(TREE_SITTER) generate

# Build a shared object binary from the parser
# This file mainly exists to avoid race conditions / duplicate work
# when running the test targets in parallel.
$(SO) : $(PARSER)
	@# No explicit "compile" command, so just parse an empty file
	$(TREE_SITTER) parse -q /dev/null

# Build a WASM binary from the parser
# The default is to use Docker, which will ensure that the correct version is used
# (https://github.com/tree-sitter/tree-sitter/pull/1180).
# Run with DOCKER_FLAG= to use the host Emscripten version.
$(WASM) : $(PARSER)
	$(TREE_SITTER) build-wasm $(DOCKER_FLAG)

# Launch web-ui
web-ui : $(WASM)
	$(TREE_SITTER) web-ui

# tree-sitter test suite
$(TEST_TS_OK) : $(TEST_TS_FILES) $(SO)
	$(TREE_SITTER) test
	@touch $@

# parse-success
$(TEST_PARSE_SUCCESS_OK) : $(SO)
	find test/parse-success -type f | $(TREE_SITTER) parse -q --paths /dev/stdin
	@touch $@

# parse-success-xfail
test/tmp/parse-success-xfail/%.ok : test/parse-success-xfail/% $(SO)
	if $(TREE_SITTER) parse -q $< ; then exit 1 ; fi
	@mkdir -p "$$(dirname $@)"
	@touch $@
