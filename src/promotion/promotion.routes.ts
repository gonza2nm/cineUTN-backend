import { Router } from "express";
import { authMiddleware } from "../utils/authMiddleware.js";
import { remove, findAll, findAllByCinema, findOne, update , add, sanitizePromotionInput } from "./promotion.controller.js";

export const promotionRouter = Router();

promotionRouter.get("/", findAll);
promotionRouter.get("/bycinema/:cid", findAllByCinema);
promotionRouter.get("/:code", findOne);
promotionRouter.post("/", authMiddleware(['manager']), sanitizePromotionInput, add);
promotionRouter.put("/:code", authMiddleware(['manager']), sanitizePromotionInput, update );
promotionRouter.delete("/:code",authMiddleware(['manager']), remove );