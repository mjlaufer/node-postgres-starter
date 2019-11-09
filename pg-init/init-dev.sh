#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL

    CREATE DATABASE starter;

    \c starter

    CREATE TABLE users
    (
        id SERIAL PRIMARY KEY,
        email VARCHAR NOT NULL,
        username VARCHAR NOT NULL
        password VARCHAR NOT NULL
    );

EOSQL
