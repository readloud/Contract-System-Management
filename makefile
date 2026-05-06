# ============================================
# MAKEFILE - Contract Management System
# ============================================

.PHONY: help setup install dev build clean

# Colors
GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
WHITE  := $(shell tput -Txterm setaf 7)
RESET  := $(shell tput -Txterm sgr0)

help: ## Show this help message
	@echo ''
	@echo '${YELLOW}Contract Management System - Commands${RESET}'
	@echo ''
	@echo '${GREEN}Usage:${RESET}'
	@echo '  make <command>'
	@echo ''
	@echo '${GREEN}Available commands:${RESET}'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  ${GREEN}%-20s${RESET} %s\n", $$1, $$2}'

setup: ## Generate package-lock.json untuk semua service
	@echo "${YELLOW}📦 Generating package-lock.json for all services...${RESET}"
	@echo ""
	@echo "${GREEN}1. Setting up backend...${RESET}"
	cd backend && npm install --package-lock-only
	@echo "${GREEN}2. Setting up frontend...${RESET}"
	cd frontend && npm install --package-lock-only --legacy-peer-deps
	@echo "${GREEN}3. Setting up realtime...${RESET}"
	cd realtime && npm install --package-lock-only
	@echo ""
	@echo "${GREEN}✅ All package-lock.json files created!${RESET}"
	@ls -la backend/package-lock.json frontend/package-lock.json realtime/package-lock.json

setup-docker: ## Generate package-lock.json using Docker
	@echo "${YELLOW}📦 Generating package-lock.json using Docker...${RESET}"
	docker-compose -f docker-compose.setup.yml up --remove-orphans
	docker-compose -f docker-compose.setup.yml down
	@echo "${GREEN}✅ Done!${RESET}"

install: ## Install all dependencies (without Docker)
	@echo "${YELLOW}📦 Installing dependencies...${RESET}"
	cd backend && npm install
	cd frontend && npm install
	cd realtime && npm install
	@echo "${GREEN}✅ All dependencies installed!${RESET}"

dev: ## Run development environment with Docker
	@echo "${YELLOW}🚀 Starting development environment...${RESET}"
	docker-compose up

dev-detach: ## Run development environment in background
	@echo "${YELLOW}🚀 Starting development environment (detached)...${RESET}"
	docker-compose up -d
	@echo "${GREEN}✅ Services running!${RESET}"
	@echo "Frontend:  http://localhost:3000"
	@echo "Backend:   http://localhost:3001"
	@echo "Realtime:  ws://localhost:1234"

build: ## Build all Docker images
	@echo "${YELLOW}🔨 Building Docker images...${RESET}"
	docker-compose build

clean: ## Clean all containers, volumes, and node_modules
	@echo "${YELLOW}🧹 Cleaning up...${RESET}"
	docker-compose down -v
	rm -rf backend/node_modules backend/package-lock.json
	rm -rf frontend/node_modules frontend/package-lock.json
	rm -rf realtime/node_modules realtime/package-lock.json
	@echo "${GREEN}✅ Cleanup complete!${RESET}"

logs: ## Show logs from all services
	docker-compose logs -f

status: ## Show status of all services
	docker-compose ps

shell-backend: ## Open shell in backend container
	docker exec -it cms-backend sh

shell-frontend: ## Open shell in frontend container
	docker exec -it cms-frontend sh

shell-realtime: ## Open shell in realtime container
	docker exec -it cms-realtime sh

migrate: ## Run database migrations
	docker exec -it cms-backend npm run migration:run

seed: ## Seed database with initial data
	docker exec -it cms-backend npm run seed

test-backend: ## Run backend tests
	cd backend && npm run test

test-frontend: ## Run frontend tests
	cd frontend && npm run test

build-prod: ## Build for production
	@echo "${YELLOW}🔨 Building production images...${RESET}"
	docker-compose -f docker-compose.prod.yml build

deploy-prod: ## Deploy to production
	@echo "${YELLOW}🚀 Deploying to production...${RESET}"
	docker-compose -f docker-compose.prod.yml up -d
	@echo "${GREEN}✅ Production deployed!${RESET}"