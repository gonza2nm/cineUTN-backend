import { Request, Response, NextFunction } from 'express';
import { Cinema } from './cinema.entity.js';
import { orm } from '../shared/db/orm.js';

const em = orm.em;

function sanitizeCinemaInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    name: req.body.name,
    address: req.body.address,
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
    const cinemas = await em.find(Cinema, {});
    res.status(200).json({ message: 'found all cinemas', data: cinemas });
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while querying all cinemas',
      error: error.message,
    });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const cinema = await em.findOneOrFail(Cinema, { id }); //probar el manejo de erroes con el metodo finOne()
    res.status(200).json({ message: 'found cinema', data: cinema });
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while querying the data',
      error: error.message,
    });
  }
}

async function add(req: Request, res: Response) {
  try {
    const cinema = em.create(Cinema, req.body.sanitizedInput);
    await em.flush();
    res.status(201).json({ message: 'cinema created', data: cinema });
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while adding the data',
      error: error.message,
    });
  }
}

async function update(req: Request, res: Response) {
  res.status(500).json({ message: 'Not implemented' });
}

async function remove(req: Request, res: Response) {
  res.status(500).json({ message: 'Not implemented' });
}

export { sanitizeCinemaInput, findAll, findOne, add, update, remove };
