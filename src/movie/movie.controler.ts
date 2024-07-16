import { Request, Response, NextFunction, } from "express";
import { Movie } from "./movie.entity.js";
import { orm } from "../shared/db/orm.js";

const em = orm.em

function sanitizeMovieInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    name: req.body.name,
    description: req.body.description,
    format: req.body.format
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
    const movies = await em.find(Movie, {})
    res.status(200).json({ message: 'found all movies', data: movies })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.body.id)
    const movie = await em.findOneOrFail(Movie, { id })
    res.status(200).json({ message: 'movie found', data: movie })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const movie = em.create(Movie, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'movie created', data: movie })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const movieToUpdate = await em.findOneOrFail(Movie, { id })
    em.assign(movieToUpdate, req.body.sanitizedInput)
    await em.flush()
    res.status(200).json({ message: 'movie updated', data: movieToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

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

export { sanitizeMovieInput, findAll, findOne, add, update, remove }