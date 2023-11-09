#!/bin/bash

set -e

SCRIPT_DIR="$(dirname "$(readlink -f "$BASH_SOURCE")")"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
PLAYGROUNDS_DIR="$PROJECT_DIR/playground"

# we need this because PROJECT_DIR contain reference
# of file:playground/stimulus/vendor/symfony files
cd "$PLAYGROUNDS_DIR/stimulus"
symfony composer install

cd "$PROJECT_DIR"
npm ci

cd "$PROJECT_DIR/src/vite-bundle"
symfony composer install

cd "$PROJECT_DIR/src/vite-plugin-symfony"
npm ci
npm run build
