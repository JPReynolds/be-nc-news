const express = require('express');
const app = express();

app.use(express.json());

const apiRouter = require('./routes/apiRouter');

module.exports = app;
