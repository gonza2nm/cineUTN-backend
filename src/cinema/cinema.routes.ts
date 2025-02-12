import { Router } from 'express';
import {
  sanitizeCinemaInput,
  findAll,
  findOne,
  add,
  update,
  remove,
  findAllByMovie
} from './cinema.controler.js';
import { authMiddleware } from '../utils/authMiddleware.js';

export const cinemaRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Cinemas
 *   description: Gestión de cines
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Cinema:
 *       type: object
 *       required:
 *         - name
 *         - address
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Cine UTN"
 *         address:
 *           type: string
 *           example: "Zeballos 1000, Rosario, Santa Fe"
 *         theaters:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               numChairs:
 *                 type: integer
 *                 example: 21
 *               cantRows:
 *                 type: integer
 *                 example: 0
 *               cantCols:
 *                 type: integer
 *                 example: 0
 *               cinema:
 *                 type: integer
 *                 example: 1
 *         movies:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: "Guardians of the Galaxy"
 *               description:
 *                 type: string
 *                 example: "Light years from Earth, 26 years after being abducted, Peter Quill finds himself the prime target of a manhunt after discovering an orb wanted by Ronan the Accuser."
 *               imageLink:
 *                 type: string
 *                 example: "https://a.ltrbxd.com/resized/film-poster/9/3/6/7/6/93676-guardians-of-the-galaxy-0-1000-0-1500-crop.jpg?v=3cc8cb967f"
 *               duration:
 *                 type: integer
 *                 example: 0
 */

/**
 * @swagger
 * /api/cinemas:
 *   get:
 *     summary: Obtiene todos los cines
 *     tags: [Cinemas]
 *     responses:
 *       200:
 *         description: Lista de cines encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: found all cinemas
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Cinema'
 *       500:
 *         description: Error al obtener los cines
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while querying all cinemas
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
cinemaRouter.get('/', findAll);

/**
 * @swagger
 * /api/cinemas/movie/{id}:
 *   get:
 *     summary: Obtiene todos los cines que están proyectando una película específica
 *     tags: [Cinemas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la película
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Lista de cines que proyectan la película
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: found all cinemas by movie
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Cine UTN"
 *                       address:
 *                         type: string
 *                         example: "Zeballos 1000, Rosario, Santa Fe"
 *                       theaters:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 1
 *                             numChairs:
 *                               type: integer
 *                               example: 21
 *                             cantRows:
 *                               type: integer
 *                               example: 5
 *                             cantCols:
 *                               type: integer
 *                               example: 7
 *                       movies:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 1
 *                             name:
 *                               type: string
 *                               example: "Guardians of the Galaxy"
 *                             description:
 *                               type: string
 *                               example: "Light years from Earth, 26 years after being abducted, Peter Quill finds himself the prime target of a manhunt after discovering an orb wanted by Ronan the Accuser."
 *                             imageLink:
 *                               type: string
 *                               example: "https://a.ltrbxd.com/resized/film-poster/9/3/6/7/6/93676-guardians-of-the-galaxy-0-1000-0-1500-crop.jpg?v=3cc8cb967f"
 *                             duration:
 *                               type: integer
 *                               example: 0
 *                             cinemas:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: integer
 *                                     example: 1
 *                                   name:
 *                                     type: string
 *                                     example: "Cine UTN"
 *                                   address:
 *                                     type: string
 *                                     example: "Zeballos 1000, Rosario, Santa Fe"
 *       500:
 *         description: Error al obtener los cines
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while querying all cinemas by movie
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
cinemaRouter.get('/movie/:id', findAllByMovie);

/**
 * @swagger
 * /api/cinemas/{id}:
 *   get:
 *     summary: Obtiene un cine específico por su ID
 *     tags: [Cinemas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del cine
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Detalles del cine encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: found cinema
 *                 data:
 *                   $ref: '#/components/schemas/Cinema'
 *       404:
 *         description: Cine no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: cinema not found
 *       500:
 *         description: Error al obtener el cine
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while querying the cinema
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
cinemaRouter.get('/:id', findOne);

/**
 * @swagger
 * /api/cinemas:
 *   post:
 *     summary: Crea un nuevo cine
 *     tags: [Cinemas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Cine Prueba"
 *               address:
 *                 type: string
 *                 example: "Prueba 1020, Rosario, Santa Fe"
 *             required:
 *               - name
 *               - address
 *     responses:
 *       201:
 *         description: Cine creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "cinema created"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 11
 *                     name:
 *                       type: string
 *                       example: "Cine Prueba"
 *                     address:
 *                       type: string
 *                       example: "Prueba 1020, Rosario, Santa Fe"
 *                     theaters:
 *                       type: array
 *                       items: {}
 *                       example: []
 *                     movies:
 *                       type: array
 *                       items: {}
 *                       example: []
 *                     managers:
 *                       type: array
 *                       items: {}
 *                       example: []
 *                     events:
 *                       type: array
 *                       items: {}
 *                       example: []
 *                     promotions:
 *                       type: array
 *                       items: {}
 *                       example: []
 *       500:
 *         description: Error al agregar el cine
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while adding the cinema"
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
cinemaRouter.post('/', authMiddleware(['manager']), sanitizeCinemaInput, add);

/**
 * @swagger
 * /api/cinemas/{id}:
 *   put:
 *     summary: Actualiza un cine existente
 *     tags: [Cinemas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del cine a actualizar
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cinema'
 *     responses:
 *       200:
 *         description: Cine actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: cinema updated
 *                 data:
 *                   $ref: '#/components/schemas/Cinema'
 *       404:
 *         description: Cine no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: cinema not found to update
 *       500:
 *         description: Error al actualizar el cine
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while updating the cinema
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
cinemaRouter.put('/:id', authMiddleware(['manager']), sanitizeCinemaInput, update);

/**
 * @swagger
 * /api/cinemas/{id}:
 *   delete:
 *     summary: Elimina un cine por ID
 *     tags: [Cinemas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del cine a eliminar
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Cine eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: cinema deleted
 *                 data:
 *                   $ref: '#/components/schemas/Cinema'  
 *       404:
 *         description: Cine no encontrado para eliminar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: cinema not found to delete.
 *       409:
 *         description: No se puede eliminar el cine porque tiene eventos asociados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No puede eliminarse este cine si todavía tiene eventos asociados.
 *       500:
 *         description: Error al eliminar el cine
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while deleting the cinema
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
cinemaRouter.delete('/:id', authMiddleware(['manager']), remove);
