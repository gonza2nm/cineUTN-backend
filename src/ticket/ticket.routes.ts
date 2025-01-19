import { Router } from "express";
import { add, findAll, findOne, remove, sanitizeTicketInput, update, findAllTicketbyPurchase, removeAllTicketsByPurchase} from "./ticket.controler.js";
import { authMiddleware } from "../utils/authMiddleware.js";

export const ticketRouter = Router();



ticketRouter.get('/', authMiddleware(["manager"]), findAll)
ticketRouter.get('/:id', authMiddleware(["user", "manager"]), findOne)
ticketRouter.get('/byBuy/:id', authMiddleware(["user", "manager"]), findAllTicketbyPurchase)
ticketRouter.post('/', authMiddleware(["user", "manager"]), sanitizeTicketInput, add)
ticketRouter.put('/:id', authMiddleware(["manager"]), sanitizeTicketInput, update)
ticketRouter.delete('/:id', remove)
ticketRouter.delete('/byBuy/:id', authMiddleware(["user", "manager"]), removeAllTicketsByPurchase)
