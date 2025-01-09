import { Request, Response, NextFunction } from 'express';
import { orm } from '../shared/db/orm.js';
import { Event } from './event.entity.js';

const em = orm.em;

function sanitizeEventInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    name: req.body.name,
    description: req.body.description,
    startDate: req.body.startDate,
    finishDate: req.body.finishDate,
    cinemas: req.body.cinemas
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
    const events = await em.find(Event, {}, { populate: ['cinemas'] });
    res.status(200).json({ message: 'found all events', data: events });
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while querying all events',
      error: error.message,
    });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const event = await em.findOneOrFail(Event, { id },)
    res.status(200).json({ message: 'found event', data: event })
  } catch (error: any) {
    res.status(500).json({ message: 'An error occurred while finding the event', error: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const event = em.create(Event, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'event created', data: event })
  } catch (error: any) {
    res.status(500).json({ message: 'An error occurred while adding the event', error: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const eventToUpdate = await em.findOneOrFail(Event, { id })
    em.assign(eventToUpdate, req.body.sanitizedInput)
    await em.flush()
    res.status(200).json({ message: 'event updated', data: eventToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: 'An error occurred while updating the event', error: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const event = await em.findOne(Event, { id })
    if (!event) { //verifica si es null o undefined
      res.status(404).json({ message: 'event not found for deletion.' })
    } else {
      await em.removeAndFlush(event)
      res.status(200).json({ data: event, message: 'event deleted' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'An error occurred while deleting the event', error: error.message })
  }
}



export { sanitizeEventInput, findAll, findOne, add, update, remove }