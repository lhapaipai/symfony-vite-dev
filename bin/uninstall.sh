#!/bin/bash

set -e

SCRIPT_DIR="$(dirname "$(readlink -f "$BASH_SOURCE")")"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
PLAYGROUNDS_DIR="$PROJECT_DIR/playground"

for PLAYGROUND_DIR in $PLAYGROUNDS_DIR/*
do
  PLAYGROUND="$(basename $PLAYGROUND_DIR)"
  echo "* uninstall playground $PLAYGROUND"
  cd "$PLAYGROUND_DIR"

  rm -rf var/cache/*
  rm -rf composer.lock
  rm -rf vendor
  rm -rf node_modules
  rm -rf pnpm-lock.yaml
done


cd "$PROJECT_DIR/docs"
rm -rf node_modules
rm -rf pnpm-lock.yaml


cd "$PROJECT_DIR/src/vite-plugin-symfony"
rm -rf node_modules
rm -rf pnpm-lock.yaml

cd "$PROJECT_DIR"
rm -rf node_modules
rm -rf pnpm-lock.yaml