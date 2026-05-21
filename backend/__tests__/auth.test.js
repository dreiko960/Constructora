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
