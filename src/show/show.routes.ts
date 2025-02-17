import { Router } from 'express';
import {
  sanitizeShowInput,
  sanitizeShowInputToFindByCinemaAndMovie,
  findAll,
  findOne,
  findByCinemaAndMovie,
  add,
  update,
  remove,
  findAllByCinema,
} from './show.controler.js';
import { authMiddleware } from '../utils/authMiddleware.js';

export const showRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Shows
 *   description: Gestiona Funciones de los cines
*/

/**
 * @swagger
 * components:
 *   schemas:
 *     Show:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         dayAndTime:
 *           type: string
 *           format: date-time
 *           example: "2025-03-10T18:00:00.000Z"
 *         finishTime:
 *           type: string
 *           format: date-time
 *           example: "2025-03-10T20:00:00.000Z"
 *         theater:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 2
 *         movie:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 5
 *         format:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *         language:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 3
 *         tickets:
 *           type: array
 *           items: 
 *              $ref: '#/components/schemas/Ticket' 
 */


/**
 * @swagger
 * /api/shows:
 *   get:
 *     summary: Obtiene todas las funciones de cine.
 *     tags: 
 *       - Shows
 *     responses:
 *       200:
 *         description: Se encontraron todas las funciones de cine correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Found all shows"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Show'
 *       500:
 *         description: Error en el servidor al obtener las funciones.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while querying all shows"
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */
showRouter.get('/', findAll);

/**
 * @swagger
 * /api/shows/{id}:
 *   get:
 *     summary: Obtiene una función de cine específica.
 *     tags: 
 *       - Shows
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la función de cine.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: moredetails
 *         required: false
 *         description: Si se establece en "yes", devuelve más detalles de la función.
 *         schema:
 *           type: string
 *           enum: [yes]
 *     responses:
 *       200:
 *         description: Se encontró la función de cine correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Found show"
 *                 data:
 *                   $ref: '#/components/schemas/Show'
 *       500:
 *         description: Error en el servidor al obtener la función de cine.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while querying show"
 *                 error:
 *                   type: string
 *                   example: "Show not found"
 */
showRouter.get('/:id', findOne);
/**
 * @swagger
 * /api/shows/cinema/{id}:
 *   get:
 *     summary: Obtiene todas las funciones disponibles en un cine específico.
 *     tags: 
 *       - Shows
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del cine.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Se encontraron todas las funciones disponibles en el cine.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Found all shows"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Show'
 *       500:
 *         description: Error en el servidor al obtener las funciones del cine.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while querying all shows"
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */
showRouter.get('/bycinema/:id',authMiddleware(["user",'manager']), findAllByCinema);

/**
 * @swagger
 * /api/shows/showtimes:
 *   post:
 *     summary: Busca funciones de cine según cine y película.
 *     tags: 
 *       - Shows
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movieId:
 *                 type: integer
 *                 example: 5
 *               cinemaId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Se encontraron las funciones disponibles.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Found Shows"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Show'
 *       400:
 *         description: Error en los datos enviados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "There is an error in the data you sent"
 *                 error:
 *                   type: string
 *                   example: "Bad Request"
 *       500:
 *         description: Error en el servidor al buscar funciones.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while querying show"
 *                 error:
 *                   type: string
 *                   example: "Database error"
 */

showRouter.post('/showtimes', sanitizeShowInputToFindByCinemaAndMovie, findByCinemaAndMovie);
/**
 * @swagger
 * /api/shows:
 *   post:
 *     summary: Agrega una nueva función de cine.
 *     tags: 
 *       - Shows
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dayAndTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-02-20T18:30:00Z"
 *               theater:
 *                 type: integer
 *                 example: 1
 *               movie:
 *                 type: integer
 *                 example: 5
 *               format:
 *                 type: integer
 *                 example: 2
 *               language:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Función creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Show created"
 *                 data:
 *                   $ref: '#/components/schemas/Show'
 *       400:
 *         description: Error en los datos enviados o conflicto en el horario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "El horario de la función se superpone con otra función en la misma sala."
 *       500:
 *         description: Error en el servidor al agregar la función.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while adding the show"
 *                 error:
 *                   type: string
 *                   example: "Database error"
 */

showRouter.post('/', authMiddleware(['manager']), sanitizeShowInput, add);

/**
 * @swagger
 * /api/shows/{id}:
 *   put:
 *     summary: Actualiza una función de cine.
 *     tags: 
 *       - Shows
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la función a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dayAndTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-02-20T18:30:00Z"
 *               theater:
 *                 type: integer
 *                 example: 1
 *               movie:
 *                 type: integer
 *                 example: 5
 *               format:
 *                 type: integer
 *                 example: 2
 *               language:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Función actualizada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Show updated"
 *                 data:
 *                   $ref: '#/components/schemas/Show'
 *       400:
 *         description: Error en los datos enviados o conflicto de horarios.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "El horario de la función se superpone con otra función en la misma sala."
 *       404:
 *         description: Función no encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "La función no se encontró."
 *       500:
 *         description: Error en el servidor al actualizar la función.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while updating the show"
 *                 error:
 *                   type: string
 *                   example: "Database error"
 */

showRouter.put('/:id', authMiddleware(['manager']), sanitizeShowInput, update);

/**
 * @swagger
 * /api/shows/{id}:
 *   delete:
 *     summary: Elimina una función de cine.
 *     tags: 
 *       - Shows
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la función a eliminar.
 *     responses:
 *       200:
 *         description: Función eliminada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Show deleted"
 *                 data:
 *                   $ref: '#/components/schemas/Show'
 *       404:
 *         description: Función no encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Show not found for deletion."
 *       500:
 *         description: Error en el servidor al eliminar la función.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while deleting the show"
 *                 error:
 *                   type: string
 *                   example: "Database error"
 */

showRouter.delete('/:id', authMiddleware(['manager']), remove);