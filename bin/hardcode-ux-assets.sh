#!/bin/bash

set -e

SCRIPT_DIR="$(dirname "$(readlink -f "$BASH_SOURCE")")"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
PLAYGROUNDS_DIR="$PROJECT_DIR/playground"
DEST_DIR="$PROJECT_DIR/extra/ux-assets"

cd "$PLAYGROUNDS_DIR/stimulus"

composer install

for PACKAGE in ux-autocomplete ux-chartjs ux-cropperjs ux-dropzone ux-lazy-image ux-live-component ux-notify ux-react ux-svelte ux-swup ux-toggle-password ux-translator ux-turbo ux-typed ux-vue
do
  rm -rf "$DEST_DIR/$PACKAGE"
  cp -r vendor/symfony/$PACKAGE/assets "$DEST_DIR/$PACKAGE"
done
