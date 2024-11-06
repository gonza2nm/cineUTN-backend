import { Router } from 'express';
import {
  sanitizeUserInput,
  findAll,
  findOne,
  add,
  update,
  remove,
  findOneManager,
  findAllManagers,
} from './user.controler.js';

export const userRouter = Router();

// No cambiar el orden de las rutas
userRouter.post('/login', sanitizeUserInput, findOne);
userRouter.post('/register', sanitizeUserInput, add);

userRouter.get('/managers', findAllManagers);
userRouter.get('/managers/:id', sanitizeUserInput, findOneManager);

userRouter.get('/', findAll);
userRouter.put('/:id', sanitizeUserInput, update);
userRouter.patch('/:id', sanitizeUserInput, update);
userRouter.delete('/:id', remove);



