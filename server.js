const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

// GET Route for notes page
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

// API Routes
app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to read notes' });
    } else {
      res.json(JSON.parse(data));
    }
  });
});

app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;
  const newNote = { id: uuidv4(), title, text };

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to read notes' });
    } else {
      const notes = JSON.parse(data);
      notes.push(newNote);
      fs.writeFile('./db/db.json', JSON.stringify(notes, null, 2), err => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Failed to save note' });
        } else {
          res.json(newNote);
        }
      });
    }
  });
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
