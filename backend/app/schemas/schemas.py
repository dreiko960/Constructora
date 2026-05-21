from pydantic import BaseModel, EmailStr
from datetime import datetime, date
from typing import Optional, List, Any

class RoleBase(BaseModel):
    nombre: str
    permisos: Optional[Any] = None
    descripcion: Optional[str] = None

class Role(RoleBase):
    id: int
    class Config:
        from_attributes = True

class UserBase(BaseModel):
    nombre: str
    email: EmailStr
    telefono: Optional[str] = None
    estado: str = "Activo"

class UserCreate(UserBase):
    password: str
    rol_id: int

class User(UserBase):
    id: int
    rol_id: Optional[int] = None
    ultimo_acceso: Optional[datetime] = None
    fecha_creacion: datetime
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class ProjectBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    ubicacion: Optional[str] = None
    cliente: Optional[str] = None
    fecha_inicio: Optional[date] = None
    fecha_fin: Optional[date] = None
    presupuesto: Optional[int] = None
    estado: str = "Activo"
    tipo: str

class ProjectCreate(ProjectBase):
    responsable_id: int

class Project(ProjectBase):
    id: int
    avance_total: int
    responsable_id: Optional[int] = None
    class Config:
        from_attributes = True

class PlanoBase(BaseModel):
    nombre: str
    tipo: Optional[str] = None
    numero_plano: Optional[str] = None
    descripcion: Optional[str] = None
    estado: str = "Pendiente"
    archivo_url: Optional[str] = None

class PlanoCreate(PlanoBase):
    proyecto_id: int
    creado_por: int

class Plano(PlanoBase):
    id: int
    proyecto_id: int
    fecha_creacion: datetime
    class Config:
        from_attributes = True

class ActividadBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    responsable_id: Optional[int] = None
    fecha_inicio: Optional[date] = None
    fecha_fin_plan: Optional[date] = None
    avance_plan: int = 0
    avance_real: int = 0
    estado: str = "No iniciada"
    prioridad: str = "Media"

class ActividadCreate(ActividadBase):
    proyecto_id: int

class Actividad(ActividadBase):
    id: int
    proyecto_id: int
    class Config:
        from_attributes = True

class EvidenciaBase(BaseModel):
    titulo: Optional[str] = None
    descripcion: Optional[str] = None
    tipo: Optional[str] = None
    archivo_url: Optional[str] = None
    fecha_captura: Optional[datetime] = None
    ubicacion: Optional[str] = None
    tags: Optional[str] = None

class EvidenciaCreate(EvidenciaBase):
    proyecto_id: Optional[int] = None
    actividad_id: Optional[int] = None
    subido_por: int

class Evidencia(EvidenciaBase):
    id: int
    proyecto_id: int
    actividad_id: Optional[int] = None
    subido_por: Optional[int] = None
    class Config:
        from_attributes = True

class NotificationBase(BaseModel):
    tipo: Optional[str] = None
    titulo: str
    mensaje: str
    leida: bool = False
    url_enlace: Optional[str] = None

class NotificationCreate(NotificationBase):
    usuario_id: int
    proyecto_id: Optional[int] = None

class Notification(NotificationBase):
    id: int
    usuario_id: int
    proyecto_id: Optional[int] = None
    fecha_creacion: datetime
    class Config:
        from_attributes = True

class DocumentBase(BaseModel):
    nombre: str
    tipo: Optional[str] = None
    descripcion: Optional[str] = None
    archivo_url: Optional[str] = None
    estado: str = "Pendiente"
    version: Optional[str] = "1.0"

class DocumentCreate(DocumentBase):
    proyecto_id: Optional[int] = None
    subido_por: int

class DocumentUpdate(BaseModel):
    nombre: Optional[str] = None
    tipo: Optional[str] = None
    descripcion: Optional[str] = None
    archivo_url: Optional[str] = None
    estado: Optional[str] = None
    version: Optional[str] = None
    proyecto_id: Optional[int] = None

class ReportSummary(BaseModel):
    total_proyectos: int
    proyectos_activos: int
    presupuesto_total: int
    gasto_estimado: int
    avance_promedio: float

class FinancialData(BaseModel):
    month: str
    presupuesto: int
    gasto: int
    avance: Optional[int] = 0

class TypeDistribution(BaseModel):
    name: str
    value: int

class DashboardStats(BaseModel):
    summary: ReportSummary
    financials: List[FinancialData]
    distribution: List[TypeDistribution]

class Document(DocumentBase):
    id: int
    proyecto_id: Optional[int] = None
    tamaño: Optional[int] = None
    fecha_subida: datetime
    subido_por: int
    fecha_aprob: Optional[datetime] = None
    aprobado_por: Optional[int] = None
    class Config:
        from_attributes = True

class VersionPlanoBase(BaseModel):
    version: str
    archivo_url: str
    cambios: Optional[str] = None

class VersionPlanoCreate(VersionPlanoBase):
    plano_id: int
    modificado_por: int

class VersionPlano(VersionPlanoBase):
    id: int
    plano_id: int
    fecha_version: datetime
    modificado_por: int
    class Config:
        from_attributes = True
