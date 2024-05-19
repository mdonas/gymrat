        CREATE DATABASE pruebadb

create table task(
    id serial PRIMARY KEY,
    title VARCHAR(255) UNIQUE,
    descripcion VARCHAR(255),
)