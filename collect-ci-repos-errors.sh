#!/bin/bash
set -eEuo pipefail

# Script to generate the initial list in
# https://github.com/CyberShadow/tree-sitter-d/issues/3

cd ~/work/tree-sitter-d

find ../tree-sitter-d-ci-repos -type f -\( -name '*.d' -o -name '*.di' -\) |
	grep -v ' ' |
	./-/t parse -q --paths /dev/stdin |
	while read -r line
	do
		if [[ "$line" =~ ^\.\./tree-sitter-d-ci-repos/([^/]*)/([^/]*)/([^ ]*)\ *\	[0-9]*\ ms\	\((.*\ \[([0-9]+),\ [0-9]+\]\ -\ \[([0-9]+),\ [0-9]+\])\)$ ]]
		then
			user=${BASH_REMATCH[1]}
			repo=${BASH_REMATCH[2]}
			path=${BASH_REMATCH[3]}
			error=${BASH_REMATCH[4]}
			line1=${BASH_REMATCH[5]}
			line2=${BASH_REMATCH[6]}
			commit=$(git -C "../tree-sitter-d-ci-repos/$user/$repo" rev-parse HEAD)
			echo "- [ ] [$user/$repo: $path](https://github.com/$user/$repo/blob/$commit/$path#L$((1+line1))-L$((1+line2))) - \`$error\`"
		else
			printf 'Unable to parse line: %s\n' "$line" 1>&2
		fi
	done
