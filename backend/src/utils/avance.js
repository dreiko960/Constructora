function calcularAvanceTotal(actividades) {
  if (actividades.length === 0) return 0;
  const validas = actividades.filter(a => a.estado !== 'Cancelada');
  if (validas.length === 0) return 0;
  const sum = validas.reduce((acc, curr) => acc + curr.avance_real, 0);
  return Math.round(sum / validas.length);
}
module.exports = { calcularAvanceTotal };
