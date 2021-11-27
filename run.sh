#!/bin/bash

cd ./docker/compose
if [ $# -eq 0 ]; then
    echo "Running local up -d --build"
    docker-compose -f docker-compose.yml -f docker-compose.local.yml up -d --build
    exit 1
elif [ $1 == "down" ]; then
    echo "Running local down"
    docker-compose -f docker-compose.yml -f docker-compose.local.yml down ${@:2}
else
    echo "Running ${@:1}"
    docker-compose -f docker-compose.yml -f docker-compose.$1.yml ${@:1}
fi