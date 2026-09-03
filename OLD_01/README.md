# Scrum pokeR

> It's a monorepo, a monolithic.

Created with:
- Nestjs
- Vite
- React
---
<div>
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
    <img width="120" src="https://vitejs.dev/logo.svg" alt="Vite logo">
    <img width="120" src="https://raw.githubusercontent.com/facebook/react/main/fixtures/dom/public/react-logo.svg" alt="Preact logo">
</div>

---

---

[How to run it](/docs/README.md)ss


npm run typeorm migration:run -- -d ./src/config/migration.config.ts

npm run typeorm migration:generate -- -d ./src/config/migration.config.ts migrations/addAdminToRoomm

docker exec $container_name psql -d $POSTGRES_DATABASE -U $POSTGRES_USER -c "SELECT * FROM room"

container_name="dokku.postgres.scrum-poker-db"; POSTGRES_USER="postgres"; POSTGRES_DATABASE="scrum_poker_db"; docker exec $container_name psql -d $POSTGRES_DATABASE -U $POSTGRES_USER -c "select * from room"

container_name="dokku.postgres.scrum-poker-db"; POSTGRES_USER="postgres"; POSTGRES_DATABASE="scrum_poker_db"; docker exec $container_name psql -d $POSTGRES_DATABASE -U $POSTGRES_USER -c "update room set admin='1'"

container_name="dokku.postgres.scrum-poker-dev-db"; POSTGRES_USER="postgres"; POSTGRES_DATABASE="scrum_poker_dev_db"; docker exec $container_name psql -d $POSTGRES_DATABASE -U $POSTGRES_USER -c "update room set admin=''"

container_name="dokku.postgres.scrum-poker-dev-db"; POSTGRES_USER="postgres"; POSTGRES_DATABASE="scrum_poker_dev_db"; docker exec $container_name psql -d $POSTGRES_DATABASE -U $POSTGRES_USER -c "select * from room"

container_name="dokku.postgres.scrum-poker-dev-db"; POSTGRES_USER="postgres"; POSTGRES_DATABASE="scrum_poker_dev_db"; docker exec $container_name psql -d $POSTGRES_DATABASE -U $POSTGRES_USER -c "delete from room"

container_name="dokku.postgres.scrum-poker-dev-db"; POSTGRES_USER="postgres"; POSTGRES_DATABASE="scrum_poker_dev_db"; docker exec $container_name psql -d $POSTGRES_DATABASE -U $POSTGRES_USER -c "select * from user"