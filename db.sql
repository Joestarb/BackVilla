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


    SELECT COUNT(*) AS contador_recursos
FROM recurso
WHERE fk_proyecto = ?;









CREATE DATABASE gestion_sw;
USE gestion_sw;

-- Tabla rol
CREATE TABLE rol (
  id_rol INT AUTO_INCREMENT,
  nombre VARCHAR(255),
  PRIMARY KEY (id_rol)
);

-- Tabla estado
CREATE TABLE estado (
  id_estado INT AUTO_INCREMENT,
  nombre VARCHAR(255),
  PRIMARY KEY (id_estado)
);

-- Modifica la tabla proyecto eliminando la fk_recurso
 CREATE TABLE proyecto (
	id_proyecto INT AUTO_INCREMENT,
 	nombre VARCHAR(255),
	descripcion VARCHAR(255),
	fecha_inicio DATE,
    fecha_fin DATE,
	fk_estado INT,
	PRIMARY KEY (id_proyecto),
	FOREIGN KEY (fk_estado) REFERENCES estado (id_estado)
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

-- Tabla equipo
CREATE TABLE equipo (
  id_equipo INT AUTO_INCREMENT,
  nombre VARCHAR(255),
  fk_proyecto INT,
  PRIMARY KEY (id_equipo),
  FOREIGN KEY (fk_proyecto) REFERENCES proyecto (id_proyecto)
);


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

-- Tabla tarea
CREATE TABLE tarea (
  id_tarea INT AUTO_INCREMENT,
  nombre VARCHAR(255),
  descripcion VARCHAR(255),
  fecha_inicio DATE,
  fecha_fin DATE,
  fk_proyecto INT, --  Si se asocia la tarea a un proyecto específico
  fk_usuario INT,      
  PRIMARY KEY (id_tarea),
  FOREIGN KEY (fk_proyecto) REFERENCES proyecto (id_proyecto),
  FOREIGN KEY (fk_usuario) REFERENCES usuario (id_usuario)
);

CREATE VIEW usuarioData AS 
SELECT 
	u.nombre, 
	u.id_usuario, 
    u.correo_electronico, 
    u.contrasena, 
    r.nombre AS nombre_rol
    ,e.nombre AS nombre_equip 
    FROM usuario u JOIN rol r ON 
    u.fk_rol = r.id_rol JOIN equipo e ON u.fk_equipo = e.id_equipo;


CREATE VIEW tarea_view AS 
SELECT 
    t.id_tarea AS id, 
    t.nombre AS nombre, 
    t.descripcion, 
    t.fecha_inicio AS inicio, 
    t.fecha_fin AS final, 
    p.nombre AS proyecto, 
    u.id_usuario AS usuario_id,
    u.nombre AS usuario, 
    e.nombre AS equipo
FROM 
    tarea t 
JOIN 
    proyecto p ON t.fk_proyecto = p.id_proyecto 
JOIN 
    usuario u ON t.fk_usuario = u.id_usuario 
JOIN 
    equipo e ON u.fk_equipo = e.id_equipo;











// Eli BD



-- Insertar roles
INSERT INTO rol (nombre) VALUES ('Administrador'), ('Lider');
INSERT INTO rol (nombre) VALUES ('Diseñador'), ('Programador'),('Analista');

-- Insertar estados
INSERT INTO estado (nombre) VALUES ('En proceso'), ('Completado'), ('Pendiente');

-- Insertar proyectos
INSERT INTO proyecto (nombre, descripcion, fecha_inicio, fecha_fin, fk_estado)
VALUES ('Proyecto 1', 'Descripción del Proyecto 1', '2024-01-01', '2024-12-31', 1),
       ('Proyecto 2', 'Descripción del Proyecto 2', '2024-02-01', '2024-11-30',  2),
       ('Proyecto 3', 'Descripción del Proyecto 3', '2024-03-01', '2024-10-31',  3);
       
-- Insertar recursos
INSERT INTO recurso (tipo_recurso, nombre, funcionalidad, fk_proyecto)
VALUES ('Tipo 1', 'Recurso 1', 'Funcionalidad del Recurso 1', 1),
       ('Tipo 2', 'Recurso 2', 'Funcionalidad del Recurso 2', 2),
       ('Tipo 3', 'Recurso 3', 'Funcionalidad del Recurso 3', 3);


-- Insertese primero usuarios usando el endpoint de signup


-- Insertar equipos
INSERT INTO equipo (nombre) VALUES ('Equipo 1'), ('Equipo 2'), ('Equipo 3');


-- Insertar tareas
INSERT INTO tarea (nombre, descripcion, fecha_inicio, fecha_fin, fk_proyecto, fk_usuario)
VALUES ('Tarea 1', 'Descripción de la Tarea 1', '2024-01-01', '2024-01-31', 1, 1),
       ('Tarea 2', 'Descripción de la Tarea 2', '2024-02-01', '2024-02-29', 2, 2),
       ('Tarea 3', 'Descripción de la Tarea 3', '2024-03-01', '2024-03-31', 3, 1);




CREATE VIEW equipoData AS 
SELECT 
    e.id_equipo,
    e.nombre AS nombre_equipo,
    p.nombre AS nombre_proyecto
FROM 
    equipo e
JOIN 
    proyecto p ON e.fk_proyecto = p.id_proyecto;
