#!/bin/bash 

echo $1
container_name=scrum-poker-local
volume_name=scrum-poker-local-volume
docker_image='postgres:16.1'
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

stop () {
  docker container stop $container_name
  docker container rm $container_name
}

start () {
  docker pull $docker_image
  set_environment
  set_volume

  docker run \
      --name $container_name \
      --publish $POSTGRES_PORT:5432 \
      --env POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
      --env POSTGRES_USER=$POSTGRES_USER \
      --env POSTGRES_DB=$POSTGRES_DB \
      --volume "$volume_name:/var/lib/postgresql/data" \
      --network host \
      --detach \
      $docker_image

      docker container list --filter name=$container_name --format '{{.Names}}'
      docker container list --filter name=$container_name --format '{{.Status}}'

      docker container logs --follow $container_name
}

if [[ $1 == "stop" ]]; then
  stop  
fi

if [[ $1 == "start" ]]; then
  stop
  start
fi

if [ -z $1 ] || [ $1 == "" ] ; then
  echo "User [start] or [stop]"
fi