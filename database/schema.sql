-- Script de creación de la base de datos para el Grupo Ipurre EIRL
CREATE DATABASE IF NOT EXISTS grupo_ipurre_eirl;
USE grupo_ipurre_eirl;

-- Roles de usuario
CREATE TABLE ROLES (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    permisos JSON,
    descripcion TEXT
);

-- Usuarios del sistema
CREATE TABLE USUARIOS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    rol_id INT,
    estado ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
    ultimo_acceso DATETIME,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES ROLES(id)
);

-- Proyectos de construcción
CREATE TABLE PROYECTOS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    ubicacion VARCHAR(255),
    cliente VARCHAR(100),
    fecha_inicio DATE,
    fecha_fin DATE,
    presupuesto DECIMAL(15, 2),
    avance_total INT DEFAULT 0,
    estado ENUM('Activo', 'Completado', 'En Pausa', 'Cancelado') DEFAULT 'Activo',
    tipo ENUM('Residencial', 'Comercial', 'Industrial') NOT NULL,
    responsable_id INT,
    FOREIGN KEY (responsable_id) REFERENCES USUARIOS(id)
);

-- Relación N:M Usuarios y Proyectos
CREATE TABLE USUARIOS_PROYECTOS (
    usuario_id INT,
    proyecto_id INT,
    rol_proyecto VARCHAR(50),
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (usuario_id, proyecto_id),
    FOREIGN KEY (usuario_id) REFERENCES USUARIOS(id),
    FOREIGN KEY (proyecto_id) REFERENCES PROYECTOS(id)
);

-- Planos de los proyectos
CREATE TABLE PLANOS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    proyecto_id INT,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(50),
    numero_plano VARCHAR(50),
    descripcion TEXT,
    estado ENUM('Aprobado', 'Pendiente', 'Rechazado') DEFAULT 'Pendiente',
    archivo_url VARCHAR(255),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    creado_por INT,
    FOREIGN KEY (proyecto_id) REFERENCES PROYECTOS(id),
    FOREIGN KEY (creado_por) REFERENCES USUARIOS(id)
);

-- Historial de versiones de planos
CREATE TABLE VERSIONES_PLANO (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plano_id INT,
    version VARCHAR(10) NOT NULL,
    archivo_url VARCHAR(255) NOT NULL,
    cambios TEXT,
    fecha_version TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modificado_por INT,
    FOREIGN KEY (plano_id) REFERENCES PLANOS(id),
    FOREIGN KEY (modificado_por) REFERENCES USUARIOS(id)
);

-- Actividades/Tareas de obra
CREATE TABLE ACTIVIDADES (
    id INT AUTO_INCREMENT PRIMARY KEY,
    proyecto_id INT,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    responsable_id INT,
    fecha_inicio DATE,
    fecha_fin_plan DATE,
    fecha_fin_real DATE,
    avance_plan INT DEFAULT 0,
    avance_real INT DEFAULT 0,
    estado ENUM('No iniciada', 'En proceso', 'Completada', 'Retrasada') DEFAULT 'No iniciada',
    prioridad ENUM('Alta', 'Media', 'Baja') DEFAULT 'Media',
    FOREIGN KEY (proyecto_id) REFERENCES PROYECTOS(id),
    FOREIGN KEY (responsable_id) REFERENCES USUARIOS(id)
);

-- Evidencias fotográficas y archivos de avance
CREATE TABLE EVIDENCIAS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    proyecto_id INT,
    actividad_id INT,
    titulo VARCHAR(100),
    descripcion TEXT,
    tipo VARCHAR(50),
    archivo_url VARCHAR(255),
    fecha_captura DATETIME,
    subido_por INT,
    ubicacion VARCHAR(255),
    tags TEXT,
    FOREIGN KEY (proyecto_id) REFERENCES PROYECTOS(id),
    FOREIGN KEY (actividad_id) REFERENCES ACTIVIDADES(id),
    FOREIGN KEY (subido_por) REFERENCES USUARIOS(id)
);

-- Documentación general
CREATE TABLE DOCUMENTOS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    proyecto_id INT,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(50),
    descripcion TEXT,
    archivo_url VARCHAR(255),
    tamaño INT,
    estado ENUM('Pendiente', 'Aprobado', 'Rechazado') DEFAULT 'Pendiente',
    version VARCHAR(10),
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subido_por INT,
    fecha_aprob DATETIME,
    aprobado_por INT,
    FOREIGN KEY (proyecto_id) REFERENCES PROYECTOS(id),
    FOREIGN KEY (subido_por) REFERENCES USUARIOS(id),
    FOREIGN KEY (aprobado_por) REFERENCES USUARIOS(id)
);

-- Reportes generados
CREATE TABLE REPORTES (
    id INT AUTO_INCREMENT PRIMARY KEY,
    proyecto_id INT,
    tipo_reporte VARCHAR(50),
    nombre VARCHAR(100),
    periodo_inicio DATE,
    periodo_fin DATE,
    datos_json JSON,
    generado_por INT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (proyecto_id) REFERENCES PROYECTOS(id),
    FOREIGN KEY (generado_por) REFERENCES USUARIOS(id)
);

-- Notificaciones para usuarios
CREATE TABLE NOTIFICACIONES (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    proyecto_id INT,
    tipo VARCHAR(50),
    titulo VARCHAR(100),
    mensaje TEXT,
    leida BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    url_enlace VARCHAR(255),
    FOREIGN KEY (usuario_id) REFERENCES USUARIOS(id),
    FOREIGN KEY (proyecto_id) REFERENCES PROYECTOS(id)
);

-- Comentarios en planos, actividades, etc.
CREATE TABLE COMENTARIOS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    referencia_tipo VARCHAR(50), -- 'plano', 'actividad', 'documento', etc.
    referencia_id INT,
    contenido TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    editado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (usuario_id) REFERENCES USUARIOS(id)
);

-- Tabla de auditoría para registro de acciones
CREATE TABLE AUDITORIA (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    accion VARCHAR(100),
    tabla_afectada VARCHAR(50),
    registro_id INT,
    valores_antes JSON,
    valores_desp JSON,
    ip_address VARCHAR(45),
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES USUARIOS(id)
);

-- Inserción de Roles iniciales
INSERT INTO ROLES (nombre, descripcion) VALUES 
('Administrador', 'Acceso total al sistema'),
('Supervisor', 'Gestión de proyectos y actividades'),
('Ingeniero', 'Gestión de planos y documentación técnica'),
('Operario', 'Registro de evidencias y consulta de tareas');

-- Inserción de Usuario Admin (Password: admin123 - Nota: En producción usar hash)
INSERT INTO USUARIOS (nombre, email, password, rol_id) VALUES 
('Administrador del Sistema', 'admin@constructora.com', 'admin123', 1);
