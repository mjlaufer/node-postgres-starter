# node-postgres-starter

## About

This is an opinionated template for developing containerized web services with Node, TypeScript, and PostgreSQL. This project also includes basic configuration for CircleCI.

## Getting Started

### Prerequisites

-   Node.js v16
-   Yarn v1

### Initial Setup

Clone this repository.

Install dependencies.

```sh
yarn install
```

Create a `.env` file based on the `.env.example` file.

### Local Development

Install PostgreSQL v14 and Redis v6.

Note: If you install PostgreSQL using Homebrew, you may need to run the following command:

```sh
/usr/local/opt/postgres/bin/createuser -s postgres
```

Create PostgreSQL databases for `dev` and `test` environments. By default, these are called `starter` and `starter_test`, respectively.

`yarn run knex migrate:latest` : Run database migrations.

`yarn run knex seed:run` : Run seed files.

`yarn run dev` : Run the application in development mode.

`yarn run test:watch` : Run the test runner in watch mode.

`yarn run test:ci`: Run CI checks.

### Local Development with Docker

Install Docker.

Ensure that the `./pg-init/init-test-db.sh` file is executable.

```sh
chmod -x ./pg-init/init-test-db.sh
```

`docker-compose up -d` : Run the application in development mode.

`docker exec -it APP_CONTAINER yarn run knex migrate:latest` : Run database migrations.

`docker exec -it APP_CONTAINER yarn run knex seed:run` : Run seed files.

`docker exec -it APP_CONTAINER yarn run test:watch` : Run the test runner in watch mode.

`docker-compose -f docker-compose.yml -f docker-compose.ci.yml up` : Run CI checks.

`docker-compose down` : Stop containers; remove containers, networks, volumes, and images created by `up`.

## Docker Reference

`docker build PATH` : Build an image from a Dockerfile.

`docker exec -it CONTAINER COMMAND` : Run a command in the running container.

`docker logs -f CONTAINER` : Fetch the logs of a container; follow log output.

`docker ps` : List containers.

`docker run -p 5000:80 IMAGE [COMMAND]` : Run a command in a new container; publish the container’s port(s) to the host (i.e., bind port 80 of
the container to port 5000 of the host).
