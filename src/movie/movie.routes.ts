import { Router } from "express";
import { sanitizeMovieInput, findAll, findOne, add, update, remove } from "./movie.controler.js";

export const movieRouter = Router()

movieRouter.get('/', findAll)
movieRouter.get('/:id', findOne)
movieRouter.post('/', sanitizeMovieInput, add)
movieRouter.put('/:id', sanitizeMovieInput, update)
movieRouter.patch('/:id', sanitizeMovieInput, update)
movieRouter.delete('/:id', remove)