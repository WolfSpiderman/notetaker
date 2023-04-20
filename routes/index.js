const express = require('express');

// Import the router for notes
const notesRouter = require('./notes');

const app = express();

// Use the notes router at the /notes endpoint
app.use('/notes', notesRouter);

module.exports = app;
