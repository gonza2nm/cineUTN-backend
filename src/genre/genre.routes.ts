import { Router } from "express";
import { sanitizeGenreInput, findAll, findOne, add, update, remove } from "./genre.controler.js";
import { authMiddleware } from "../utils/authMiddleware.js";

export const genreRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Genres
 *   description: Gestión de géneros de películas
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
 *     Genre:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Acción
 *       example:
 *         id: 1
 *         name: Comedia
 */

/**
 * @swagger
 * /api/genres:
 *   get:
 *     summary: Obtiene todos los géneros
 *     tags: [Genres]
 *     responses:
 *       200:
 *         description: found all genres
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: found all genres
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Genre'
 *             example:
 *               message: found all genres
 *               data:
 *                 - id: 1
 *                   name: Acción
 *                 - id: 2
 *                   name: Comedia
 *       500:
 *         description: An error occurred while finding all the genres
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while finding all the genres
 *                 error:
 *                   type: string
 *                   example: error message
 */
genreRouter.get('/', findAll)

/**
 * @swagger
 * /api/genres/{id}:
 *   get:
 *     summary: Obtiene un género por ID
 *     tags: [Genres]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del género
 *     responses:
 *       200:
 *         description: found genre
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: found genre
 *                 data:
 *                   $ref: '#/components/schemas/Genre'
 *             example:
 *               message: found genre
 *               data:
 *                 id: 1
 *                 name: Acción
 *       500:
 *         description: An error occurred while finding the genre
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while finding the genre
 *                 error:
 *                   type: string
 *                   example: error message
 */
genreRouter.get('/:id', findOne)

/**
 * @swagger
 * /api/genres:
 *   post:
 *     summary: Crea un nuevo género
 *     tags: [Genres]
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: Genero Prueba
 *     responses:
 *       201:
 *         description: genre created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: genre created
 *                 data:
 *                   $ref: '#/components/schemas/Genre'
 *             example:
 *               message: genre created
 *               data:
 *                 id: 3
 *                 name: Genero Prueba
 *       500:
 *         description: An error occurred while adding the genre
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while adding the genre
 *                 error:
 *                   type: string
 *                   example: error message
 */
genreRouter.post('/', authMiddleware(['manager']), sanitizeGenreInput, add)

/**
 * @swagger
 * /api/genres/{id}:
 *   put:
 *     summary: Modifica un género por ID (completo)
 *     tags: [Genres]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del género
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Genero modificado
 *     responses:
 *       200:
 *         description: genre updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: genre updated
 *                 data:
 *                   $ref: '#/components/schemas/Genre'
 *             example:
 *               message: genre updated
 *               data:
 *                 id: 1
 *                 name: Genero modificado
 *       500:
 *         description: An error occurred while updating the genre
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while updating the genre
 *                 error:
 *                   type: string
 *                   example: error message
 */
genreRouter.put('/:id', authMiddleware(['manager']), sanitizeGenreInput, update)

/**
 * @swagger
 * /api/genres/{id}:
 *   delete:
 *     summary: Elimina un género por ID
 *     tags: [Genres]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del género
 *     responses:
 *       200:
 *         description: genre deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: genre deleted
 *                 data:
 *                   $ref: '#/components/schemas/Genre'
 *             example:
 *               message: genre deleted
 *               data:
 *                 id: 1
 *                 name: Acción
 *       404:
 *         description: genre not found for deletion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: genre not found for deletion
 *       500:
 *         description: An error occurred while deleting the genre
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while deleting the genre
 *                 error:
 *                   type: string
 *                   example: error message
 */
genreRouter.delete('/:id', authMiddleware(['manager']), remove)
