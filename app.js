const express = require('express');
const app = express();

app.use(express.json());

const apiRouter = require('./routes/apiRouter');

app.use('/api', apiRouter);

app.all('/*', (req, res, next) => {
  res.status(404).send({ msg: 'path not found' });
});

module.exports = app;
