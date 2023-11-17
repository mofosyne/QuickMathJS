.DEFAULT_GOAL := help
NPM := npm

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: install
install: ## Install project dependencies
	$(NPM) install

.PHONY: start
start: ## Start the application
	$(NPM) start

.PHONY: test
test: ## Test the application
	$(NPM) test
