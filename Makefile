include .env

dev-up:
	docker-compose up --build

dev-down:
	docker-compose down && echo y | docker image prune

dev-re:
	make dev-down && make dev-up

build-push:
	(cd client && yarn export -o ../server/build)
	docker-compose -f docker-compose.prod.yml build
	docker-compose -f docker-compose.prod.yml push

db-push:
	(cd server && yarn prisma db push)

db-migrate:
	(cd server && DATABASE_URL=${DATABASE_URL} yarn prisma migrate deploy)

atlas-inspect:
	echo "atlas-inspect"

atlas-apply:
	echo "atlas-apply"

swarm-deploy:
	ssh ${TUNNEL_MANAGER_NODE} '/root/up.sh'

sync-commit:
	git push origin main
	make build-push
	make swarm-deploy