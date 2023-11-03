#!/bin/bash

SCRIPT_DIR="$(dirname "$(readlink -f "$BASH_SOURCE")")"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
PLAYGROUNDS_DIR="$PROJECT_DIR/playground"

for PLAYGROUND_DIR in $PLAYGROUNDS_DIR/*
do
  cd "$PLAYGROUND_DIR"
  composer install
done