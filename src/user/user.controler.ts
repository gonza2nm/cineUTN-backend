import { Request, Response, NextFunction } from "express"
import { User } from "./user.entity.js"
import { orm } from '../shared/db/orm.js'


const em = orm.em

function sanitizeUserInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
      name: req.body.name,
      dni: req.body.dni,
      apellido: req.body.apellido,
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
    const { name, dni, apellido, email, password, type } = req.body.sanitizedInput;

    try {
        const user = new User(name, dni, apellido, email, type); 
        user.password = password;
        user.type = type;

        await em.persistAndFlush(user);
        res.status(201).json(user);
    } catch (error: any) {
        res.status(500).json({
            message: 'Error al crear usuario',
            error: error.message,
        });
    }
}

   async function findAll(req: Request, res: Response) {
      try {
          const users = await em.find(User, {});
          res.status(200).json(users);
        } catch (error: any) {
          res.status(500).json({
            message: 'Error al obtener usuarios',
            error: error.message,
          });
        }
    }
    
  

 async function findOne(req: Request, res: Response) {
  const userDni = req.params.userdni; 

  try {
      
      const user = await em.findOne(User, { dni: userDni });
      if (!user) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.status(200).json(user);
  } catch (error: any) {
      res.status(500).json({
          message: 'Error al obtener el usuario',
          error: error.message,
      });
  }
}
    
  
  async function update(req: Request, res: Response) {
      const userDni = req.params.dni;
      const { name, dni, apellido, email, password, type } = req.body.sanitizedInput;
  
      try {
          const user = await em.findOne(User, { dni: userDni });
          if (!user) {
              return res.status(404).json({ message: 'Usuario no encontrado' });
          }
          await em.flush();
          res.status(200).json(user);
        } catch (error: any) {
          res.status(500).json({
            message: 'Error al actualizar usuario',
            error: error.message,
          });
        }
    }
    
  

 async function remove(req: Request, res: Response) {
      const userDni = req.params.dni;
  
      try {
          const user = await em.findOne(User, { dni: userDni});
          if (!user) {
              return res.status(404).json({ message: 'Usuario no encontrado' });
          }
  
          await em.removeAndFlush(user);
          res.status(200).json({ message: 'Usuario eliminado correctamente' });
        } catch (error: any) {
          res.status(500).json({
            message: 'Error al eliminar usuario',
            error: error.message,
          });
        }
    } 
    export { sanitizeUserInput, findAll, findOne, add, update, remove };