console								:= /usr/bin/php -dxdebug.mode=off bin/console

.PHONY: help
help:
	@grep -E '(^[a-zA-Z_-]+:.*?## .*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-22s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'


.PHONY: routes
routes:	## generate fos-routes.json
	$(console) fos:js-routing:dump --format=json --target=var/cache/fos-routes.json