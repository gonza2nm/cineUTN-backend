import { Router } from "express";
import { add, findAll, findOne, remove, sanitizeTicketInput, update, findAllTicketbyPurchase, removeAllTicketsByPurchase} from "./ticket.controler.js";
import { authMiddleware } from "../utils/authMiddleware.js";

export const ticketRouter = Router();


/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: Gestióna las entradas de las peliculas
 */


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: authToken  # La cookie donde se almacena el token JWT
 *   schemas:
 *     Ticket:
 *       type: object
 *       required:
 *         - show
 *         - buy
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         show:
 *           type: number
 *           example: 15
 *         buy:
 *           type: integer
 *           example: 10
 */



/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Obtiene todas las entradas
 *     tags: [Tickets]
 *     responses:
 *       200:
 *         description: Listado de todas las entradas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: found all tickets
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ticket'
 *       500:
 *         description: Error al encotrar las entradas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while finding all the buys
 *                 error:
 *                   type: string
 *                   example: error message
 */

ticketRouter.get('/', authMiddleware(["manager"]), findAll)


/**
 * @swagger
 * /api/tickets/{id}:
 *   get:
 *     summary: Obtiene un ticket por su ID
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del ticket
 *     responses:
 *       200:
 *         description: Ticket encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Ticket'
 *             example:
 *               message: ticket found
 *               data:
 *                   id: 1
 *                   show: 15
 *                   buy: 10
 *       500:
 *         description: Error al encontrar las entradas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while finding the ticket
 *                 error:
 *                   type: string
 *                   example: error message
 */
ticketRouter.get('/:id', authMiddleware(["user", "manager"]), findOne)


/**
 * @swagger
 * /api/tickets/byBuy/{id}:
 *   get:
 *     summary: Obtiene todas las entradas de una compra
 *     tags: [Tickets]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la compra
 *     responses:
 *       200:
 *         description: Listado de entradas de una compra
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ticket'
 *             example:
 *               message: Found tickets
 *               data:
 *                 - id: 1
 *                   total: 15
 *                   userId: 10
 *       500:
 *         description: Error al encontrar las entradas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while finding the tickets
 *                 error:
 *                   type: string
 *                   example: error message
 */
ticketRouter.get('/byBuy/:id', authMiddleware(["user", "manager"]), findAllTicketbyPurchase)

/**
 * @swagger
 * /api/tickets:
 *   post:
 *     summary: Crea un nuevo ticket
 *     tags: [Tickets]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - buy
 *               - show
 *             properties:
 *               buy:
 *                 type: integer
 *                 example: 10
 *               show:
 *                 type: string
 *                 example: '15'
 *     responses:
 *       201:
 *         description: Ticket creado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Ticket'
 *             example:
 *               message: Ticket created
 *               data:
 *                 id: 2
 *                 show: 15
 *                 buy: 10
 *       500:
 *         description: Error al crear el ticket
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while adding the ticket
 *                 error:
 *                   type: string
 *                   example: error message
 */
ticketRouter.post('/', authMiddleware(["user", "manager"]), sanitizeTicketInput, add)

/**
 * @swagger
 * /api/tickets/{id}:
 *   patch:
 *     summary: Actualiza un ticket por su ID
 *     tags: [Tickets]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del ticket
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - show
 *             properties:
 *               show:
 *                 type: string
 *                 example: 16
 *     responses:
 *       200:
 *         description: Ticket actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ticket updated
 *                 data:
 *                   $ref: '#/components/schemas/Ticket'
 *             example:
 *               message: Ticket updated
 *               data:
 *                 id: 1
 *                 show: 16
 *       500:
 *         description: Error al actualizar el ticket
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: 
 *                   type: string
 *                   example: An error occurred while updating the ticket
 *                 error:
 *                   type: string
 *                   example: error.message
 */
ticketRouter.put('/:id', sanitizeTicketInput, update)

/**
 * @swagger
 * /api/tickets/byBuy/{id}:
 *   delete:
 *     summary: Elimina todas las entradas de una compra
 *     tags: [Tickets]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la compra
 *     responses:
 *       200:
 *         description: Tickets deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All tickets deleted
 *       404:
 *         description: Tickets not found for deletion.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tickets not found for deletion.
 *       500:
 *         description: An error occurred while finding the ticket
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while finding the ticket
 *                 error:
 *                   type: string
 *                   example: error message
 */ 
ticketRouter.delete('/byBuy/:id', authMiddleware(["user", "manager"]), removeAllTicketsByPurchase)


/**
 * @swagger
 * /api/tickets/{id}:
 *   delete:
 *     summary: Elimina una entrada por el ID
 *     tags: [Tickets]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la compra
 *     responses:
 *       200:
 *         description: Ticket deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All tickets deleted
 *       404:
 *         description: Tickets not found for deletion.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tickets not found for deletion.
 *       500:
 *         description: An error occurred while finding the ticket
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while finding the ticket
 *                 error:
 *                   type: string
 *                   example: error message
 */ 
ticketRouter.delete('/:id', remove)
