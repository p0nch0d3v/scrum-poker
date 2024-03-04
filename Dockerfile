FROM node:20-alpine

ARG VITE_NODE_ENV=""
ARG VITE_SOCKET_SERVER=""

ENV VITE_NODE_ENV=${VITE_NODE_ENV}
ENV VITE_SOCKET_SERVER=${VITE_SOCKET_SERVER}

EXPOSE 80
RUN mkdir /app
WORKDIR /app
COPY . /app
RUN npm install --global typescript@5.2.2 @nestjs/cli turbo@1.12.4 vite@5.1.0
RUN npm install --legacy-peer-deps
RUN npm run build
CMD [ "npm", "run" , "start"]
