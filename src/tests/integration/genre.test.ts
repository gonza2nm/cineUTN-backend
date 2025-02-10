import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { genreRouter } from '../../../src/genre/genre.routes';
import { orm } from '../../../src/shared/db/orm';
import { Genre } from '../../../src/genre/genre.entity';

// Configurar Express para las pruebas
const app = express();
app.use(express.json());
app.use('/genres', genreRouter);

// Mock de autenticación (es necesario para las rutas)
vi.mock("../../../src/utils/authMiddleware.js", () => ({
  authMiddleware: (_roles: string[]) => (req: any, res: any, next: any) => {
    req.user = { role: 'manager' }; // Asumimos que el role es 'manager'
    next();
  },
}));

// Preparar la base de datos antes de las pruebas
beforeAll(async () => {
  await orm.connect();
});

// Limpiar la base de datos antes de cada prueba
beforeEach(async () => {
  await orm.em.getConnection().execute('DELETE FROM genre;');
});

// Cerrar la conexión después de las pruebas
afterAll(async () => {
  await orm.close();
});

// Test de integración para los géneros
describe('Pruebas de géneros', () => {

  it('GET /genres debería retornar todos los géneros', async () => {
    // Crear un género para probar que no está vacío
    const genre = orm.em.create(Genre, { name: "Acción" });
    await orm.em.persistAndFlush(genre);

    const response = await request(app).get('/genres');

    try {
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0]).toHaveProperty('name', 'Acción');
    } catch (error) {
      console.log("Error en GET /genres:", error);
      throw error; // Re-lanzar el error para que falle la prueba
    }
  });

  it('POST /genres debería crear un nuevo género', async () => {
    const newGenre = {
      name: 'Comedia'
    };

    const response = await request(app).post('/genres').send(newGenre);

    try {
      // Comprobamos si la respuesta fue 201 (creación exitosa)
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'genre created');
      expect(response.body.data).toHaveProperty('name', 'Comedia');
    } catch (error) {
      // Mostrar detalles sobre la respuesta si falla
      console.log("Respuesta completa en POST /genres:", response.body);
      console.log("Error en POST /genres:", error);
      throw error; // Re-lanzar el error para que falle la prueba
    }
  });

  it('GET /genres/:id debería retornar un género específico', async () => {
    // Crear un género para luego obtenerlo
    const genre = orm.em.create(Genre, { name: "Terror" });
    await orm.em.persistAndFlush(genre);

    const response = await request(app).get(`/genres/${genre.id}`);

    try {
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('name', 'Terror');
      expect(response.body.data).toHaveProperty('id', genre.id);
    } catch (error) {
      // Mostrar detalles sobre la respuesta si falla
      console.log("Respuesta completa en GET /genres/:id:", response.body);
      console.log("Error en GET /genres/:id:", error);
      throw error; // Re-lanzar el error para que falle la prueba
    }
  });

  it('PUT /genres/:id debería actualizar un género existente', async () => {
    // Crear un género primero
    const genre = orm.em.create(Genre, { name: "Terror" });
    await orm.em.persistAndFlush(genre);

    // Actualizar el género
    const updatedGenre = { name: 'Suspenso' };
    const response = await request(app).put(`/genres/${genre.id}`).send(updatedGenre);

    try {
      // Comprobamos si la respuesta fue 200 (actualización exitosa)
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'genre updated');
      expect(response.body.data).toHaveProperty('name', 'Suspenso');
    } catch (error) {
      // Mostrar detalles sobre la respuesta si falla
      console.log("Respuesta completa en PUT /genres/:id:", response.body);
      console.log("Error en PUT /genres/:id:", error);
      throw error; // Re-lanzar el error para que falle la prueba
    }
  });

  it('DELETE /genres/:id debería eliminar un género existente', async () => {
    // Crear un género primero
    const genre = orm.em.create(Genre, { name: "Aventura" });
    await orm.em.persistAndFlush(genre);

    // Eliminar el género
    const response = await request(app).delete(`/genres/${genre.id}`);

    try {
      // Comprobamos si la respuesta fue 200 (eliminación exitosa)
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'genre deleted');
    } catch (error) {
      // Mostrar detalles sobre la respuesta si falla
      console.log("Respuesta completa en DELETE /genres/:id:", response.body);
      console.log("Error en DELETE /genres/:id:", error);
      throw error; // Re-lanzar el error para que falle la prueba
    }
  });
});
