#!/bin/bash
set -eEuo pipefail

# Script to update the list in
# https://github.com/CyberShadow/tree-sitter-d/issues/3

function read_errors()
{
	local lines_var=$1
	local order_var=$2
	declare -Ag "$lines_var"
	declare -ag "$order_var"
	local -n lines="$lines_var"
	local -n order="$order_var"
	while read -r line
	do
		if [[ "$line" =~ ^-\ \[\ \]\ \[([^/]*)/([^/]*):\ ([^\]]*)\].* ]]
		then
			user=${BASH_REMATCH[1]}
			repo=${BASH_REMATCH[2]}
			path=${BASH_REMATCH[3]}
			full_path=$user/$repo/$path
			lines[$full_path]=$line
			order+=("$full_path")
		else
			printf 'Unable to parse line: %s\n' "$line" 1>&2
		fi
	done
}

read_errors old_lines old_order < ci-repos-errors.txt
read_errors new_lines new_order < ci-repos-errors-2.txt

for full_path in "${old_order[@]}"
do
	if [[ -v new_lines[$full_path] ]]
	then
		line=${new_lines[$full_path]}
	else
		line=${old_lines[$full_path]}
		line=${line/- \[ \] /- [X] }
	fi
	printf '%s\n' "$line"
done

# while read -r line
# do
# 	if [[ "$line" =~ ^-\ \[\ \]\ \[([^/]*)/([^/]*):\ ([^\]]*)\].* ]]
# 	then
# 		user=${BASH_REMATCH[1]}
# 		repo=${BASH_REMATCH[2]}
# 		path=${BASH_REMATCH[3]}
# 		full_path=$user/$repo/$path
# 		old_md[$full_path]=$line
# 	else
# 		printf 'Unable to parse line: %s\n' "$line" 1>&2
# 	fi
# done < ci-repos-errors.txt


# find ../tree-sitter-d-ci-repos -type f -\( -name '*.d' -o -name '*.di' -\) |
# 	grep -v ' ' |
# 	./-/t parse -q --paths /dev/stdin |
# 	while read -r line
# 	do
# 		if [[ "$line" =~ ^\.\./tree-sitter-d-ci-repos/([^/]*)/([^/]*)/([^ ]*)\ *\	[0-9]*\ ms\	\((.*\ \[([0-9]+),\ [0-9]+\]\ -\ \[([0-9]+),\ [0-9]+\])\)$ ]]
# 		then
# 			user=${BASH_REMATCH[1]}
# 			repo=${BASH_REMATCH[2]}
# 			path=${BASH_REMATCH[3]}
# 			error=${BASH_REMATCH[4]}
# 			line1=${BASH_REMATCH[5]}
# 			line2=${BASH_REMATCH[6]}
# 			commit=$(git -C "../tree-sitter-d-ci-repos/$user/$repo" rev-parse HEAD)
# 			echo "- [ ] [$user/$repo: $path](https://github.com/$user/$repo/blob/$commit/$path#L$((1+line1))-L$((1+line2))) - \`$error\`"
# 		else
# 			printf 'Unable to parse line: %s\n' "$line" 1>&2
# 		fi
# 	done
