import { Request, Response, NextFunction } from 'express';
import { User } from './user.entity.js';
import { orm } from '../shared/db/orm.js';

//findOne an update reciben dni y remove el id por la implementacion de getreference
const em = orm.em;
//aca hago la comprobacion para limpiar el input de que si no es manager no puede asociarse a un cine
function sanitizeUserInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    name: req.body.name,
    dni: req.body.dni,
    surname: req.body.surname,
    email: req.body.email,
    password: req.body.password,
    type: req.body.type,
    cinema: req.body.cinema,
  };
  if (req.body.sanitizedInput['type'] !== 'manager') {
    delete req.body.sanitizedInput['cinema'];
  }
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });
  next();
}

async function add(req: Request, res: Response) {
  try {
    let message = 'user created';
    if (req.body.cinema !== undefined && req.body.type === 'user') {
      message +=
        ', but this user does not have permissions to associate with a cinema as a manager';
    } else if (req.body.type === 'manager' && req.body.cinema === undefined) {
      throw new Error('A manager must be associated with a cinema');
    }
    const user = em.create(User, req.body.sanitizedInput);
    await em.flush();
    res.status(201).json({ message: message, data: user });
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while adding the user',
      error: error.message,
    });
  }
}

async function findAll(req: Request, res: Response) {
  try {
    const users = await em.find(User, {});
    res.status(200).json({ message: 'found all users', data: users });
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while finding all the users',
      error: error.message,
    });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const user = await em.findOneOrFail(User, req.body.sanitizedInput, { populate: ['buys'] });
    if (!user) {
      res.status(404).json({ message: 'user not found' });
    } else {
      res.status(200).json({ message: 'found user', data: user });
    }
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while querying the user',
      error: error.message,
    });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const userToUpdate = await em.findOne(User, { id });
    if (userToUpdate === null) {
      res.status(404).json({ message: 'user not found to update' });
    } else {
      em.assign(userToUpdate, req.body.sanitizedInput);
      await em.flush();
      res.status(200).json({
        message: 'user updated',
        data: userToUpdate,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while updating the user',
      error: error.message,
    });
  }
}

//por id 
async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const user = await em.findOne(User, { id });
    if (!user) {
      return res.status(404).json({
        message: 'user not found to delete.',
      });
    } else {
      await em.removeAndFlush(user);
      res.status(200).json({ data: user, message: 'user deleted' });
    }
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while deleting the user',
      error: error.message,
    });
  }
}

export { sanitizeUserInput, findAll, findOne, add, update, remove };
