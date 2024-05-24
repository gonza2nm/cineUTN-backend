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
    console.log('Server running on http://localhost:3000/');
});
console.log('hello');
//# sourceMappingURL=app.js.map