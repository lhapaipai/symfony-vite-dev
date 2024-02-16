
help: ## Outputs this help screen
	@grep -E '(^[a-zA-Z0-9\./_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}{printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'

install: ## Install vite-bundle/vite-plugin-symfony dependencies
	./bin/install.sh

install-playgrounds: ## Install playgrounds (pnpm i/composer i)
	./bin/install-playgrounds.sh

ci-cd:
	cd src/vite-bundle && composer run ci-check
	cd src/vite-plugin-symfony && pnpm run tsc:check && pnpm run lint:check
	make tests

tests: ## run vite-bundle/vite-plugin-symfony tests
	cd src/vite-bundle && ./bin/phpunit
	cd src/vite-plugin-symfony && pnpm run test-run

phpstan-82:
	cd src/vite-bundle && \
		rm -r vendor/ composer.lock && \
		php8.2 /usr/local/bin/composer install && \
		composer run phpstan-82

phpstan-80:
	cd src/vite-bundle && \
		rm -r vendor/ composer.lock && \
		php8.0 /usr/local/bin/composer install && \
		composer run phpstan-80