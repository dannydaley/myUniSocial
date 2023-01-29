#! /bin/bash

docker build -t dd252935/myUniSocial/platform/back-end .

docker stop dd252935myUniSocial
docker rm  dd252935myUniSocial



docker run -d --name dd252935myUniSocial -p 8080:3001 dd252935/myUniSocial