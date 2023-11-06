#!/usr/bin/env bash

# inspired from
# https://github.com/laravel/framework/blob/7.x/bin/release.sh

SCRIPT_DIR="$(dirname "$(readlink -f "$BASH_SOURCE")")"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

set -e

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


if egrep '^[0-9]+\.[0-9]+\.[0-9]+' <<< "$VERSION" > /dev/null 2>&1
then
    n=${VERSION//[!0-9]/ }
    a=(${n//\./ })
    MAJOR_VERSION=${a[0]}
    MINOR_VERSION=${a[1]}
    PATCH_VERSION=${a[2]}
else
    echo "Invalid version number x.y.z"
    exit 1
fi

# # Make sure the working directory is clear.
# if [[ ! -z "$(git status --porcelain)" ]]
# then
#     echo "Your working directory is dirty. Did you forget to commit your changes?"
#     exit 1
# fi

git pull origin


BUNDLE_FILE="$PROJECT_DIR/src/vite-bundle/src/PentatrionViteBundle.php"

BUNDLE_VERSION_STRING="['$VERSION', $MAJOR_VERSION, $MINOR_VERSION, $PATCH_VERSION]"
sed -i -e "s/const VERSION = [^;]\+;/const VERSION = $BUNDLE_VERSION_STRING;/g" "$BUNDLE_FILE"


PACKAGE_JSON_FILE="$PROJECT_DIR/src/vite-bundle/install/package.json"
sed -i -e "s/\"vite-plugin-symfony\": \"\^[\.0-9]\+\"/\"vite-plugin-symfony\": \"^$MAJOR_VERSION.$MINOR_VERSION\"/g" "$PACKAGE_JSON_FILE"


# Make sure current branch and release branch match.
if [[ "$RELEASE_BRANCH" != "$CURRENT_BRANCH" ]]
then
    echo "Release branch ($RELEASE_BRANCH) does not match the current active branch ($CURRENT_BRANCH)."
    exit 1
fi



cd "$PROJECT_DIR/src/vite-plugin-symfony"
npm --no-git-tag-version --allow-same-version version $VERSION


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
git tag -a "v$VERSION" -m "v$VERSION"
git push origin --tags

