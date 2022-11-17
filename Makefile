dc-up:
	docker-compose up --build

dc-down:
	docker-compose down && echo y | docker image prune

dc-push:
	(cd client && yarn export -o ../server/build)
	docker-compose -f docker-compose.prod.yml build
	docker-compose -f docker-compose.prod.yml push

db-push:
	(cd server && yarn prisma db push)

db-migrate:
	(cd server && DATABASE_URL=$(url) yarn prisma migrate deploy)