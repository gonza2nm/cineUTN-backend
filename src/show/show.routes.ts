import { Router } from 'express';
import {
  sanitizeShowInput,
  sanitizeShowInputToFindByCinemaAndMovie,
  findAll,
  findOne,
  findByCinemaAndMovie,
  add,
  update,
  remove,
} from './show.controler.js';

export const showRouter = Router();

showRouter.get('/', findAll);
showRouter.get('/:id', findOne);
showRouter.post('/showtimes',sanitizeShowInputToFindByCinemaAndMovie, findByCinemaAndMovie);
showRouter.post('/', sanitizeShowInput,  add);
showRouter.put('/:id', sanitizeShowInput, update);
showRouter.delete('/:id', remove);