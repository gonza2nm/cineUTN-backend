import { Request, Response, NextFunction } from "express"
import { GenreRepository } from "./genre.repository.js"
import { Genre } from "./genre.entity.js"


const repository = new GenreRepository()

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

function findAll(req: Request, res: Response) {
  res.json({ data: repository.findAll() })
}

function findOne(req: Request, res: Response) {
  const id = req.params.id
  const genre = repository.findOne({ id })
  if (!genre) {
    return res.status(404).send({ message: 'genre not found' })
  }
  res.json({ data: genre })
}


function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput

  const genreInput = new Genre(
    input.name
  )

  const genre = repository.add(genreInput)
  return res.status(201).send({ message: 'genre created', data: genre })
}

function update(req: Request, res: Response) {
  req.body.sanitizedInput.id = req.params.id
  const genre = repository.update(req.body.sanitizedInput)

  if (!genre) {
    return res.status(404).send({ message: 'genre not found' })
  }

  return res.status(200).send({ message: 'genre updated successfully', data: genre })
}


function remove(req: Request, res: Response) {
  const id = req.params.id
  const genre = repository.delete({ id })

  if (!genre) {
    res.status(404).send({ message: 'genre not found' })
  } else {
    res.status(200).send({ message: 'genre deleted successfully' })
  }
}




export { sanitizeGenreInput, findAll, findOne, add, update, remove }