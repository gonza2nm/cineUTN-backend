import { NextFunction, Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Snack } from "../snack/snack.entity.js";

const em = orm.em;

function sanitizeSanckInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    name: req.body.name,
    description: req.body.description,
    urlPhoto: req.body.urlPhoto,
    price: req.body.price,
    promotions: req.body.promotions,
    buys: req.body.buys
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });

  console.log('Datos del snack', req.body.sanitizedInput)
  next();
}
async function findAll(req: Request, res: Response) {
  try {
    const snacks = await em.find(Snack, {});
    res.status(200).json({ message: 'found all snacks', data: snacks });
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while querying all snacks',
      error: error.message,
    });
  }
}
async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const snack = await em.findOne(Snack, { id },)
    if (snack === null) {
      res.status(404).json({ message: 'snack not found', data: null })
    } else {
      res.status(200).json({ message: 'found snack', data: snack })
    }
  } catch (error: any) {
    res.status(500).json({ message: 'An error occurred while finding the snack', error: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const snack = em.create(Snack, req.body.sanitizedInput)
    await em.flush();
    res.status(201).json({ message: 'Snack created', data: snack })
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while adding the snack',
      error: error.message
    })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const snackToUpdate = await em.findOne(Snack, { id });
    if (snackToUpdate) {
      em.assign(snackToUpdate, req.body.sanitizedInput);
      await em.flush();
      res.status(200).json({
        message: "Snack updated successfully",
        data: snackToUpdate
      });
    } else {
      res.status(404).json({
        message: "Snack not found",
        error: "Not found"
      })
    }
  } catch (error: any) {
    res.status(500).json({
      message: "An error ocurred while updating the snack",
      error: error.message
    })
  }
}
async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const snackToDelete = await em.findOne(Snack, { id });
    if (snackToDelete) {
      await em.removeAndFlush(snackToDelete)
      res.status(200).json({
        message: "Snack deleted",
        data: snackToDelete
      });
    } else {
      res.status(404).json({
        message: "Snack not found",
        error: "Not found"
      })
    }
  } catch (error: any) {
    res.status(500).json({
      message: "An error ocurred while deleting the snack",
      error: error.message
    })
  }
}
export { sanitizeSanckInput, findAll, findOne, add, update, remove }