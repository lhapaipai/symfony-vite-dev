NODE_RUN = docker run \
		--rm \
		-ti \
		-v $(PWD):/app \
		-w /app \
		node:21-alpine

# Executables (local)
DOCKER_COMP = docker compose

# Docker containers
PHP_CONT = $(DOCKER_COMP) exec php

# Executables
PHP      = $(PHP_CONT) php
COMPOSER = $(PHP_CONT) composer
SYMFONY  = $(PHP) bin/console


help: ## Outputs this help screen
	@grep -E '(^[a-zA-Z0-9\./_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}{printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'

vite-dev: ## run vite dev server
	docker run \
		--rm \
		-ti \
		-v $(PWD):/app \
		-p 5173:5173 \
		-w /app \
		node:21-alpine \
		npm run dev

vite-build: ## build js files
	$(NODE_RUN)	npm run build

npm-install: ## within node:21-alpine
	$(NODE_RUN)	npm install

composer: ## Run composer, pass the parameter "c=" to run a given command, example: make composer c='req symfony/orm-pack'
	@$(eval c ?=)
	@$(COMPOSER) $(c)
