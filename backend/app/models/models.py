from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum, JSON, Boolean, Text, Date, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..db.session import Base

class Role(Base):
    __tablename__ = "ROLES"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50), nullable=False)
    permisos = Column(JSON)
    descripcion = Column(Text)
    usuarios = relationship("User", back_populates="rol")

class User(Base):
    __tablename__ = "USUARIOS"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    telefono = Column(String(20))
    password = Column(String(255), nullable=False)
    rol_id = Column(Integer, ForeignKey("ROLES.id"))
    estado = Column(Enum('Activo', 'Inactivo'), default='Activo')
    ultimo_acceso = Column(DateTime)
    fecha_creacion = Column(DateTime, server_default=func.now())
    
    rol = relationship("Role", back_populates="usuarios")
    proyectos_asignados = relationship("UserProject", back_populates="usuario")
    notificaciones = relationship("Notification", back_populates="usuario")

class Project(Base):
    __tablename__ = "PROYECTOS"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(150), nullable=False)
    descripcion = Column(Text)
    ubicacion = Column(String(255))
    cliente = Column(String(100))
    fecha_inicio = Column(Date)
    fecha_fin = Column(Date)
    presupuesto = Column(Integer) # Simplified for now
    avance_total = Column(Integer, default=0)
    estado = Column(Enum('Activo', 'Completado', 'En Pausa', 'Cancelado'), default='Activo')
    tipo = Column(Enum('Residencial', 'Comercial', 'Industrial'), nullable=False)
    responsable_id = Column(Integer, ForeignKey("USUARIOS.id"))
    
    usuarios = relationship("UserProject", back_populates="proyecto")
    planos = relationship("Plano", back_populates="proyecto")
    actividades = relationship("Actividad", back_populates="proyecto")
    evidencias = relationship("Evidencia", back_populates="proyecto")
    notificaciones = relationship("Notification", back_populates="proyecto")

class Notification(Base):
    __tablename__ = "NOTIFICACIONES"
    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("USUARIOS.id"))
    proyecto_id = Column(Integer, ForeignKey("PROYECTOS.id"))
    tipo = Column(String(50))
    titulo = Column(String(100))
    mensaje = Column(Text)
    leida = Column(Boolean, default=False)
    fecha_creacion = Column(DateTime, server_default=func.now())
    url_enlace = Column(String(255))

    usuario = relationship("User", back_populates="notificaciones")
    proyecto = relationship("Project", back_populates="notificaciones")

class UserProject(Base):
    __tablename__ = "USUARIOS_PROYECTOS"
    usuario_id = Column(Integer, ForeignKey("USUARIOS.id"), primary_key=True)
    proyecto_id = Column(Integer, ForeignKey("PROYECTOS.id"), primary_key=True)
    rol_proyecto = Column(String(50))
    fecha_asignacion = Column(DateTime, server_default=func.now())
    
    usuario = relationship("User", back_populates="proyectos_asignados")
    proyecto = relationship("Project", back_populates="usuarios")

class Plano(Base):
    __tablename__ = "PLANOS"
    id = Column(Integer, primary_key=True, index=True)
    proyecto_id = Column(Integer, ForeignKey("PROYECTOS.id"))
    nombre = Column(String(100), nullable=False)
    tipo = Column(String(50))
    numero_plano = Column(String(50))
    descripcion = Column(Text)
    estado = Column(Enum('Aprobado', 'Pendiente', 'Rechazado'), default='Pendiente')
    archivo_url = Column(String(255))
    fecha_creacion = Column(DateTime, server_default=func.now())
    creado_por = Column(Integer, ForeignKey("USUARIOS.id"))

    proyecto = relationship("Project", back_populates="planos")
    versiones = relationship("VersionPlano", back_populates="plano")

class VersionPlano(Base):
    __tablename__ = "VERSIONES_PLANO"
    id = Column(Integer, primary_key=True, index=True)
    plano_id = Column(Integer, ForeignKey("PLANOS.id"))
    version = Column(String(10), nullable=False)
    archivo_url = Column(String(255), nullable=False)
    cambios = Column(Text)
    fecha_version = Column(DateTime, server_default=func.now())
    modificado_por = Column(Integer, ForeignKey("USUARIOS.id"))

    plano = relationship("Plano", back_populates="versiones")

class Actividad(Base):
    __tablename__ = "ACTIVIDADES"
    id = Column(Integer, primary_key=True, index=True)
    proyecto_id = Column(Integer, ForeignKey("PROYECTOS.id"))
    nombre = Column(String(150), nullable=False)
    descripcion = Column(Text)
    responsable_id = Column(Integer, ForeignKey("USUARIOS.id"))
    fecha_inicio = Column(Date)
    fecha_fin_plan = Column(Date)
    fecha_fin_real = Column(Date)
    avance_plan = Column(Integer, default=0)
    avance_real = Column(Integer, default=0)
    estado = Column(Enum('No iniciada', 'En proceso', 'Completada', 'Retrasada'), default='No iniciada')
    prioridad = Column(Enum('Alta', 'Media', 'Baja'), default='Media')

    proyecto = relationship("Project", back_populates="actividades")
    evidencias = relationship("Evidencia", back_populates="actividad")

class Evidencia(Base):
    __tablename__ = "EVIDENCIAS"
    id = Column(Integer, primary_key=True, index=True)
    proyecto_id = Column(Integer, ForeignKey("PROYECTOS.id"))
    actividad_id = Column(Integer, ForeignKey("ACTIVIDADES.id"), nullable=True)
    titulo = Column(String(100))
    descripcion = Column(Text)
    tipo = Column(String(50))
    archivo_url = Column(String(255))
    fecha_captura = Column(DateTime)
    subido_por = Column(Integer, ForeignKey("USUARIOS.id"))
    ubicacion = Column(String(255))
    tags = Column(Text)

    proyecto = relationship("Project", back_populates="evidencias")
    actividad = relationship("Actividad", back_populates="evidencias")

class Document(Base):
    __tablename__ = "DOCUMENTOS"
    id = Column(Integer, primary_key=True, index=True)
    proyecto_id = Column(Integer, ForeignKey("PROYECTOS.id"))
    nombre = Column(String(100), nullable=False)
    tipo = Column(String(50))
    descripcion = Column(Text)
    archivo_url = Column(String(255))
    tamaño = Column(Integer)
    estado = Column(Enum('Pendiente', 'Aprobado', 'Rechazado'), default='Pendiente')
    version = Column(String(10))
    fecha_subida = Column(DateTime, server_default=func.now())
    subido_por = Column(Integer, ForeignKey("USUARIOS.id"))
    fecha_aprob = Column(DateTime)
    aprobado_por = Column(Integer, ForeignKey("USUARIOS.id"))
