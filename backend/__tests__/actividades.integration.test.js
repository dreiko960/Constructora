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
    expect(res.body.errores).toContain('El avance no puede ser mayor a 100%');
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
