import { Router } from "express";
import { authMiddleware } from "../utils/authMiddleware.js";
import { remove, findAll, findAllByCinema, findOne, update , add, sanitizePromotionInput } from "./promotion.controller.js";

export const promotionRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Promotions
 *   description: Gestión de las promociones de los cines
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
 *     Promotion:
 *       type: object
 *       required:
 *         - name
 *         - description
 *       properties:
 *         code:
 *           type: string
 *           example: ABC123
 *         name:
 *           type: string
 *           example: '2x1'
 *         description:
 *           type: string
 *           example: Podes llevar 2 pororos al precio de 1
 *       example:
 *         code: ABC123
 *         name: 2x1
 *         description: Podes llevar 2 pororos al precio de 1
 */

/**
 * @swagger
 * /api/promotions:
 *   get:
 *     summary: Obtiene todas las promociones
 *     tags: [Promotions]
 *     responses:
 *       200:
 *         description: found all promotions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: found all promotions
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Promotion'
 *             example:
 *               message: found all promotions
 *               data:
 *                 - code: ABC123
 *                   description: Podes llevar 2 pororos al precio de 1
 *                   name: 2x1
 *       500:
 *         description: An error occurred while finding all the promotions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while finding all the promotions
 *                 error:
 *                   type: string
 *                   example: error message
 */
promotionRouter.get("/", findAll);

/**
 * @swagger
 * /api/promotions/bycinema/{id}:
 *   get:
 *     summary: Obtiene todas las promociones de un cine
 *     tags: [Promotions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cine
 *     responses:
 *       200:
 *         description: This cinema has these promotions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: This cinema has these promotions
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Promotion'
 *             example:
 *               message: This cinema has these promotions
 *               data:
 *                 - code: ABC123
 *                   description: Podes llevar 2 pororos al precio de 1
 *                   name: 2x1
 *       404:
 *         description: Promotions by cinema not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Promotions by cinema not found
 *                 error:
 *                   type: string
 *                   example: Cinema not found
 *       500:
 *         description: An error ocurred while querying promotions by cinema
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error ocurred while querying promotions by cinema
 *                 error:
 *                   type: string
 *                   example: error message
 */
promotionRouter.get("/bycinema/:cid", findAllByCinema);

/**
 * @swagger
 * /api/promotions/{code}:
 *   get:
 *     summary: Obtiene una promocion por su código
 *     tags: [Promotions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la promocion
 *     responses:
 *       200:
 *         description: found promotion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: found promotion
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Promotion'
 *             example:
 *               message: found promotion
 *               data:
 *                 - code: ABC123
 *                   description: Podes llevar 2 pororos al precio de 1
 *                   name: 2x1
 *       404:
 *         description: promotion not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Promotions by cinema not found
 *                 data:
 *                   type: null
 *       500:
 *         description: An error occurred while finding the promotion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while finding the promotion
 *                 error:
 *                   type: string
 *                   example: error message
 */
promotionRouter.get("/:code", findOne);

/**
 * @swagger
 * /api/promotions:
 *   post:
 *     summary: Crea una nueva promocion
 *     tags: [Promotions]
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: 2x1
 *               description:
 *                 type: string
 *                 example: Lleva 2 gaseosas al precio de 1
 *     responses:
 *       201:
 *         description: 'Promotion created'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Promotion created'
 *                 data:
 *                   $ref: '#/components/schemas/Promotion'
 *             example:
 *               message: 'Promotion created'
 *               data:
 *                 code: ABC123
 *                 name: 2x1
 *                 description: Lleva 2 gaseosas al precio de 1
 *       500:
 *         description: An error occurred while adding the promotion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while adding the promotion
 *                 error:
 *                   type: string
 *                   example: error message
 */
promotionRouter.post("/", authMiddleware(['manager']), sanitizePromotionInput, add);

/**
 * @swagger
 * /api/promotions/{code}:
 *   put:
 *     summary: Actualiza una promocion
 *     tags: [Promotions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la promocion
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: 2x1
 *               description:
 *                 type: string
 *                 example: Lleva 2 gaseosas al precio de 1
 *     responses:
 *       200:
 *         description: Promotion updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Promotion updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Promotion'
 *             example:
 *               message: Promotion updated successfully
 *               data:
 *                 code: ABC123 
 *                 name: 2x1
 *                 description: Promotion updated successfully
 *       500:
 *         description: An error occurred while updating the promotion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: 
 *                   type: string
 *                   example: An error occurred while updating the promotion
 *                 error:
 *                   type: string
 *                   example: error message
 */
promotionRouter.put("/:code", authMiddleware(['manager']), sanitizePromotionInput, update );


/**
 * @swagger
 * /api/promotions/{code}:
 *   delete:
 *     summary: Elimina una promocion
 *     tags: [Promotions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la promocion
 *     responses:
 *       200:
 *         description: Promotion deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Promotion deleted
 *             example:
 *               message: Promotion deleted
 *       500:
 *         description: An error ocurred while deleting the promotion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: 
 *                   type: string
 *                   example: An error ocurred while deleting the promotion
 *                 error:
 *                   type: string
 *                   example: error message
 */
promotionRouter.delete("/:code",authMiddleware(['manager']), remove );