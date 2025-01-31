import { Request, Response, NextFunction } from 'express';
import { orm } from '../shared/db/orm.js';
import { Event } from './event.entity.js';
import { Cinema } from '../cinema/cinema.entity.js';
import { checkOverlappingEventsWithCinemas } from '../utils/checkEventOverlap.js';

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
    const event = await em.findOneOrFail(Event, { id }, { populate: ['cinemas'] })
    res.status(200).json({ message: 'found event', data: event })
  } catch (error: any) {
    res.status(500).json({ message: 'An error occurred while finding the event', error: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    // Para manejar relaciones usamos los id y obtenemos sus referencias.
    if (req.body.sanitizedInput.cinemas) {
      // Usamos em.getReference para asignar las referencias de los cinemas
      req.body.sanitizedInput.cinemas.map((cinema: { id: number }) => em.getReference(Cinema, cinema.id));
    }

    // para calcular si hay overlapping
    const { startDate, finishDate, cinemas } = req.body.sanitizedInput;
    const overlappingEventCinemas = await checkOverlappingEventsWithCinemas(startDate, finishDate, cinemas);

    if (overlappingEventCinemas.length > 0) {
      // Extraemos IDs de los cines con superposición y filtramos valores undefined (ya que aca devuelve objetos cinemas solo con id y sin datos)
      const overlappingCinemaIds = overlappingEventCinemas
        .map((cinema) => cinema.id)
        .filter((id): id is number => id !== undefined);
      // Buscar los datos de los cines coon esos IDs
      const overlappingCinemasWithNames = await em.find(Cinema, { id: { $in: overlappingCinemaIds } });

      // Extraermos los nombres de los cines
      const cinemaNames = overlappingCinemasWithNames.map((cinema) => cinema.name);
      return res.status(400).json({
        message: "El tiempo de este evento se solapa con el de otro en los cines: " + cinemaNames
      });

    } else {
      const event = em.create(Event, req.body.sanitizedInput)
      await em.flush()
      res.status(201).json({ message: 'event created', data: event })
    }
  } catch (error: any) {
    res.status(500).json({ message: 'An error occurred while adding the event', error: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const eventToUpdate = await em.findOneOrFail(Event, { id })

    // Si req.body.sanitizedInput incluye `cinemas`, lo convertimos a referencias
    if (req.body.sanitizedInput.cinemas) {
      req.body.sanitizedInput.cinemas = req.body.sanitizedInput.cinemas.map((cinema: { id: number }) => em.getReference(Cinema, cinema.id));
    }
    // para calcular si hay overlapping
    const { startDate, finishDate, cinemas } = req.body.sanitizedInput;
    const overlappingEventCinemas = await checkOverlappingEventsWithCinemas(startDate, finishDate, cinemas, id);

    if (overlappingEventCinemas.length > 0) {
      // Extraemos IDs de los cines con superposición y filtramos valores undefined (ya que aca devuelve objetos cinemas solo con id y sin datos)
      const overlappingCinemaIds = overlappingEventCinemas
        .map((cinema) => cinema.id)
        .filter((id): id is number => id !== undefined);
      // Buscar los datos de los cines coon esos IDs
      const overlappingCinemasWithNames = await em.find(Cinema, { id: { $in: overlappingCinemaIds } });

      // Extraermos los nombres de los cines
      const cinemaNames = overlappingCinemasWithNames.map((cinema) => cinema.name);
      return res.status(400).json({
        message: "El tiempo de este evento se solapa con el de otro en los cines: " + cinemaNames
      });

    } else {
      em.assign(eventToUpdate, req.body.sanitizedInput)
      await em.flush()
      res.status(200).json({ message: 'event updated', data: eventToUpdate })
    }
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

async function findEventsByCinema(req: Request, res: Response) {
  try {
    const cinemaId = Number.parseInt(req.params.cinemaId)
    const events = await em.find(Event, { cinemas: { id: cinemaId } }, { populate: ['cinemas'] });
    res.status(200).json({ message: 'found all events', data: events });
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while querying all events',
      error: error.message,
    });
  }
}



export { sanitizeEventInput, findAll, findOne, add, update, remove, findEventsByCinema }