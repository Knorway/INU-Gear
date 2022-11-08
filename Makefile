dc-up:
	docker-compose up --build

dc-down:
	docker-compose down && echo y | docker image prune

migrate:
	DATABASE_URL=$(url) prisma migrate deploy