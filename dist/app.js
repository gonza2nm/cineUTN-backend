import express from 'express';
const app = express();
const user = {
    name: 'gonzalo',
    lastname: 'mansilla',
};
app.use('/', (req, res) => {
    res.json(user);
});
app.listen(3000, () => {
    console.log(`El servidor esta corriendo en http://localhost:3000`);
});
//# sourceMappingURL=app.js.map