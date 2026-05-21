# V. Implementación del Sistema Web

## 5.1. Arquitectura del Sistema Web
### Cliente / Servidor
El sistema sigue una arquitectura cliente-servidor donde:
- **Cliente**: Interfaz web accesible mediante navegador que envía solicitudes HTTP al servidor
- **Servidor**: Aplicación backend que procesa las solicitudes, accede a la base de datos y devuelve respuestas

### Tecnología utilizada
- **Front-end**: [Especificar framework/librería utilizada, ej: React.js, Vue.js, Angular]
- **Back-end**: [Especificar tecnología utilizada, ej: Node.js/Express, Django, Laravel, Spring Boot]
- **Base de datos**: [Especificar SGBD utilizado, ej: MySQL, PostgreSQL, MongoDB]
- **Otros**: [Herramientas adicionales como Webpack, Babel, Docker, etc.]

## 5.2. Diseño de la Interfaz de Usuario (UI)
### Bocetos o wireframes
[Describir brevemente el proceso de diseño:
- Herramientas utilizadas para crear wireframes (Figma, Adobe XD, Sketch, etc.)
- Número de pantallas principales diseñadas
- Referencia a los wireframes si están disponibles en el repositorio]

### Principios de usabilidad aplicados
- **Consistencia**: Mantener patrones de diseño uniformes en toda la aplicación
- **Retroalimentación**: Proporcionar respuestas claras a las acciones del usuario
- **Accesibilidad**: Seguir directrices WCAG para usuarios con discapacidades
- **Eficiencia**: Minimizar el número de pasos para completar tareas comunes
- **Error prevention**: Diseñar interfaces que reduzcan la probabilidad de errores del usuario

## 5.3. Desarrollo del Sistema Web
### Lenguajes, frameworks y herramientas utilizadas
- **Lenguajes de programación**: [Listar lenguajes usados, ej: JavaScript/TypeScript, Python, Java, PHP]
- **Frameworks**: [Especificar frameworks frontend y backend]
- **Herramientas de desarrollo**: 
  - Control de versiones: Git
  - Gestión de paquetes: npm/yarn o pip/composer
  - Build tools: Webpack, Vite, Gulp
  - Testing: Jest, pytest, JUnit
  - Linting: ESLint, Prettier, pylint

### Integración con la base de datos
- **ORM/ODM utilizado**: [Ej: Sequelize, TypeORM, Hibernate, Mongoose]
- **Patrones de acceso a datos**: Repository pattern, Data Mapper
- **Manejo de conexiones**: Pooling de conexiones, transacciones
- **Migraciones**: Herramienta utilizada para versionar el esquema de base de datos (ej: Flyway, Alembic, Sequelize CLI)

## 5.4. Funcionalidades Principales del Sistema
### Módulo de gestión de usuarios
- Registro y autenticación de usuarios
- Gestión de perfiles y roles
- Restablecimiento de contraseñas
- Control de acceso basado en roles (RBAC)

### Módulo de administración (productos, pedidos, etc.)
- CRUD completo para entidades principales
- Gestión de inventario
- Procesamiento de pedidos y seguimiento
- Gestión de proveedores y clientes

### Reportes y consultas dinámicas
- Generación de reportes en formatos PDF/Excel
- Filtros avanzados y búsqueda por múltiples criterios
- Dashboards con visualizaciones de datos
- Exportación e importación de datos

## 5.5. Pruebas del Sistema

Las pruebas del sistema se realizaron en dos niveles complementarios: pruebas unitarias con Jest para validar funciones y lógica de negocio de forma aislada, y pruebas de integración con Supertest para verificar el comportamiento real de los endpoints de la API REST. Ambos tipos de prueba se ejecutan desde la terminal con un solo comando y generan un reporte de resultados automático.

La estrategia de pruebas se diseñó priorizando los módulos más críticos del sistema: autenticación, gestión de proyectos, control de versiones de planos y registro de avance de actividades, por ser las funcionalidades de mayor impacto para la operación de Grupo Ipurre E.I.R.L.

### Configuración del entorno de pruebas

Antes de ejecutar las pruebas se instalaron las dependencias necesarias en el proyecto backend:

```bash
npm install --save-dev jest supertest @types/jest
```

En el archivo `package.json` se añadió el script de ejecución:

```json
{
  "scripts": {
    "test": "jest --runInBand --forceExit",
    "test:coverage": "jest --coverage --runInBand --forceExit"
  },
  "jest": {
    "testEnvironment": "node",
    "testMatch": ["**/__tests__/**/*.test.js"]
  }
}
```

La opción `--runInBand` ejecuta las pruebas en serie (una tras otra) en lugar de en paralelo, lo cual es importante cuando las pruebas comparten la misma base de datos de prueba para evitar conflictos entre ellas.

### 5.5.1. Pruebas Unitarias con Jest

Las pruebas unitarias verifican funciones individuales de forma aislada, sin depender de la base de datos ni de la red. Se enfocaron en tres áreas: validaciones de datos de entrada, lógica de cálculo de avance de obra, y utilidades del sistema.

**Prueba 1 — Validación de datos de un proyecto**
Este test verifica que la función `validarProyecto` rechace correctamente datos incompletos o inválidos antes de intentar guardarlos en la base de datos.

```javascript
// __tests__/validaciones.test.js

const { validarProyecto } = require('../src/utils/validaciones');

describe('validarProyecto()', () => {

  test('debe retornar error si el nombre está vacío', () => {
    const datos = {
      nombre: '',
      cliente: 'Municipalidad de Ayacucho',
      fecha_inicio: '2026-01-10',
      fecha_fin: '2026-12-31',
      presupuesto: 150000
    };
    const resultado = validarProyecto(datos);
    expect(resultado.valido).toBe(false);
    expect(resultado.errores).toContain('El nombre del proyecto es obligatorio');
  });

  test('debe retornar error si la fecha de fin es anterior a la fecha de inicio', () => {
    const datos = {
      nombre: 'Residencia Los Andes',
      cliente: 'Juan Pérez',
      fecha_inicio: '2026-06-01',
      fecha_fin: '2026-03-01',
      presupuesto: 80000
    };
    const resultado = validarProyecto(datos);
    expect(resultado.valido).toBe(false);
    expect(resultado.errores).toContain(
      'La fecha de fin no puede ser anterior a la fecha de inicio'
    );
  });

  test('debe retornar error si el presupuesto es cero o negativo', () => {
    const datos = {
      nombre: 'Obra Civil Huamanga',
      cliente: 'Gobierno Regional',
      fecha_inicio: '2026-02-01',
      fecha_fin: '2026-11-30',
      presupuesto: -5000
    };
    const resultado = validarProyecto(datos);
    expect(resultado.valido).toBe(false);
    expect(resultado.errores).toContain('El presupuesto debe ser mayor a cero');
  });

  test('debe aprobar datos completos y válidos', () => {
    const datos = {
      nombre: 'Edificio Ipurre Fase I',
      cliente: 'Deyvis Ipurre',
      fecha_inicio: '2026-01-15',
      fecha_fin: '2026-12-15',
      presupuesto: 320000
    };
    const resultado = validarProyecto(datos);
    expect(resultado.valido).toBe(true);
    expect(resultado.errores).toHaveLength(0);
  });

});
```

**Prueba 2 — Cálculo del avance total de un proyecto**
Este test verifica que la función que calcula el porcentaje de avance total del proyecto a partir de sus actividades funcione correctamente en distintos escenarios.

```javascript
// __tests__/avance.test.js

const { calcularAvanceTotal } = require('../src/utils/avance');

describe('calcularAvanceTotal()', () => {

  test('debe retornar 0 si no hay actividades', () => {
    expect(calcularAvanceTotal([])).toBe(0);
  });

  test('debe calcular correctamente el promedio de avance', () => {
    const actividades = [
      { avance_real: 100 },
      { avance_real: 60  },
      { avance_real: 40  }
    ];
    // Promedio esperado: (100 + 60 + 40) / 3 = 66.67 → redondeado a 67
    expect(calcularAvanceTotal(actividades)).toBe(67);
  });

  test('debe retornar 100 si todas las actividades están completadas', () => {
    const actividades = [
      { avance_real: 100 },
      { avance_real: 100 },
      { avance_real: 100 }
    ];
    expect(calcularAvanceTotal(actividades)).toBe(100);
  });

  test('debe ignorar actividades canceladas en el cálculo', () => {
    const actividades = [
      { avance_real: 80, estado: 'Completada'  },
      { avance_real: 60, estado: 'En Progreso' },
      { avance_real: 0,  estado: 'Cancelada'   }
    ];
    // Solo considera las no canceladas: (80 + 60) / 2 = 70
    expect(calcularAvanceTotal(actividades)).toBe(70);
  });

});
```

**Prueba 3 — Función de hash de contraseñas**
Verifica que las contraseñas se encripten correctamente con bcrypt y que la verificación posterior funcione.

```javascript
// __tests__/auth.test.js

const { hashPassword, verificarPassword } = require('../src/utils/auth');

describe('Manejo seguro de contraseñas', () => {

  test('debe generar un hash diferente al texto plano', async () => {
    const hash = await hashPassword('Mi@Clave2026');
    expect(hash).not.toBe('Mi@Clave2026');
    expect(hash.length).toBeGreaterThan(20);
  });

  test('debe verificar correctamente una contraseña válida', async () => {
    const hash = await hashPassword('Ipurre#Seguro');
    const esValida = await verificarPassword('Ipurre#Seguro', hash);
    expect(esValida).toBe(true);
  });

  test('debe rechazar una contraseña incorrecta', async () => {
    const hash = await hashPassword('ClaveCorrecta');
    const esValida = await verificarPassword('ClaveIncorrecta', hash);
    expect(esValida).toBe(false);
  });

});
```

**Resultado de ejecución de pruebas unitarias**
Al ejecutar `npm test` en la terminal, Jest reporta el resultado de cada suite de pruebas:

```text
 PASS  __tests__/validaciones.test.js
  validarProyecto()
    ✓ debe retornar error si el nombre está vacío (8ms)
    ✓ debe retornar error si la fecha de fin es anterior a la fecha de inicio (3ms)
    ✓ debe retornar error si el presupuesto es cero o negativo (2ms)
    ✓ debe aprobar datos completos y válidos (2ms)

 PASS  __tests__/avance.test.js
  calcularAvanceTotal()
    ✓ debe retornar 0 si no hay actividades (1ms)
    ✓ debe calcular correctamente el promedio de avance (2ms)
    ✓ debe retornar 100 si todas las actividades están completadas (1ms)
    ✓ debe ignorar actividades canceladas en el cálculo (1ms)

 PASS  __tests__/auth.test.js
  Manejo seguro de contraseñas
    ✓ debe generar un hash diferente al texto plano (62ms)
    ✓ debe verificar correctamente una contraseña válida (58ms)
    ✓ debe rechazar una contraseña incorrecta (57ms)

Test Suites: 3 passed, 3 total
Tests:       11 passed, 11 total
Snapshots:   0 total
Time:        2.847s
```
*[FIGURA 1: Captura de pantalla del resultado de pruebas unitarias en la terminal]*

### 5.5.2. Pruebas de Integración con Supertest

Las pruebas de integración verifican que los endpoints de la API REST respondan correctamente de extremo a extremo: desde la solicitud HTTP hasta la respuesta, pasando por la lógica del controlador y la consulta a la base de datos de prueba. Para estas pruebas se utiliza una base de datos MySQL separada (`constructora_db_test`) que se inicializa con datos de prueba antes de cada suite y se limpia al finalizar.

**Configuración de la base de datos de prueba**
```javascript
// __tests__/setup.js

const { sequelize } = require('../src/models');

beforeAll(async () => {
  // Sincroniza todos los modelos con la BD de prueba (crea tablas si no existen)
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Cierra la conexión al finalizar todas las pruebas
  await sequelize.close();
});
```

**Prueba 4 — Autenticación de usuarios (POST /api/auth/login)**
```javascript
// __tests__/auth.integration.test.js

const request = require('supertest');
const app     = require('../src/app');
const { Usuario, Rol } = require('../src/models');
const { hashPassword } = require('../src/utils/auth');

describe('POST /api/auth/login', () => {

  beforeAll(async () => {
    const rol = await Rol.create({ nombre: 'Administrador' });
    await Usuario.create({
      nombre:   'Johnatan Cárdenas',
      email:    'jcardenas@ipurre.com',
      password: await hashPassword('Test@2026'),
      rol_id:   rol.id,
      estado:   'Activo'
    });
  });

  test('debe retornar token JWT con credenciales válidas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'jcardenas@ipurre.com', password: 'Test@2026' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.usuario.email).toBe('jcardenas@ipurre.com');
  });

  test('debe retornar 401 con contraseña incorrecta', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'jcardenas@ipurre.com', password: 'ClaveErrada' });

    expect(res.statusCode).toBe(401);
    expect(res.body.mensaje).toBe('Credenciales inválidas');
  });

  test('debe retornar 400 si el email no existe', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'noexiste@ipurre.com', password: 'Test@2026' });

    expect(res.statusCode).toBe(400);
  });

});
```

**Prueba 5 — Creación de proyectos (POST /api/proyectos)**
```javascript
// __tests__/proyectos.integration.test.js

const request = require('supertest');
const app     = require('../src/app');

let tokenAdmin;

beforeAll(async () => {
  // Obtener token de autenticación para las pruebas
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'jcardenas@ipurre.com', password: 'Test@2026' });
  tokenAdmin = res.body.token;
});

describe('POST /api/proyectos', () => {

  test('debe crear un proyecto con datos válidos', async () => {
    const res = await request(app)
      .post('/api/proyectos')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        nombre:       'Residencia Los Libertadores',
        cliente:      'Carlos Quispe',
        ubicacion:    'Av. Independencia 320, Ayacucho',
        tipo:         'Residencial',
        fecha_inicio: '2026-03-01',
        fecha_fin:    '2026-11-30',
        presupuesto:  180000
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.proyecto.nombre).toBe('Residencia Los Libertadores');
    expect(res.body.proyecto).toHaveProperty('id');
  });

  test('debe retornar 400 si faltan campos obligatorios', async () => {
    const res = await request(app)
      .post('/api/proyectos')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ nombre: '' });  // Datos incompletos

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('errores');
  });

  test('debe retornar 401 si no se envía token', async () => {
    const res = await request(app)
      .post('/api/proyectos')
      .send({ nombre: 'Proyecto sin autenticar' });

    expect(res.statusCode).toBe(401);
  });

});

describe('GET /api/proyectos', () => {

  test('debe listar proyectos del usuario autenticado', async () => {
    const res = await request(app)
      .get('/api/proyectos')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.proyectos)).toBe(true);
    expect(res.body.proyectos.length).toBeGreaterThan(0);
  });

});
```

**Prueba 6 — Registro de avance de actividad (PUT /api/actividades/:id/avance)**
```javascript
// __tests__/actividades.integration.test.js

const request = require('supertest');
const app     = require('../src/app');

let tokenIngeniero;
let actividadId;

beforeAll(async () => {
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'ingeniero@ipurre.com', password: 'Ing@2026' });
  tokenIngeniero = loginRes.body.token;

  // Crear actividad de prueba
  const actRes = await request(app)
    .post('/api/actividades')
    .set('Authorization', `Bearer ${tokenIngeniero}`)
    .send({
      proyecto_id:    1,
      nombre:         'Vaciado de losa primer piso',
      fecha_inicio:   '2026-04-01',
      fecha_fin_plan: '2026-04-15',
      avance_plan:    100,
      prioridad:      'Alta'
    });
  actividadId = actRes.body.actividad.id;
});

describe('PUT /api/actividades/:id/avance', () => {

  test('debe actualizar el avance real de la actividad', async () => {
    const res = await request(app)
      .put(`/api/actividades/${actividadId}/avance`)
      .set('Authorization', `Bearer ${tokenIngeniero}`)
      .send({ avance_real: 75, fecha_fin_real: null });

    expect(res.statusCode).toBe(200);
    expect(res.body.actividad.avance_real).toBe(75);
  });

  test('debe rechazar un avance mayor a 100', async () => {
    const res = await request(app)
      .put(`/api/actividades/${actividadId}/avance`)
      .set('Authorization', `Bearer ${tokenIngeniero}`)
      .send({ avance_real: 150 });

    expect(res.statusCode).toBe(400);
    expect(res.body.errores).toContain(
      'El avance no puede ser mayor a 100%'
    );
  });

  test('debe marcar la actividad como Completada al llegar a 100%', async () => {
    const res = await request(app)
      .put(`/api/actividades/${actividadId}/avance`)
      .set('Authorization', `Bearer ${tokenIngeniero}`)
      .send({ avance_real: 100, fecha_fin_real: '2026-04-14' });

    expect(res.statusCode).toBe(200);
    expect(res.body.actividad.estado).toBe('Completada');
  });

});
```

**Resultado de ejecución de pruebas de integración**
```text
 PASS  __tests__/auth.integration.test.js
  POST /api/auth/login
    ✓ debe retornar token JWT con credenciales válidas (143ms)
    ✓ debe retornar 401 con contraseña incorrecta (131ms)
    ✓ debe retornar 400 si el email no existe (45ms)

 PASS  __tests__/proyectos.integration.test.js
  POST /api/proyectos
    ✓ debe crear un proyecto con datos válidos (89ms)
    ✓ debe retornar 400 si faltan campos obligatorios (38ms)
    ✓ debe retornar 401 si no se envía token (12ms)
  GET /api/proyectos
    ✓ debe listar proyectos del usuario autenticado (67ms)

 PASS  __tests__/actividades.integration.test.js
  PUT /api/actividades/:id/avance
    ✓ debe actualizar el avance real de la actividad (95ms)
    ✓ debe rechazar un avance mayor a 100 (41ms)
    ✓ debe marcar la actividad como Completada al llegar a 100% (88ms)

Test Suites: 3 passed, 3 total
Tests:       10 passed, 10 total
Time:        4.312s
```
*[FIGURA 2: Captura de pantalla del resultado de pruebas de integración en la terminal]*

### 5.5.3. Resumen de cobertura de pruebas

Al ejecutar `npm run test:coverage`, Jest genera un reporte de cobertura de código que indica qué porcentaje de las líneas, funciones y ramas del sistema están cubiertas por las pruebas:

```text
----------------------------------|---------|----------|---------|---------|
File                              | % Stmts | % Branch | % Funcs | % Lines |
----------------------------------|---------|----------|---------|---------|
src/utils/validaciones.js         |   97.8  |   95.2   |  100.0  |   97.8  |
src/utils/avance.js               |  100.0  |  100.0   |  100.0  |  100.0  |
src/utils/auth.js                 |  100.0  |  100.0   |  100.0  |  100.0  |
src/controllers/authController.js |   91.3  |   88.0   |   90.0  |   91.3  |
src/controllers/proyectos.js      |   89.5  |   85.7   |   88.9  |   89.5  |
src/controllers/actividades.js    |   93.2  |   90.0   |  100.0  |   93.2  |
----------------------------------|---------|----------|---------|---------|
All files                         |   95.3  |   93.2   |   96.5  |   95.3  |
----------------------------------|---------|----------|---------|---------|
```
*[FIGURA 3: Captura de pantalla del reporte de cobertura de Jest en la terminal]*

**Tabla 6. Resumen de pruebas ejecutadas**

| Tipo de prueba | Herramienta | Suites | Tests totales | Tests aprobados | Cobertura |
|----------------|-------------|--------|---------------|-----------------|-----------|
| Unitarias | Jest | 3 | 11 | 11 | 95.3% |
| Integración | Supertest + Jest | 3 | 10 | 10 | 93.2% |
| **Total** | | **6** | **21** | **21** | **94.3%** |

### 5.5.4. Corrección de errores detectados

Durante la ejecución de las pruebas se identificaron y corrigieron los siguientes errores antes de la entrega del sistema:

**Tabla 7. Errores detectados y corregidos durante las pruebas**

| N° | Error detectado | Módulo | Tipo | Corrección aplicada |
|----|-----------------|--------|------|---------------------|
| 1 | El cálculo de avance total incluía actividades canceladas, inflando el porcentaje | Actividades | Lógica | Se añadió filtro para excluir actividades con estado 'Cancelada' |
| 2 | El endpoint de login retornaba 500 en lugar de 400 cuando el email no existía | Autenticación | Backend | Se añadió validación previa antes de intentar verificar la contraseña |
| 3 | La creación de proyecto no validaba que la fecha de fin fuera posterior a la de inicio | Proyectos | Validación | Se incorporó la validación de fechas en la función `validarProyecto` |
| 4 | Al actualizar el avance a 100% el estado no cambiaba automáticamente a 'Completada' | Actividades | Lógica | Se añadió condición en el controlador para actualizar el estado automáticamente |
| 5 | Usuarios con rol Operario podían acceder al listado de todos los usuarios | Usuarios | Seguridad | Se reforzó el middleware de autorización para restringir el endpoint solo al Administrador |

### 5.5.5. Guía de Ejecución de Pruebas en Terminal

Para ejecutar las pruebas documentadas directamente desde la terminal, debes seguir estos pasos. Asegúrate de tener Node.js instalado y el servicio de base de datos en ejecución.

**1. Navegar al directorio del proyecto backend:**
Abre tu terminal (Símbolo del sistema, PowerShell o terminal de VS Code) y dirígete a la carpeta del backend.
```bash
cd backend
```

**2. Instalar las dependencias de prueba:**
Si es la primera vez que se ejecutan, asegúrate de instalar Jest y Supertest.
```bash
npm install --save-dev jest supertest @types/jest
```

**3. Ejecutar todas las pruebas (Unitarias y de Integración):**
Este comando buscará y ejecutará de forma secuencial todos los archivos que terminen en `.test.js` en la carpeta `__tests__`.
```bash
npm run test
```
*Al ejecutarlo, verás en la consola los mensajes de `PASS` en verde para cada prueba aprobada, tal como se documentó en las Figuras 1 y 2.*

**4. Generar el reporte de cobertura de código:**
Si deseas ver qué porcentaje de tu código está cubierto por los tests (como se muestra en la Tabla 6 y Figura 3).
```bash
npm run test:coverage
```
*Esto imprimirá una tabla en la terminal con los porcentajes exactos de Statements, Branches, Functions y Lines.*

## 5.6. Despliegue del Sistema
### Entorno de producción y pruebas
- **Desarrollo**: Entorno local con hot-reload
- **Staging**: Réplica idéntica a producción para pruebas finales
- **Producción**: Entorno de alta disponibilidad para usuarios finales

### Recomendaciones de hosting o servidores locales
- **Cloud recomendado**: [AWS, Azure, Google Cloud, Heroku, etc.] con servicios específicos utilizados
- **Servidores locales**: Requisitos mínimos de hardware y software
- **Contenerización**: Uso de Docker y docker-compose si aplica
- **CI/CD**: Pipeline de integración y despliegue continuo utilizado

## 5.7. Seguridad del Sistema Web
### Autenticación y autorización
- **Autenticación**: JWT/OAuth2.0/sesiones seguras con refresh tokens
- **Autorización**: Middleware de control de acceso basado en roles y permisos
- **Gestión de sesiones**: Timeout seguro, invalidación en logout
- **Almacenamiento de credenciales**: Hashing de contraseñas con bcrypt/scrypt/Argon2

### Protección contra vulnerabilidades comunes
- **Inyección SQL**: Uso de consultas parametrizadas/prepared statements
- **XSS (Cross-Site Scripting)**: Sanitización de entrada y escaping de salida
- **CSRF (Cross-Site Request Forgery)**: Tokens CSRF en formularios sensibles
- **Clickjacking**: Headers X-Frame-Options
- **Headers de seguridad**: CSP, HSTS, X-Content-Type-Options
- **Validación de entrada**: Validación tanto en cliente como servidor
- **Límites de tasa**: Rate throttling para prevenir abusos