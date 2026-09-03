#!/bin/bash

env_file='.env.docker'
image_name='scrum-poker:dev'
container_name='scrum-poker-dev'

docker container stop $container_name
docker container rm $container_name
docker image rm $image_name

docker build \
    --progress plain \
    --no-cache \
    --tag $image_name \
    .

export $(cat $env_file | xargs)
cat $env_file

docker run \
    --rm \
    --network host \
    --publish 3000:80 \
    --env MODE=$MODE \
    --env NODE_ENV=$NODE_ENV \
    --env SOCKET_SERVER=$SOCKET_SERVER \
    --env APP_PORT=$APP_PORT \
    --env POSTGRES_HOST=$POSTGRES_HOST \
    --env POSTGRES_PORT=$POSTGRES_PORT \
    --env POSTGRES_USER=$POSTGRES_USER \
    --env POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
    --env POSTGRES_DATABASE=$POSTGRES_DATABASE \
    --env GOOGLE_AUTH_CLIENT_SECRET=$GOOGLE_AUTH_CLIENT_SECRET \
    --env GOOGLE_AUTH_CLIENT_ID=$GOOGLE_AUTH_CLIENT_ID \
    --name $container_name \
    $image_name
 