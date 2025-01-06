import { Router } from "express";
import { add, findAll, findOne, remove, sanitizeTicketInput, update, findAllTicketbyPurchase, remove2} from "./ticket.controler.js";
import { authMiddleware } from "../utils/authMiddleware.js";

export const ticketRouter = Router();


ticketRouter.get('/', authMiddleware(["manager"]), findAll)
ticketRouter.get('/:id', authMiddleware(["user", "manager"]), findOne)
ticketRouter.post('/byBuy', authMiddleware(["user", "manager"]),sanitizeTicketInput, findAllTicketbyPurchase)
ticketRouter.post('/', authMiddleware(["user", "manager"]), sanitizeTicketInput, add)
ticketRouter.put('/:id', authMiddleware(["manager"]), sanitizeTicketInput, update)
ticketRouter.delete('/:id', remove)
ticketRouter.post('/remove2', sanitizeTicketInput, remove2)