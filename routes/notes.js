const notes = require("express").Router();
const { readFromFile, readAndAppend } = require("../helpers/fsUtils");
const { v4: uuidv4 } = require("uuid");
const bodyParser = require("body-parser");
const fs = require("fs");

// Enable JSON body parsing
notes.use(bodyParser.json());

// Handle GET requests to /notes endpoint
notes.get("/", (req, res) => {
  readFromFile("./db/db.json")
    .then((data) => res.json(JSON.parse(data)))
    .catch((err) => console.error(err));
});

// Handle POST requests to /notes endpoint
notes.post("/", (req, res) => {
  if (!req.body) {
    res.status(400).send("Invalid request");
    return;
  }

  // Pulls title and text from user input
  const { title, text } = req.body;

  // Skeleton for a new note object with a unique ID
  const newNote = {
    title,
    text,
    id: uuidv4(),
  };

  // Append the new note to the JSON database
  readAndAppend(newNote, "./db/db.json")
    .then(() => res.json(`Note added successfully 🚀`))
    .catch((err) => console.error(err));
});

// Handle DELETE requests to /notes/:id endpoint
notes.delete("/:id", (req, res) => {
  const idToDelete = req.params.id;

  readFromFile("./db/db.json")
    .then((data) => JSON.parse(data))
    .then((notes) => {
      // Find the index of the note to delete based on its ID
      const noteIndex = notes.findIndex((note) => note.id === idToDelete);

      // If the note is not found, send a 404 error
      if (noteIndex === -1) {
        res.status(404).send("Note not found");
      } else {
        // Remove the note from the notes array and write the updated data back to the JSON file
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
