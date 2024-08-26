import 'reflect-metadata';
import express from 'express';
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
import cors from 'cors';
const app = express();
app.use(express.json());
app.use(cors({
    origin: (origin, callback) => {
        const ACCEPTED_ORIGINS = ['http://localhost:4200'];
        if (!origin) {
            return callback(null, false);
        }
        else if (ACCEPTED_ORIGINS.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('not allowed by cors'));
    },
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
app.use((_, res) => {
    return res.status(404).send({ message: 'Resource not found' });
});
await syncSchema(); //never in production
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000/');
});
//# sourceMappingURL=app.js.map