#!/bin/bash

set -e

SCRIPT_DIR="$(dirname "$(readlink -f "$BASH_SOURCE")")"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
PLAYGROUNDS_DIR="$PROJECT_DIR/playground"

cd "$PLAYGROUNDS_DIR/stimulus"
symfony composer install

cd "$PROJECT_DIR"
# we need this because package.json contain reference
# of vendor/symfony/ux-* files
symfony composer install --no-autoloader
pnpm install

cd "$PROJECT_DIR/src/vite-bundle"
symfony composer install

cd "$PROJECT_DIR/src/vite-plugin-symfony"
pnpm install
pnpm run build
