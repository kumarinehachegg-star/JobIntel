.PHONY: dev install build lint backend-setup frontend-setup

dev:
	npm run dev

install:
	npm run install:all

build:
	npm run build

lint:
	npm run lint

backend-setup:
	cd backend && npm install

frontend-setup:
	cd frontend && npm install
