import { Request, Response, NextFunction } from "express"
import { Genre } from "./genre.entity.js"
import { orm } from '../shared/db/orm.js'

const em = orm.em

function sanitizeGenreInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    name: req.body.name
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
    const genres = await em.find(Genre, {},)
    res.status(200).json({ message: 'found all genres', data: genres })
  } catch (error: any) {
    res.status(500).json({ message: 'An error occurred while finding all the genres', error: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const genre = await em.findOneOrFail(Genre, { id },)
    res.status(200).json({ message: 'found genre', data: genre })
  } catch (error: any) {
    res.status(500).json({ message: 'An error occurred while finding the genre', error: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const genre = em.create(Genre, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'genre created', data: genre })
  } catch (error: any) {
    res.status(500).json({ message: 'An error occurred while adding the genre', error: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const genreToUpdate = await em.findOneOrFail(Genre, { id })//asigna los valores del sanitizedInput al objeto de entidad genreToUpdate
    em.assign(genreToUpdate, req.body.sanitizedInput)
    await em.flush()
    res.status(200).json({ message: 'genre updated', data: genreToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: 'An error occurred while updating the genre', error: error.message })
  }
}
/*
async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const genreToRemove = em.findOneOrFail(Genre, {id})
    await em.removeAndFlush(genreToRemove)
    res.status(200).send({ message: 'genre deleted' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
*/

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const genre = await em.findOne(Genre, { id })
    if (!genre) { //verifica si es null o undefined
      res.status(404).json({ message: 'genre not found for deletion.' })
    } else {
      await em.removeAndFlush(genre)
      res.status(200).json({ data: genre, message: 'genre deleted' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'An error occurred while deleting the genre', error: error.message })
  }
}

export { sanitizeGenreInput, findAll, findOne, add, update, remove }
