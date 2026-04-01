.PHONY: install dev build test docker-up docker-down clean
install:
	npm install
	cd frontend && npm install
dev:
	./scripts/dev.sh
build:
	npm run build
	cd frontend && npm run build
test:
	npm test
	cd frontend && npm test
docker-up:
	docker compose up --build -d
docker-down:
	docker compose down
clean:
	rm -rf node_modules
	rm -rf frontend/node_modules
	docker system prune -f