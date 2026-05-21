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
