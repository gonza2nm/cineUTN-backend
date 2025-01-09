import { Router } from "express";
import { authMiddleware } from "../utils/authMiddleware.js";
import { add, findAll, findOne, remove, sanitizeEventInput, update } from "./event.controler.js";

export const eventRouter = Router()

eventRouter.get('/', findAll)
eventRouter.get('/:id', findOne)
eventRouter.post('/', authMiddleware(['manager']), sanitizeEventInput, add)
eventRouter.put('/:id', authMiddleware(['manager']), sanitizeEventInput, update)
eventRouter.delete('/:id', authMiddleware(['manager']), remove)