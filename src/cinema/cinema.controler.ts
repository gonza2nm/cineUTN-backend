import { Request, Response, NextFunction } from 'express';
import { Cinema } from './cinema.entity.js';
import { orm } from '../shared/db/orm.js';

const em = orm.em;

function sanitizeCinemaInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    name: req.body.name,
    address: req.body.address,
    movies: req.body.movies,
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });
  next();
}

async function findAllByMovie(req: Request, res: Response) {
  try {
    const movieId = Number.parseInt(req.params.id);
    const cinemas = await em.find(Cinema, { movies: { id: movieId } }, { populate: ['movies', 'movies.cinemas'] });
    res.status(200).json({ message: 'found all cinemas by movie', data: cinemas });
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while querying all cinemas by movie',
      error: error.message,
    });
  }
}

async function findAll(req: Request, res: Response) {
  try {
    const cinemas = await em.find(Cinema, {}, { populate: ['theaters', 'movies'] });
    res.status(200).json({ message: 'found all cinemas', data: cinemas });
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while querying all cinemas',
      error: error.message,
    });
  }
}
/*agregue para pasarle query strings
ej: http://localhost:3000/api/cinemas/1?genres=all
los querys se comienzan con '?', separan atributos por '&' y
se le asigna valor a un atributo con '='
valores permitidos:
genres = all,
si no se especifica devuelve solo el cine con sus salas
*/
async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    let cinema;
    if (req.query.genres === "all") {
      cinema = await em.findOne(Cinema, { id }, { populate: ['theaters', 'movies', 'movies.genres'] });
    } else {
      cinema = await em.findOne(Cinema, { id }, { populate: ['theaters', 'movies'] });
    }
    if (cinema === null) {
      res.status(404).json({ message: 'cinema not found' });
    } else {
      res.status(200).json({ message: 'found cinema', data: cinema });
    }
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while querying the cinema',
      error: error.message,
    });
  }
}

async function add(req: Request, res: Response) {
  try {
    const cinema = em.create(Cinema, req.body.sanitizedInput);
    await em.flush();
    res.status(201).json({ message: 'cinema created', data: cinema });
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while adding the cinema',
      error: error.message,
    });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const cinemaToUpdate = await em.findOne(Cinema, { id });
    if (cinemaToUpdate === null) {
      res.status(404).json({ message: 'cinema not found to update' });
    } else {
      em.assign(cinemaToUpdate, req.body.sanitizedInput);
      await em.flush();
      res.status(200).json({ message: 'cinema updated', data: cinemaToUpdate });
    }
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while updating the cinema',
      error: error.message,
    });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const cinema = await em.findOne(Cinema, { id }, { populate: ['theaters', 'events'] });
    if (cinema === null) {
      res.status(404).json({ message: 'cinema not found to delete.' });
    } else {
      if (cinema.events.length === 0) {
        await em.removeAndFlush(cinema);
        res.status(200).json({ data: cinema, message: 'cinema deleted' });
      } else {
        res.status(409).json({ message: 'No puede eliminarse este cine si todavia tiene eventos asociados.' });
      }
    }
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while deleting the cinema',
      error: error.message,
    });
  }
}

export { sanitizeCinemaInput, findAll, findOne, add, update, remove, findAllByMovie };
