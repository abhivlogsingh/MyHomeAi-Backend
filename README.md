## To build docker image of Medantrik MedTech Service Prod
> docker build -t abhivlogsingh7/myhomeai:1.0.0 .

## To run the build image
> docker run -d --name myhomeai-api-service -p 5003:5000 abhivlogsingh7/myhomeai:1.0.0


## docker login into server
> docker login -u abhivlogsingh7 -p abhivlogsingh7

## To push the docker image into private docker repo
> docker push abhivlogsingh7/myhomeai:1.0.0

## To pull the docker image from private docker repo
> docker pull abhivlogsingh7/myhomeai:1.0.0
> podman pull abhivlogsingh7/myhomeai:1.0.0
> podman run -d --name myhomeai-api-service -p 5003:5000 abhivlogsingh7/myhomeai:1.0.0


> ls
> docker ps
> docker stop 7359bbfa2a91
> docker rm 7359bbfa2a91
> docker images
> docker rmi 994a6a740369



> ls
> podman ps
> podman stop 7359bbfa2a91
> podman rm 7359bbfa2a91
> podman images
> podman rmi 994a6a740369