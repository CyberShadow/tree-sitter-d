#!/bin/bash
set -eEuo pipefail

# shellcheck disable=SC1090
source ~/lib/d-ver.sh

rm -rf ~/work/tree-sitter-d-tmp/tree-sitter-d/test
cp -a ~/work/{,tree-sitter-d-tmp/}tree-sitter-d/test
cd ~/work/tree-sitter-d-tmp/tree-sitter-d
./-/m test -j
