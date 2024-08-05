import { Request, Response, NextFunction } from 'express';
import { User } from './user.entity.js';
import { orm } from '../shared/db/orm.js';


const em = orm.em
function sanitizeGenreInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
      name: req.body.name
      dni: req.body.dni,
      apellido: req.body.apellido,
      email: req.body.email,
      password: req.body.password,
      type: req.body.type,
      

      
    }
