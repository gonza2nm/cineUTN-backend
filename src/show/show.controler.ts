import { Request, Response, NextFunction } from "express"
import { Show } from "./show.entity.js"
import { orm } from '../shared/db/orm.js'
import { checkTimeShowInTheater } from "../utils/checkTimeShowInTheater.js"
import { checkLanguageAndFormat } from "../utils/checkLanguageAndFormat.js"
import { Seat } from "../seat/seat.entity.js"
import { Movie } from "../movie/movie.entity.js"

const em = orm.em

function sanitizeShowInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    dayAndTime: req.body.dayAndTime,
    theater: req.body.theater,
    movie: req.body.movie,
    format: req.body.format,
    language: req.body.language
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}
function sanitizeShowInputToFindByCinemaAndMovie(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    movieId: req.body.movieId,
    cinemaId: req.body.cinemaId,
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}

async function findAll(req: Request, res: Response) {
  try {
    const shows = await em.find(Show, {}, { populate: ['theater', 'movie'] })
    res.status(200).json({ message: 'Found all shows', data: shows })
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while querying all shows',
      error: error.message,
    })
  }
}

async function findAllByCinema(req: Request, res: Response) {
  try {
    const cinema_id = Number.parseInt(req.params.id);
    const currentDate = new Date();
    const shows = await em.find(Show, 
      {theater:
        {
          cinema:{id:cinema_id}
        },
        dayAndTime: {$gte: currentDate}
      },
      { populate: ['theater', 'movie',"format","language"],
        orderBy: {dayAndTime: "ASC"}
      }
    );
    res.status(200).json({ message: 'Found all shows', data: shows })
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while querying all shows',
      error: error.message,
    })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    let show;
    if(req.query.moredetails === "yes"){
      show = await em.findOneOrFail(Show, { id }, { populate: ['theater', 'movie','format','language', "movie.formats", "movie.languages"] })
    } else{
      show = await em.findOneOrFail(Show, { id }, { populate: ['theater', 'movie','format','language'] })
    }
    res.status(200).json({ message: 'Found show', data: show })
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while querying show',
      error: error.message,
    })
  }
}


async function add(req: Request, res: Response) {
  try {
    
    const { dayAndTime, theater, movie, format, language } = req.body.sanitizedInput;
    const _movie = await em.findOne(Movie,{id: movie});
    if(!_movie){
        res.status(400).json({message: "the movie of the show do not exist"});
    }else{
      const startTime = new Date(`${dayAndTime}`);
      const finishTime = new Date(startTime);
      finishTime.setMinutes(finishTime.getMinutes() + _movie.duration); 
      const overlapping = await checkTimeShowInTheater(dayAndTime, finishTime, theater, null);
      const is_format_languages_ok = await checkLanguageAndFormat(movie, language, format);
      
      if (overlapping) {
        res.status(400).json({ message: "The show time overlaps with another show in the same theater" })
      } else if (!is_format_languages_ok) {
        res.status(400).json({ message: 'the language or the format do not exist in that movie' })
      } else {
        const show = em.create(Show, {...req.body.sanitizedInput, finishTime: finishTime, })
        await em.persistAndFlush(show);
        addSeats(show)
        res.status(201).json({ message: 'Show created', data: show })
      }}

  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while adding the show',
      error: error.message,
    })
  }
}

//solo devuelve las funciones que tienen fecha y hora mayor a la actual, para evitar problemas 
async function findByCinemaAndMovie(req: Request, res: Response){
  try{
    const {movieId, cinemaId} = req.body.sanitizedInput;
    if(cinemaId < 0 || movieId < 0 || !cinemaId || !movieId ) {
      res.status(400).json({message:"There is an error in the data you sent", error: "Bad Request"})
    } else {
      let currentDate = new Date()
      const shows = await em.find(
        Show, 
        { movie: movieId, theater: {cinema: {id: cinemaId}}, dayAndTime: { $gte: currentDate} }, 
        { populate: ['movie', 'theater', 'theater.cinema', 'format', 'language'] }
      );
      res.status(200).json({message: "Found Shows", data: shows});
    }
  }catch(error: any){
  res.status(500).json({  
      message: 'An error occurred while querying show',
      error: error.message, });
  }
}

async function update(req: Request, res: Response) {
  try {
    const { dayAndTime, theater, movie, format, language } = req.body.sanitizedInput;
    const id = Number.parseInt(req.params.id)
    const showToUpdate = await em.findOneOrFail(Show, { id })

    if (!req.body.sanitizedInput.movie) {
      res.status(400).json({ message: 'the movie is null or undefined' })
    } else if (!showToUpdate) {
      res.status(404).json({ message: 'Show not found for updating.' });
    } else {    
      const _movie = await em.findOne(Movie,{id: movie});
      if(!_movie){
        res.status(400).json({message: "the movie of the show do not exist"});
      }else{
        const startTime = new Date(`${dayAndTime}`);
        const finishTime = new Date(startTime);
        finishTime.setMinutes(finishTime.getMinutes() + _movie.duration); 
        if(showToUpdate.id != undefined){
        const overlapping = await checkTimeShowInTheater(dayAndTime, finishTime, theater, showToUpdate.id);
        const is_format_languages_ok = await checkLanguageAndFormat(movie, language, format);
        if (overlapping) {
          res.status(400).json({ message: "The show time overlaps with another show in the same theater" })
        } else if (!is_format_languages_ok) {4
          res.status(400).json({ message: 'the language or the format do not exist in that movie' })
        }
        else {
          showToUpdate.dayAndTime = startTime;
          showToUpdate.theater = theater;
          showToUpdate.finishTime = finishTime;
          showToUpdate.movie = movie;
          showToUpdate.format = format;
          showToUpdate.language = language;
          await em.persistAndFlush(showToUpdate);
          res.status(200).json({ message: 'Show updated', data: showToUpdate })
        }
      }
      }
    }
  } catch (error: any) {
    res.status(500).json({ message: "An error occurred while updating the show", error: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const show = await em.findOne(Show, { id });
    if (show === null) {
      res.status(404).json({ message: 'Show not found for deletion.' });
    } else {
      await em.removeAndFlush(show);
      res.status(200).send({ data: show, message: 'Show deleted' });
    }
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while deleting the show',
      error: error.message,
    });
  }
}


async function addSeats(show: Show) {

  try {
    await em.populate(show, ['theater']);
    const rows = show.theater.cantRows;
    const cols = show.theater.cantCols;
    console.log(`Rows: ${rows}, Cols: ${cols}`);

    const letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];
    const seats = [];

    for (let fila = 0; fila < rows; fila++) {
      for (let col = 0; col < cols; col++) {
        seats.push(em.create(Seat, {
          seatNumber: `${letras[fila]}${col + 1}`,
          status: 'Disponible',
          show: show
        }))
      }
    }  
    await em.persistAndFlush(seats);
  
  } catch (error) {
    console.error("Error creating seats:", error);
  }
}

export { sanitizeShowInput, sanitizeShowInputToFindByCinemaAndMovie, findAll, findOne, add,findByCinemaAndMovie, findAllByCinema, update, remove }