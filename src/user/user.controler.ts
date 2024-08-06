import { Request, Response, NextFunction } from "express"
import { User } from "./user.entity.js"
import { orm } from '../shared/db/orm.js'


const em = orm.em

function sanitizeUserInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    name: req.body.name,
    dni: req.body.dni,
    surname: req.body.surname,
    email: req.body.email,
    password: req.body.password,
    type: req.body.type,  
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
    const user = em.create(User, req.body.sanitizedInput);
    await em.flush();
    res.status(201).json({ message: 'user created', data: user });
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
      error: error.message 
    });
  }
}
    
async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const user = await em.findOneOrFail(User, { id });
    if(!user){
      res.status(404).json({ message: 'user not found' });  
    } else{
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
    const id = Number.parseInt(req.params.id);
    const userToUpdate = await em.findOne(User, { id });
    if (userToUpdate === null) {
      res.status(404).json({ message: 'user not found to update' });
    } else {
      em.assign(userToUpdate, req.body.sanitizedInput);
      await em.flush();
      res.status(200).json({ 
        message: 'user updated', 
        data: userToUpdate 
      });
    }
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while updating the user',
      error: error.message,
    });
  }
}
    
  
async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const userToRemove = await em.getReference(User, id);
    const user = await em.findOne(User, {id});
    if (!user) {
      return res.status(404).json({ 
        message: 'user not found to delete.' 
      });
    } else {
      await em.removeAndFlush(userToRemove);
      res.status(200).json({ message: 'user deleted' });
    }
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while deleting the user',
      error: error.message,
    });
  }
}
 
export { sanitizeUserInput, findAll, findOne, add, update, remove };