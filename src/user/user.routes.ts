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
  logout,
  login,
  verifyTokenAndFindData
} from './user.controler.js';
import { authMiddleware } from '../utils/authMiddleware.js';

export const userRouter = Router();

// No cambiar el orden de las rutas
userRouter.post('/login', sanitizeUserInput, login);
userRouter.post('/logout', authMiddleware(['user','manager']), logout);
userRouter.get('/verify-token-find-data', verifyTokenAndFindData);
userRouter.post('/register', sanitizeUserInput, add);

userRouter.get('/managers', authMiddleware(['manager']), findAllManagers);
userRouter.get('/managers/:id', authMiddleware(['manager']), sanitizeUserInput, findOneManager);

userRouter.get('/', authMiddleware(['manager']), findAll);
userRouter.get('/:id', sanitizeUserInput, findOne);
userRouter.put('/:id', authMiddleware(), sanitizeUserInput, update);
userRouter.patch('/:id', authMiddleware(), sanitizeUserInput, update);
userRouter.delete('/:id', authMiddleware(), remove);



