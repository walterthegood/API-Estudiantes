'use strict';

const { randomUUID } = require('crypto');
const db = require('../models/db');

// GET /api/estudiantes
function getAll(req, res) {
  res.json(db.estudiantes);
}

// GET /api/estudiantes/:id
function getById(req, res) {
  const estudiante = db.estudiantes.find((e) => e.id === req.params.id);
  if (!estudiante) {
    return res.status(404).json({ message: 'Estudiante no encontrado' });
  }
  res.json(estudiante);
}

// POST /api/estudiantes
function create(req, res) {
  const { nombre, apellido, matricula, email, grado } = req.body;

  if (!nombre || !apellido || !matricula) {
    return res
      .status(400)
      .json({ message: 'Los campos nombre, apellido y matricula son requeridos' });
  }

  const duplicate = db.estudiantes.find((e) => e.matricula === matricula);
  if (duplicate) {
    return res.status(409).json({ message: 'Ya existe un estudiante con esa matricula' });
  }

  const estudiante = {
    id: randomUUID(),
    nombre,
    apellido,
    matricula,
    email: email || null,
    grado: grado || null,
    creadoEn: new Date().toISOString(),
  };

  db.estudiantes.push(estudiante);
  res.status(201).json(estudiante);
}

// PUT /api/estudiantes/:id
function update(req, res) {
  const index = db.estudiantes.findIndex((e) => e.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Estudiante no encontrado' });
  }

  const { nombre, apellido, matricula, email, grado } = req.body;

  if (matricula) {
    const duplicate = db.estudiantes.find(
      (e) => e.matricula === matricula && e.id !== req.params.id
    );
    if (duplicate) {
      return res.status(409).json({ message: 'Ya existe un estudiante con esa matricula' });
    }
  }

  db.estudiantes[index] = {
    ...db.estudiantes[index],
    nombre: nombre !== undefined ? nombre : db.estudiantes[index].nombre,
    apellido: apellido !== undefined ? apellido : db.estudiantes[index].apellido,
    matricula: matricula !== undefined ? matricula : db.estudiantes[index].matricula,
    email: email !== undefined ? email : db.estudiantes[index].email,
    grado: grado !== undefined ? grado : db.estudiantes[index].grado,
  };

  res.json(db.estudiantes[index]);
}

// DELETE /api/estudiantes/:id
function remove(req, res) {
  const index = db.estudiantes.findIndex((e) => e.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Estudiante no encontrado' });
  }

  // Also remove associated incidents
  db.incidencias = db.incidencias.filter((i) => i.estudianteId !== req.params.id);

  db.estudiantes.splice(index, 1);
  res.status(204).send();
}

// GET /api/estudiantes/:id/incidencias
function getIncidencias(req, res) {
  const estudiante = db.estudiantes.find((e) => e.id === req.params.id);
  if (!estudiante) {
    return res.status(404).json({ message: 'Estudiante no encontrado' });
  }

  const incidencias = db.incidencias.filter((i) => i.estudianteId === req.params.id);
  res.json(incidencias);
}

module.exports = { getAll, getById, create, update, remove, getIncidencias };
