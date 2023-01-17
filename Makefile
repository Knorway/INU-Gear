include .env

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
	(cd server && DATABASE_URL=${DATABASE_URL} yarn prisma migrate deploy)

atlas-inspect:
	echo "atlas-inspect"

atlas-apply:
	echo "atlas-apply"

swarm-deploy:
	ssh ${TUNNEL_MANAGER_NODE} '/root/up.sh'

# 루트카메라는 최다판매량과 평균 구매평점 4.9이상의 
# 후기를 갖춘 검증 된 상품을 보장해드려요 