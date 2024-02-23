#!/bin/bash 
echo $1
container_name=local-postgres
volume_name=local-postgres-volume
docker_image='postgres:16'
env_file='.env.docker'

set_environment () {
  if [ ! -f "$env_file" ]; then
    echo -e "\e[33mWARNING: "$env_file not found, creating from template" \e[0m"
    cp "$env_file.template" $env_file
  fi

  # Read docker.env file and add its content to environment
  export $(cat $env_file | xargs)

  echo -e ' ----- ENVIRONMENT ----- '
  cat $env_file
  echo -e $"\n ----------------------- "
}

set_volume () {
  volume_exists=$(docker volume list --quiet --filter name=$volume_name)

  if [ -z $volume_exists ] || [ "$volume_exists" = "" ]; then
    docker volume create $volume_name
  fi
}

docker pull $docker_image
set_environment
set_volume

if [[ $1 == "stop" ]]; then
    docker container stop $container_name
    docker container rm $container_name
fi

if [[ $1 == "start" ]]; then
    docker run \
        --name $container_name \
        --publish 5432:5432 \
        --env POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
        --env POSTGRES_USER=$POSTGRES_USER \
        --env POSTGRES_DB=$POSTGRES_DB \
        --volume "$volume_name:/var/lib/postgresql/data" \
        --detach \
        $docker_image

        docker container list --filter name=$container_name --format '{{.Names}}'
        docker container list --filter name=$container_name --format '{{.Status}}'
fi
