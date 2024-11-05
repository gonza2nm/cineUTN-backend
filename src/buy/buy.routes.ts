import { Router } from 'express';
import {
  sanitizeBuyInput,
  findAll,
  findOne,
  add,
  update,
  remove
} from './buy.controler.js';

export const buyRouter = Router();

buyRouter.get('/', findAll);
buyRouter.get('/:id', findOne);
buyRouter.post('/', sanitizeBuyInput,  add);
buyRouter.put('/:id', sanitizeBuyInput, update);
buyRouter.delete('/:id', remove);