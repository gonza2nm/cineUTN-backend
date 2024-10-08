import { Router } from 'express';
import {
  sanitizeCinemaInput,
  findAll,
  findOne,
  add,
  update,
  remove,
  findAllByMovie
} from './cinema.controler.js';

export const cinemaRouter = Router();

cinemaRouter.get('/', findAll);
cinemaRouter.get('/movie/:id', findAllByMovie);
cinemaRouter.get('/:id', findOne);
cinemaRouter.post('/', sanitizeCinemaInput, add);
cinemaRouter.put('/:id', sanitizeCinemaInput, update);
cinemaRouter.delete('/:id', remove);
