import { Request, Response, NextFunction } from 'express';
import { User } from './user.entity.js';
import { orm } from '../shared/db/orm.js';
import { Cinema } from '../cinema/cinema.entity.js';
import jwt from "jsonwebtoken";
import { comparePassword, hashPassword } from '../utils/hashFunctions.js';

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
    buys: req.body.buys
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
    let message = 'User created';
    if (req.body.cinema !== undefined && req.body.type === 'user') {
      message +=
        ', but this user does not have permissions to associate with a cinema as a manager';
    } else if (req.body.type === 'manager' && req.body.cinema === undefined) {
      throw new Error('A manager must be associated with a cinema');
    }

    if (req.body.type === 'manager') {
      req.body.sanitizedInput.cinema = em.getReference(Cinema, req.body.sanitizedInput.cinema)
    }
    const hashedPassword = await hashPassword(req.body.sanitizedInput.password);
    const user = em.create(User, { ...req.body.sanitizedInput, password: hashedPassword });
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
    const userId = Number.parseInt(req.body.sanitizedInput.id)
    const user = await em.findOneOrFail(User, { id: userId }, { populate: ['buys'] });
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

async function findAllManagers(req: Request, res: Response) {
  try {
    const users = await em.find(User, { type: 'manager' });
    res.status(200).json({ message: 'found all managers', data: users });
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while finding all the managers',
      error: error.message,
    });
  }
}
async function findOneManager(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const user = await em.findOneOrFail(User, { id, type: 'manager' }, { populate: ['cinema'] });
    res.status(200).json({ message: 'manager found', data: user });
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while finding the manager',
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
      if (userToUpdate.type === 'manager' && !userToUpdate.cinema) {
        res.status(400).json({ message: 'The manager must be assinged to only one cinema.', error: "Bad Request" });
      } else {
        const hashedPassword = await hashPassword(req.body.sanitizedInput.password);
        em.assign(userToUpdate, { ...req.body.sanitizedInput, password: hashedPassword });
        await em.flush();
        res.status(200).json({
          message: 'user updated',
          data: userToUpdate,
        });
      }
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
        message: 'User not found to delete.',
      });
    } else {
      await em.removeAndFlush(user);
      res.status(200).json({ data: user, message: 'User deleted' });
    }
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while deleting the user',
      error: error.message,
    });
  }
}

async function login(req: Request, res: Response) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await em.findOneOrFail(
      User,
      { email },
    );
    if (!user) {
      res.status(404).json({ message: 'User not found', error: "Not Found" });
    } else {
      const isPasswordCorrect = await comparePassword(password, user.password);
      if (isPasswordCorrect) {
        const token = jwt.sign(
          { id: user.id, role: user.type },
          process.env.JWT_SECRET as string,
          { expiresIn: process.env.JWT_EXPIRESIN }
        );
        //produccion
        /*
        res.cookie("authToken", token, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          maxAge: 1000 * 60 * 60,
          partitioned: true
        })
        */
        //desarrollo
        ///*
        res.cookie("authToken", token, {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          maxAge: 1000 * 60 * 60,
        })
        //*/
        res.status(200).json({ message: 'Found user', data: user, });
      } else {
        res.status(401).json({ message: "Email o contraseña incorrecta", error: "Credenciales incorrectas" });
      }
    }
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while trying to log in',
      error: error.message,
    });
  }
}

async function logout(req: Request, res: Response) {
  try {
    //produccion
    /*
    res.cookie('authToken', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 0,
      partitioned: true
    });
    */
    //desarrollo
    ///*
    res.cookie('authToken', '', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 0,
    });
    //*/
    res.status(200).json({ message: 'Logout exitoso' });
  } catch (error: any) {
    res.status(500).json({
      message: 'Error al realizar el logout',
      error: error.message,
    });
  }
}

async function verifyTokenAndFindData(req: Request, res: Response) {
  try {
    const token = req.cookies.authToken;
    if (!token) {
      return res.status(401).json({ message: 'No token provided', });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number; role: string };

    const user = await em.findOneOrFail(
      User,
      { id: decoded.id },
      { populate: ['buys'] }
    );
    if (!user) {
      res.status(404).json({ message: 'User not found', error: "Not Found" });
    } else {
      res.status(200).json({ message: 'Found user', data: user, });
    }
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while querying the user',
      error: error.message,
    });
  }
}


export { sanitizeUserInput, findAll, findAllManagers, verifyTokenAndFindData, findOneManager, add, update, remove, login, logout, findOne };
