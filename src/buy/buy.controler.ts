import { Request, Response, NextFunction } from "express"
import { Buy } from "./buy.entity.js"
import { orm } from '../shared/db/orm.js'
import { Ticket } from "../ticket/ticket.entity.js";
import { Snack } from "../snack/snack.entity.js";
import jwt from 'jsonwebtoken';
import QRCode from 'qrcode';
import { Promotion } from "../promotion/promotion.entity.js";
import { generateQRCode } from "../utils/qrCodeGenerator.js";
import { Seat } from "../seat/seat.entity.js";
import { SnackBuy } from "../intermediate-tables/snack-buy.entity.js";
import { PromotionBuy } from "../intermediate-tables/promotion-buy.entity.js";


const em = orm.em

function sanitizeBuyInput(req: Request, res: Response, next: NextFunction) {
  const snacks = req.body.snacks;
  const promos = req.body.promotions;
  const seats = req.body.seats;
  req.body.sanitizedBuyInput = {
    description: req.body.description,
    user: req.body.user,
    total: req.body.total,
    status: req.body.status,
  }
  Object.keys(req.body.sanitizedBuyInput).forEach((key) => {
    if (req.body.sanitizedBuyInput[key] === undefined) {
      delete req.body.sanitizedBuyInput[key]
    }
  })

  req.body.snacks = snacks;
  req.body.promotions = promos;
  req.body.seats = seats
  next()
}

async function findAll(req: Request, res: Response) {
  try {
    const buys = await em.find(Buy, {}, { populate: ['user', 'tickets'] });
    res.status(200).json({ message: 'Found all buys', data: buys })
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while querying all buys',
      error: error.message,
    })
  }
}

async function findAllpurchasebyUser(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    await updateExpirateBuys();

    const buys = await em.find(Buy, { user: id }, { populate: ['user'] });
    res.status(200).json({ message: 'found all buys', data: buys });

  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while finding all the buys',
      error: error.message,
    });
  }
}


async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const buy = await em.findOneOrFail(Buy, { id }, { populate: ['tickets.show.movie', 'tickets.show.format', 'tickets.show.language', 'tickets.seat', 'snacksBuy.snack', 'promotionsBuy.promotion'] });
    res.status(200).json({ message: 'Found buy', data: buy })
  } catch (error: any) {
    res.status(500).json({ message: 'An error occurred while querying the buy', error: error.message, })
  }
}

async function generateQRCodeForBuy(req: Request, res: Response) {
  try {
    const buyId = Number(req.params.id);

    // Busco la compra en la base de datos
    const buy = await em.findOne(Buy, { id: buyId });
    if (!buy) {
      return res.status(404).json({ message: 'Buy not found' });
    }

    // Creo el código QR 
    const qrCodeUrl = await generateQRCode(buyId);

    return res.status(200).json({
      message: 'QR code generated successfully',
      qrCodeUrl,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: 'An error occurred while generating the QR',
      error: error.message,
    });
  }
}

async function validateQRCode(req: Request, res: Response) {
  const token = req.body.token;

  try {
    const JWT_SECRET = process.env.JWT_SECRET

    if (!JWT_SECRET) {//para que no moleste mas abajo por ser undefied
      return res.status(500).json({ message: "QR secret key is not configured in the environment." });
    }
    //  actualizamos compras expiradas antes de validar el QR
    await updateExpirateBuys();

    // Verificar el token con la clave secreta
    const decoded: any = jwt.verify(token, JWT_SECRET); // `decoded` contiene el `buyId`

    const buyId = decoded.buyId;

    // Buscar la compra en la base de datos
    const buy = await em.findOne(Buy, { id: buyId }, {
      populate: ['tickets.show.movie', 'tickets.show.theater.cinema', 'snacksBuy.snack', 'promotionsBuy.promotion']
    }); //estos tickets.XXX tambien traen las relaciones superiores, ej: tickets.show.movie me trae tickets y show
    if (!buy) {
      return res.status(404).json({ message: 'Buy not found.' });
    }

    // Verificar si la compra está cancelada
    if (buy.status === 'cancelado') {
      return res.status(400).json({ message: 'The buy has been cancelled.' });
    }

    // Si todo está bien, el QR es válido
    return res.status(200).json({ message: 'QR is valid.', data: buy });

  } catch (error: any) {
    return res.status(400).json({ message: 'Invalid or expired token.', error: error.message });
  }
}

/*por problemas al eliminar el usuario y no perder las compras, 
permito poner nulo el userId pero al crearlo debe tenerlo si o si*/
async function add(req: Request, res: Response) {
  try {
    if (req.body.sanitizedBuyInput["user"] === undefined) {
      throw new Error("the buy must have an user");
    }
    const buy = em.create(Buy, req.body.sanitizedBuyInput)
    await em.flush()
    res.status(201).json({ message: 'Buy created', data: buy })
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while adding the buy',
      error: error.message,
    })
  }
}


async function addPurchase(req: Request, res: Response) {
  try {
    const buy = await em.transactional(async (em) => {

      if (req.body.sanitizedBuyInput["user"] === undefined) {
        throw new Error("the buy must have an user");
      }
      const buy = em.create(Buy, req.body.sanitizedBuyInput);
      buy.status = 'Válida';
      await em.flush();

      const buyId = buy.id;
      req.body.sanitizedTicketInput.buy = buyId;

      const tickets = [];

      if (req.body.sanitizedBuyInput.description === 'Compra de entradas') {

        for (const seat of req.body.seats) {

          //Crea los tickets 
          const ticket = em.create(Ticket, req.body.sanitizedTicketInput);
          ticket.seat = seat
          tickets.push(ticket)

          //Actualiza el estado del asiento
          const seattoupdate = await em.findOneOrFail(Seat, { id: seat.id })
          seattoupdate.status = 'Ocupado';
        }

        await em.persistAndFlush(tickets);

      } else {
        throw new Error('Hubo un error al hacer la compra.');
      }

      if (req.body.snacks) {
        for (const snackData of req.body.snacks) {
          const snackRef = em.getReference(Snack, snackData.id);
          const snackBuy = em.create(SnackBuy, {
            buy: buy,
            snack: snackRef,
            quantity: snackData.cant
          });

          em.persist(snackBuy);
        }
      }

      if (req.body.promotions) {
        for (const promotionData of req.body.promotions) {
          const promotionRef = em.getReference(Promotion, promotionData.code);
          const promotionBuy = em.create(PromotionBuy, {
            buy: buy,
            promotion: promotionRef,
            quantity: promotionData.cant
          });

          em.persist(promotionBuy);
        }
      }


      await em.flush();
      return buy;
    })

    res.status(200).json({ message: 'Buy and Tickets created', data: buy });

  } catch (error:any) {
    console.error('Error en la transacción:', error);
    res.status(500).send({ message: 'Error al crear la compra y las entradas', error: error.message});
  }
}



async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const buyToUpdate = await em.findOneOrFail(Buy, { id })
    em.assign(buyToUpdate, req.body.sanitizedBuyInput)
    await em.flush()
    res.status(200).json({ message: 'Buy updated', data: buyToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}



async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const buy = await em.findOne(Buy, { id });
    if (buy === null) {
      res.status(404).json({ message: 'Buy not found for deletion.' });
    } else {
      await em.removeAndFlush(buy);
      res.status(200).send({ data: buy, message: 'Buy deleted' });
    }
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while deleting the buy',
      error: error.message,
    });
  }
}


async function updateExpirateBuys() {
  const today = new Date();
  const buysToExpire = await em.find(Buy, {
    status: 'Válida',
    tickets: {
      show: {
        finishTime: { $lt: today }
      }
    }
  });

  for (const buy of buysToExpire) {
    buy.status = 'Expirada';
  }

  await em.flush();
}



export { sanitizeBuyInput, findAll, findOne, add, update, remove, findAllpurchasebyUser, addPurchase, generateQRCodeForBuy, validateQRCode }
