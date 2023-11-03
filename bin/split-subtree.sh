#!/bin/bash

SCRIPT_DIR="$(dirname "$(readlink -f "$BASH_SOURCE")")"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

set -e

cd $PROJECT_DIR

# Make sure the working directory is clear.
if [[ ! -z "$(git status --porcelain)" ]]
then
    echo "Your working directory is dirty. Did you forget to commit your changes?"

    exit 1
fi

git subtree push --prefix=src/vite-bundle git@github.com:lhapaipai/vite-bundle.git main
git subtree push --prefix=src/vite-plugin-symfony git@github.com:lhapaipai/vite-plugin-symfony.git main
