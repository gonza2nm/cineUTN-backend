import { Router } from "express";
import { sanitizeMovieInput, findAll, findOne, add, update, remove, findNextMoviesReleases } from "./movie.controler.js";
import { authMiddleware } from "../utils/authMiddleware.js";

export const movieRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: Gestiona peliculas de los cines
*/

/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - imageLink
 *         - duration
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Inception"
 *         description:
 *           type: string
 *           example: "A mind-bending thriller that explores the concept of dreams within dreams."
 *         imageLink:
 *           type: string
 *           example: "https://example.com/inception.jpg"
 *         duration:
 *           type: integer
 *           example: 148
 *         genres:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Sci-Fi", "Action", "Thriller"]
 *         cinemas:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Cinema 1", "Cinema 2"]
 *         formats:
 *           type: array
 *           items:
 *             type: string
 *           example: ["IMAX", "2D"]
 *         languages:
 *           type: array
 *           items:
 *             type: string
 *           example: ["English", "Spanish"]
 */

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Obtiene todas las películas.
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: Películas obtenidas con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "found all movies"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movie'
 *       500:
 *         description: Error en el servidor al obtener las películas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while finding all the movies"
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */
movieRouter.get('/', findAll)
/**
 * @swagger
 * /api/movies/next-releases:
 *   get:
 *     summary: Obtiene las próximas películas a estrenarse dentro de los próximos 30 días.
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: Próximas películas obtenidas con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Found upcoming movie releases"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movie'
 *       500:
 *         description: Error en el servidor al obtener las próximas películas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while finding the next movie releases"
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */
movieRouter.get('/next-releases', findNextMoviesReleases) //Cuidado con el orden, como estaba abajo del findOne tomaba /next-releases como id y por eso fallaba.

/**
 * @swagger
 * /api/movies/{id}:
 *   get:
 *     summary: Obtiene los detalles de una película por su ID.
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la película que se desea obtener.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Película obtenida con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "movie found"
 *                 data:
 *                   $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Película no encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Movie not found"
 *       500:
 *         description: Error en el servidor al obtener la película.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while finding the movie"
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */
movieRouter.get('/:id', findOne)

/**
 * @swagger
 * /api/movies:
 *   post:
 *     summary: Crea una nueva película. Requiere autenticación como 'manager'.
 *     tags: [Movies]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Inception"
 *               description:
 *                 type: string
 *                 example: "A mind-bending thriller"
 *               imageLink:
 *                 type: string
 *                 example: "https://example.com/inception.jpg"
 *               duration:
 *                 type: integer
 *                 example: 148
 *               formats:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *               cinemas:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 2
 *               languages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *               genres:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *               shows:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *     responses:
 *       201:
 *         description: Película creada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "movie created"
 *                 data:
 *                   $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Error al procesar los datos de la película.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "format or languages are undefined or null"
 *       500:
 *         description: Error en el servidor al crear la película.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while adding the movie"
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */
movieRouter.post('/', authMiddleware(['manager']), sanitizeMovieInput, add)

/**
 * @swagger
 * /api/movies/{id}:
 *   put:
 *     summary: Actualiza una película por su ID. Requiere autenticación como 'manager'.
 *     tags: [Movies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la película que se desea actualizar.
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Inception"
 *               description:
 *                 type: string
 *                 example: "Updated description"
 *               imageLink:
 *                 type: string
 *                 example: "https://example.com/inception_updated.jpg"
 *               duration:
 *                 type: integer
 *                 example: 150
 *     responses:
 *       200:
 *         description: Película actualizada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Movie updated"
 *                 data:
 *                   $ref: '#/components/schemas/Movie'
 *       500:
 *         description: Error en el servidor al actualizar la película.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while updating the movie"
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */
movieRouter.put('/:id', authMiddleware(['manager']), sanitizeMovieInput, update)

/**
 * @swagger
 * /api/movies/{id}:
 *   patch:
 *     summary: Actualiza parcialmente los detalles de una película específica por su ID.
 *     tags: [Movies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la película que se desea actualizar parcialmente.
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Inception Updated"
 *     responses:
 *       200:
 *         description: Película actualizada parcialmente con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Movie updated"
 *                 data:
 *                   $ref: '#/components/schemas/Movie'
 *       500:
 *         description: Error en el servidor al actualizar parcialmente la película.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while updating the movie"
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */
movieRouter.patch('/:id', authMiddleware(['manager']), sanitizeMovieInput, update)

/**
 * @swagger
 * /api/movies/{id}:
 *   delete:
 *     summary: Elimina una película por su ID. No se puede eliminar si la película tiene funciones asociadas.
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la película que se desea eliminar.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Película eliminada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "movie deleted"
 *                 data:
 *                   $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Película no encontrada para eliminar.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "movie not found for deletion."
 *       409:
 *         description: No se puede eliminar la película porque tiene funciones asociadas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "cannot delete this movie because it still has associated shows"
 *       500:
 *         description: Error en el servidor al eliminar la película.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while deleting the movie"
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */
movieRouter.delete('/:id', authMiddleware(['manager']), remove)