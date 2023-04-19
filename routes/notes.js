const notes = require('express').Router();
const { readFromFile, readAndAppend } = require('../helpers/fsUtils');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');


notes.use(bodyParser.json());

notes.get('/', (req, res) => {
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

notes.post('/', (req, res) => {
  console.log(req.body);

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

    readAndAppend(newNote, './db/db.json');
    res.json(`Note added successfully 🚀`);
  } else {
    res.error('Error in adding note');
  }
});

notes.delete('/:id', (req, res) => {
  const idToDelete = req.params.id;

  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((notes) => {
      // Find the note with the given ID
      const noteIndex = notes.findIndex((note) => note.id === idToDelete);

      if (noteIndex === -1) {
        // If the note is not found, return a 404 response
        res.status(404).send('Note not found');
      } else {
        // Otherwise, delete the note from the array and write the updated notes to the file
        notes.splice(noteIndex, 1);
        fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
          if (err) {
            res.status(500).send('Error writing to file');
          } else {
            res.send('Note deleted successfully');
          }
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error reading file');
    });
});


module.exports = notes;
