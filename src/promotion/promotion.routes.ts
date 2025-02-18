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
 *         - promotionStartDate 
 *         - promotionFinishDate 
 *         - price 
 *         - cinemas 
 *         - snacks 
 *       properties:
 *         code:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         promotionStartDate:
 *           type: string
 *           format: date
 *         promotionFinishDate:
 *           type: string
 *           format: date
 *         price:
 *           type: number
 *         cinemas:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *         snacks:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               urlPhoto:
 *                 type: string
 *               price:
 *                 type: integer
 *         promotionsBuy:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               quantity:
 *                 type: number
 */

/**
 * @swagger
 * /api/promotions:
 *   get:
 *     summary: Obtiene todas las promociones
 *     tags: [Promotions]
 *     responses:
 *       200:
 *         description: Lista de todas las promociones
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
 *               message: found all promotions
 *               data:
 *                 - code: "ABC123"
 *                   name: "2x1"
 *                   description: "Podes llevar 2 pororos al precio de 1"
 *                   promotionStartDate: "2025-02-10"
 *                   promotionFinishDate: "2025-02-20"
 *                   price: 2500
 *                   cinemas:
 *                     - id: 1
 *                       name: "Cine UTN"
 *                       address: "Zeballos 1000, Rosario, Santa Fe"
 *                   snacks:
 *                     - id: 1
 *                       name: "Pororo caramelizado"
 *                       description: "Palomitas de maíz cubiertas de caramelo"
 *                       urlPhoto: "https://imag.bonviveur.com/hamburguesa-clasica.jpg"
 *                       price: 1500
 *       500:
 *         description: Error al encontrar las promociones
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
 *         description: Listado de promociones de un cine
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
 *               message: This cinema has these promotions
 *               data:
 *                 - code: ABC123
 *                   name: 2x1
 *                   description: Lleva 2 pororos al precio de 1
 *                   promotionStartDate: 2025-02-20
 *                   promotionFinishDate: 2025-02-25
 *                   price: 1500

 *       404:
 *         description: Promociones no encontradas
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
 *         description: Error al encontrar las promociones
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
 *         description: Promocion encontrada
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
 *                     $ref: '#/components/schemas/Promotion'
 *             example:
 *               message: Found promotion
 *               data:
 *                 code: ABC123
 *                 name: 2x1
 *                 description: Lleva 2 pororos al precio de 1
 *                 promotionStartDate: 2025-02-20
 *                 promotionFinishDate: 2025-02-25
 *                 price: 1500
 *                 cinemas:
 *                   - id: 1
 *                     name: "Cine UTN"
 *                     address: "Zeballos 1000, Rosario, Santa Fe"
 *                 snacks:
 *                   - id: 1
 *                     name: "Pororo caramelizado"
 *                     description: "Palomitas de maíz cubiertas de caramelo"
 *                     urlPhoto: "https://imag.bonviveur.com/hamburguesa-clasica.jpg"
 *                     price: 1500

 *       404:
 *         description: Promocion no encontrada
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
 *         description: Error al encontrar las promocion
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
 *             $ref: '#/components/schemas/Promotion'
 *           example:
 *             name: "2x1"
 *             description: "Lleva 2 pororos al precio de 1"
 *             promotionStartDate: "2025-02-16"
 *             promotionFinishDate: "2025-02-25"
 *             price: 1500
 *             cinemas:
 *               - id: 1
 *                 name: ""
 *                 address: ""
 *                 theaters: []
 *                 movies: []
 *             snacks:
 *               - id: 6
 *                 name: ""
 *                 description: ""
 *                 urlPhoto: ""
 *                 price: 0
 *                 
 *     responses:
 *       201:
 *         description: Promocion creada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Promotion'
 *             example:
 *               message: 'Promotion created'
 *               data:
 *                 code: abc123
 *                 name: 2x1
 *                 description: Lleva 2 pororos al precio de 1
 *                 promotionStartDate: 2025-02-16
 *                 promotionFinishDate: 2025-02-25
 *                 price: 1500
 *                 promocionBuy: []
 *                 cinemas:
 *                   - id: 1
 *                     name: ""
 *                     address: ""
 *                     theaters: []
 *                     movies: []
 *                     events: []
 *                     managers: []
 *                     promotions: [abc123]
 *                 snacks:
 *                   - id: 6
 *                     name: ""
 *                     description: ""
 *                     urlPhoto: ""
 *                     price: 0
 *                     snacksBuy: []
 *                     promotions: [abc123]
 *       400:
 *         description: Problemas con la fecha
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: La fecha de inicio o de fin no puede ser anterior a la fecha de hoy.
 *       500:
 *         description: Error al crear la promocion
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
 *                   example: error.message
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
 *             $ref: '#/components/schemas/Promotion'
 *           example:
 *             name: "2x1"
 *             description: "Lleva 2 pororos al precio de 1"
 *             promotionStartDate: "2025-02-16"
 *             promotionFinishDate: "2025-02-25"
 *             price: 1500
 *             cinemas:
 *               - id: 1
 *                 name: ""
 *                 address: ""
 *                 theaters: []
 *                 movies: []
 *             snacks:
 *               - id: 6
 *                 name: ""
 *                 description: ""
 *                 urlPhoto: ""
 *                 price: 0
 *     responses:
 *       200:
 *         description: Promocion actualizada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Promotion'
 *             example:
 *               message: Promotion updated successfully
 *               data:
 *                 code: ABC123
 *                 name: 2x1
 *                 description: Lleva 2 pororos al precio de 1
 *                 promotionStartDate: 2025-02-20
 *                 promotionFinishDate: 2025-02-25
 *                 price: 1500
 *                 cinemas: [1]
 *                 snacks: [6]
 *       400:
 *         description: Problemas con la fecha
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: La fecha de inicio o de fin no puede ser anterior a la fecha de hoy.
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
 *         description: Promocion eliminada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Promotion'
 *             example:
 *               message: Promotion deleted
 *               data:
 *                 code: ABC123
 *                 name: 2x1
 *                 description: Lleva 2 pororos al precio de 1
 *                 promotionStartDate: 2025-02-20
 *                 promotionFinishDate: 2025-02-25
 *                 price: 1500
 *       400:
 *         description: Promocion no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: 
 *                   type: string
 *                   example: Promotion not found
 *                 error:
 *                   type: string
 *                   example: Not found
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