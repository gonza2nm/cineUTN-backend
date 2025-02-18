import { Router } from 'express';
import {
  sanitizeTheaterInput,
  findAll,
  findOne,
  add,
  update,
  remove,
} from './theater.controler.js';
import { authMiddleware } from '../utils/authMiddleware.js';

export const theaterRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Theaters
 *   description: Gestiona Salas de los cines
*/

/**
 * @swagger
 * components:
 *   schemas:
 *     Theater:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         numChairs:
 *           type: integer
 *           description: Número total de butacas en la sala.
 *           example: 100
 *         cantRows:
 *           type: integer
 *           description: Cantidad de filas de asientos en la sala.
 *           example: 10
 *         cantCols:
 *           type: integer
 *           description: Cantidad de columnas de asientos en la sala.
 *           example: 10
 *         cinema:
 *           $ref: '#/components/schemas/Cinema'
 *         shows:
 *           type: array
 *           description: Lista de funciones asociadas a la sala.
 *           items:
 *             $ref: '#/components/schemas/Show'
 */

/**
 * @swagger
 * /api/theaters:
 *   get:
 *     summary: Obtiene todas las salas.
 *     tags: [Theaters]
 *     responses:
 *       200:
 *         description: Se encontraron todas las salas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "found all theaters"
 *                 data:
 *                   type: array
 *                   items:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: integer
 *                        example: 1
 *                      numChairs:
 *                        type: integer
 *                        example: 100
 *                      cantRows:
 *                        type: integer
 *                        example: 10
 *                      cantCols:
 *                        type: integer
 *                        example: 10
 *                      cinema:
 *                        type: integer
 *                        example: 1
 *       500:
 *         description: Error en el servidor al obtener las salas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while querying all theaters"
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */

theaterRouter.get('/', findAll);

/**
 * @swagger
 * /api/theaters/{id}:
 *   get:
 *     summary: Obtiene una sala por su ID.
 *     tags: [Theaters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del teatro a obtener.
 *     responses:
 *       200:
 *         description: Se encontró la sala.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "found theater"
 *                 data:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: integer
 *                        example: 1
 *                      numChairs:
 *                        type: integer
 *                        example: 100
 *                      cantRows:
 *                        type: integer
 *                        example: 10
 *                      cantCols:
 *                        type: integer
 *                        example: 10
 *                      cinema:
 *                        type: integer
 *                        example: 1 
 *       404:
 *         description: No se encontró la sala con el ID especificado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "theater not found"
 *       500:
 *         description: Error en el servidor al obtener la sala.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while querying the theater"
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */

theaterRouter.get('/:id', findOne);

/**
 * @swagger
 * /api/theaters:
 *   post:
 *     summary: Crea una nueva sala.
 *     tags: [Theaters]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numChairs:
 *                 type: integer
 *                 example: 100
 *               cantRows:
 *                 type: integer
 *                 example: 10
 *               cantCols:
 *                 type: integer
 *                 example: 10
 *               cinema:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       201:
 *         description: La sala fue creada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "theater created"
 *                 data:
 *                   $ref: '#/components/schemas/Theater'
 *       500:
 *         description: Error en el servidor al crear la sala.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while adding the data"
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */

theaterRouter.post('/', authMiddleware(['manager']), sanitizeTheaterInput, add);

/**
 * @swagger
 * /api/theaters/{id}:
 *   put:
 *     summary: Actualiza la sala por su ID.
 *     tags: [Theaters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la sala a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numChairs:
 *                 type: integer
 *                 example: 120
 *               cinema:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: La sala fue actualizada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "theater updated"
 *                 data:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: integer
 *                        example: 1
 *                      numChairs:
 *                        type: integer
 *                        example: 100
 *                      cantRows:
 *                        type: integer
 *                        example: 10
 *                      cantCols:
 *                        type: integer
 *                        example: 10
 *                      cinema:
 *                        type: integer
 *                        example: 1
 *       404:
 *         description: No se encontró la sala con el ID especificado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Theater not found to update"
 *       500:
 *         description: Error en el servidor al actualizar la sala.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while updating the theater"
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */

theaterRouter.put('/:id', authMiddleware(['manager']), sanitizeTheaterInput, update);

/**
 * @swagger
 * /api/theaters/{id}:
 *   delete:
 *     summary: Elimina una sala por su ID.
 *     tags: [Theaters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la sala a eliminar.
 *     responses:
 *       200:
 *         description: La sala fue eliminada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "theater deleted"
  *                data:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: integer
 *                        example: 1
 *                      numChairs:
 *                        type: integer
 *                        example: 100
 *                      cantRows:
 *                        type: integer
 *                        example: 10
 *                      cantCols:
 *                        type: integer
 *                        example: 10
 *                      cinema:
 *                        type: integer
 *                        example: 1
 *       404:
 *         description: No se encontró la sala con el ID especificado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "theater not found to delete"
 *       500:
 *         description: Error en el servidor al eliminar la sala.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while deleting the theater"
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */

theaterRouter.delete('/:id', authMiddleware(['manager']), remove);
