import { Router } from "express";
import { sanitizeMovieInput, findAll, findOne, add, update, remove, findNextMoviesReleases } from "./movie.controler.js";

export const movieRouter = Router()

movieRouter.get('/', findAll)
movieRouter.get('/next-releases', findNextMoviesReleases) //Cuidado con el orden, como estaba abajo del findOne tomaba /next-releases como id y por eso fallaba.
movieRouter.get('/:id', findOne)
movieRouter.post('/', sanitizeMovieInput, add)
movieRouter.put('/:id', sanitizeMovieInput, update)
movieRouter.patch('/:id', sanitizeMovieInput, update)
movieRouter.delete('/:id', remove)