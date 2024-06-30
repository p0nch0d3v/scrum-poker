
## How to run with node-js (20+):

```bash
npm install --global typescript@5.2.2 @nestjs/cli turbo@1.12.4 vite@5.1.0
```
```bash
npm install --legacy-peer-deps
```

Suggested environment values (API)
> /apps/api/.env
```bash
POSTGRES_HOST=localhost
POSTGRES_PASSWORD=p@$$w0rd
POSTGRES_USER=postgres
POSTGRES_DATABASE=scrum-poker-db
POSTGRES_DB=scrum-poker-db
POSTGRES_PORT=5432
POSTGRES_URI=use_it_instead_of_individual_Postgres_settings
NODE_ENV=development
MODE=development
SOCKET_SERVER=localhost:3000
APP_PORT=3000
```

```bash
npm run build; npm run dev
```

## How to ruin with Docker Compose:

Suggested environment values (API)
> /.env.docker
```bash
POSTGRES_HOST=127.0.0.1
POSTGRES_PASSWORD=p@$$w0rd
POSTGRES_USER=postgres
POSTGRES_DATABASE=scrum-poker-db
POSTGRES_DB=scrum-poker-db
POSTGRES_PORT=5432
POSTGRES_URI=use_it_instead_of_individual_Postgres_settings
NODE_ENV=development
MODE=development
SOCKET_SERVER=localhost:3000
APP_PORT=3000
```

```bash
docker compose up --detach
```

## Use the generated images

```bash
docker pull p0nch0d3v/scrum-poker:master
```

```bash
docker run \
    --rm \
    --publish 3000:80 \
    --env MODE=Production \
    --env NODE_ENV=Production \
    --env SOCKET_SERVER=localhost \
    --env APP_PORT=80 \
    --env POSTGRES_HOST=TBD \
    --env POSTGRES_PORT=TBD \
    --env POSTGRES_USER=TBD \
    --env POSTGRES_PASSWORD=TBD \
    --env POSTGRES_DATABASE=TBD \
    --env POSTGRES_URI=TBD \
    --name "scrum-poker" \
    p0nch0d3v/scrum-poker:master
```
