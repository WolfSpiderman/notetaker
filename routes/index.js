const express = require('express');
const bodyParser = require('body-parser');

const notesRouter = require('./notes');

const app = express();

app.use('/notes', notesRouter);

module.exports = app;