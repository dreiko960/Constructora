-- Script de creación de la base de datos NORMALIZADA (hasta 5NF)
-- Proyecto: Constructora
-- Propósito: Demostrar las 5 formas de normalización en MySQL Workbench

CREATE DATABASE IF NOT EXISTS constructora_normalizada;
USE constructora_normalizada;

-- =========================================================================
-- 1NF (Primera Forma Normal): Atómicos y sin grupos repetidos
-- Se eliminan campos como 'tags' o 'permisos JSON' que no sean atómicos
-- =========================================================================

-- Tabla de permisos individuales (Normalización de permisos en ROLES)
CREATE TABLE PERMISOS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT
);

-- =========================================================================
-- 2NF (Segunda Forma Normal): Dependencia funcional completa
-- Cada tabla tiene su propia clave primaria y los atributos dependen de ella
-- =========================================================================

-- Tabla de Roles (sin el campo JSON de permisos)
CREATE TABLE ROLES (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT
);

-- Relación N:M entre Roles y Permisos (1NF y 2NF aplicada)
CREATE TABLE ROLES_PERMISOS (
    rol_id INT,
    permiso_id INT,
    PRIMARY KEY (rol_id, permiso_id),
    FOREIGN KEY (rol_id) REFERENCES ROLES(id),
    FOREIGN KEY (permiso_id) REFERENCES PERMISOS(id)
);

-- =========================================================================
-- 3NF (Tercera Forma Normal): Sin dependencias transitivas
-- Los atributos no clave no dependen de otros atributos no clave
-- =========================================================================

-- Tabla de Clientes (Normalización del campo 'cliente' en PROYECTOS)
CREATE TABLE CLIENTES (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    ruc_dni VARCHAR(20) UNIQUE,
    email VARCHAR(100),
    telefono VARCHAR(20)
);

-- Tabla de Tipos de Proyecto (Normalización del ENUM 'tipo' en PROYECTOS)
CREATE TABLE TIPOS_PROYECTO (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL -- 'Residencial', 'Comercial', etc.
);

-- Tabla de Estados (Lookup table para estados de proyectos, planos, etc.)
CREATE TABLE ESTADOS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    categoria VARCHAR(50) NOT NULL -- 'PROYECTO', 'PLANO', 'ACTIVIDAD'
);

-- =========================================================================
-- BCNF (Boyce-Codd Normal Form) y 4NF (Cuarta Forma Normal)
-- Eliminación de dependencias multivaloradas
-- =========================================================================

-- Usuarios del sistema
CREATE TABLE USUARIOS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    rol_id INT,
    estado_id INT,
    ultimo_acceso DATETIME,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES ROLES(id),
    FOREIGN KEY (estado_id) REFERENCES ESTADOS(id)
);

-- Proyectos de construcción (3NF: clientes y tipos externalizados)
CREATE TABLE PROYECTOS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    ubicacion VARCHAR(255),
    cliente_id INT,
    tipo_proyecto_id INT,
    estado_id INT,
    fecha_inicio DATE,
    fecha_fin DATE,
    presupuesto DECIMAL(15, 2),
    avance_total INT DEFAULT 0,
    responsable_id INT,
    FOREIGN KEY (cliente_id) REFERENCES CLIENTES(id),
    FOREIGN KEY (tipo_proyecto_id) REFERENCES TIPOS_PROYECTO(id),
    FOREIGN KEY (estado_id) REFERENCES ESTADOS(id),
    FOREIGN KEY (responsable_id) REFERENCES USUARIOS(id)
);

-- Tabla de Tags (Normalización de 'tags' en EVIDENCIAS - 4NF)
CREATE TABLE TAGS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL
);

-- =========================================================================
-- 5NF (Quinta Forma Normal): Reconstrucción por Proyección-Join
-- Manejo de relaciones ternarias complejas
-- =========================================================================

-- Relación Ternaria: Usuarios, Proyectos y sus Funciones específicas (5NF)
CREATE TABLE ASIGNACIONES_PROYECTO (
    usuario_id INT,
    proyecto_id INT,
    rol_especifico VARCHAR(50),
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (usuario_id, proyecto_id),
    FOREIGN KEY (usuario_id) REFERENCES USUARIOS(id),
    FOREIGN KEY (proyecto_id) REFERENCES PROYECTOS(id)
);

-- Evidencias (Normalizada: tags movidos a tabla aparte)
CREATE TABLE EVIDENCIAS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    proyecto_id INT,
    actividad_id INT,
    titulo VARCHAR(100),
    descripcion TEXT,
    archivo_url VARCHAR(255),
    fecha_captura DATETIME,
    subido_por INT,
    ubicacion VARCHAR(255),
    FOREIGN KEY (proyecto_id) REFERENCES PROYECTOS(id),
    -- actividad_id referencia a ACTIVIDADES (se asume creada similar al esquema original)
    FOREIGN KEY (subido_por) REFERENCES USUARIOS(id)
);

-- Relación N:M entre Evidencias y Tags (4NF aplicada)
CREATE TABLE EVIDENCIAS_TAGS (
    evidencia_id INT,
    tag_id INT,
    PRIMARY KEY (evidencia_id, tag_id),
    FOREIGN KEY (evidencia_id) REFERENCES EVIDENCIAS(id),
    FOREIGN KEY (tag_id) REFERENCES TAGS(id)
);

-- Inserción de datos de ejemplo para prueba en MySQL Workbench
INSERT INTO PERMISOS (nombre) VALUES ('CREAR_PROYECTO'), ('EDITAR_PLANO'), ('SUBIR_EVIDENCIA');
INSERT INTO ROLES (nombre) VALUES ('Administrador'), ('Ingeniero');
INSERT INTO ROLES_PERMISOS (rol_id, permiso_id) VALUES (1, 1), (1, 2), (1, 3), (2, 2), (2, 3);
INSERT INTO CLIENTES (nombre, ruc_dni) VALUES ('Constructora ABC', '20123456789');
INSERT INTO TIPOS_PROYECTO (nombre) VALUES ('Residencial'), ('Comercial');
INSERT INTO ESTADOS (nombre, categoria) VALUES ('Activo', 'PROYECTO'), ('Pendiente', 'PLANO');
