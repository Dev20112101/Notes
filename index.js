import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './db.js';
import Note from './noteModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ensure DB connection is established before handling API requests
app.use(async (req, res, next) => {
  if (req.path === '/') return next();
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).send('Database connection failed.');
  }
});

// Serve the frontend on GET /
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// GET Request - READING DATA (JSON)
app.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find().sort({ date: -1, _id: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).send('Error fetching notes: ' + err.message);
  }
});

// POST Request - CREATING DATA
app.post('/', async (req, res) => {
  try {
    const { note } = req.body || {};
    if (!note || !note.trim()) {
      return res.status(400).send('Note content is required.');
    }

    await Note.create({ content: note.trim() });
    res.status(201).send('Note added successfully!');
  } catch (err) {
    res.status(500).send('Error adding note: ' + err.message);
  }
});

// PUT Request - UPDATING DATA
app.put('/', async (req, res) => {
  try {
    const { id, note } = req.body || {};
    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { content: note, date: Date.now() },
      { new: true }
    );

    if (updatedNote) {
      res.send('Note updated successfully!');
    } else {
      res.status(404).send('Note not found.');
    }
  } catch (error) {
    res.status(500).send('Error updating note: ' + error.message);
  }
});

// DELETE Request - DELETING DATA
app.delete('/', async (req, res) => {
  try {
    const { id } = req.body || {};
    const deleted = await Note.findByIdAndDelete(id);
    if (deleted) {
      res.send('Note deleted successfully.');
    } else {
      res.status(404).send('Note not found.');
    }
  } catch (err) {
    res.status(500).send('Error deleting note: ' + err.message);
  }
});

export default app;

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}