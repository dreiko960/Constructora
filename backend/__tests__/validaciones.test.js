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
    expect(resultado.errores).toContain('La fecha de fin no puede ser anterior a la fecha de inicio');
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
