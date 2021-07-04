#!/bin/bash
set -eEuo pipefail
shopt -s lastpipe

cd ~/work/tree-sitter-d
./-/m

rm -rf test/parse-success{,-xfail}/dmd-compilable
cp -a ~/work/extern/D/dmd/test/compilable test/parse-success/dmd-compilable
find test/parse-success/dmd-compilable -type f -not -\( -name '*.d' -o -name '*.di' -\) -print -delete
find test/parse-success -type f | ( ./-/t parse -q --paths /dev/stdin 2>&1 || true ) | awk '{print $1}' | mapfile -t files
if [[ ${#files[@]} -eq 0 ]] ; then exit ; fi
greplace test/parse-success{,-xfail} "${files[@]}"
