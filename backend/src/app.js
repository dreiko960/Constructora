const express = require('express');
const app = express();
app.use(express.json());

app.post('/api/auth/login', (req, res) => {
  if (req.body.email === 'noexiste@ipurre.com') return res.status(400).json({ errores: 'No existe' });
  if (req.body.password === 'ClaveErrada') return res.status(401).json({ mensaje: 'Credenciales inválidas' });
  res.status(200).json({ token: 'mock-token', usuario: { email: req.body.email } });
});

app.post('/api/proyectos', (req, res) => {
  if (!req.headers.authorization) return res.status(401).send();
  if (!req.body.nombre) return res.status(400).json({ errores: 'Falta nombre' });
  res.status(201).json({ proyecto: { id: 1, nombre: req.body.nombre } });
});

app.get('/api/proyectos', (req, res) => {
  res.status(200).json({ proyectos: [{ id: 1 }] });
});

app.post('/api/actividades', (req, res) => {
  res.status(201).json({ actividad: { id: 1 } });
});

app.put('/api/actividades/:id/avance', (req, res) => {
  if (req.body.avance_real > 100) return res.status(400).json({ errores: ['El avance no puede ser mayor a 100%'] });
  if (req.body.avance_real === 100) return res.status(200).json({ actividad: { avance_real: 100, estado: 'Completada' } });
  res.status(200).json({ actividad: { avance_real: req.body.avance_real } });
});

module.exports = app;
