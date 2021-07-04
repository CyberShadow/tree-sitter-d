#!/bin/bash
TREE_SITTER_BASE_DIR="$HOME"/work/extern/tree-sitter exec make TREE_SITTER=~/work/extern/tree-sitter/target/release/tree-sitter "$@"
