'use strict';

const express = require('express');

const app = express();

app.use(express.json());

app.use('/api/estudiantes', require('./routes/estudiantes'));
app.use('/api/incidencias', require('./routes/incidencias'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

module.exports = app;
