import { Router } from "express";
import { authMiddleware } from "../utils/authMiddleware.js";
import { remove, findAll, findOne, update , add, sanitizeSanckInput } from "./snack.contoller.js";

export const snackRouter = Router();

snackRouter.get("/", findAll);
snackRouter.get("/:id", findOne);
snackRouter.post("/", /*authMiddleware(['manager']),*/sanitizeSanckInput, add);
snackRouter.put("/:id", /*authMiddleware(['manager']),*/sanitizeSanckInput, update );
snackRouter.delete("/:id",/*authMiddleware(['manager']),*/ remove );