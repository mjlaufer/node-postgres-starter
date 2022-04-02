# node-postgres-starter

## About

This is an opinionated template for developing containerized web services with Node, TypeScript, and PostgreSQL.

## Getting Started

### Prerequisites

-   Node.js v16
-   PostgreSQL v14
-   Redis v6
-   Docker
-   CircleCI

Note: If you install PostgreSQL using homebrew, you may need to run the following command:

```sh
/usr/local/opt/postgres/bin/createuser -s postgres
```

### Local Development

Clone this repository.

Install dependencies.

```sh
yarn install
```

Create a .env file based on the .env.example file.

Create PostgreSQL databases for `dev` and `test` environments.

### Useful Scripts

`yarn run dev` : Run the application in development mode.

`yarn run test:watch` : Run the test runner in watch mode.

`yarn run knex migrate:latest` : Run database migrations.

`yarn run knex seed:run` : Run seed files.

### Using Docker

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
