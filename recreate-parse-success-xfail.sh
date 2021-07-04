#!/bin/bash
set -eEuo pipefail
shopt -s lastpipe

cd ~/work/tree-sitter-d
./-/m

rm -rf test/parse-success{,-xfail}
git checkout test/parse-success{,-xfail}
greplace test/parse-success{-xfail,} test/parse-success-xfail
find test/parse-success -type f | ( ./-/t parse -q --paths /dev/stdin 2>&1 || true ) | awk '{print $1}' | mapfile -t files
greplace test/parse-success{,-xfail} "${files[@]}"
