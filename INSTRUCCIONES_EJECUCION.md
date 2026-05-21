# Instrucciones de Ejecución - Sistema de Gestión de Obras

Este documento detalla los pasos necesarios para configurar y ejecutar el sistema de gestión de obras del Grupo Ipurre EIRL.

## Requisitos Previos

- **Python 3.8+**
- **Node.js 18+** y **npm**
- **MySQL Server** (opcional si se usa SQLite para desarrollo local)

## Configuración del Backend (FastAPI)

1.  **Navegar al directorio del backend:**
    ```bash
    cd backend
    ```

2.  **Instalar dependencias:**
    ```bash
    pip install -r requirements.txt
    ```
    *Nota: Si experimentas problemas con `bcrypt`, se recomienda instalar `bcrypt==4.0.1`.*

3.  **Configurar variables de entorno:**
    Edita el archivo `.env` en la carpeta `backend/`.
    ```env
    DATABASE_URL=mysql+mysqlconnector://usuario:password@localhost:3306/grupo_ipurre_eirl
    # O para SQLite local:
    # DATABASE_URL=sqlite:///./sql_app.db
    SECRET_KEY=tu_clave_secreta_aqui
    ALGORITHM=HS256
    ACCESS_TOKEN_EXPIRE_MINUTES=30
    ```

4.  **Inicializar la Base de Datos y Semilla de Datos:**
    Ejecuta el script de semilla para crear las tablas y cargar datos de prueba:
    ```bash
    python seed.py
    ```

5.  **Ejecutar el servidor:**
    ```bash
    uvicorn app.main:app --reload
    ```
    El API estará disponible en `http://127.0.0.1:8000`. Puedes ver la documentación en `http://127.0.0.1:8000/docs`.

## Configuración del Frontend (React + Vite)

1.  **Navegar al directorio del frontend:**
    ```bash
    cd frontend
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Ejecutar el entorno de desarrollo:**
    ```bash
    npm run dev
    ```
    El sistema estará accesible en `http://localhost:5173`.

## Usuarios de Prueba (Seed)

Si ejecutaste el script `seed.py`, puedes usar las siguientes credenciales:

| Rol | Email | Password |
| :--- | :--- | :--- |
| Administrador | `admin@constructora.com` | `admin123` |
| Supervisor | `ana.fernandez@constructora.com` | `supervisor123` |
| Ingeniero | `miguel.torres@constructora.com` | `ingeniero123` |
| Operario | `rosa.vargas@constructora.com` | `operario123` |
| Contador | `jorge.paredes@constructora.com` | `contador123` |

## Notas Adicionales

- Asegúrate de que el puerto `8000` (backend) y `5173` (frontend) estén libres.
- Las imágenes y documentos subidos se almacenan en `backend/uploads/`.
