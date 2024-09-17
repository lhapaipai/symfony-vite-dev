#!/bin/bash

set -e

SCRIPT_DIR="$(dirname "$(readlink -f "$BASH_SOURCE")")"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

pnpm install

cd "$PROJECT_DIR/src/vite-bundle"
symfony composer install

cd "$PROJECT_DIR/src/vite-plugin-symfony"
pnpm run build
