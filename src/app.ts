import express from 'express';
import { genreRouter } from './genre/genre.routes.js'
import 'reflect-metadata'
import { orm, syncSchema } from './shared/db/orm.js'
import { RequestContext } from '@mikro-orm/core'

const app = express();
app.use(express.json())

app.use((req, res, next) => {
  RequestContext.create(orm.em, next)
})

app.use('/api/genres', genreRouter)

app.use((_, res) => {
  return res.status(404).send({ message: 'Resource not found' })
})

await syncSchema() //never in production

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000/')
});


// 0 Sacarle la mayuscula a Genre.ts y eliminar carpeta clases?
// 1 crear shared + repository.ts
// 2 crear genre.entity.ts
// 3 crear genre.repository.ts
// 4 crear genre.controler.ts
// 5 crear genre.routes.ts
// 6 modificar app.ts
// 7 crear genres.http
//8