import { Request, Response, NextFunction } from 'express';
import { Movie } from './movie.entity.js';
import { orm } from '../shared/db/orm.js';
import { Genre } from '../genre/genre.entity.js';
import { Format } from '../format/format.entity.js';
import { Language } from '../language/language.entity.js';
import { Cinema } from '../cinema/cinema.entity.js';

const em = orm.em;

function sanitizeMovieInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    name: req.body.name,
    description: req.body.description,
    imageLink: req.body.imageLink,
    duration: req.body.duration,
    formats: req.body.formats,
    cinemas: req.body.cinemas,
    languages: req.body.languages,
    genres: req.body.genres,
    shows: req.body.shows,
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
    const movies = await em.find(Movie, {}, { populate: ['genres', 'cinemas', 'formats', 'languages'] }); 
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
      { populate: ['genres', 'cinemas', 'formats', 'languages'] }
    );
    res.status(200).json({ message: 'movie found', data: movie });
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while finding the movie',
      error: error.message,
    });
  }
}

async function add(req: Request, res: Response) {
  try {
    if (!req.body.sanitizedInput.formats || !req.body.sanitizedInput.languages || req.body.sanitizedInput.formats.length === 0 || req.body.sanitizedInput.languages.length === 0) {
      res.status(400).json({ message: 'format or languages are undefined or null', error: "Bad Request" });
    } else {
      if (req.body.sanitizedInput.genres.length === 0 || req.body.sanitizedInput.cinemas.length === 0) {
        res.status(400).json({ message: 'The movie requires at least one genre and one cinema.', error: "Bad Request" });
      } else {

        // Para manejar relaciones debemos usar los id y obtener sus referencias.
        if (req.body.sanitizedInput.genres) {
          // Usamos em.getReference para asignar las referencias de los generos
          req.body.sanitizedInput.genres.map((genre: { id: number }) => em.getReference(Genre, genre.id));
        }

        if (req.body.sanitizedInput.formats) {
          req.body.sanitizedInput.formats.map((format: { id: number }) => em.getReference(Format, format.id));
        }

        if (req.body.sanitizedInput.languages) {
          req.body.sanitizedInput.languages.map((language: { id: number }) => em.getReference(Language, language.id));
        }

        if (req.body.sanitizedInput.cinemas) {
          req.body.sanitizedInput.cinemas.map((cinema: { id: number }) => em.getReference(Cinema, cinema.id));
        }
        const movie = em.create(Movie, req.body.sanitizedInput);
        await em.flush();
        res.status(201).json({ message: 'movie created', data: movie });
      }
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

    // Para manejar relaciones debemos usar los id y obtener sus referencias.
    if (req.body.sanitizedInput.genres) {
      // Usamos em.getReference para asignar las referencias de los genero
      movieToUpdate.genres.set(req.body.sanitizedInput.genres.map((genre: { id: number }) => em.getReference(Genre, genre.id)));
    }

    if (req.body.sanitizedInput.formats) {
      movieToUpdate.formats.set(req.body.sanitizedInput.formats.map((format: { id: number }) => em.getReference(Format, format.id)));
    }

    if (req.body.sanitizedInput.languages) {
      movieToUpdate.languages.set(req.body.sanitizedInput.languages.map((language: { id: number }) => em.getReference(Language, language.id)));
    }

    if (req.body.sanitizedInput.cinemas) {
      movieToUpdate.cinemas.set(req.body.sanitizedInput.cinemas.map((cinema: { id: number }) => em.getReference(Cinema, cinema.id)));
    }

    // Asignar otros campos
    em.assign(movieToUpdate, {
      name: req.body.sanitizedInput.name,
      description: req.body.sanitizedInput.description,
      imageLink: req.body.sanitizedInput.imageLink,
      duration : req.body.sanitizedInput.duration
    });

    await em.flush();
    res.status(200).json({ message: 'Movie updated', data: movieToUpdate });
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while updating the movie',
      error: error.message,
    });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const movie = await em.findOne(Movie, { id }, { populate: ['shows'] });
    if (!movie) {
      //verifica si es null o undefined
      res.status(404).json({ message: 'movie not found for deletion.' });
    } else {
      //verifica si hay funciones asociadas a la pelicula
      if (movie.shows.length === 0) {
        await em.removeAndFlush(movie);
        res.status(200).json({ data: movie, message: 'movie deleted' });
      } else {
        console.log(movie.shows)
        res.status(409).json({ message: 'cannot delete this movie because it still has associated shows' });
      }
    }
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while deleting the movie',
      error: error.message,
    });
  }
}

async function findNextMoviesReleases(req: Request, res: Response) {
  try {
    const today = new Date(); // se crea today con la fecha actual
    const thirtyDaysLater = new Date(); // inicializo la variable de la fecha de los 30 dias despues
    thirtyDaysLater.setDate(today.getDate() + 30); //get day agarra el dia actual que guarde en today, le sumo 30 y el resultado de la nueva fecha lo guardo con el setDate

    // Busca todas las películas con sus funciones asociadas, y ordena las funciones por la fecha mas cercana.
    const movies = await em.find(Movie, {}, {
      populate: ['shows'],
      orderBy: { //este parametro indica como ordenar los resultados
        shows: {
          dayAndTime: 'asc' // las funciones se ordenan por la fecha más cercana primero (menor a mayor)
        }
      }
    });

    // Filtro las películas cuya primera funcion este dentro de los proximos 30 dias
    const upcomingMovies = movies.filter(movie => { //filter usa esta funcion para cada elemento del array para ver si true o false. Si true lo agrega a upcomingMovies.

      // Obtengo la primera función de la película (porque están ordenadas por fecha)
      const firstShow = movie.shows.getItems()[0];// getItems es un mentodo del objeto Collection (ya que la relacion movie-> shows es un objeto Collection). GetItems devuelve los elementos de la coleccion como un arreglo normal, y al hacer [0] puedo acceder al primer elemento de ese array(el show o funcion).

      // Verifica si no es una función pasada y si la fecha de la primera funcion esta dentro de los próximos 30 días.
      if (firstShow && firstShow.dayAndTime > today && firstShow.dayAndTime <= thirtyDaysLater) { //firstShow en la condicion controla que no sea undefined o null el firstShow.
        return true; // Si la primera función  existe, no pasó(no estrenó), y está en los próximos 30 días, incluimos la película en upcomingMovies.
      } else {
        return false; // Si no cumple alguna condicion condición, no la agrego a upcomingMovies.
      }
    });
    res.status(200).json({ message: 'Found upcoming movie releases', data: upcomingMovies });
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while finding the next movie releases',
      error: error.message
    });
  }
}


export { sanitizeMovieInput, findAll, findOne, add, update, remove, findNextMoviesReleases };
