import { Request, Response, NextFunction } from 'express';
import { Theater } from './theater.entity.js';
import { orm } from '../shared/db/orm.js';

const em = orm.em;

function sanitizeTheaterInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    numChairs: req.body.numChairs,
    cinema: req.body.cinema,
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
    const theaters = await em.find(Theater, {});
    res.status(200).json({ message: 'found all cinemas', data: theaters }); //no seria "found all  theaters?"
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while querying all theaters',
      error: error.message,
    });
  }
}
async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const theater = await em.findOne(Theater, { id });
    if (theater === null) {
      res.status(404).json({ message: 'theater not found' });
    } else {
      res.status(200).json({ message: 'found theater', data: theater });
    }
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while querying the theater',
      error: error.message,
    });
  }
}

async function add(req: Request, res: Response) {
  try {
    const theater = em.create(Theater, req.body.sanitizedInput);
    await em.flush();
    res.status(201).json({ message: 'theater created', data: theater });
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while adding the data',
      error: error.message,
    });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const { numChairs, cinema } = req.body;
    console.log(`numero de sillas${numChairs}, id de cine: ${cinema}`);
    const theaterToUpdate = await em.findOne(Theater, { id });
    if (!theaterToUpdate) {
      res.status(404).json({ message: 'Theater not found' });
    } else {
      if (numChairs !== undefined) {
        theaterToUpdate.numChairs = numChairs;
      }
      if (cinema !== undefined) {
        //no permito asignar la sala a otro cine
        theaterToUpdate.cinema = theaterToUpdate.cinema;
      }
      await em.flush();
      res
        .status(200)
        .json({ message: 'theater updated', data: theaterToUpdate });
    }
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while updating the theater',
      error: error.message,
    });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const theaterToRemove = em.getReference(Theater, id);
    const theater = await em.findOne(Theater, { id });
    if (theater === null) {
      res.status(404).json({ message: 'theater not found for deletion.' });
    } else {
      await em.removeAndFlush(theaterToRemove);
      res.status(204).send({ message: 'theater deleted' });
    }
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while deleting the theater',
      error: error.message,
    });
  }
}

export { sanitizeTheaterInput, findAll, findOne, add, update, remove };
