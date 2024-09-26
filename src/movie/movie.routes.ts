import { Router } from "express";
import { sanitizeMovieInput, findAll, findOne, add, update, remove, findNextMoviesReleases } from "./movie.controler.js";
// importar findNextMoviesReleases

export const movieRouter = Router()

movieRouter.get('/', findAll)
movieRouter.get('/:id', findOne)
movieRouter.get('/next-releases', findNextMoviesReleases)
movieRouter.post('/', sanitizeMovieInput, add)
movieRouter.put('/:id', sanitizeMovieInput, update)
movieRouter.patch('/:id', sanitizeMovieInput, update)
movieRouter.delete('/:id', remove)