#!/bin/bash

env_file='.env.docker'
image_name='scrum-poker:dev'
container_name='scrum-poker-dev'

docker container stop $container_name
docker container rm $container_name
docker image rm $image_name

docker build \
    --no-cache \
    --tag $image_name \
    .

export $(cat $env_file | xargs)

docker run \
    --rm \
    --network host \
    --publish 3000:3000 \
    --env NODE_ENV='production' \
    --env POSTGRES_HOST=$POSTGRES_HOST \
    --env POSTGRES_PORT=$POSTGRES_PORT \
    --env POSTGRES_USER=$POSTGRES_USER \
    --env POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
    --env POSTGRES_DATABASE=$POSTGRES_DATABASE \
    --name $container_name \
    $image_name