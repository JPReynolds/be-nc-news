const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
const apiRouter = require('./routes/apiRouter');
const {
  handleCustomErrors,
  handle400s,
  handle422s,
  handle500s,
} = require('./errors');

app.use(cors());
app.use('/api', apiRouter);

app.all('/*', (req, res, next) => {
  res.status(404).send({ msg: 'path not found' });
});

app.use(handleCustomErrors);
app.use(handle400s);
app.use(handle422s);
app.use(handle500s);

module.exports = app;
