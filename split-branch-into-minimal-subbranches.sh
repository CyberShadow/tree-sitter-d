#!/bin/bash
set -eEuo pipefail

branch=grammar2x
base=master

cd ~/work/tree-sitter-d-generator/generator/dlang.org

git checkout -q "$base" # Ensure we are not on a branch which we are about to delete

git show-ref --heads |
	( grep -F " refs/heads/$branch-" || true ) |
	while read -r hash ref
	do
		printf 'Deleting %s (was at %s)\n' "$ref" "$hash"
		git update-ref -d "$ref"
	done

num_branches=0

git log --reverse --pretty=format:%H "$base".."$branch" |
	while IFS= read -r hash
	do
		git checkout -q -B "$branch-$num_branches" "$base"
		if git cherry-pick "$hash"
		then
			num_branches=$((num_branches + 1))
			continue
		else
			git cherry-pick --abort
		fi

		added=false
		for (( i=0; i<num_branches; i++ ))
		do
			git checkout -q "$branch-$i"
			if git cherry-pick "$hash"
			then
				added=true
				break
			else
				git cherry-pick --abort
			fi
		done

		if ! $added
		then
			printf 'Failed to find a home for %s\n' "$hash" 1>&2
			exit 1
		fi
	done
