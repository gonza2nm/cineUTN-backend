import { Request, Response, NextFunction } from "express"
import { Buy } from "./buy.entity.js"
import { orm } from '../shared/db/orm.js'
import jwt from 'jsonwebtoken';
import QRCode from 'qrcode';


const em = orm.em

function sanitizeBuyInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    description: req.body.description,
    user: req.body.user,
    total: req.body.total,
    status: req.body.status
  }
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}

function generateSignedToken(buyId: number): string {
  const buyDataQR = { //datos que voy a encriptar
    buyId,
    timestamp: Date.now(),
  };

  return jwt.sign(
    buyDataQR,
    process.env.JWT_SECRETQR as string,
    { expiresIn: process.env.JWT_EXPIRESINQR });
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
    const buys = await em.find(Buy, req.body.sanitizedInput, { populate: ['user'] });
    res.status(200).json({ message: 'found all tickets', data: buys });
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while finding all the tickets',
      error: error.message,
    });
  }
}


async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const buy = await em.findOneOrFail(Buy, { id }, { populate: ['user', 'tickets'] });
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

    // Genero el token JWT firmado
    const signedToken = generateSignedToken(buyId);

    // Creo el código QR usando el token firmado
    const qrCodeUrl = await QRCode.toDataURL(signedToken);

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
    const JWT_SECRETQR = process.env.JWT_SECRETQR

    if (!JWT_SECRETQR) {//para que no moleste mas abajo por ser undefied
      return res.status(500).json({ message: "QR secret key is not configured in the environment." });
    }
    // Verificar el token con la clave secreta
    const decoded: any = jwt.verify(token, JWT_SECRETQR); // `decoded` contiene el `buyId` y el timestamp

    const buyId = decoded.buyId;

    // Buscar la compra en la base de datos
    const buy = await em.findOne(Buy, { id: buyId });
    if (!buy) {
      return res.status(404).json({ message: 'Buy not found.' });
    }

    // Verificar si la compra está cancelada
    if (buy.status === 'cancelled') {
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
    if (req.body.sanitizedInput["user"] === undefined) {
      throw new Error("the buy must have an user");
    }
    const buy = em.create(Buy, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'Buy created', data: buy })
  } catch (error: any) {
    res.status(500).json({
      message: 'An error occurred while adding the buy',
      error: error.message,
    })
  }
}


async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const buyToUpdate = await em.findOneOrFail(Buy, { id })
    em.assign(buyToUpdate, req.body.sanitizedInput)
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




export { sanitizeBuyInput, findAll, findOne, add, update, remove, findAllpurchasebyUser, generateQRCodeForBuy, validateQRCode }