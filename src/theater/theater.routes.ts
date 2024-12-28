import { Router } from 'express';
import {
  sanitizeTheaterInput,
  findAll,
  findOne,
  add,
  update,
  remove,
} from './theater.controler.js';
import { authMiddleware } from '../utils/authMiddleware.js';

export const theaterRouter = Router();

theaterRouter.get('/', findAll);
theaterRouter.get('/:id', findOne);
theaterRouter.post('/', authMiddleware(['manager']), sanitizeTheaterInput, add);
theaterRouter.put('/:id', authMiddleware(['manager']), sanitizeTheaterInput, update);
theaterRouter.delete('/:id', authMiddleware(['manager']), remove);
