import { Router } from "express";
import { authMiddleware } from "../utils/authMiddleware.js";
import { remove, findAll, findOne, update , add, sanitizeSanckInput } from "./snack.contoller.js";

export const snackRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Snacks
 *   description: Gestiona los snacks (comidas y bebidas) que ofrecen los cines
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
 *     Snack:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Pororo caramelizado
 *         description:
 *           type: string
 *           example: Palomitas de maíz cubiertas de caramelo
 *         price:
 *           type: integer
 *           example: 1500
 */


/**
 * @swagger
 * /api/snacks:
 *   get:
 *     summary: Obtiene todos los snacks
 *     tags: [Snacks]
 *     responses:
 *       200:
 *         description: Lista de los snacks encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: found all snacks
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Snack'

 *       500:
 *         description: Error al obtener los snacks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while querying all snacks
 *                 error:
 *                   type: string
 *                   example: error.message
 */
snackRouter.get("/", findAll);


/**
 * @swagger
 * /api/snacks/{id}:
 *   get:
 *     summary: Obtiene un snack por su ID
 *     tags: [Snacks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del snack
 *     responses:
 *       200:
 *         description: Snack encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: found snack
 *                 data:
 *                   $ref: '#/components/schemas/Snack'
 *       404:
 *         description: Snack no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: snack not found
 *                 data:
 *                   type: null
 *       500:
 *         description: Error al obtener el snack
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while finding the snack
 *                 error:
 *                   type: string
 *                   example: error.message
 */
snackRouter.get("/:id", findOne);


/**
 * @swagger
 * /api/snacks:
 *   post:
 *     summary: Crea un nuevo snack
 *     tags: [Snacks]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nachos con queso
 *               description:
 *                 type: string
 *                 example: Nachos crujientes con salsa de queso.
 *               price:
 *                 type: number
 *                 example: 1800
 *     responses:
 *       201:
 *         description: Snack creado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Snack created
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: 
 *                       type: string
 *                       example: 2
 *                     name: 
 *                       type: string
 *                       example: Nachos con queso
 *                     description:
 *                       type: string
 *                       example: Nachos crujientes con salsa de queso.
 *                     price:
 *                       type: number
 *                       example: 1800
 * 
 *       500:
 *         description: Error al crear el snack
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while adding the snack
 *                 error:
 *                   type: string
 *                   example: error.message
 */
snackRouter.post("/", authMiddleware(['manager']),sanitizeSanckInput, add);

/**
 * @swagger
 * /api/snacks/{id}:
 *   put:
 *     summary: Actualiza un snack por su ID
 *     tags: [Snacks]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del snack a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             $ref: '#/components/schemas/Snack'
 *           example:
 *             name: Pororo clasico
 *             description: Pororos sin caramelo
 *             price: 1200

 *     responses:
 *       200:
 *         description: Snack actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Snack updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Snack'
 *             example:
 *               id: 1
 *               name: Pororo clasico
 *               description: Pororos sin caramelo
 *               price: 1200
 * 
 *       404:
 *         description: Snack no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: snack not found
 *                 data:
 *                   type: null
 *               
 *       500:
 *         description: Error al actualizar el snack
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error ocurred while updating the snack
 *                 error:
 *                   type: string
 *                   example: error.message
 */
snackRouter.put("/:id", authMiddleware(['manager']),sanitizeSanckInput, update );

/**
 * @swagger
 * /api/snacks/{id}:
 *   delete:
 *     summary: Elimina un snack
 *     tags: [Snacks]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del snack a eliminar
 *     responses:
 *       200:
 *         description: Snack eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Snack deleted
 * 
 *       404:
 *         description: Snack no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: snack not found
 *                 data:
 *                   type: null
 *               
 *       500:
 *         description: Error al eliminar el snack
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error ocurred while deleting the snack
 *                 error:
 *                   type: string
 *                   example: error.message
 */
snackRouter.delete("/:id",authMiddleware(['manager']), remove );