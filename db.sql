CREATE DATABASE gestion_sw;

USE gestion_sw;

-- Tabla usuario
CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT,
    nombre VARCHAR(50),
    correo_electronico VARCHAR(100),
    contrasena VARCHAR(100),
    fk_rol INT,
    fk_equipo INT,
    PRIMARY KEY (id_usuario),  
    FOREIGN KEY (fk_rol) REFERENCES rol (id_rol),
    FOREIGN KEY (fk_equipo) REFERENCES equipo (id_equipo)
);

-- Resto de tus definiciones de tabla...


-- Tabla rol
CREATE TABLE rol (
  id_rol INT AUTO_INCREMENT,
  nombre VARCHAR(255),
  PRIMARY KEY (id_rol)
);

-- Tabla tarea
CREATE TABLE tarea (
  id_tarea INT AUTO_INCREMENT,
  nombre VARCHAR(255),
  descripcion VARCHAR(255),
  fecha_inicio DATE,
  fecha_fin DATE,
  fk_proyecto INT, --  Si se asocia la tarea a un proyecto específico
  fk_rol INT,      
  PRIMARY KEY (id_tarea),
  FOREIGN KEY (fk_proyecto) REFERENCES proyecto (id_proyecto),
  FOREIGN KEY (fk_rol) REFERENCES rol (id_rol)
);


-- Tabla equipo
CREATE TABLE equipo (
  id_equipo INT AUTO_INCREMENT,
  nombre VARCHAR(255),
  PRIMARY KEY (id_equipo)
    
);

-- Tabla estado
CREATE TABLE estado (
  id_estado INT AUTO_INCREMENT,
  nombre VARCHAR(255),
  PRIMARY KEY (id_estado)
);

-- Tabla recurso
CREATE TABLE recurso (
  id_recurso INT AUTO_INCREMENT,
  tipo_recurso VARCHAR(255),
  nombre VARCHAR(255),
  funcionalidad VARCHAR(255),
  fk_proyecto INT,  -- Nueva clave foránea para asociar un recurso a un proyecto
  PRIMARY KEY (id_recurso),
  FOREIGN KEY (fk_proyecto) REFERENCES proyecto (id_proyecto)
);

-- Modifica la tabla proyecto eliminando la fk_recurso
 CREATE TABLE proyecto (
	id_proyecto INT AUTO_INCREMENT,
 	nombre VARCHAR(255),
	descripcion VARCHAR(255),
	fecha_inicio DATE,
    fecha_fin DATE,
	fk_equipo INT,
	fk_estado INT,
	PRIMARY KEY (id_proyecto),
	FOREIGN KEY (fk_equipo) REFERENCES equipo (id_equipo),
	FOREIGN KEY (fk_estado) REFERENCES estado (id_estado)
	);