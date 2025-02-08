#!/bin/bash

set -e

SCRIPT_DIR="$(dirname "$(readlink -f "$BASH_SOURCE")")"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
PLAYGROUNDS_DIR="$PROJECT_DIR/playground"

for PLAYGROUND_DIR in $PLAYGROUNDS_DIR/*
do
  PLAYGROUND="$(basename $PLAYGROUND_DIR)"

  if [ $PLAYGROUND == "docker" ]
  then
    continue
  fi

  echo "* installing playground $PLAYGROUND"
  cd "$PLAYGROUND_DIR"

  if [ $PLAYGROUND != "vite-only" ]
  then
    echo '  > symfony composer update'
    symfony composer update 1> /dev/null 2>&1 \
      && echo '    [ok]' || echo '    [failed]'
  fi

  if [ $PLAYGROUND == "basic-vite4" ]
  then
    echo '  > pnpm update'
    pnpm update 1> /dev/null \
      && echo '    [ok]' || echo '    [failed]'
  else
    echo '  > pnpm update --latest'
    pnpm update --latest 1> /dev/null \
      && echo '    [ok]' || echo '    [failed]'
  fi
done
