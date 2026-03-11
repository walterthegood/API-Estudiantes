'use strict';

const request = require('supertest');
const app = require('../src/app');
const db = require('../src/models/db');

beforeEach(() => {
  db.estudiantes = [];
  db.incidencias = [];
});

describe('Estudiantes API', () => {
  describe('GET /api/estudiantes', () => {
    it('devuelve un arreglo vacío cuando no hay estudiantes', async () => {
      const res = await request(app).get('/api/estudiantes');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('devuelve todos los estudiantes', async () => {
      await request(app)
        .post('/api/estudiantes')
        .send({ nombre: 'Juan', apellido: 'Perez', matricula: 'A001' });

      const res = await request(app).get('/api/estudiantes');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });
  });

  describe('POST /api/estudiantes', () => {
    it('crea un estudiante con campos requeridos', async () => {
      const res = await request(app)
        .post('/api/estudiantes')
        .send({ nombre: 'Ana', apellido: 'Lopez', matricula: 'B002', email: 'ana@example.com', grado: '3ro' });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({ nombre: 'Ana', apellido: 'Lopez', matricula: 'B002' });
      expect(res.body.id).toBeDefined();
    });

    it('retorna 400 cuando faltan campos requeridos', async () => {
      const res = await request(app)
        .post('/api/estudiantes')
        .send({ nombre: 'Ana' });

      expect(res.status).toBe(400);
    });

    it('retorna 409 con matricula duplicada', async () => {
      await request(app)
        .post('/api/estudiantes')
        .send({ nombre: 'Ana', apellido: 'Lopez', matricula: 'B002' });

      const res = await request(app)
        .post('/api/estudiantes')
        .send({ nombre: 'Carlos', apellido: 'Ruiz', matricula: 'B002' });

      expect(res.status).toBe(409);
    });
  });

  describe('GET /api/estudiantes/:id', () => {
    it('devuelve un estudiante por id', async () => {
      const created = await request(app)
        .post('/api/estudiantes')
        .send({ nombre: 'Maria', apellido: 'Gomez', matricula: 'C003' });

      const res = await request(app).get(`/api/estudiantes/${created.body.id}`);
      expect(res.status).toBe(200);
      expect(res.body.nombre).toBe('Maria');
    });

    it('retorna 404 si no existe', async () => {
      const res = await request(app).get('/api/estudiantes/id-inexistente');
      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/estudiantes/:id', () => {
    it('actualiza un estudiante existente', async () => {
      const created = await request(app)
        .post('/api/estudiantes')
        .send({ nombre: 'Pedro', apellido: 'Torres', matricula: 'D004' });

      const res = await request(app)
        .put(`/api/estudiantes/${created.body.id}`)
        .send({ grado: '5to' });

      expect(res.status).toBe(200);
      expect(res.body.grado).toBe('5to');
    });

    it('retorna 404 si no existe', async () => {
      const res = await request(app)
        .put('/api/estudiantes/id-inexistente')
        .send({ nombre: 'Test' });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/estudiantes/:id', () => {
    it('elimina un estudiante existente', async () => {
      const created = await request(app)
        .post('/api/estudiantes')
        .send({ nombre: 'Luis', apellido: 'Martinez', matricula: 'E005' });

      const res = await request(app).delete(`/api/estudiantes/${created.body.id}`);
      expect(res.status).toBe(204);

      const check = await request(app).get(`/api/estudiantes/${created.body.id}`);
      expect(check.status).toBe(404);
    });

    it('retorna 404 si no existe', async () => {
      const res = await request(app).delete('/api/estudiantes/id-inexistente');
      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/estudiantes/:id/incidencias', () => {
    it('devuelve incidencias del estudiante', async () => {
      const est = await request(app)
        .post('/api/estudiantes')
        .send({ nombre: 'Rosa', apellido: 'Diaz', matricula: 'F006' });

      await request(app)
        .post('/api/incidencias')
        .send({ estudianteId: est.body.id, titulo: 'Falta', tipo: 'asistencia' });

      const res = await request(app).get(`/api/estudiantes/${est.body.id}/incidencias`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });

    it('retorna 404 si el estudiante no existe', async () => {
      const res = await request(app).get('/api/estudiantes/id-inexistente/incidencias');
      expect(res.status).toBe(404);
    });
  });
});

describe('Incidencias API', () => {
  let estudianteId;

  beforeEach(async () => {
    const res = await request(app)
      .post('/api/estudiantes')
      .send({ nombre: 'Test', apellido: 'User', matricula: 'T001' });
    estudianteId = res.body.id;
  });

  describe('GET /api/incidencias', () => {
    it('devuelve un arreglo vacío cuando no hay incidencias', async () => {
      const res = await request(app).get('/api/incidencias');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe('POST /api/incidencias', () => {
    it('crea una incidencia con campos requeridos', async () => {
      const res = await request(app)
        .post('/api/incidencias')
        .send({ estudianteId, titulo: 'Conducta inapropiada', tipo: 'disciplinaria' });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({ titulo: 'Conducta inapropiada', tipo: 'disciplinaria', estado: 'abierta' });
      expect(res.body.id).toBeDefined();
    });

    it('retorna 400 cuando faltan campos requeridos', async () => {
      const res = await request(app)
        .post('/api/incidencias')
        .send({ estudianteId, titulo: 'Sin tipo' });

      expect(res.status).toBe(400);
    });

    it('retorna 400 con tipo inválido', async () => {
      const res = await request(app)
        .post('/api/incidencias')
        .send({ estudianteId, titulo: 'Test', tipo: 'invalido' });

      expect(res.status).toBe(400);
    });

    it('retorna 404 si el estudianteId no existe', async () => {
      const res = await request(app)
        .post('/api/incidencias')
        .send({ estudianteId: 'id-inexistente', titulo: 'Test', tipo: 'academica' });

      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/incidencias/:id', () => {
    it('devuelve una incidencia por id', async () => {
      const created = await request(app)
        .post('/api/incidencias')
        .send({ estudianteId, titulo: 'Bajo rendimiento', tipo: 'academica' });

      const res = await request(app).get(`/api/incidencias/${created.body.id}`);
      expect(res.status).toBe(200);
      expect(res.body.titulo).toBe('Bajo rendimiento');
    });

    it('retorna 404 si no existe', async () => {
      const res = await request(app).get('/api/incidencias/id-inexistente');
      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/incidencias/:id', () => {
    it('actualiza una incidencia existente', async () => {
      const created = await request(app)
        .post('/api/incidencias')
        .send({ estudianteId, titulo: 'Falta injustificada', tipo: 'asistencia' });

      const res = await request(app)
        .put(`/api/incidencias/${created.body.id}`)
        .send({ estado: 'cerrada' });

      expect(res.status).toBe(200);
      expect(res.body.estado).toBe('cerrada');
    });

    it('retorna 400 con estado inválido', async () => {
      const created = await request(app)
        .post('/api/incidencias')
        .send({ estudianteId, titulo: 'Test', tipo: 'otra' });

      const res = await request(app)
        .put(`/api/incidencias/${created.body.id}`)
        .send({ estado: 'invalido' });

      expect(res.status).toBe(400);
    });

    it('retorna 404 si no existe', async () => {
      const res = await request(app)
        .put('/api/incidencias/id-inexistente')
        .send({ titulo: 'Test' });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/incidencias/:id', () => {
    it('elimina una incidencia existente', async () => {
      const created = await request(app)
        .post('/api/incidencias')
        .send({ estudianteId, titulo: 'Test delete', tipo: 'salud' });

      const res = await request(app).delete(`/api/incidencias/${created.body.id}`);
      expect(res.status).toBe(204);

      const check = await request(app).get(`/api/incidencias/${created.body.id}`);
      expect(check.status).toBe(404);
    });

    it('retorna 404 si no existe', async () => {
      const res = await request(app).delete('/api/incidencias/id-inexistente');
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/estudiantes/:id elimina incidencias relacionadas', () => {
    it('elimina incidencias al borrar el estudiante', async () => {
      await request(app)
        .post('/api/incidencias')
        .send({ estudianteId, titulo: 'Incidencia huerfana', tipo: 'otra' });

      await request(app).delete(`/api/estudiantes/${estudianteId}`);

      const res = await request(app).get('/api/incidencias');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(0);
    });
  });
});

describe('Health check', () => {
  it('GET /api/health devuelve ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('Ruta no encontrada', () => {
  it('devuelve 404 para rutas desconocidas', async () => {
    const res = await request(app).get('/ruta-inexistente');
    expect(res.status).toBe(404);
  });
});
