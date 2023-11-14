#!/bin/bash

set -e

SCRIPT_DIR="$(dirname "$(readlink -f "$BASH_SOURCE")")"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
PLAYGROUNDS_DIR="$PROJECT_DIR/playground"


cd "$PROJECT_DIR"
# we need this because package.json contain reference
# of vendor/symfony/ux-* files
composer install --no-autoloader
npm i

cd "$PROJECT_DIR/src/vite-bundle"
symfony composer install

cd "$PROJECT_DIR/src/vite-plugin-symfony"
npm ci
npm run build
