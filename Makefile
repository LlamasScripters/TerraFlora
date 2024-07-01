DOCKER_COMPOSE = docker-compose

EXEC_DB   = $(DOCKER_COMPOSE) exec postgres
EXEC_NODE = $(DOCKER_COMPOSE) exec server
EXEC_VUE  = $(DOCKER_COMPOSE) exec client

##
## Project
## -------
##

install: ## Install and start the project
install: build start
.PHONY: install

build: ## Build the Docker images
	$(DOCKER_COMPOSE) build --force-rm --compress
.PHONY: build

start: ## Start the project
	$(DOCKER_COMPOSE) up -d --remove-orphans --force-recreate
.PHONY: start

kill: ## Stop all containers
	$(DOCKER_COMPOSE) kill
	$(DOCKER_COMPOSE) down --volumes --remove-orphans
.PHONY: kill

reset: ## Stop and start a fresh install of the project
reset: kill install
.PHONY: reset

restart: ## Stop, kill, build and restart project
restart: kill build start
.PHONY: restart

##
## Tools
## -----
##

db-reset: ## Reset dump
db-reset:
	docker-compose exec -T postgres psql app < db/dump/db.sql
.PHONY: db-reset

db-import: ## Import dump
db-import:
	docker-compose exec -T postgres psql app < db/dump/dump.sql
.PHONY: db-import

db-dump: ## Dump database
db-dump:
	#docker-compose exec -T postgres pg_dump --clean --create --schema-only app > db/dump/dump.sql
	docker-compose exec -T postgres pg_dump --data-only app > db/dump/dump.sql
.PHONY: db-dump

db-sync-mongo:
db-sync-mongo:
	docker-compose exec -T server node insertProductToMongo.js
.PHONY: db-sync-mongo

vue-logs: #Enter app container and show logs
vue-logs:
	$(DOCKER_COMPOSE) logs -f client
.PHONY: client-vue

node-logs: #Enter node container and show logs
node-logs:
	$(DOCKER_COMPOSE) logs -f server
.PHONY: node-logs

enter-db:
enter-db:
	$(EXEC_DB) bash
.PHONY: enter-db

enter-node:
enter-node:
	$(EXEC_NODE) sh
.PHONY: enter-node

enter-vue:
enter-vue:
	$(EXEC_VUE) sh
.PHONY: enter-vue

