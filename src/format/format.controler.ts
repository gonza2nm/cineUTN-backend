import { Request, Response, NextFunction } from "express"
import { Format } from "./format.entity.js"
import { orm } from '../shared/db/orm.js'

const em = orm.em

function sanitizeFormatInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    formatName: req.body.formatName
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
    const formats = await em.find(Format, {},)
    res.status(200).json({ message: 'found all formats', data: formats })
  } catch (error: any) {
    res.status(500).json({ message: 'An error occurred while finding all the formats', error: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const format = await em.findOneOrFail(Format, { id },)
    res.status(200).json({ message: 'found format', data: format })
  } catch (error: any) {
    res.status(500).json({ message: 'An error occurred while finding the format', error: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const format = em.create(Format, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'format created', data: format })
  } catch (error: any) {
    res.status(500).json({ message: 'An error occurred while adding the format', error: error.message })
  }
}


async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const format = await em.findOne(Format, { id })
    if (!format) { //verifica si es null o undefined
      res.status(404).json({ message: 'format not found for deletion.' })
    } else {
      await em.removeAndFlush(format)
      res.status(200).json({ data: format, message: 'format deleted' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'An error occurred while deleting the format', error: error.message })
  }
}

export { sanitizeFormatInput, findAll, findOne, add, remove }
