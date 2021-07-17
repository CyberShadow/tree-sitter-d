#!/bin/bash
set -eEuo pipefail
shopt -s lastpipe

branch=grammar2x
base=master

cd ~/work/tree-sitter-d-generator/generator/dlang.org

old_branch=$(git rev-parse --abbrev-ref HEAD)

git checkout -q "$base" # Ensure we are not on a branch which we are about to delete

git show-ref --heads |
	( grep -F " refs/heads/$branch-" || true ) |
	while read -r hash ref
	do
		printf 'Deleting %s (was at %s)\n' "$ref" "$hash"
		git update-ref -d "$ref"
	done

branches=()

git log --reverse --pretty=tformat:$'%H\t%at\t%f' "$base".."$branch" |
	while IFS=$'\t' read -r hash date slug
	do
		subbranch=$branch-$slug
		git checkout -q -B "$subbranch" "$base"
		if GIT_COMMITTER_DATE=$date git -c commit.gpgsign=false cherry-pick "$hash"
		then
			branches+=("$subbranch")
			continue
		else
			git cherry-pick --abort
			git checkout -q "$base"
			git update-ref -d refs/heads/"$subbranch"
		fi

		added=false
		for subbranch in "${branches[@]}"
		do
			git checkout -q "$subbranch"
			if GIT_COMMITTER_DATE=$date git -c commit.gpgsign=false cherry-pick "$hash"
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

git push --force-with-lease my "${branches[@]}"

printf '%s\n' "${branches[@]}" |
	grep -vxFf <(
		curl 'https://api.github.com/repos/dlang/dlang.org/pulls?state=all&per_page=100' |
		jq -r '.[] | select(.user.login == "CyberShadow") | .head.ref'
	) |
	while read -r subbranch
	do
		xdg-open "https://github.com/CyberShadow/d-programming-language.org/pull/new/$subbranch"
	done

if [[ -n "$old_branch" ]]
then
	git checkout -q "$old_branch"
fi
