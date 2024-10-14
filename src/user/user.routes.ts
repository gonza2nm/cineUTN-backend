import { Router } from 'express';
import {
  sanitizeUserInput,
  findAll,
  findOne,
  add,
  update,
  remove,
} from './user.controler.js';

export const userRouter = Router();

userRouter.get('/', findAll);
userRouter.post('/login', sanitizeUserInput, findOne);
userRouter.post('/register', sanitizeUserInput, add);
userRouter.put('/:id', sanitizeUserInput, update);
userRouter.patch('/:id', sanitizeUserInput, update);
userRouter.delete('/:id', remove);
