dc-up:
	docker-compose up --build

dc-down:
	docker-compose down && echo y | docker image prune

dc-re:
	make dc-down && make dc-up

dc-push:
	(cd client && yarn export -o ../server/build)
	docker-compose -f docker-compose.prod.yml build
	docker-compose -f docker-compose.prod.yml push

db-push:
	(cd server && yarn prisma db push)

db-migrate:
	(cd server && DATABASE_URL=$(url) yarn prisma db push)

atlas-inspect:
	echo "atlas-inspect"

atlas-apply:
	echo "atlas-apply"