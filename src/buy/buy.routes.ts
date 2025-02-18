import { Router } from 'express';
import {
  sanitizeBuyInput,
  findAll,
  findOne,
  add,
  update,
  remove, 
  findAllpurchasebyUser,
  addPurchase,
  generateQRCodeForBuy,
  validateQRCode
} from './buy.controler.js';
import { authMiddleware } from '../utils/authMiddleware.js';
import { sanitizeTicketInput } from '../ticket/ticket.controler.js';

export const buyRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Buys
 *   description: Gestióna la compra de entradas y otros productos
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
 *     Buy:
 *       type: object
 *       required:
 *         - total
 *         - status
 *         - fechaHora
 *         - user
 *       properties:
 *         id:
 *           type: integer
 *         total:
 *           type: number
 *         status:
 *           type: string
 *         fechaHora:
 *           type: string
 *           format: date-time
 *         user:
 *           type: object
 *           properties:
 *             id: 
 *               type: integer 
 *             dni: 
 *               type: string 
 *             name: 
 *               type: string 
 *             surname: 
 *               type: string 
 *             email: 
 *               type: string 
 *             password: 
 *               type: string 
 *             type: 
 *               type: string 
 *             cinema: 
 *               type: integer 
 *         tickets:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *             id: 
 *               type: integer 
 *             show: 
 *               type: integer 
 *             buy: 
 *               type: integer 
 *             seat: 
 *               type: integer 
 *         snacksBuy:
 *           type: array
 *         promotionsBuy:
 *           type: array
 *
 */



/**
 * @swagger
 * /api/buys:
 *   get:
 *     summary: Obtiene todas las compras
 *     tags: [Buys]
 *     responses:
 *       200:
 *         description: Listado de todas las compras
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
 *                     $ref: '#/components/schemas/Promotion'
 *             example:
 *               message: found all buys
 *               data:
 *                 - id: 1
 *                   total: 9000
 *                   status: "Válida"
 *                   fechaHora: "2025-02-10"
 *                   user:
 *                     id: 4
 *                     dni: 4
 *                     name: "Nombre"
 *                     surname: "Apellido"
 *                     email: "ejemplogmail.com"
 *                     password: "123456"
 *                     type: "user"
 *                     cinema: null
 *                   tickets:
 *                     - id: 1
 *                       show: 5
 *                       buy: 5
 *                       seat: 6
 *       500:
 *         description: Error al encontrar las compras
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
 *                   example: error.message
 */
buyRouter.get('/', authMiddleware(["manager"]), findAll);


/**
 * @swagger
 * /api/buys/{id}:
 *   get:
 *     summary: Obtiene una compra por su id
 *     tags: [Buys]
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
 *         description: Compra encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   items:
 *                     $ref: '#/components/schemas/Buy'
 *                     tickets:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id: 
 *                             type: integer 
 *                           show: 
 *                             type: object  
 *                             properties: 
 *                               id: 
 *                                 type: integer 
 *                               dayAndTime: 
 *                                 type: string 
 *                               finishTime: 
 *                                 type: string 
 *                               theater: 
 *                                 type: integer 
 *                               movie: 
 *                                 type: object  
 *                                 properties:  
 *                                   id:  
 *                                     type: integer   
 *                                   name:  
 *                                     type: string   
 *                                   description:  
 *                                     type: string   
 *                                   imageLink:  
 *                                     type: string   
 *                                   duration:  
 *                                     type: integer   
 *                               format: 
 *                                 type: object  
 *                                 properties:  
 *                                   id:  
 *                                     type: integer   
 *                                   formatName:  
 *                                     type: string   
 *                               language: 
 *                                 type: object  
 *                                 properties:  
 *                                   id:  
 *                                     type: integer   
 *                                   languageName:  
 *                                     type: string   
 *                     seat:
 *                       type: object
 *                       properties:
 *                         id: 
 *                           type: integer 
 *                         seatNumber: 
 *                           type: string 
 *                         status: 
 *                           type: string 
 *                         show: 
 *                           type: object 
 * 
 *             example:
 *               message: Found buy
 *               data:
 *                 - id: 1
 *                   total: 9000
 *                   status: "Válida"
 *                   fechaHora: "2025-02-10"
 *                   user: 4
 *                   tickets:
 *                     - id: 1
 *                       show: 
 *                         id: 1 
 *                         dayAndTime: "2025-02-17T02:00:00.000Z" 
 *                         finishTime: "2025-02-17T03:30:00.000Z"
 *                         theater: 1 
 *                         movie: 
 *                           id: 1 
 *                           name: "Nombre peli" 
 *                           description: "Descripcion de la peli" 
 *                           imageLink: "Portada" 
 *                           duration: 90 
 *                         format: 
 *                           id: 1 
 *                           formatName: "formato" 
 *                         language: 
 *                           id: 1 
 *                           languageName: "idioma" 
 *                       buy: 5
 *                       seat: 
 *                         id: 1 
 *                         seatNumber: "A1" 
 *                         status: "ocupado"
 *                         show:
 *                           id: 1 
 *                           dayAndTime: "2025-02-17T02:00:00.000Z" 
 *                           finishTime: "2025-02-17T03:30:00.000Z"
 *                           theater: 1 
 *                           movie: 
 *                             id: 1 
 *                             name: "Nombre peli" 
 *                             description: "Descripcion de la peli" 
 *                             imageLink: "Portada" 
 *                             duration: 90 
 *                           format: 
 *                             id: 1 
 *                             formatName: "formato" 
 *                           language: 
 *                             id: 1 
 *                             languageName: "idioma"
 *                   snacksBuy: []
 *                   promotionsBuy: []
 *       500:
 *         description: Error al encontrar la compra
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while finding the buy
 *                 error:
 *                   type: string
 *                   example: error.message
 */
buyRouter.get('/:id', authMiddleware(["user", "manager"]), findOne);



/**
 * @swagger
 * /api/buys/byUser/{id}:
 *   get:
 *     summary: Obtiene todas las compras de un usuario
 *     tags: [Buys]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Listado de compras de un usuario
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
 *                     $ref: '#/components/schemas/Buy'
 *             example:
 *               message: Found all buys
 *               data:
 *                 - id: 1
 *                   total: 9000
 *                   status: "Válida"
 *                   fechaHora: "2025-02-10"
 *                   user: 4
 *                   tickets:
 *                     - id: 1
 *                       show: 
 *                         id: 1 
 *                         dayAndTime: "2025-02-17T02:00:00.000Z" 
 *                         finishTime: "2025-02-17T03:30:00.000Z"
 *                         theater: 1 
 *                         movie: 
 *                           id: 1 
 *                           name: "Nombre peli" 
 *                           description: "Descripcion de la peli" 
 *                           imageLink: "Portada" 
 *                           duration: 90 
 *                         format: 1
 *                         language: 1
 *                       buy: 5
 *                       seat: 1 
 *       500:
 *         description: Error al encontrar las compras
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
 *                   example: error.message
 */
buyRouter.get('/byUser/:id', authMiddleware(["user", "manager"]), findAllpurchasebyUser)



/**
 * @swagger
 * /api/buys/generateQr/{id}:
 *   get:
 *     summary: Genera un código QR para una compra específica
 *     tags: [Buys]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la compra para la cual se generará el código QR
 *     responses:
 *       200:
 *         description: Código QR generado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'QR code generated successfully'
 *                 qrCodeUrl:
 *                   type: string
 *                   example: 'https://example.com/qrcode/123'
 *       404:
 *         description: Compra no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Buy not found'
 *       500:
 *         description: Error al generar el código QR
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'An error occurred while generating the QR'
 *                 error:
 *                   type: string
 *                   example: 'Error details here'
 */

buyRouter.get('/generateQr/:id', authMiddleware(["user", "manager"]), generateQRCodeForBuy)
//buyRouter.post('/',authMiddleware(["user", "manager"]), sanitizeBuyInput, add);


/**
 * @swagger
 * /api/buys:
 *   post:
 *     summary: Crea una nueva compra y sus entradas
 *     tags: [Buys]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Buy'
 *             show:
 *               type: integer
 *             seats:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id: 
 *                     type: integer 
 *                   seatNumber: 
 *                     type: string 
 *                   status: 
 *                      type: string 
 *                   show: 
 *                      type: integer
 *           example:
 *             total: 9000
 *             fechaHora: "2025-02-10" 
 *             user: 7 
 *             show: 25 
 *             seats: 
 *               - id: 2
 *                 seatNumber: A2 
 *                 status: "Disponible" 
 *                 show: 25 
 *     responses:
 *       200:
 *         description: Compra y entradas creadas exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Buy'
 *             example:
 *               message: "Buy and Tickets created"
 *               data:
 *                 id: 1
 *                 fechaHora: "2025-02-18T21:49:04.202Z"
 *                 status: "Válida"
 *                 total: 9000
 *                 user: 7
 *                 tickets:
 *                   - id: 1
 *                     show: 25
 *                     buy: 1
 *                     seats: 
 *                       id: 1 
 *                       seatNumber: A1 
 *                       status: "Ocupado" 
 *                       show: 25 
 *                 snacksBuy: []
 *                 promotionsBuy: []
 *       500:
 *         description: Error interno al crear la compra y las entradas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al crear la compra y las entradas"
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

buyRouter.post('/',authMiddleware(["user", "manager"]), sanitizeBuyInput, sanitizeTicketInput,  addPurchase);



/**
 * @swagger
 * /api/buys/validateQr:
 *   post:
 *     summary: Valida un código QR asociado a una compra.
 *     tags: [Buys]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token JWT generado para la compra (incluye el `buyId`).
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJidXlJZCI6MjUsImlhdCI6MTY4MDA4ODAwMH0.4Q9c7GHE2BkL6b5sVpyyEmuT-7EqxYw8gOKx8C24IoQ"
 *     responses:
 *       200:
 *         description: QR válido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "QR is valid."
 *                 data:
 *                   type: object
 *                   description: Datos completos de la compra.
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 25
 *                     status:
 *                       type: string
 *                       example: "válida"
 *                     tickets:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           show:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 20
 *                               movie:
 *                                 type: object
 *                                 properties:
 *                                   name:
 *                                     type: string
 *                                     example: "Avengers: Endgame"
 *                               theater:
 *                                 type: object
 *                                 properties:
 *                                   name:
 *                                     type: string
 *                                     example: "Sala 1"
 *                                   cinema:
 *                                     type: object
 *                                     properties:
 *                                       name:
 *                                         type: string
 *                                         example: "Cinepolis"
 *                     snacksBuy:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           snack:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                                 example: "Popcorn"
 *                           quantity:
 *                             type: integer
 *                             example: 2
 *                     promotionsBuy:
 *                       type: array
 *                       description: Lista de promociones compradas.
 *                       items:
 *                         type: object
 *                         properties:
 *                           promotion:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                                 example: "2x1 Nachos"
 *       400:
 *         description: Token inválido o expirado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid or expired token."
 *                 error:
 *                   type: string
 *                   example: "jwt expired"
 *       404:
 *         description: Compra no encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Buy not found."
 *       500:
 *         description: Error del servidor (clave secreta no configurada).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "QR secret key is not configured in the environment."
 */

buyRouter.post('/validateQr', authMiddleware(["manager"]), validateQRCode) //post para poder enviar datos en el body de la solicitud


/**
 * @swagger
 * /api/buys/{id}:
 *   patch:
 *     summary: Actualiza una compra existente.
 *     tags: [Buys]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: ID de la compra que se desea actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Buy'
 *           example:
 *             status: "Cancelada"
 *             
 *     responses:
 *       200:
 *         description: Compra actualizada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Buy'
 *             example:
 *               message: "Buy updated"
 *               data: 
 *                 id: 1
 *                 total: 9000
 *                 status: "Válida"
 *                 fechaHora: "2025-01-19T02:33:33.000Z"
 *                 user: 4
 *       500:
 *         description: Error al actualizar la compra.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred."
 */

buyRouter.patch('/:id',authMiddleware(["user", "manager"]), sanitizeBuyInput, update); //REVISAR



/**
 * @swagger
 * /api/buys/{id}:
 *   delete:
 *     summary: Elimina una compra existente.
 *     tags: [Buys]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: ID de la compra que se desea eliminar.
 *     responses:
 *       200:
 *         description: Compra eliminada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Buy'
 *             example:
 *               message: "Buy deleted"
 *               data:
 *                 id: 1
 *                 total: 9000
 *                 status: "Válida"
 *                 fechaHora: "2025-01-19T02:33:33.000Z"
 *                 user: 4
 *       404:
 *         description: La compra no fue encontrada para su eliminación.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Buy not found for deletion."
 *       500:
 *         description: Error interno al intentar eliminar la compra.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while deleting the buy."
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
buyRouter.delete('/:id',authMiddleware(["user", "manager"]), remove);
