import { Request, Response, NextFunction } from 'express';
import { Movie } from './movie.entity.js';
import { orm } from '../shared/db/orm.js';
import { error } from 'console';

const em = orm.em;

function sanitizeMovieInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    name: req.body.name,
    description: req.body.description,
    imageLink: req.body.imageLink,
    formats: req.body.formats,
    languages: req.body.languages,
    genres: req.body.genres,
  }; //cuidado! antes mostraba los generos vacios pero fue porque no los habia agregado en este sanitize input

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });
  next();
}

async function findAll(req: Request, res: Response) {
  try {
    const movies = await em.find(Movie, {}, { populate: ['genres', 'formats', 'languages'] }); //en este tercer parametro le indicamos que relaciones queremos que cargue
    res.status(200).json({ message: 'found all movies', data: movies });
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while finding all the movies',
      error: error.message,
    });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const movie = await em.findOneOrFail(
      Movie,
      { id },
      { populate: ['genres', 'formats', 'languages'] }
    );
    res.status(200).json({ message: 'movie found', data: movie });
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while finding the movie',
      error: error.message,
    });
  }
}
//al añadir la pelicula controla que por lo menos este asignada a un formato y a un idioma
async function add(req: Request, res: Response) {
  try {
    if (!req.body.sanitizedInput.formats || !req.body.sanitizedInput.languages || req.body.sanitizedInput.formats.length === 0 || req.body.sanitizedInput.languages.length === 0) {
      res.status(400).json({ message: 'format or languages are undefined or null', error: "Bad Request" });
    } else {
      const movie = em.create(Movie, req.body.sanitizedInput);
      await em.flush();
      res.status(201).json({ message: 'movie created', data: movie });
    }
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while adding the movie',
      error: error.message,
    });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const movieToUpdate = await em.findOneOrFail(Movie, { id });
    em.assign(movieToUpdate, req.body.sanitizedInput);
    await em.flush();
    res.status(200).json({ message: 'movie updated', data: movieToUpdate });
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while updating the movie',
      error: error.message,
    });
  }
}
/*
async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const movieToRemove = em.getReference(Movie, id)
    await em.removeAndFlush(movieToRemove)
    res.status(200).send({ message: 'movie deleted' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
*/
async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const movie = await em.findOne(Movie, { id });
    if (!movie) {
      //verifica si es null o undefined
      res.status(404).json({ message: 'movie not found for deletion.' });
    } else {
      await em.removeAndFlush(movie);
      res.status(200).json({ data: movie, message: 'movie deleted' });
    }
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while deleting the movie',
      error: error.message,
    });
  }
}

/*
 findNextMoviesReleases(dame las movies filtro -> (dame las funciones de las movies)-> filtro(fijate la funcion con menor dia /o siempre tener ordenadas las funciones de menor a mayor cuando se cargan/ y seleccionar funcion con menor dia si esta el proximos 30 dias)

async function findNextMoviesReleases(req: Request, res: Response) {
  try {
    const movies = await em.find(Movie, { shows: { dayAndTime: { $gte: new Date } } })
  } catch { }
} 
*/


// exportar findNextMoviesReleases
export { sanitizeMovieInput, findAll, findOne, add, update, remove };
