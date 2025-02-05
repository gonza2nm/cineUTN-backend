import { Request, Response, NextFunction } from "express"
import { orm } from '../shared/db/orm.js'

import { Seat } from "../seat/seat.entity.js";


const em = orm.em



async function findallSeatsbyShow(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const seats = await em.find(Seat, { show: id });
    res.status(200).json({ message: 'found all seats', data: seats });

  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while finding all the seats',
      error: error.message,
    });
  }
}


async function updateSeatsbyShow(req: Request, res: Response) {

  const { seatsId } = req.body
  try {
    const id = Number.parseInt(req.params.id);
    const seats = await em.find(Seat, { show: id,  id: {$in: seatsId} });

    if (!seats || seats.length === 0) {
      return res.status(400).json({ message: 'Seats not founded' });
    }

    seats.forEach(seat => {
      seat.status = 'Disponible'
    })

    await em.flush();
    res.status(200).json({ message: 'Asientos actualizados ', data: seats });

  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while finding all the seats',
      error: error.message,
    });
  }
}

export { findallSeatsbyShow, updateSeatsbyShow }