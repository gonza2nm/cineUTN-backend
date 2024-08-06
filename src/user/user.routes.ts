import { Router } from "express"
import { sanitizeUserInput, findAll, findOne, add, update, remove } from "./user.controler.js";

export const userRouter = Router()

userRouter.get('/', findAll)
userRouter.get('/:dni', findOne)
userRouter.post('/', sanitizeUserInput, add)
userRouter.put('/:dni', sanitizeUserInput, update)
userRouter.patch('/:dni', sanitizeUserInput, update)
userRouter.delete('/:id', remove)