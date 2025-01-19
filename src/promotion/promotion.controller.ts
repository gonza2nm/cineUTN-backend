import { NextFunction, Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Promotion } from "./promotion.entity.js";
import { customAlphabet, nanoid } from "nanoid";
import { Cinema } from "../cinema/cinema.entity.js";

const em = orm.em;
const alfabeto = "ABCDEFGHRTJKPQWZMUXVY123456789"

function sanitizePromotionInput(req: Request, res: Response, next: NextFunction){
  req.body.sanitizedInput = {
    name: req.body.name,
    description: req.body.description,
    promotionStartDate: req.body.promotionStartDate,
    promotionFinishDate: req.body.promotionFinishDate,
    discount: req.body.discount,
    cinemas: req.body.cinemas,
    snacks : req.body.snacks
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if(req.body.sanitizedInput[key] === undefined){
      delete req.body.sanitizedInput[key];
    }
  });
  next();
}

async function findAll(req: Request, res: Response){
  try {
    const promotions = await em.find(Promotion, {});
    res.status(200).json({ message: 'found all promotions', data: promotions });
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while querying all promotions',
      error: error.message,
    });
  }
}

async function findAllByCinema (req: Request, res: Response){
  try{
    const cinemaId = Number.parseInt(req.params.cid);
    const cinema = await em.findOne(Cinema, {id : cinemaId},{populate: ["promotions"]});
    if(!cinema){
      res.status(404).json({
        message: "Promotions by cinema not found",
        error: "Cinema not found"
      })
    }else{
      const promotions = cinema.promotions.getItems();
      if(promotions.length > 0){
        res.status(200).json({
          data: promotions,
          message: "This cinema has these promotions"
        })
      }else{
        res.status(200).json({
          data: promotions,
          message: "This cinema hasn't promotions at the moment"
        })  
      }
    }
  }catch(error: any){
    res.status(500).json({
      message: "An error ocurred while querying promotions by cinema",
      error: error.message
    });
  }
}

async function findOne(req: Request, res: Response){
  try {
    const code = req.params.code;
    const promotion = await em.findOne(Promotion, { code },)
    if(promotion === null){
      res.status(404).json({ message: 'promotion not found', data: null })
    }else{
      res.status(200).json({ message: 'found promotion', data: promotion })
    }
  } catch (error: any) {
    res.status(500).json({ message: 'An error occurred while finding the promotion', error: error.message })
  }
}

async function add(req: Request, res: Response){
  try{
    const generarCodigoUnico = customAlphabet(alfabeto, 8);
    const code = generarCodigoUnico();
    const promotion = em.create(Promotion, {
      ...req.body.sanitizedInput, 
      code
    });
    await em.flush();
    res.status(201).json({ message: 'Promotion created', data: promotion })
  }catch(error : any){
    res.status(500).json({
      message: 'An error occurred while adding the promotion',
      error: error.message
    })
  }
}

async function update(req: Request, res: Response){
  try{
    const code = req.params.code;
    const snackToUpdate = await em.findOne(Promotion, { code });
    if(snackToUpdate){
      em.assign(snackToUpdate, req.body.sanitizedInput);
      await em.flush();
      res.status(200).json({
        message: "Promotion updated successfully",
        data: snackToUpdate
      });
    }else{
      res.status(404).json({
        message: "Promotion not found",
        error: "Not found"
      })
    }
  }catch(error: any){
    res.status(500).json({
      message: "An error ocurred while updating the promotion",
      error: error.message
    })
  }
}

async function remove(req: Request, res: Response){
  try{
    const code = req.params.code;
    const snackToDelete = await em.findOne(Promotion, { code });
    if(snackToDelete){
      await em.removeAndFlush(snackToDelete)
      res.status(200).json({
        message: "Promotion deleted",
        data: snackToDelete
      });
    }else{
      res.status(404).json({
        message: "Promotion not found",
        error: "Not found"
      })
    }
  }catch(error: any){
    res.status(500).json({
      message: "An error ocurred while deleting the promotion",
      error : error.message
    })
  }
}
export{sanitizePromotionInput, findAll, findAllByCinema, findOne, add, update, remove}