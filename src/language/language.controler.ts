import { Request, Response, NextFunction } from "express"
import { Language } from "./language.entity.js"
import { orm } from '../shared/db/orm.js'

const em = orm.em

function sanitizeLanguageInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    languageName: req.body.languageName
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
    const languages = await em.find(Language, {},)
    res.status(200).json({ message: 'found all languages', data: languages })
  } catch (error: any) {
    res.status(500).json({ message: 'An error occurred while finding all the languages', error: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const language = await em.findOneOrFail(Language, { id },)
    res.status(200).json({ message: 'found language', data: language })
  } catch (error: any) {
    res.status(500).json({ message: 'An error occurred while finding the language', error: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const language = em.create(Language, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'language created', data: language })
  } catch (error: any) {
    res.status(500).json({ message: 'An error occurred while adding the language', error: error.message })
  }
}


async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const language = await em.findOne(Language, { id })
    if (!language) { //verifica si es null o undefined
      res.status(404).json({ message: 'language not found for deletion.' })
    } else {
      await em.removeAndFlush(language)
      res.status(200).json({ data: language, message: 'language deleted' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'An error occurred while deleting the language', error: error.message })
  }
}

export { sanitizeLanguageInput, findAll, findOne, add, remove }
