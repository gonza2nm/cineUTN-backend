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
  findAllByCinema,
} from './show.controler.js';
import { authMiddleware } from '../utils/authMiddleware.js';

export const showRouter = Router();

showRouter.get('/', findAll);
showRouter.get('/:id', findOne);
showRouter.get('/bycinema/:id',authMiddleware(["user",'manager']), findAllByCinema);
showRouter.post('/showtimes', sanitizeShowInputToFindByCinemaAndMovie, findByCinemaAndMovie);
showRouter.post('/', authMiddleware(['manager']), sanitizeShowInput, add);
showRouter.put('/:id', authMiddleware(['manager']), sanitizeShowInput, update);
showRouter.delete('/:id', authMiddleware(['manager']), remove);