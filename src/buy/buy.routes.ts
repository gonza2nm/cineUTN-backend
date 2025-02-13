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
 *   description: Gestióna la compra de entradas y otros pruductos
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
 *         - userId
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         total:
 *           type: number
 *           example: 8500
 *         userId:
 *           type: integer
 *           example: 123
 *         status:
 *           type: string
 *           example: 'Válida'
 */


/**
 * @swagger
 * /api/buys:
 *   get:
 *     summary: Obtiene todas las compras
 *     tags: [Buys]
 *     responses:
 *       200:
 *         description: Lista de compras encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: found all buys
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Buy'
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
 *     summary: Obtiene una compra por su ID
 *     tags: [Buys]
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
 *                   example: found buy
 *                 data:
 *                   $ref: '#/components/schemas/Buy'
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
 *                   example: Found all buys
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Buy'
 *       500:
 *         description: Error al encontrar las compras de un usuario
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
 *     summary: Genera un código QR para una compra
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
 *         description: Codigo QR generado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: QR code generated successfully
 *                 data:
 *                   type: string
 *                   example: "QR_CODE_IMAGE_DATA"
 *       500:
 *         description: Error al generar el codigo QR
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while generating QR code
 *                 error:
 *                   type: string
 *                   example: error.message
 *       404:
 *         description: Compra no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Buy not found
 */


buyRouter.get('/generateQr/:id', authMiddleware(["user", "manager"]), generateQRCodeForBuy)
//buyRouter.post('/',authMiddleware(["user", "manager"]), sanitizeBuyInput, add);

/**
 * @swagger
 * /api/buys:
 *   post:
 *     summary: Crea una nueva compra
 *     tags: [Buys]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - total
 *               - status
 *               - description
 *               - userId
 *             properties:
 *               total:
 *                 type: number
 *                 example: 9500
 *               userId:
 *                 type: integer
 *                 example: 321
 *               status:
 *                 type: string
 *                 example: 'Válida'
 *               description:
 *                 type: string
 *                 example: 'Compra de entrada'

 *     responses:
 *       201:
 *         description: Compra creada
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
 *               message: Buy created successfully
 *               data:
 *                 id: 2
 *                 total: 9500
 *                 userId: 321
 *                 status: 'Válida'
 *                 example: 'Compra de entrada'
 *       500:
 *         description: Error al crear la compra
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while creating the buy
 *                 error:
 *                   type: string
 *                   example: error message
 */

buyRouter.post('/',authMiddleware(["user", "manager"]), sanitizeBuyInput, sanitizeTicketInput,  addPurchase);

/**
 * @swagger
 * /api/buys/validateQr:
 *   post:
 *     summary: Valida un código QR de compra
 *     tags: [Buys]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - qrCode
 *             properties:
 *               qrCode:
 *                 type: string
 *                 example: "QR_CODE_IMAGE_DATA"
 *     responses:
 *       200:
 *         description: Valida el codigo QR
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: QR code validated successfully
 *       500:
 *         description: Error al validad eL codigo QR
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while validating the QR code
 *                 error:
 *                   type: string
 *                   example: error message
 */


buyRouter.post('/validateQr', authMiddleware(["manager"]), validateQRCode) //post para poder enviar datos en el body de la solicitud

/**
 * @swagger
 * /api/buys/{id}:
 *   patch:
 *     summary: Actualiza una compra por su ID
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 example: 'Cancelada'
 *     responses:
 *       200:
 *         description: Compra actualizada
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
 *               message: Buy updated
 *               data:
 *                 id: 1
 *                 status: 'Cancelada'
 *       500:
 *         description: Error al actualizar la compra
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: error.message
 */

buyRouter.patch('/:id',authMiddleware(["user", "manager"]), sanitizeBuyInput, update); //REVISAR

/**
 * @swagger
 * /api/buys/{id}:
 *   delete:
 *     summary: Elimina una compra
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
 *         description: Compra eliminada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Buy deleted successfully
 *       404:
 *         description: Compra no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Buy not found for deletion.
 *       500:
 *         description: Error al eliminar la compra
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while deleting the purchase
 *                 error:
 *                   type: string
 *                   example: error message
 */ 

buyRouter.delete('/:id',authMiddleware(["user", "manager"]), remove);
