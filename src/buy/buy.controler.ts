import { Request, Response, NextFunction } from "express"
import { Buy } from "./buy.entity.js"
import { orm } from '../shared/db/orm.js'
import { Ticket } from "../ticket/ticket.entity.js";

const em = orm.em

function sanitizeBuyInput(req: Request, res: Response, next: NextFunction) {
  console.log('Datos recibidos en el buy:', req.body);
  const cantElements = req.body.cantElements;
  req.body.sanitizedBuyInput = {
    description: req.body.description,
    user: req.body.user,
    total: req.body.total,
    status: req.body.status
  }
  Object.keys(req.body.sanitizedBuyInput).forEach((key) => {
    if (req.body.sanitizedBuyInput[key] === undefined) {
      delete req.body.sanitizedBuyInput[key]
    }
  })

  req.body.cantElements = cantElements;
  console.log('Datos del buy', req.body.sanitizedBuyInput)
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
    const buys = await em.find(Buy, req.body.sanitizedBuyInput, { populate: ['user']});
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

//----------------------------------------------------------------------------------------------------------------
async function addPruchase(req: Request, res: Response) {   
  console.log('Estos son los datos de buy', req.body.sanitizedBuyInput)
  console.log('Datos son los datos del ticket', req.body.sanitizedTicketInput);

  await em.begin();

  try {
    if (req.body.sanitizedBuyInput["user"] === undefined) {
      throw new Error("the buy must have an user");
    }
    const buy = em.create(Buy, req.body.sanitizedBuyInput);
    await em.flush();

    const buyId = buy.id;
    req.body.sanitizedTicketInput.buy = buyId;

    console.log('Verifico que ticket tenag todo:', req.body.sanitizedTicketInput)
    console.log('Verifico la propiedad descripcion:', req.body.sanitizedBuyInput.description)

    for (let index = 0; index < req.body.cantElements; index++) {
      if (req.body.sanitizedBuyInput.description === 'Compra de entradas') {
        const ticket = em.create(Ticket, req.body.sanitizedTicketInput);
        await em.persistAndFlush(ticket);
      } else {
        throw new Error('No es una compra de entradas');
      }
    }
    await em.commit(); // Confirmar la transacción
    res.status(200).json({message: 'Buy and Tickets created', data: buy});
  } catch (error) {
    await em.rollback(); // Revertir la transacción en caso de error
    console.error('Error en la transacción:', error);
    res.status(500).send('Error al crear la compra y las entradas');
  }
}

//----------------------------------------------------------------------------------------------------------------


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



export { sanitizeBuyInput, findAll, findOne, add, update, remove, findAllpurchasebyUser , addPruchase}