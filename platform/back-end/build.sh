#! /bin/bash

docker build -t dd252935/myCircle .

docker stop dd252935myCircle
docker rm  dd252935myCircle



docker run -d --name dd252935myCircle -p 8080:3001 dd252935/myCircle