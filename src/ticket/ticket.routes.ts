import { Router } from "express";
import { add, findAll, findOne, remove, sanitizeTicketInput, update } from "./ticket.controler.js";

export const ticketRouter = Router();

ticketRouter.get('/', findAll)
ticketRouter.get('/:id', findOne)
ticketRouter.post('/', sanitizeTicketInput, add)
ticketRouter.put('/:id', sanitizeTicketInput, update)
ticketRouter.patch('/:id', sanitizeTicketInput, update)
ticketRouter.delete('/:id', remove)