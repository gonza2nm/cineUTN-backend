import { Request, Response, NextFunction } from 'express';
import { orm } from '../shared/db/orm.js';
import { Ticket } from './ticket.entity.js';

const em = orm.em;

function sanitizeTicketInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedTicketInput = {
    show: req.body.show,
    buy: req.body.buy
  };

  Object.keys(req.body.sanitizedTicketInput).forEach((key) => {
    if (req.body.sanitizedTicketInput[key] === undefined) {
      delete req.body.sanitizedTicketInput[key];
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


async function findAllTicketbyPurchase(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const tickets = await em.find(Ticket, { buy: id }, { populate: ['show', 'show.movie', 'show.theater', 'show.format', 'show.language', 'seat', 'buy']});
    res.status(200).json({ message: 'tickets found', data: tickets });
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while finding the ticket',
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
    const ticket = em.create(Ticket, req.body.sanitizedTicketInput);
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
    em.assign(ticketToUpdate, req.body.sanitizedTicketInput);
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
    const ticket = await em.findOne(Ticket, { id });
    if (!ticket) {
      //verifica si es null o undefined
      res.status(404).json({ message: 'ticket not found for deletion.' });
    } else {
      await em.removeAndFlush(ticket);
      res.status(200).json({ data: ticket, message: 'ticket deleted' });
    }
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while deleting the ticket',
      error: error.message,
    });
  }
}

async function removeAllTicketsByPurchase(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const tickets = await em.find(Ticket, { buy: id });
    if(tickets.length === 0) {
      res.status(404).json({ message: 'Tickets not found for deletion.' });
    } else {
      await em.removeAndFlush(tickets);
      res.status(200).json({ message: 'All tickets deleted' });
    }
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while finding the ticket',
      error: error.message,
    });
  }
  
}


export { sanitizeTicketInput, findAll, findOne, add, update, remove, findAllTicketbyPurchase, removeAllTicketsByPurchase };
