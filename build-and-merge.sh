#!/bin/bash
set -eEuo pipefail

# shellcheck disable=SC1090
source ~/lib/d-ver.sh

cd ~/work/tree-sitter-d-generator/generator
( d_ldc ; drun -O -inline source/generator )

rm -rf ~/work/tree-sitter-d-tmp
mkdir ~/work/tree-sitter-d-tmp
cp -a ~/work/tree-sitter-d ~/work/tree-sitter-d-tmp/
cd ~/work/tree-sitter-d-tmp/tree-sitter-d
git add -A .
git commit -qam 'draft trial' || true
git checkout -q generated
git fetch generator
git reset -q --hard generator/generated
cp -a ~/work/tree-sitter-d-generator/grammar.js ./grammar.js
git commit -qam 'draft trial' || true
git checkout -q master
git merge -q generated --no-edit

#./node_modules/.bin/tree-sitter generate
# git clean -fdx
./-/m test
