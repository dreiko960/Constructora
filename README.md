# Grupo Ipurre EIRL - Sistema de Gestión de Obras - Documentación Técnica

## 📋 Tabla de Contenido

## Descripción General

Sistema web de gestión de obras de construcción para Grupo Ipurre EIRL con arquitectura cliente-servidor desacoplada. Permite administrar proyectos, planos, actividades, evidencias fotográficas, documentos y usuarios.

**Tecnologías:**
- **Backend:** Python 3.x, FastAPI, SQLAlchemy ORM, MySQL
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Recharts
- **Autenticación:** JWT (JSON Web Tokens) con bcrypt

---

## Requisitos Previos

| Software | Versión | Descarga |
|----------|---------|----------|
| Python | 3.10+ | https://www.python.org/downloads/ |
| Node.js | 18+ | https://nodejs.org/ |
| MySQL | 8.0+ | https://dev.mysql.com/downloads/ |

Verificar instalaciones:
```bash
python --version
node --version
npm --version
```

---

## Estructura del Proyecto

```
Proyecto Constructora/
├── backend/
│   ├── app/
│   │   ├── main.py              # Punto de entrada, endpoints API
│   │   ├── db/
│   │   │   └── session.py       # Conexión BD y sesiones
│   │   ├── models/
│   │   │   └── models.py        # Modelos SQLAlchemy (ORM)
│   │   ├── schemas/
│   │   │   └── schemas.py       # Esquemas Pydantic (validación)
│   │   └── core/
│   │       └── auth.py          # Lógica JWT y hashing
│   ├── uploads/                  # Archivos subidos
│   │   ├── evidencias/
│   │   ├── planos/
│   │   └── documentos/
│   ├── seed.py                   # Datos de prueba
│   ├── requirements.txt          # Dependencias Python
│   ├── .env                      # Variables de entorno
│   └── venv/                     # Entorno virtual
│
├── frontend/
│   ├── src/
│   │   ├── main.tsx              # Punto de entrada React
│   │   ├── App.tsx               # Componente raíz
│   │   ├── routes.tsx            # Rutas de la aplicación
│   │   ├── lib/
│   │   │   └── api.ts            # Configuración Axios
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   └── RootLayout.tsx    # Layout principal (sidebar + header)
│   │   │   └── pages/
│   │   │       ├── Login.tsx
│   │   │       ├── Dashboard.tsx
│   │   │       ├── Projects.tsx
│   │   │       ├── ProjectDetail.tsx
│   │   │       ├── PlanoDetail.tsx
│   │   │       ├── Documents.tsx
│   │   │       ├── Evidencias.tsx
│   │   │       ├── Reports.tsx
│   │   │       ├── Users.tsx
│   │   │       ├── CreateUser.tsx
│   │   │       ├── EditUser.tsx
│   │   │       └── NotFound.tsx
│   │   └── public/
│   │       └── images/           # Imágenes estáticas
│   ├── package.json
│   └── vite.config.ts
│
├── database/
│   ├── schema.sql                # Script SQL de creación de tablas
│   └── normalized_schema.sql     # Esquema normalizado
│
├── arquitectura_sistema.txt      # Documento de arquitectura
└── modelo_entidad_relacion.txt   # Modelo ER
```

---

## Configuración del Backend

### 1. Crear la base de datos en MySQL

```sql
CREATE DATABASE constructora_bd;
```

O ejecutando el script:
```bash
mysql -u root -p < database/schema.sql
```

### 2. Configurar variables de entorno

Editar `backend/.env`:
```env
DATABASE_URL=mysql+mysqlconnector://root:root@127.0.0.1:3306/constructora_bd
SECRET_KEY=09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

> **Nota:** Cambiar `root:root` por tus credenciales reales de MySQL.

### 3. Crear entorno virtual e instalar dependencias

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate        # Windows
pip install -r requirements.txt
```

### 4. Poblar la base de datos con datos de prueba

```bash
python seed.py
```

### 5. Iniciar el servidor

```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

El backend estará disponible en: **http://localhost:8000**
Documentación automática: **http://localhost:8000/docs**

---

## Configuración del Frontend

### 1. Instalar dependencias

```bash
cd frontend
npm install
```

### 2. Iniciar el servidor de desarrollo

```bash
npm run dev
```

El frontend estará disponible en: **http://localhost:5173**

### 3. Compilar para producción

```bash
npm run build
npm run preview
```

---

## Ejecución del Sistema

### Inicio rápido (2 terminales)

**Terminal 1 - Backend:**
```bash
cd backend
.\venv\Scripts\activate
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Verificación

1. Abrir http://localhost:5173
2. Iniciar sesión con las credenciales por defecto
3. Navegar por las diferentes secciones

---

## API Endpoints

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/token` | Login (retorna JWT) |
| GET | `/users/me` | Obtener usuario actual |

### Proyectos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/proyectos` | Listar todos los proyectos |
| GET | `/proyectos/{id}` | Obtener proyecto por ID |
| POST | `/proyectos` | Crear proyecto |
| PUT | `/proyectos/{id}` | Actualizar proyecto |
| DELETE | `/proyectos/{id}` | Eliminar proyecto |

### Planos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/proyectos/{id}/planos` | Listar planos de un proyecto |
| POST | `/proyectos/{id}/planos` | Crear plano |
| GET | `/planos/{plano_id}` | Obtener plano por ID |
| GET | `/planos/{plano_id}/proyecto` | Obtener proyecto del plano |
| DELETE | `/planos/{plano_id}` | Eliminar plano |

### Versiones de Planos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/planos/{plano_id}/versiones` | Listar versiones |
| POST | `/planos/{plano_id}/versiones` | Crear versión |
| DELETE | `/planos/{plano_id}/versiones/{version_id}` | Eliminar versión |

### Actividades

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/proyectos/{id}/actividades` | Listar actividades |
| POST | `/proyectos/{id}/actividades` | Crear actividad |
| DELETE | `/actividades/{id}` | Eliminar actividad |

### Evidencias

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/evidencias` | Listar todas las evidencias |
| GET | `/proyectos/{id}/evidencias` | Evidencias de un proyecto |
| POST | `/proyectos/{id}/evidencias` | Crear evidencia |
| POST | `/evidencias-general` | Crear evidencia sin proyecto |
| DELETE | `/evidencias/{id}` | Eliminar evidencia |

### Documentos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/documents` | Listar todos los documentos |
| GET | `/documents/{id}` | Obtener documento por ID |
| POST | `/documents` | Crear documento |
| PUT | `/documents/{id}` | Actualizar documento |
| DELETE | `/documents/{id}` | Eliminar documento |

### Usuarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/users` | Listar usuarios |
| GET | `/users/{id}` | Obtener usuario |
| POST | `/users` | Crear usuario |
| PUT | `/users/{id}` | Actualizar usuario |
| GET | `/roles` | Listar roles |

### Notificaciones

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/notifications` | Listar notificaciones del usuario |
| POST | `/notifications` | Crear notificación |
| PUT | `/notifications/{id}/read` | Marcar como leída |

### Reportes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/reports/stats` | Estadísticas del dashboard |

### Archivos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/upload` | Subir archivo |
| GET | `/uploads/{filename}` | Descargar archivo |

---

## Base de Datos

### Diagrama Entidad-Relación

```
ROLES (1) ──── (N) USUARIOS (N) ──── (N) PROYECTOS
                              │
                              ├── (1) ──── (N) PLANOS (1) ──── (N) VERSIONES_PLANO
                              │
                              ├── (1) ──── (N) ACTIVIDADES (1) ──── (N) EVIDENCIAS
                              │
                              ├── (1) ──── (N) DOCUMENTOS
                              │
                              └── (1) ──── (N) NOTIFICACIONES
```

### Tablas

#### ROLES
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT PK | Identificador |
| nombre | VARCHAR(50) | Nombre del rol |
| permisos | JSON | Permisos del rol |
| descripcion | TEXT | Descripción |

#### USUARIOS
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT PK | Identificador |
| nombre | VARCHAR(100) | Nombre completo |
| email | VARCHAR(100) UNIQUE | Correo electrónico |
| telefono | VARCHAR(20) | Teléfono |
| password | VARCHAR(255) | Contraseña hasheada |
| rol_id | INT FK | Rol del usuario |
| estado | ENUM | Activo/Inactivo |
| ultimo_acceso | DATETIME | Último acceso |
| fecha_creacion | DATETIME | Fecha de creación |

#### PROYECTOS
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT PK | Identificador |
| nombre | VARCHAR(150) | Nombre del proyecto |
| descripcion | TEXT | Descripción |
| ubicacion | VARCHAR(255) | Ubicación |
| cliente | VARCHAR(100) | Cliente |
| fecha_inicio | DATE | Fecha inicio |
| fecha_fin | DATE | Fecha fin |
| presupuesto | INTEGER | Presupuesto |
| avance_total | INTEGER | Avance (%) |
| estado | ENUM | Activo/Completado/En Pausa/Cancelado |
| tipo | ENUM | Residencial/Comercial/Industrial |
| responsable_id | INT FK | Usuario responsable |

#### PLANOS
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT PK | Identificador |
| proyecto_id | INT FK | Proyecto asociado |
| nombre | VARCHAR(100) | Nombre del plano |
| tipo | VARCHAR(50) | Tipo (Arquitectónico, Estructural, etc.) |
| numero_plano | VARCHAR(50) | Número de plano |
| descripcion | TEXT | Descripción |
| estado | ENUM | Aprobado/Pendiente/Rechazado |
| archivo_url | VARCHAR(255) | URL del archivo |
| fecha_creacion | DATETIME | Fecha de creación |
| creado_por | INT FK | Usuario creador |

#### VERSIONES_PLANO
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT PK | Identificador |
| plano_id | INT FK | Plano asociado |
| version | VARCHAR(10) | Número de versión |
| archivo_url | VARCHAR(255) | URL del archivo |
| cambios | TEXT | Descripción de cambios |
| fecha_version | DATETIME | Fecha de la versión |
| modificado_por | INT FK | Usuario modificador |

#### ACTIVIDADES
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT PK | Identificador |
| proyecto_id | INT FK | Proyecto asociado |
| nombre | VARCHAR(150) | Nombre de la actividad |
| descripcion | TEXT | Descripción |
| responsable_id | INT FK | Usuario responsable |
| fecha_inicio | DATE | Fecha inicio |
| fecha_fin_plan | DATE | Fecha fin planificada |
| fecha_fin_real | DATE | Fecha fin real |
| avance_plan | INTEGER | Avance planificado (%) |
| avance_real | INTEGER | Avance real (%) |
| estado | ENUM | No iniciada/En proceso/Completada/Retrasada |
| prioridad | ENUM | Alta/Media/Baja |

#### EVIDENCIAS
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT PK | Identificador |
| proyecto_id | INT FK | Proyecto asociado |
| actividad_id | INT FK | Actividad asociada |
| titulo | VARCHAR(100) | Título |
| descripcion | TEXT | Descripción |
| tipo | VARCHAR(50) | Tipo (Imagen, Video, etc.) |
| archivo_url | VARCHAR(255) | URL del archivo |
| fecha_captura | DATETIME | Fecha de captura |
| subido_por | INT FK | Usuario que subió |
| ubicacion | VARCHAR(255) | Ubicación |
| tags | TEXT | Etiquetas |

#### DOCUMENTOS
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT PK | Identificador |
| proyecto_id | INT FK | Proyecto asociado |
| nombre | VARCHAR(100) | Nombre del documento |
| tipo | VARCHAR(50) | Tipo (Legal, Técnico, etc.) |
| descripcion | TEXT | Descripción |
| archivo_url | VARCHAR(255) | URL del archivo |
| tamaño | INTEGER | Tamaño en bytes |
| estado | ENUM | Pendiente/Aprobado/Rechazado |
| version | VARCHAR(10) | Versión |
| fecha_subida | DATETIME | Fecha de subida |
| subido_por | INT FK | Usuario que subió |
| fecha_aprob | DATETIME | Fecha de aprobación |
| aprobado_por | INT FK | Usuario aprobador |

#### NOTIFICACIONES
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT PK | Identificador |
| usuario_id | INT FK | Usuario destinatario |
| proyecto_id | INT FK | Proyecto asociado |
| tipo | VARCHAR(50) | Tipo (Info, Alerta, etc.) |
| titulo | VARCHAR(100) | Título |
| mensaje | TEXT | Mensaje |
| leida | BOOLEAN | Leída/No leída |
| fecha_creacion | DATETIME | Fecha de creación |
| url_enlace | VARCHAR(255) | URL de enlace |

#### USUARIOS_PROYECTOS (Tabla pivote)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| usuario_id | INT PK, FK | Usuario |
| proyecto_id | INT PK, FK | Proyecto |
| rol_proyecto | VARCHAR(50) | Rol en el proyecto |
| fecha_asignacion | DATETIME | Fecha de asignación |

---

## Autenticación

El sistema usa JWT (JSON Web Tokens) con el flujo siguiente:

1. **Login:** `POST /token` con email y password
2. **Respuesta:** `{ access_token: "...", token_type: "bearer" }`
3. **Requests subsecuentes:** Header `Authorization: Bearer {token}`
4. **Expiración:** 30 minutos (configurable en `.env`)

### Seguridad
- Contraseñas hasheadas con bcrypt
- Tokens firmados con HS256
- CORS configurado para orígenes específicos
- Validación de tokens en cada request protegida

---

## Credenciales por Defecto

| Email | Password | Rol |
|-------|----------|-----|
| admin@constructora.com | admin123 | Administrador |
| ana.fernandez@constructora.com | supervisor123 | Supervisor |
| miguel.torres@constructora.com | ingeniero123 | Ingeniero |
| rosa.vargas@constructora.com | operario123 | Operario |
| jorge.paredes@constructora.com | contador123 | Contador |
| luisa.huaman@constructora.com | operario123 | Operario |

---

## Datos de Prueba

El sistema incluye un script de seed que pobla la base de datos con datos realistas:

### Proyectos (7)
1. Edificio Mirador Las Gardenias (Residencial, Activo, 35%)
2. Planta Industrial Norte – Ampliación (Industrial, Activo, 18%)
3. Centro Comercial Plaza Sur (Comercial, Activo, 62%)
4. Condominio Los Rosales (Residencial, Activo, 78%)
5. Torre Empresarial Pacífico (Comercial, Activo, 55%)
6. Hospital Regional del Norte – Etapa II (Industrial, Activo, 85%)
7. Residencial Santa Patricia – En Pausa (Residencial, En Pausa, 22%)

### Resumen de datos
- **Roles:** 5 (Administrador, Supervisor, Ingeniero, Operario, Contador)
- **Usuarios:** 6
- **Actividades:** 38
- **Planos:** 32
- **Versiones de plano:** 7
- **Evidencias:** 27
- **Documentos:** 36
- **Notificaciones:** 20

### Ejecutar seed
```bash
cd backend
python seed.py
```

---

## Solución de Problemas

### Error de conexión a MySQL
- Verificar que MySQL esté corriendo
- Verificar credenciales en `.env`
- Crear la base de datos manualmente: `CREATE DATABASE constructora_bd;`

### Error de CORS
- Verificar que el frontend use `localhost` (no `127.0.0.1`)
- Verificar orígenes en `backend/app/main.py`

### Error 500 en evidencias
- Verificar que el schema `Evidencia` tenga `actividad_id: Optional[int]`

### Puerto ocupado
```bash
# Ver proceso usando el puerto
netstat -ano | findstr :8000
netstat -ano | findstr :5173

# Matar proceso
taskkill /PID <PID> /F
```

---

## Variables de Entorno

### Backend (.env)
| Variable | Valor por defecto | Descripción |
|----------|-------------------|-------------|
| DATABASE_URL | mysql+mysqlconnector://root:root@127.0.0.1:3306/constructora_bd | URL de conexión a BD |
| SECRET_KEY | (hash largo) | Clave para firmar JWT |
| ALGORITHM | HS256 | Algoritmo de firma |
| ACCESS_TOKEN_EXPIRE_MINUTES | 30 | Expiración del token |

---

## Comandos Útiles

### Backend
```bash
# Activar entorno virtual
.\venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Iniciar servidor
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Poblar base de datos
python seed.py

# Ver documentación API
# http://localhost:8000/docs
```

### Frontend
```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Vista previa de producción
npm run preview
```

---

## Rutas del Frontend

| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/login` | Login | Inicio de sesión |
| `/dashboard` | Dashboard | Panel principal |
| `/proyectos` | Projects | Lista de proyectos |
| `/proyectos/nuevo` | CreateProject | Crear proyecto |
| `/proyectos/:id` | ProjectDetail | Detalle del proyecto |
| `/proyectos/:id/planos/:planoId` | PlanoDetail | Detalle del plano |
| `/documentos` | Documents | Lista de documentos |
| `/documentos/:id` | DocumentDetail | Detalle del documento |
| `/evidencias` | Evidencias | Galería de evidencias |
| `/reportes` | Reports | Reportes y estadísticas |
| `/usuarios` | Users | Lista de usuarios |
| `/usuarios/nuevo` | CreateUser | Crear usuario |
| `/usuarios/editar/:id` | EditUser | Editar usuario |

---

## Notas de Desarrollo

- El frontend usa `localhost:8000` como base URL para la API
- Los archivos subidos se guardan en `backend/uploads/`
- Las tablas se crean automáticamente al iniciar el backend
- El seed solo inserta datos si las tablas están vacías
- Para reiniciar los datos: eliminar y recrear la base de datos, luego ejecutar `python seed.py`
