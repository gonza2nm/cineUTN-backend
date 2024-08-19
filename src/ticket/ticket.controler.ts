import { Request, Response, NextFunction } from 'express';
import { orm } from '../shared/db/orm.js';
import { Ticket } from './ticket.entity.js';

const em = orm.em;

function sanitizeTicketInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    show: req.body.show,
    buy: req.body.buy
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });
  next();
}

async function findAll(req: Request, res: Response) {
  try {
    const tickets = await em.find(Ticket, {}, { populate: ['show', 'buy'] });
    res.status(200).json({ message: 'found all tickets', data: tickets });
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while finding all the tickets',
      error: error.message,
    });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const ticket = await em.findOneOrFail(
      Ticket,
      { id },
      { populate: ['show', 'buy'] }
    );
    res.status(200).json({ message: 'ticket found', data: ticket });
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while finding the ticket',
      error: error.message,
    });
  }
}

async function add(req: Request, res: Response) {
  try {
    const ticket = em.create(Ticket, req.body.sanitizedInput);
    await em.flush();
    res.status(201).json({ message: 'ticket created', data: ticket });
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while adding the ticket',
      error: error.message,
    });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const ticketToUpdate = await em.findOneOrFail(Ticket, { id });
    em.assign(ticketToUpdate, req.body.sanitizedInput);
    await em.flush();
    res.status(200).json({ message: 'ticket updated', data: ticketToUpdate });
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while updating the ticket',
      error: error.message,
    });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const ticketToRemove = await em.findOne(Ticket, { id });
    if (!ticketToRemove) {
      //verifica si es null o undefined
      res.status(404).json({ message: 'ticket not found for deletion.' });
    } else {
      await em.removeAndFlush(ticketToRemove);
      res.status(200).json({ message: 'ticket deleted' });
    }
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while deleting the ticket',
      error: error.message,
    });
  }
}

export { sanitizeTicketInput, findAll, findOne, add, update, remove };
