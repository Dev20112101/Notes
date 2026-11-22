import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './db.js';
import Note from './noteModel.js';

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve the Apple Notes frontend on GET /
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// GET Request - READING DATA (JSON)
app.get('/notes', async (req, res) => {
  let notes = await Note.find();
  res.json(notes);
});

// POST Request - CREATING DATA
app.post('/', async (req, res) => {
  const { note } = req.body;
  await Note.create({ content: note });

  res.status(201).send('Note added successfully!');
});

// PUT Request - UPDATING DATA
app.put('/', (req, res) => {

    const { id, note } = req.body;

    Note.findByIdAndUpdate(id, {content : note}, {new: true}).then((updatedNote) => {

        if (updatedNote) {

            res.send('Note updated successfully!');

        } else {

            res.status(404).send('Note not found.');

        }

    }).catch((error) => {

        res.status(500).send('Error updating note: ' + error.message);

    });

});

// DELETE Request - DELETING DATA
app.delete('/', async (req, res) => {
  const { id } = req.body;
  const deleted = await Note.findByIdAndDelete(id);
  if (deleted) {
    res.send('Note deleted successfully.');
  } else {
    res.status(404).send('Note not found.');
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});