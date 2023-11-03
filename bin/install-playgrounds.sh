#!/bin/bash

set -e

SCRIPT_DIR="$(dirname "$(readlink -f "$BASH_SOURCE")")"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
PLAYGROUNDS_DIR="$PROJECT_DIR/playground"

for PLAYGROUND_DIR in $PLAYGROUNDS_DIR/*
do
  echo "* installing playground $(basename $PLAYGROUND_DIR)"
  cd "$PLAYGROUND_DIR"

  echo '  > npm i'
  npm i 1> /dev/null \
    && echo '    [ok]' || echo '    [failed]'

  echo '  > npm run build'
  npm run build 1> /dev/null \
    && echo '    [ok]' || echo '    [failed]'

  echo '  > symfony composer install'
  symfony composer install 1> /dev/null 2>&1 \
    && echo '    [ok]' || echo '    [failed]'
done