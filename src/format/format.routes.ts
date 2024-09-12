import { Router } from "express";
import { sanitizeFormatInput, findAll, findOne, add, remove } from "./format.controler.js";

export const formatRouter = Router()

formatRouter.get('/', findAll)
formatRouter.get('/:id', findOne)
formatRouter.post('/', sanitizeFormatInput, add)
formatRouter.delete('/:id', remove)