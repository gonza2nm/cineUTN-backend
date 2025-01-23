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
  authCheck,
  logout,
  login,
  getData
} from './user.controler.js';
import { authMiddleware } from '../utils/authMiddleware.js';

export const userRouter = Router();

// No cambiar el orden de las rutas
userRouter.post('/login', sanitizeUserInput, login);
userRouter.post('/logout', authMiddleware(['user','manager']), logout);
userRouter.get('/getdata', authMiddleware(['user',"manager"]), getData);
userRouter.get('/:id', sanitizeUserInput, findOne);
userRouter.post('/register', sanitizeUserInput, add);

userRouter.get('/managers', authMiddleware(['manager']), findAllManagers);
userRouter.get('/managers/:id', authMiddleware(['manager']), sanitizeUserInput, findOneManager);

userRouter.get('/', authMiddleware(['manager']), findAll);
userRouter.get('/auth/check', authCheck);
userRouter.put('/:id', authMiddleware(), sanitizeUserInput, update);
userRouter.patch('/:id', authMiddleware(), sanitizeUserInput, update);
userRouter.delete('/:id', authMiddleware(), remove);



