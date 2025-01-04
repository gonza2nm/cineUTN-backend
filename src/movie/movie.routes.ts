import { Router } from "express";
import { sanitizeMovieInput, findAll, findOne, add, update, remove, findNextMoviesReleases } from "./movie.controler.js";
import { authMiddleware } from "../utils/authMiddleware.js";

export const movieRouter = Router()

movieRouter.get('/', findAll)
movieRouter.get('/next-releases', findNextMoviesReleases) //Cuidado con el orden, como estaba abajo del findOne tomaba /next-releases como id y por eso fallaba.
movieRouter.get('/:id', findOne)
movieRouter.post('/', authMiddleware(['manager']), sanitizeMovieInput, add)
movieRouter.put('/:id', authMiddleware(['manager']), sanitizeMovieInput, update)
movieRouter.patch('/:id', authMiddleware(['manager']), sanitizeMovieInput, update)
movieRouter.delete('/:id', authMiddleware(['manager']), remove)