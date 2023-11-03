#!/usr/bin/env bash

# inspired from
# https://github.com/laravel/framework/blob/7.x/bin/release.sh

PROJECT_DIR="$(dirname "$(readlink -f "$BASH_SOURCE")")"
VERSION="$1"
RELEASE_BRANCH=main
TMP_DIR=$PROJECT_DIR/.local/splitted-repo

set -e

cd "$PROJECT_DIR"
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)


if (( "$#" != 1 ))
then
    echo "Tag has to be provided."

    exit 1
fi

git fetch origin

# Make sure current branch and release branch match.
if [[ "$RELEASE_BRANCH" != "$CURRENT_BRANCH" ]]
then
    echo "Release branch ($RELEASE_BRANCH) does not match the current active branch ($CURRENT_BRANCH)."

    exit 1
fi

# Make sure the working directory is clear.
if [[ ! -z "$(git status --porcelain)" ]]
then
    echo "Your working directory is dirty. Did you forget to commit your changes?"

    exit 1
fi


cd "$PROJECT_DIR/src/vite-plugin-symfony"
npm --no-git-tag-version version $VERSION

cd "$PROJECT_DIR"

git add .
git commit -m 'change vite-plugin-symfony package.json version'

git tag -a $VERSION -m $VERSION

git push origin


# vite-bundle
rm -rf $TMP_DIR
mkdir --parents "$TMP_DIR"

cd $TMP_DIR
git clone git@github.com:lhapaipai/vite-bundle.git .
git checkout "$RELEASE_BRANCH"
# prepend with "v"
git tag -a "v$VERSION" -m "v$VERSION"
git push origin --tags

# vite-plugin-symfony
rm -rf $TMP_DIR
mkdir --parents "$TMP_DIR"

cd $TMP_DIR
git clone git@github.com:lhapaipai/vite-plugin-symfony.git .
git checkout "$RELEASE_BRANCH"
git tag -a "$VERSION" -m "$VERSION"
git push origin --tags