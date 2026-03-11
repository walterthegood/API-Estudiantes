# API-Estudiantes

API REST para la gestión de **incidencias de estudiantes**, construida con Node.js y Express.

## Instalación

```bash
npm install
```

## Uso

```bash
npm start
```

El servidor corre en `http://localhost:3000` por defecto. La variable de entorno `PORT` puede usarse para cambiar el puerto.

## Endpoints

### Estudiantes

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/estudiantes` | Listar todos los estudiantes |
| GET | `/api/estudiantes/:id` | Obtener un estudiante por ID |
| POST | `/api/estudiantes` | Crear un nuevo estudiante |
| PUT | `/api/estudiantes/:id` | Actualizar un estudiante |
| DELETE | `/api/estudiantes/:id` | Eliminar un estudiante (y sus incidencias) |
| GET | `/api/estudiantes/:id/incidencias` | Listar incidencias de un estudiante |

#### Campos del estudiante

| Campo | Tipo | Requerido |
|-------|------|-----------|
| `nombre` | string | ✅ |
| `apellido` | string | ✅ |
| `matricula` | string | ✅ (único) |
| `email` | string | ❌ |
| `grado` | string | ❌ |

### Incidencias

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/incidencias` | Listar todas las incidencias |
| GET | `/api/incidencias/:id` | Obtener una incidencia por ID |
| POST | `/api/incidencias` | Crear una nueva incidencia |
| PUT | `/api/incidencias/:id` | Actualizar una incidencia |
| DELETE | `/api/incidencias/:id` | Eliminar una incidencia |

#### Campos de la incidencia

| Campo | Tipo | Requerido | Valores |
|-------|------|-----------|---------|
| `estudianteId` | string | ✅ | ID de estudiante existente |
| `titulo` | string | ✅ | |
| `descripcion` | string | ❌ | |
| `tipo` | string | ✅ | `academica`, `disciplinaria`, `asistencia`, `salud`, `otra` |
| `estado` | string | ❌ | `abierta` (default), `en_proceso`, `cerrada` |

## Pruebas

```bash
npm test
```

## Estructura del proyecto

```
├── index.js              # Punto de entrada
├── src/
│   ├── app.js            # Configuración de Express
│   ├── models/
│   │   └── db.js         # Base de datos en memoria
│   ├── controllers/
│   │   ├── estudiantesController.js
│   │   └── incidenciasController.js
│   └── routes/
│       ├── estudiantes.js
│       └── incidencias.js
└── tests/
    └── api.test.js
```
