import { Router } from "express";
import { authMiddleware } from "../utils/authMiddleware.js";
import { add, findAll, findEventsByCinema, findOne, remove, sanitizeEventInput, update } from "./event.controler.js";

export const eventRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Gestión de eventos en cines
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: authToken
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - name
 *         - startDate
 *         - finishDate
 *         - cinemas
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Evento de navidad"
 *         description:
 *           type: string
 *           example: "Por estas fiestas van a estrenarse peliculas clasicas de navidad"
 *         startDate:
 *           type: string
 *           format: date
 *           example: "2025-12-01"
 *         finishDate:
 *           type: string
 *           format: date
 *           example: "2025-12-31"
 *         cinemas:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: "Cine UTN"
 *               address:
 *                 type: string
 *                 example: "Zeballos 1000, Rosario, Santa Fe"
 */

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Obtiene todos los eventos
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: Lista de eventos encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: found all events
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 *       500:
 *         description: Error al obtener los eventos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while querying all events
 *                 error:
 *                   type: string
 */
eventRouter.get('/', findAll)

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Obtiene un evento por ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del evento
 *     responses:
 *       200:
 *         description: Evento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: found event
 *                 data:
 *                   $ref: '#/components/schemas/Event'
 *       500:
 *         description: Error al buscar el evento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while finding the event
 *                 error:
 *                   type: string
 */
eventRouter.get('/:id', findOne)

/**
 * @swagger
 * /api/events/cinema/{cinemaId}:
 *   get:
 *     summary: Obtiene todos los eventos de un cine específico
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: cinemaId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cine
 *     responses:
 *       200:
 *         description: Lista de eventos encontrados en el cine
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: found all events
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 *       500:
 *         description: An error occurred while querying all events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: AAn error occurred while querying all events
 *                 error:
 *                   type: string
 *                   example: error message
 */
eventRouter.get('/cinema/:cinemaId', findEventsByCinema)

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Crea un nuevo evento
 *     tags: [Events]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: Evento creado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: event created
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 19
 *                     name:
 *                       type: string
 *                       example: "Evento de navidad"
 *                     description:
 *                       type: string
 *                       example: "Por estas fiestas van a estrenarse peliculas clasicas de navidad"
 *                     startDate:
 *                       type: string
 *                       format: date
 *                       example: "2025-12-01"
 *                     finishDate:
 *                       type: string
 *                       format: date
 *                       example: "2025-12-31"
 *                     cinemas:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: "Cine UTN"
 *                           address:
 *                             type: string
 *                             example: "Zeballos 1000, Rosario, Santa Fe"
 *                           theaters:
 *                             type: array
 *                             example: []
 *                           movies:
 *                             type: array
 *                             example: []
 *                           managers:
 *                             type: array
 *                             example: []
 *                           events:
 *                             type: array
 *                             items:
 *                               type: integer
 *                               example: 19
 *                           promotions:
 *                             type: array
 *                             example: []
 *       400:
 *         description: Conflicto de horarios con otro evento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "El tiempo de este evento se solapa con el de otro en los cines: Cine UTN, Cine Atlas"
 *       500:
 *         description: Error al crear el evento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while adding the event
 *                 error:
 *                   type: string
 *                   example: error message
 */
eventRouter.post('/', authMiddleware(['manager']), sanitizeEventInput, add)

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: Actualiza un evento por ID
 *     tags: [Events]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del evento a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *           example:
 *             name: "Evento de PRE-navidad"
 *             description: "Van a estrenarse peliculas clasicas de navidad UN MES ANTES"
 *             startDate: "2025-11-01"
 *             finishDate: "2025-11-30"
 *             cinemas:
 *               - id: 1
 *                 name: "Cine UTN"
 *                 address: "Zeballos 1000, Rosario, Santa Fe"
 *     responses:
 *       200:
 *         description: Evento actualizado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: event updated
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Evento de PRE-navidad"
 *                     description:
 *                       type: string
 *                       example: "Van a estrenarse peliculas clasicas de navidad UN MES ANTES"
 *                     startDate:
 *                       type: string
 *                       format: date
 *                       example: "2025-11-01"
 *                     finishDate:
 *                       type: string
 *                       format: date
 *                       example: "2025-11-30"
 *                     cinemas:
 *                       type: array
 *                       items:
 *                         type: integer
 *                         example: 1  
 *       400:
 *         description: Conflicto de horarios con otro evento en los cines especificados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "El tiempo de este evento se solapa con el de otro en los cines: Cine UTN, Cine Atlas"
 *       500:
 *         description: Error interno al actualizar el evento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while updating the event
 *                 error:
 *                   type: string
 *                   example: "Detailed error message"
 */

eventRouter.put('/:id', authMiddleware(['manager']), sanitizeEventInput, update)

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Elimina un evento por ID
 *     tags: [Events]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del evento a eliminar
 *     responses:
 *       200:
 *         description: Evento eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: event deleted
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 18
 *                     name:
 *                       type: string
 *                       example: "Evento de navidad"
 *                     description:
 *                       type: string
 *                       example: "Por estas fiestas van a estrenarse peliculas clasicas de navidad"
 *                     startDate:
 *                       type: string
 *                       format: date
 *                       example: "2025-12-01"
 *                     finishDate:
 *                       type: string
 *                       format: date
 *                       example: "2025-12-31"
 *       404:
 *         description: Evento no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: event not found for deletion.
 *       500:
 *         description: Error al eliminar el evento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while deleting the event
 *                 error:
 *                   type: string
 */
eventRouter.delete('/:id', authMiddleware(['manager']), remove)