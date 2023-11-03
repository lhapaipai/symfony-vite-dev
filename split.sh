#!/bin/bash

set -e

git subtree push --prefix=src/vite-bundle git@github.com:lhapaipai/vite-bundle.git main
git subtree push --prefix=src/vite-plugin-symfony git@github.com:lhapaipai/vite-plugin-symfony.git main
