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
    expect(calcularAvanceTotal(actividades)).toBe(70);
  });
});
