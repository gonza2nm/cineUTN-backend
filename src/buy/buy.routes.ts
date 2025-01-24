import { Router } from 'express';
import {
  sanitizeBuyInput,
  findAll,
  findOne,
  add,
  update,
  remove, 
  findAllpurchasebyUser,
  addPruchase
} from './buy.controler.js';
import { authMiddleware } from '../utils/authMiddleware.js';
import { sanitizeTicketInput } from '../ticket/ticket.controler.js';

export const buyRouter = Router();

buyRouter.get('/', authMiddleware(["manager"]), findAll);
buyRouter.get('/:id', authMiddleware(["user", "manager"]), findOne);
buyRouter.post('/byUser', authMiddleware(["user", "manager"]),sanitizeBuyInput, findAllpurchasebyUser)
//buyRouter.post('/',authMiddleware(["user", "manager"]), sanitizeBuyInput,  add);
buyRouter.post('/',authMiddleware(["user", "manager"]), sanitizeBuyInput, sanitizeTicketInput,  addPruchase);
buyRouter.patch('/:id',authMiddleware(["user", "manager"]), sanitizeBuyInput, update); //REVISAR
buyRouter.delete('/:id',authMiddleware(["user", "manager"]), remove);