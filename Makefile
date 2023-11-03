
help: ## Outputs this help screen
	@grep -E '(^[a-zA-Z0-9\./_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}{printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'

install: ## Install vite-bundle/vite-plugin-symfony dependencies
	./bin/install.sh

install-playgrounds: ## Install playgrounds (npm i/composer i)
	./bin/install-playgrounds.sh

tests: ## run vite-bundle/vite-plugin-symfony tests
	cd src/vite-bundle && ./bin/phpunit
	cd src/vite-plugin-symfony && npm run test-run