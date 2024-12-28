import { Router } from "express";
import { sanitizeGenreInput, findAll, findOne, add, update, remove } from "./genre.controler.js";
import { authMiddleware } from "../utils/authMiddleware.js";

export const genreRouter = Router()

genreRouter.get('/', findAll)
genreRouter.get('/:id', findOne)
genreRouter.post('/', authMiddleware(['manager']), sanitizeGenreInput, add) //sanitizeGenreInput es el middleware se utiliza para limpiar y validar los datos de entrada antes de proceder con la operación de agregar.
genreRouter.put('/:id', authMiddleware(['manager']), sanitizeGenreInput, update)
genreRouter.patch('/:id', authMiddleware(['manager']), sanitizeGenreInput, update)
genreRouter.delete('/:id', authMiddleware(['manager']), remove)