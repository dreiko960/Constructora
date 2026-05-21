// __tests__/proyectos.integration.test.js
const request = require('supertest');
const app     = require('../src/app');

let tokenAdmin;

beforeAll(async () => {
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
      .send({ nombre: '' });

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
