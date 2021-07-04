#!/bin/bash
# shellcheck disable=SC2016
# shellcheck disable=SC1003
set -eEuo pipefail

src=~/work/tree-sitter-d/grammar.js

while true
do
	# if ./build-and-merge.sh > output.txt 2>&1
	if env -C "$(dirname "$src")" ./-/t generate > output.txt 2>&1
	then
		exit # Done?
	fi

	line=$(
		sed -n 's/.*Add a conflict for these rules: `\(.*\)`$/[$.\1],/p' output.txt |
			sed 's/`, `/, $./g'
	)

	# printf '%s\n' "$line"
	# break

	if [[ -z "$line" ]]
	then
		exit 1
	fi

	if grep -qF '// '"$line" "$src"
	then
		greplace -f '// '"$line" "$line" "$src"
	else
		sed -i '/<-- insert here/i\    '"$line" "$src"
	fi
done
