FROM node:20-slim

ARG NODE_ENV=""
ARG VITE_NODE_ENV=""
ARG VITE_SOCKET_SERVER=""
ARG POSTGRES_URI=""

ENV NODE_ENV=${NODE_ENV}
ENV VITE_NODE_ENV=${VITE_NODE_ENV}
ENV VITE_SOCKET_SERVER=${VITE_SOCKET_SERVER}
ENV POSTGRES_URI=${POSTGRES_URI}

EXPOSE 80
RUN mkdir /app
WORKDIR /app
COPY . /app
RUN npm install --global typescript@5.2.2 @nestjs/cli turbo@1.12.4 vite@5.1.0
RUN npm install --legacy-peer-deps
RUN npm run build

# WORKDIR /app/apps/api
# RUN npm run typeorm migration:run -- -d ./src/config/migration.config.ts
# WORKDIR /app
# CMD [ "npm", "run" , "start"]
CMD ["bash", "docker_entry_point.sh"]
