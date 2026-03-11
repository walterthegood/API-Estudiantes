'use strict';

const { randomUUID } = require('crypto');
const db = require('../models/db');

const TIPOS_VALIDOS = ['academica', 'disciplinaria', 'asistencia', 'salud', 'otra'];
const ESTADOS_VALIDOS = ['abierta', 'en_proceso', 'cerrada'];

// GET /api/incidencias
function getAll(req, res) {
  res.json(db.incidencias);
}

// GET /api/incidencias/:id
function getById(req, res) {
  const incidencia = db.incidencias.find((i) => i.id === req.params.id);
  if (!incidencia) {
    return res.status(404).json({ message: 'Incidencia no encontrada' });
  }
  res.json(incidencia);
}

// POST /api/incidencias
function create(req, res) {
  const { estudianteId, titulo, descripcion, tipo, estado } = req.body;

  if (!estudianteId || !titulo || !tipo) {
    return res
      .status(400)
      .json({ message: 'Los campos estudianteId, titulo y tipo son requeridos' });
  }

  if (!TIPOS_VALIDOS.includes(tipo)) {
    return res
      .status(400)
      .json({ message: `El tipo debe ser uno de: ${TIPOS_VALIDOS.join(', ')}` });
  }

  const estadoFinal = estado || 'abierta';
  if (!ESTADOS_VALIDOS.includes(estadoFinal)) {
    return res
      .status(400)
      .json({ message: `El estado debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}` });
  }

  const estudiante = db.estudiantes.find((e) => e.id === estudianteId);
  if (!estudiante) {
    return res.status(404).json({ message: 'Estudiante no encontrado' });
  }

  const incidencia = {
    id: randomUUID(),
    estudianteId,
    titulo,
    descripcion: descripcion || null,
    tipo,
    estado: estadoFinal,
    fecha: new Date().toISOString(),
  };

  db.incidencias.push(incidencia);
  res.status(201).json(incidencia);
}

// PUT /api/incidencias/:id
function update(req, res) {
  const index = db.incidencias.findIndex((i) => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Incidencia no encontrada' });
  }

  const { titulo, descripcion, tipo, estado } = req.body;

  if (tipo && !TIPOS_VALIDOS.includes(tipo)) {
    return res
      .status(400)
      .json({ message: `El tipo debe ser uno de: ${TIPOS_VALIDOS.join(', ')}` });
  }

  if (estado && !ESTADOS_VALIDOS.includes(estado)) {
    return res
      .status(400)
      .json({ message: `El estado debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}` });
  }

  db.incidencias[index] = {
    ...db.incidencias[index],
    titulo: titulo !== undefined ? titulo : db.incidencias[index].titulo,
    descripcion: descripcion !== undefined ? descripcion : db.incidencias[index].descripcion,
    tipo: tipo !== undefined ? tipo : db.incidencias[index].tipo,
    estado: estado !== undefined ? estado : db.incidencias[index].estado,
  };

  res.json(db.incidencias[index]);
}

// DELETE /api/incidencias/:id
function remove(req, res) {
  const index = db.incidencias.findIndex((i) => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Incidencia no encontrada' });
  }

  db.incidencias.splice(index, 1);
  res.status(204).send();
}

module.exports = { getAll, getById, create, update, remove };
