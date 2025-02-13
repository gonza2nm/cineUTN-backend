import { Router } from "express";
import { sanitizeFormatInput, findAll, findOne, add, remove } from "./format.controler.js";
import { authMiddleware } from "../utils/authMiddleware.js";

export const formatRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Formats
 *   description: Gestión de formatos de películas
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
 *     Format:
 *       type: object
 *       required:
 *         - formatName
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         formatName:
 *           type: string
 *           example: "IMAX"
 */

/**
 * @swagger
 * /api/formats:
 *   get:
 *     summary: Obtiene todos los formatos
 *     tags: [Formats]
 *     responses:
 *       200:
 *         description: found all formats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: found all formats
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Format'
 *             example:
 *               message: found all formats
 *               data:
 *                 - id: 1
 *                   formatName: 2D
 *                 - id: 2
 *                   formatName: 3D
 *       500:
 *         description: An error occurred while finding all formats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while finding all formats
 *                 error:
 *                   type: string
 *                   example: error message
 */
formatRouter.get("/", findAll);

/**
 * @swagger
 * /api/formats/{id}:
 *   get:
 *     summary: Obtiene un formato por ID
 *     tags: [Formats]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del formato
 *     responses:
 *       200:
 *         description: found format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: found format
 *                 data:
 *                   $ref: '#/components/schemas/Format'
 *             example:
 *               message: found format
 *               data:
 *                 id: 1
 *                 formatName: 2D
 *       500:
 *         description: An error occurred while finding the format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while finding the format
 *                 error:
 *                   type: string
 *                   example: error message
 */
formatRouter.get("/:id", findOne);

/**
 * @swagger
 * /api/formats:
 *   post:
 *     summary: Crea un nuevo formato
 *     tags: [Formats]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - formatName
 *             properties:
 *               formatName:
 *                 type: string
 *                 example: "IMAX"
 *     responses:
 *       201:
 *         description: Formato creado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: format created
 *                 data:
 *                   $ref: '#/components/schemas/Format'
 *             example:
 *               message: format created
 *               data:
 *                 id: 1
 *                 formatName: IMAX
 *                 movies: []
 *                 shows: []
 */
formatRouter.post("/", authMiddleware(["manager"]), sanitizeFormatInput, add);

/**
 * @swagger
 * /api/formats/{id}:
 *   delete:
 *     summary: Elimina un formato por ID
 *     tags: [Formats]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del formato
 *     responses:
 *       200:
 *         description: format deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: format deleted
 *                 data:
 *                   $ref: '#/components/schemas/Format'
 *             example:
 *               message: format deleted
 *               data:
 *                 id: 1
 *                 formatName: 2D
 *       404:
 *         description: format not found for deletion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: format not found for deletion
 *       500:
 *         description: An error occurred while deleting the format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while deleting the format
 *                 error:
 *                   type: string
 *                   example: error message
 */
formatRouter.delete("/:id", authMiddleware(["manager"]), remove);