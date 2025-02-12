import { Router } from "express";
import { sanitizeLanguageInput, findAll, findOne, add, remove } from "./language.controler.js";
import { authMiddleware } from "../utils/authMiddleware.js";

export const languageRouter = Router();


/**
 * @swagger
 * tags:
 *   name: Languages
 *   description: Gestión de idiomas de películas
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
 *     Language:
 *       type: object
 *       required:
 *         - languageName
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         languageName:
 *           type: string
 *           example: Doblada
 */

/**
 * @swagger
 * /api/languages:
 *   get:
 *     summary: Obtiene todos los idiomas
 *     tags: [Languages]
 *     responses:
 *       200:
 *         description: Lista de idiomas encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: found all languages
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Language'
 *             example:
 *               message: found all languages
 *               data:
 *                 - id: 1
 *                   languageName: Doblada
 *                 - id: 2
 *                   languageName: Subtitulada
 *       500:
 *         description: Error en el servidor al obtener los idiomas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while finding all the languages
 *                 error:
 *                   type: string
 *                   example: "error message"
 */

languageRouter.get("/", findAll);

/**
 * @swagger
 * /api/languages/{id}:
 *   get:
 *     summary: Obtiene un idioma por ID
 *     tags: [Languages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del idioma
 *     responses:
 *       200:
 *         description: Idioma encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: found language
 *                 data:
 *                   $ref: '#/components/schemas/Language'
 *             example:
 *               message: found language
 *               data:
 *                 id: 1
 *                 languageName: Doblada
 *       500:
 *         description: Error en el servidor al obtener el idioma
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while finding the language
 *                 error:
 *                   type: string
 *                   example: "error message"
 */

languageRouter.get("/:id", findOne);

/**
 * @swagger
 * /api/languages:
 *   post:
 *     summary: Crea un nuevo idioma
 *     tags: [Languages]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - languageName
 *             properties:
 *               languageName:
 *                 type: string
 *                 example: Language ejemplo
 *     responses:
 *       201:
 *         description: Idioma creado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: language created
 *                 data:
 *                   $ref: '#/components/schemas/Language'
 *             example:
 *               message: language created
 *               data:
 *                 id: 2
 *                 languageName: Language ejemplo
 *                 movies: []
 *                 shows: []
 */

languageRouter.post("/", authMiddleware(["manager"]), sanitizeLanguageInput, add);

/**
 * @swagger
 * /api/languages/{id}:
 *   delete:
 *     summary: Elimina un idioma por ID
 *     tags: [Languages]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del idioma a eliminar
 *     responses:
 *       200:
 *         description: Idioma eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: language deleted
 *                 data:
 *                   $ref: '#/components/schemas/Language'
 *             example:
 *               message: language deleted
 *               data:
 *                 id: 1
 *                 languageName: Doblada
 *       404:
 *         description: Idioma no encontrado para eliminar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: language not found for deletion
 *       500:
 *         description: Error en el servidor al eliminar el idioma
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while deleting the language
 *                 error:
 *                   type: string
 *                   example: "error message"
 */

languageRouter.delete("/:id", authMiddleware(["manager"]), remove);