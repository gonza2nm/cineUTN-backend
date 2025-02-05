import { Router } from 'express';
import { findallSeatsbyShow, updateSeatsbyShow } from './seat.controller.js';
import { authMiddleware } from '../utils/authMiddleware.js';


export const seatRouter = Router();



seatRouter.get('/byShow/:id', authMiddleware(["user", "manager"]), findallSeatsbyShow);


seatRouter.patch('/update/:id', authMiddleware(["user", "manager"]), updateSeatsbyShow);