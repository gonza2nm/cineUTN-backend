import { Router } from "express";
import { sanitizeLanguageInput, findAll, findOne, add, remove } from "./language.controler.js";

export const languageRouter = Router()

languageRouter.get('/', findAll)
languageRouter.get('/:id', findOne)
languageRouter.post('/', sanitizeLanguageInput, add)
languageRouter.delete('/:id', remove)