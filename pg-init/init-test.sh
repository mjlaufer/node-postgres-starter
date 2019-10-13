#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL

    CREATE DATABASE starter_test;

    \c starter_test

    CREATE TABLE users
    (
        id SERIAL PRIMARY KEY,
        email VARCHAR NOT NULL
    );

EOSQL
