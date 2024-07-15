import { Router } from 'express';
import {
  sanitizeTheaterInput,
  findAll,
  findOne,
  add,
  update,
  remove,
} from './theater.controler.js';

export const theaterRouter = Router();

theaterRouter.get('/', findAll);
theaterRouter.get('/:id', findOne);
theaterRouter.post('/', sanitizeTheaterInput, add);
theaterRouter.patch('/:id', sanitizeTheaterInput, update);
theaterRouter.delete('/:id', remove);
