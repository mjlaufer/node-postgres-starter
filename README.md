# ts-node-pgp-starter

[![Greenkeeper badge](https://badges.greenkeeper.io/mjlaufer/ts-node-pgp-starter.svg)](https://greenkeeper.io/)

## About

This is an opinionated template for creating and deploying containerized web APIs with Node, TypeScript, and PostgreSQL. To that end, this project uses the following technologies and packages:

-   Node.js v12
-   TypeScript v3.6
-   Express.js
-   PostgreSQL v11
-   pg-promise
-   Docker
-   Kubernetes
-   CircleCI

---

## Useful Scripts

`yarn install` : Install dependencies.

### Local Development:

`yarn run dev` : Run the application in development mode.

`yarn run ci:check` : Run CI checks.

### Using Docker:

`docker-compose up -d` : Run the application in development mode.

`docker-compose -f docker-compose.yml -f docker-compose.ci.yml up -d` : Run CI checks.

---

## Docker Reference

`docker build PATH` : Build an image from a Dockerfile.

`docker exec -it CONTAINER COMMAND` : Run a command in the running container.

`docker logs -f CONTAINER` : Fetch the logs of a container; follow log output.

`docker ps` : List containers.

`docker run -p 5000:80 IMAGE [COMMAND]` : Run a command in a new container; publish the container’s port(s) to the host (i.e., bind port 80 of
the container to port 5000 of the host).

---

## Docker Compose Reference

`docker-compose up -d` : Build and start containers in detached mode (i.e., in the background).

`docker-compose up --build` : Build images, and then start containers.

`docker-compose down` : Stop containers; remove containers, networks, volumes, and images created by `up`.

---

## Kubernetes (kubectl) Reference

`kubectl apply -f FILENAME` : Apply a configuration to a resource (e.g., pod or deployment object). The resource will be created if it doesn't exist yet.

`kubectl get RESOURCE_TYPE [-o wide]` : Display resources (e.g., pods, deployments, or services).

`kubectl delete [-f FILENAME] | RESOURCE_TYPE [NAME | --all]` : Delete resources

`kubectl set image RESOURCE_TYPE/NAME CONTAINER_NAME=NEW_IMAGE` : Update existing container image(s) of resources

---

## Deployment

Coming soon.
