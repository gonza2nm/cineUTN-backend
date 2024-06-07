import express from 'express';
import { genreRouter } from './genre/genre.routes.js';
const app = express();
app.use(express.json());
app.use('/api/genres', genreRouter);
app.use((_, res) => {
    return res.status(404).send({ message: 'Resource not found' });
});
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000/');
});
// 0 Sacarle la mayuscula a Genre.ts y eliminar carpeta clases?
// 1 crear shared + repository.ts
// 2 crear genre.entity.ts
// 3 crear genre.repository.ts
// 4 crear genre.controler.ts
// 5 crear genre.routes.ts
// 6 modificar app.ts
// 7 crear genres.http
//# sourceMappingURL=app.js.map