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
 *         show:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             dayAndTime:
 *               type: string
 *             finishTime:
 *               type: string
 *             theater:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 cantChairs:
 *                   type: integer
 *                 cantRows:
 *                   type: integer
 *                 cantCols:
 *                   type: integer
 *                 cinema:
 *                   type: integer
 *             movie:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 imagenLink:
 *                   type: string
 *                 duration:
 *                   type: integer
 *             format:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 formatName:
 *                   type: string
 *             language:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 languageName:
 *                   type: string
 *         buy:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             total:
 *               type: integer
 *             status:
 *               type: string
 *             fechaHora:
 *               type: string
 *             user:
 *               type: integer
 *         seat:
 *           type: integer

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
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ticket'
 *             example:
 *               message: found all tickets
 *               data:
 *                - id: 1
 *                  show:
 *                    id: 5
 *                    dayAndTime: "2024-11-11T01:07:00.000Z"
 *                    finishTime: "2024-11-11T02:07:00.000Z"
 *                    theater: 2
 *                    movie: 5
 *                    format: 1
 *                    language: 2
 *                  buy:
 *                    id: 10
 *                    total: 9000
 *                    status: "Válida"
 *                    fechaHora: "2024-11-08T14:42:25.000Z"
 *                    user: 4
 *                  seat: 5
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
 *               message: Ticket found
 *               data:
 *                id: 1
 *                show:
 *                  id: 5
 *                  dayAndTime: "2024-11-11T01:07:00.000Z"
 *                  finishTime: "2024-11-11T02:07:00.000Z"
 *                  theater: 2
 *                  movie: 5
 *                  format: 1
 *                  language: 2
 *                buy:
 *                  id: 10
 *                  total: 9000
 *                  status: "Válida"
 *                  fechaHora: "2024-11-08T14:42:25.000Z"
 *                  user: 4
 *                seat: 5
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
 *               message: Found all tickets
 *               data:
 *                 - id: 1
 *                   show:
 *                     id: 5
 *                     dayAndTime: "2024-11-11T01:07:00.000Z"
 *                     finishTime: "2024-11-11T02:07:00.000Z"
 *                     theater: 
 *                       id: 1 
 *                       numChairs: 75
 *                       cantRows: 8 
 *                       cantCols: 7 
 *                       cinema: 1 
 *                     movie: 
 *                       id: 3
 *                       name: "A Silent Voice: The Movie"
 *                       description: "Acá va la decripcion de la pelicula"
 *                       imageLink: "Aca la portada de la pelicula"
 *                       duration: 90
 *                     format:
 *                       id: 1
 *                       formatName: 2D
 *                     language:
 *                       id: 1
 *                       languageName: "2"
 *                   buy:
 *                     id: 10
 *                     total: 9000
 *                     status: "Válida"
 *                     fechaHora: "2024-11-08T14:42:25.000Z"
 *                     user: 4
 *                   seat: 5
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
 *             $ref: '#/components/schemas/Ticket'
 *           example:
 *             buy: 20
 *             show: 25
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
 *                 show: 20
 *                 buy: 25
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
 *   put:
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
 *             $ref: '#/components/schemas/Ticket'
 *           example:
 *             buy: 20
 *             show: 26
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
 *                 data:
 *                   $ref: '#/components/schemas/Ticket'
 *             example:
 *               message: Ticket updated
 *               data:
 *                 id: 1
 *                 show: 20
 *                 buy: 26
 *                 seat: 20
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
 *         description: Tickets eliminados
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
 *               message: All tickets deleted
 *                   
 *       404:
 *         description: Tickets no encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tickets not found for deletion.
 *       500:
 *         description: Error al encontrar los tickets
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
 *         description: Ticket eliminado
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
 *               message: Ticket deleted
 *               data:
 *                 id: 1
 *                 show: 20
 *                 buy: 26
 *                 seat: 20
 *       404:
 *         description: Ticket no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tickets not found for deletion.
 *       500:
 *         description: Error al buscar el ticket
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
