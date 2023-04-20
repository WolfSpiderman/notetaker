const notes = require("express").Router();
const { readFromFile, readAndAppend } = require("../helpers/fsUtils");
const { v4: uuidv4 } = require("uuid");
const bodyParser = require("body-parser");
const fs = require("fs");

notes.use(bodyParser.json());

notes.get("/", (req, res) => {
  readFromFile("./db/db.json")
    .then((data) => res.json(JSON.parse(data)))
    .catch((err) => console.error(err));
});

notes.post("/", (req, res) => {
  if (!req.body) {
    res.status(400).send("Invalid request");
    return;
  }

  const { title, text } = req.body;

  const newNote = {
    title,
    text,
    id: uuidv4(),
  };

  readAndAppend(newNote, "./db/db.json")
    .then(() => res.json(`Note added successfully 🚀`))
    .catch((err) => console.error(err));
});

notes.delete("/:id", (req, res) => {
  const idToDelete = req.params.id;

  readFromFile("./db/db.json")
    .then((data) => JSON.parse(data))
    .then((notes) => {
      const noteIndex = notes.findIndex((note) => note.id === idToDelete);

      if (noteIndex === -1) {
        res.status(404).send("Note not found");
      } else {
        notes.splice(noteIndex, 1);
        fs.writeFile("./db/db.json", JSON.stringify(notes), (err) => {
          if (err) {
            res.status(500).send("Error writing to file");
          } else {
            res.send("Note deleted successfully");
          }
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error reading file");
    });
});

module.exports = notes;
