import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import { orm, syncSchema } from './shared/db/orm.js';
import { RequestContext } from '@mikro-orm/core';
import { genreRouter } from './genre/genre.routes.js';
import { cinemaRouter } from './cinema/cinema.routes.js';
import { theaterRouter } from './theater/theater.routes.js';
import { movieRouter } from './movie/movie.routes.js';
import { buyRouter } from './buy/buy.routes.js';
import { showRouter } from './show/show.routes.js';
import { userRouter } from './user/user.routes.js';
import { ticketRouter } from './ticket/ticket.routes.js';
import { formatRouter } from './format/format.routes.js';
import { languageRouter } from './language/language.routes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { eventRouter } from './event/event.routes.js';
import { snackRouter } from './snack/snack.routes.js';
import { promotionRouter } from './promotion/promotion.routes.js';
import { startCronTimeJobs } from './utils/timeReminders.js';
import { seatRouter } from './seat/seat.router.js';
dotenv.config(); // carga las variables de entorno definidas en .env
const app = express();
app.use(express.json());
app.use(cookieParser()); //para poder manejar las cookies en el back
app.use(cors({
    origin: ['http://localhost:4200', "http://localhost:3001", 'https://cineutn.vercel.app', 'https://cine-utn-frontend-deploy.vercel.app'],
    credentials: true
}));
app.use((req, res, next) => {
    RequestContext.create(orm.em, next);
});
app.use('/api/genres', genreRouter);
app.use('/api/cinemas', cinemaRouter);
app.use('/api/theaters', theaterRouter);
app.use('/api/movies', movieRouter);
app.use('/api/buys', buyRouter);
app.use('/api/shows', showRouter);
app.use('/api/users', userRouter);
app.use('/api/tickets', ticketRouter);
app.use('/api/formats', formatRouter);
app.use('/api/languages', languageRouter);
app.use('/api/events', eventRouter);
app.use('/api/snacks', snackRouter);
app.use('/api/promotions', promotionRouter);
app.use('/api/seats', seatRouter);
app.use((_, res) => {
    return res.status(404).send({ message: 'Resource not found' });
});
await syncSchema(); //never in production
startCronTimeJobs(); //empieza todo lo relacionado a cron (cosas por tiempo, ej: email)
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000/');
});
//# sourceMappingURL=app.js.map