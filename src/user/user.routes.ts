import { Router } from 'express';
import {
  sanitizeUserInput,
  findAll,
  findOne,
  add,
  update,
  remove,
  findOneManager,
  findAllManagers,
  logout,
  login,
  verifyTokenAndFindData
} from './user.controler.js';
import { authMiddleware } from '../utils/authMiddleware.js';

export const userRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Usuarios del sistema de cines
*/

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - dni
 *         - name
 *         - surname
 *         - email
 *         - password
 *         - type
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         dni:
 *           type: string
 *           example: "1234511"
 *         name:
 *           type: string
 *           example: "Maria"
 *         surname:
 *           type: string
 *           example: "Lopez"
 *         email:
 *           type: string
 *           example: "marialopez@gmail.com"
 *         type:
 *           type: string
 *           enum: ["user", "manager"]
 *           example: "user"
 *         cinema:
 *           type: integer
 *           example: 1
 *         buys:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Buy'
 */


/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Verifica los datos para iniciar sesión y devuelve un token en una cookie.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "usuario@example.com"
 *               password:
 *                 type: string
 *                 example: "contraseña123"
 *     responses:
 *       200:
 *         description: Login exitoso. Retorna los datos del usuario y un token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Found user"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *                 error:
 *                   type: string
 *                   example: "Not Found"
 *       401:
 *         description: Credenciales incorrectas (email o contraseña incorrectos).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email o contraseña incorrecta"
 *                 error:
 *                   type: string
 *                   example: "Credenciales incorrectas"
 *       500:
 *         description: Error en el servidor durante el proceso de login.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while trying to log in"
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */
userRouter.post('/login', sanitizeUserInput, login);

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Cierra la sesión del usuario y elimina el token de autenticación.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Logout exitoso. El token de autenticación ha sido eliminado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logout exitoso"
 *       500:
 *         description: Error en el servidor durante el proceso de logout.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al realizar el logout"
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */
userRouter.post('/logout', authMiddleware(['user','manager']), logout);

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Crea un nuevo usuario. El tipo de usuario puede ser "user" o "manager". Los "managers" deben estar asociados a un cine.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dni:
 *                 type: string
 *                 description: Documento Nacional de Identidad del usuario.
 *                 example: "12345678"
 *               name:
 *                 type: string
 *                 description: Nombre del usuario.
 *                 example: "Juan"
 *               surname:
 *                 type: string
 *                 description: Apellido del usuario.
 *                 example: "Pérez"
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario.
 *                 example: "juan.perez@example.com"
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario.
 *                 example: "password123"
 *               type:
 *                 type: string
 *                 description: Tipo de usuario. Puede ser "user" o "manager".
 *                 enum:
 *                   - user
 *                   - manager
 *                 example: "user"
 *               cinema:
 *                 type: string
 *                 description: Identificador del cine al que el "manager" estará asociado (solo para tipo "manager").
 *                 example: "cinema123"
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente. Si el usuario es tipo "manager", puede que no esté asociado a un cine dependiendo de las condiciones.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User created, but this user does not have permissions to associate with a cinema as a manager"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Error por solicitud incorrecta, como intentar crear un "manager" sin asignar un cine.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "A manager must be associated with a cinema"
 *       500:
 *         description: Error en el servidor durante la creación del usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while adding the user"
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */
userRouter.post('/register', sanitizeUserInput, add);

/**
 * @swagger
 * /api/users/verify-token-find-data:
 *   get:
 *     summary: Verifica el token JWT y obtiene los datos del usuario asociado.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Usuario encontrado y los datos asociados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Found user"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: No se proporcionó un token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No token provided"
 *       404:
 *         description: No se encontró el usuario asociado al token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *                 error:
 *                   type: string
 *                   example: "Not Found"
 *       500:
 *         description: Error del servidor al procesar la solicitud.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while querying the user"
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */

userRouter.get('/verify-token-find-data', verifyTokenAndFindData);

/**
 * @swagger
 * /api/users/managers:
 *   get:
 *     summary: Obtiene todos los usuarios con tipo "manager".
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Se encontraron todos los managers.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "found all managers"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       500:
 *         description: Error en el servidor al obtener los managers.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while finding all the managers"
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */
userRouter.get('/managers', authMiddleware(['manager']), findAllManagers);

/**
 * @swagger
 * /api/users/managers/{id}:
 *   get:
 *     summary: Obtiene un manager por su ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del manager que se desea obtener.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Se encontró el manager.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "manager found"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: El manager no fue encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "manager not found"
 *       500:
 *         description: Error en el servidor al obtener el manager.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while finding the manager"
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */
userRouter.get('/managers/:id', authMiddleware(['manager']), sanitizeUserInput, findOneManager);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtiene todos los usuarios.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Se encontraron todos los usuarios.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "found all users"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       500:
 *         description: Error en el servidor al obtener los usuarios.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while finding all the users"
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */
userRouter.get('/', authMiddleware(['manager']), findAll);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtiene un usuario por su ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario que se desea obtener.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Se encontró el usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "found user"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: El usuario no fue encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "user not found"
 *       500:
 *         description: Error en el servidor al obtener el usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while querying the user"
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */
userRouter.get('/:id', sanitizeUserInput, findOne);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Actualiza un usuario por su ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario que se desea actualizar.
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
 *               sanitizedInput:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                   password:
 *                     type: string
 *                   type:
 *                     type: string
 *                   cinema:
 *                     type: string
 *                   // Agregar cualquier otro campo relevante para actualizar
 *     responses:
 *       200:
 *         description: Usuario actualizado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "user updated"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Error de solicitud incorrecta, como un manager sin asignación de cine.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The manager must be assinged to only one cinema."
 *                 error:
 *                   type: string
 *                   example: "Bad Request"
 *       404:
 *         description: El usuario no fue encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "user not found to update"
 *       500:
 *         description: Error en el servidor al actualizar el usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while updating the user"
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */
userRouter.put('/:id', authMiddleware(), sanitizeUserInput, update);

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Actualiza un usuario por su ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario que se desea actualizar.
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
 *               sanitizedInput:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                   password:
 *                     type: string
 *                   type:
 *                     type: string
 *                   cinema:
 *                     type: string
 *                   // Agregar cualquier otro campo relevante para actualizar
 *     responses:
 *       200:
 *         description: Usuario actualizado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "user updated"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Error de solicitud incorrecta, como un manager sin asignación de cine.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The manager must be assinged to only one cinema."
 *                 error:
 *                   type: string
 *                   example: "Bad Request"
 *       404:
 *         description: El usuario no fue encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "user not found to update"
 *       500:
 *         description: Error en el servidor al actualizar el usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while updating the user"
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */
userRouter.patch('/:id', authMiddleware(), sanitizeUserInput, update);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Elimina un usuario por su ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario que se desea eliminar.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Usuario eliminado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User deleted"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: El usuario no fue encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found to delete."
 *       500:
 *         description: Error en el servidor al eliminar el usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while deleting the user"
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */
userRouter.delete('/:id', authMiddleware(), remove);



