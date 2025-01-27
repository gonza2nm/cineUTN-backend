import { Router } from 'express';
import {
  sanitizeBuyInput,
  findAll,
  findOne,
  add,
  update,
  remove, 
  findAllpurchasebyUser,
  addPurchase,
  generateQRCodeForBuy,
  validateQRCode
} from './buy.controler.js';
import { authMiddleware } from '../utils/authMiddleware.js';
import { sanitizeTicketInput } from '../ticket/ticket.controler.js';

export const buyRouter = Router();

buyRouter.get('/', authMiddleware(["manager"]), findAll);
buyRouter.get('/:id', authMiddleware(["user", "manager"]), findOne);
buyRouter.get('/byUser/:id', authMiddleware(["user", "manager"]), findAllpurchasebyUser)
buyRouter.get('/generateQr/:id', authMiddleware(["user", "manager"]), generateQRCodeForBuy)

//buyRouter.post('/',authMiddleware(["user", "manager"]), sanitizeBuyInput, add);
buyRouter.post('/',authMiddleware(["user", "manager"]), sanitizeBuyInput, sanitizeTicketInput,  addPurchase);
buyRouter.post('/validateQr', authMiddleware(["manager"]), validateQRCode) //post para poder enviar datos en el body de la solicitud
buyRouter.patch('/:id',authMiddleware(["user", "manager"]), sanitizeBuyInput, update); //REVISAR
buyRouter.delete('/:id',authMiddleware(["user", "manager"]), remove);
