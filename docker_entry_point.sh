#!/bin/bash

cd /app/apps/api
npm run typeorm migration:run -- -d ./src/config/migration.config.ts

cd /app
npm run start
