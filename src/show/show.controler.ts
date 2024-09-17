import { Request, Response, NextFunction } from "express"
import { Show } from "./show.entity.js"
import { orm } from '../shared/db/orm.js'
import { checkTimeShowInTheater } from "../utils/checkTimeShowInTheater.js"
import { checkLanguageAndFormat } from "../utils/checkLanguageAndFormat.js"

const em = orm.em

function sanitizeShowInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    dayAndTime: req.body.dayAndTime,
    theater: req.body.theater,
    movie: req.body.movie,
    finishTime: req.body.finishTime,
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


async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const show = await em.findOneOrFail(Show, { id }, { populate: ['theater', 'movie'] })
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
    const { dayAndTime, theater, finishTime, movie, format, language } = req.body.sanitizedInput;
    const overlapping = await checkTimeShowInTheater(dayAndTime, finishTime, theater);
    const is_format_languages_ok = await checkLanguageAndFormat(movie, language, format);
    if (overlapping) {
      res.status(400).json({ message: "The show time overlaps with another show in the same theater" })
    } else if (!is_format_languages_ok) {
      res.status(400).json({ message: 'the language or the format do not exist in that movie' })
    } else {
      const show = em.create(Show, req.body.sanitizedInput)
      await em.flush()
      res.status(201).json({ message: 'Show created', data: show })
    }
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while adding the show',
      error: error.message,
    })
  }
}


async function update(req: Request, res: Response) {
  try {
    const { dayAndTime, theater, finishTime, movie, format, language } = req.body.sanitizedInput;
    const id = Number.parseInt(req.params.id)
    const showToUpdate = await em.findOneOrFail(Show, { id })
    if (!req.body.sanitizedInput.movie) {
      res.status(400).json({ message: 'the movie is null or undefined' })
    } else if (!showToUpdate) {
      res.status(404).json({ message: 'Show not found for updating.' });
    } else {
      const overlapping = await checkTimeShowInTheater(dayAndTime, finishTime, theater);
      const is_format_languages_ok = await checkLanguageAndFormat(movie, language, format);
      if (overlapping) {
        res.status(400).json({ message: "The show time overlaps with another show in the same theater" })
      } else if (!is_format_languages_ok) {
        res.status(400).json({ message: 'the language or the format do not exist in that movie' })
      }
      else {
        const show = em.create(Show, req.body.sanitizedInput)
        await em.flush()
        res.status(200).json({ message: 'Show updated', data: show })
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

export { sanitizeShowInput, findAll, findOne, add, update, remove }