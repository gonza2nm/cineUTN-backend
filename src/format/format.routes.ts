import { Router } from "express";
import { sanitizeFormatInput, findAll, findOne, add, remove } from "./format.controler.js";
import { authMiddleware } from "../utils/authMiddleware.js";

export const formatRouter = Router()

formatRouter.get('/', findAll)
formatRouter.get('/:id', findOne)
formatRouter.post('/', authMiddleware(['manager']), sanitizeFormatInput, add)
formatRouter.delete('/:id', authMiddleware(['manager']), remove)