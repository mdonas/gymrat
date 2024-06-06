CREATE DATABASE gymrat

--Ejercicios generales pj. press banca,remo,etc...
-- Table: public.ejercicios

CREATE TABLE IF NOT EXISTS public.ejercicios
(
    id_ejercicio integer NOT NULL DEFAULT nextval('ejercicios_id_ejercicio_seq'::regclass),
    nombre character varying(50) COLLATE pg_catalog."default" NOT NULL,
    descripcion text COLLATE pg_catalog."default",
    id_creador integer,
    id_musculo integer,
    CONSTRAINT ejercicios_pkey PRIMARY KEY (id_ejercicio),
    CONSTRAINT ejercicios_id_creador_fkey FOREIGN KEY (id_creador)
        REFERENCES public.usuario (id_usuario) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fk_id_musculo FOREIGN KEY (id_musculo)
        REFERENCES public.musculos (id_musculo) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.ejercicios
    OWNER to postgres;

-- Table: public.ejercicios_musculos
--Musculos involucrados en un ejercicio
CREATE TABLE IF NOT EXISTS public.ejercicios_musculos
(
    id_ejercicio_musculo integer NOT NULL DEFAULT nextval('ejercicios_musculos_id_ejercicio_musculo_seq'::regclass),
    id_ejercicio integer NOT NULL,
    id_musculo integer NOT NULL,
    CONSTRAINT ejercicios_musculos_pkey PRIMARY KEY (id_ejercicio_musculo),
    CONSTRAINT ejercicios_musculos_id_ejercicio_fkey FOREIGN KEY (id_ejercicio)
        REFERENCES public.ejercicios (id_ejercicio) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT ejercicios_musculos_id_musculo_fkey FOREIGN KEY (id_musculo)
        REFERENCES public.musculos (id_musculo) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.ejercicios_musculos
    OWNER to postgres;

    -- Table: public.ejercicios_rutina

-- Table: public.ejercicios_rutina
--Ejercicios de una rutina concreta

CREATE TABLE IF NOT EXISTS public.ejercicios_rutina
(
    id_ejercicio_rutina integer NOT NULL DEFAULT nextval('ejercicios_rutina_id_ejercicio_rutina_seq'::regclass),
    id_rutina integer NOT NULL,
    id_ejercicio integer NOT NULL,
    orden integer NOT NULL,
    series integer NOT NULL,
    dia integer,
    titulo_dia text COLLATE pg_catalog."default",
    repeticiones text COLLATE pg_catalog."default",
    peso double precision,
    fecha_edicion date,
    CONSTRAINT ejercicios_rutina_pkey PRIMARY KEY (id_ejercicio_rutina),
    CONSTRAINT ejercicios_rutina_id_ejercicio_fkey FOREIGN KEY (id_ejercicio)
        REFERENCES public.ejercicios (id_ejercicio) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT ejercicios_rutina_id_rutina_fkey FOREIGN KEY (id_rutina)
        REFERENCES public.rutinas (id_rutina) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.ejercicios_rutina
    OWNER to postgres;
    -- Table: public.musculos

-- DROP TABLE IF EXISTS public.musculos;

CREATE TABLE IF NOT EXISTS public.musculos
(
    id_musculo integer NOT NULL DEFAULT nextval('musculos_id_musculo_seq'::regclass),
    nombre_musculo character varying(50) COLLATE pg_catalog."default" NOT NULL,
    dias_recuperacion integer NOT NULL,
    notas text COLLATE pg_catalog."default",
    CONSTRAINT musculos_pkey PRIMARY KEY (id_musculo)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.musculos
    OWNER to postgres;

    -- Table: public.registros_entrenamiento

-- DROP TABLE IF EXISTS public.registros_entrenamiento;

CREATE TABLE IF NOT EXISTS public.registros_entrenamiento
(
    id_registro integer NOT NULL DEFAULT nextval('registros_entrenamiento_id_registro_seq'::regclass),
    id_rutina integer NOT NULL,
    fecha_entrenamiento date NOT NULL,
    dia_rutina integer NOT NULL,
    id_usuario integer,
    tipo_entreno text COLLATE pg_catalog."default",
    CONSTRAINT registros_entrenamiento_pkey PRIMARY KEY (id_registro),
    CONSTRAINT registros_entrenamiento_id_rutina_fkey FOREIGN KEY (id_rutina)
        REFERENCES public.rutinas (id_rutina) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.registros_entrenamiento
    OWNER to postgres;

    -- Table: public.rutinas

-- DROP TABLE IF EXISTS public.rutinas;
--Rutina semanal, conjunto de ejercicios
CREATE TABLE IF NOT EXISTS public.rutinas
(
    id_rutina integer NOT NULL DEFAULT nextval('rutinas_id_rutina_seq'::regclass),
    nombre character varying(50) COLLATE pg_catalog."default" NOT NULL,
    fecha_creacion date NOT NULL,
    frecuencia integer NOT NULL,
    id_creador integer,
    dias integer,
    CONSTRAINT rutinas_pkey PRIMARY KEY (id_rutina),
    CONSTRAINT rutinas_id_creador_fkey FOREIGN KEY (id_creador)
        REFERENCES public.usuario (id_usuario) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.rutinas
    OWNER to postgres;

    -- Table: public.usuario

-- DROP TABLE IF EXISTS public.usuario;
--tabla de usuarios
CREATE TABLE IF NOT EXISTS public.usuario
(
    id_usuario integer NOT NULL DEFAULT nextval('usuario_id_usuario_seq'::regclass),
    nombre character varying(255) COLLATE pg_catalog."default" NOT NULL,
    correo character varying(255) COLLATE pg_catalog."default" NOT NULL,
    contrasena character varying(255) COLLATE pg_catalog."default" NOT NULL,
    usuario character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT usuario_pkey PRIMARY KEY (id_usuario),
    CONSTRAINT usuario_correo_key UNIQUE (correo),
    CONSTRAINT usuario_usuario_key UNIQUE (usuario)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.usuario
    OWNER to postgres;