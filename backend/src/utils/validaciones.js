function validarProyecto(datos) {
  if (!datos.nombre) return { valido: false, errores: ['El nombre del proyecto es obligatorio'] };
  if (datos.fecha_fin < datos.fecha_inicio) return { valido: false, errores: ['La fecha de fin no puede ser anterior a la fecha de inicio'] };
  if (datos.presupuesto <= 0) return { valido: false, errores: ['El presupuesto debe ser mayor a cero'] };
  return { valido: true, errores: [] };
}
module.exports = { validarProyecto };
