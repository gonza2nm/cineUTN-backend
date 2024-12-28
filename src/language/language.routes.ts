import { Router } from "express";
import { sanitizeLanguageInput, findAll, findOne, add, remove } from "./language.controler.js";
import { authMiddleware } from "../utils/authMiddleware.js";

export const languageRouter = Router()

languageRouter.get('/', findAll)
languageRouter.get('/:id', findOne)
languageRouter.post('/', authMiddleware(['manager']), sanitizeLanguageInput, add)
languageRouter.delete('/:id', authMiddleware(['manager']), remove)