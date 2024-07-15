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
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const genre = await em.findOneOrFail(Genre, { id },)
    res.status(200).json({ message: 'found genre', data: genre })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const genre = em.create(Genre, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'genre created', data: genre })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
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
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const genreToDelete = em.getReference(Genre, id)// no realiza una consulta inmediata a la base de datos.En su lugar, devuelve una instancia de la entidad que puede utilizarse para realizar operaciones como la eliminación.
    await em.removeAndFlush(genreToDelete)
    res.status(200).send({ message: 'genre deleted' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { sanitizeGenreInput, findAll, findOne, add, update, remove }
