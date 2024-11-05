import { Router } from "express";
import { add, findAll, findOne, remove, sanitizeTicketInput, update, findAllTicketbyPurchase, remove2} from "./ticket.controler.js";

export const ticketRouter = Router();


ticketRouter.get('/', findAll)
ticketRouter.get('/:id', findOne)
ticketRouter.post('/', sanitizeTicketInput, add)
ticketRouter.post('/byBuy',sanitizeTicketInput, findAllTicketbyPurchase)
ticketRouter.put('/:id', sanitizeTicketInput, update)
ticketRouter.patch('/:id', sanitizeTicketInput, update)
ticketRouter.delete('/:id', remove)
ticketRouter.post('/remove2', sanitizeTicketInput, remove2)