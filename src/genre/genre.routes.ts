import { Router } from "express";
import { sanitizeGenreInput, findAll, findOne, add, update, remove } from "./genre.controler.js";

export const genreRouter = Router()

genreRouter.get('/', findAll)
genreRouter.get('/:id', findOne)
genreRouter.post('/', sanitizeGenreInput, add)
genreRouter.put('/:id', sanitizeGenreInput, update)
genreRouter.patch('/:id', sanitizeGenreInput, update)
genreRouter.delete('/:id', remove)