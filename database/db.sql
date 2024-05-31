CREATE DATABASE gymrat

--Ejercicios generales pj. press banca,remo,etc...
CREATE TABLE ejercicios (
  id_ejercicio SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  descripcion TEXT
  id_creador INTEGER NOT NULL REFERENCES usuario(id_usuario));

--Rutina semanal, conjunto de ejercicios
CREATE TABLE rutinas (
  id_rutina SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  fecha_creacion DATE NOT NULL,
  frecuencia int NOT NULL);

--Ejercicios de una rutina concreta
CREATE TABLE ejercicios_rutina (
  id_ejercicio_rutina SERIAL PRIMARY KEY,
  id_rutina INTEGER NOT NULL REFERENCES rutinas(id_rutina),
  id_ejercicio INTEGER NOT NULL REFERENCES ejercicios(id_ejercicio),
  orden INTEGER NOT NULL,
  series INTEGER NOT NULL);

--Series individuales de un ejercicio en un entrenamiento concreto
CREATE TABLE series_entrenamiento (
  id_serie_entrenamiento SERIAL PRIMARY KEY,
  id_ejercicio_rutina INTEGER NOT NULL REFERENCES ejercicios_rutina(id_ejercicio_rutina),
  numero_serie INTEGER NOT NULL,
  repeticiones INTEGER NOT NULL,
  peso DECIMAL(5,2),
  notas TEXT);

  --Registro de dias que se han entrenado
CREATE TABLE registros_entrenamiento (
  id_registro SERIAL PRIMARY KEY,
  id_rutina INTEGER NOT NULL REFERENCES rutinas(id_rutina),
  fecha_entrenamiento DATE NOT NULL,
  notas TEXT);

CREATE TABLE musculos (
  id_musculo SERIAL PRIMARY KEY,
  nombre_musculo VARCHAR(50) NOT NULL,
  dias_recuperacion INTEGER NOT NULL,
  notas TEXT);

--Musculos involucrados en un ejercicio
CREATE TABLE ejercicios_musculos (
  id_ejercicio_musculo SERIAL PRIMARY KEY,
  id_ejercicio INTEGER NOT NULL REFERENCES ejercicios(id_ejercicio),
  id_musculo INTEGER NOT NULL REFERENCES musculos(id_musculo));

--tabla de usuarios
CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    correo VARCHAR(255) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    usuario VARCHAR(255) NOT NULL UNIQUE
);

