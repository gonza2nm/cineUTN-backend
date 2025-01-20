import { Router } from 'express';
import {
  sanitizeBuyInput,
  findAll,
  findOne,
  add,
  update,
  remove,
  findAllpurchasebyUser,
  generateQRCodeForBuy,
  validateQRCode
} from './buy.controler.js';
import { authMiddleware } from '../utils/authMiddleware.js';

export const buyRouter = Router();

buyRouter.get('/', authMiddleware(["manager"]), findAll);
buyRouter.get('/:id', authMiddleware(["user", "manager"]), findOne);
buyRouter.get('/generateQr/:id', authMiddleware(["user", "manager"]), generateQRCodeForBuy)
buyRouter.post('/validateQr', authMiddleware(["manager"]), validateQRCode) //post para poder enviar datos en el body de la solicitud
buyRouter.post('/byUser', authMiddleware(["user", "manager"]), sanitizeBuyInput, findAllpurchasebyUser)
buyRouter.post('/', authMiddleware(["user", "manager"]), sanitizeBuyInput, add);
buyRouter.put('/:id', authMiddleware(["manager"]), sanitizeBuyInput, update); //REVISAR
buyRouter.delete('/:id', authMiddleware(["user", "manager"]), remove);