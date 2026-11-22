import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

let data = [
  { id: 1, note: 'I am learning Node.js' },
  { id: 2, note: 'I am learning Express.js' },
  { id: 3, note: 'Why am I Alive?' },
];

// Serve the Apple Notes frontend on GET /
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// GET Request - READING DATA (JSON)
app.get('/notes', (req, res) => {
  res.json(data);
});

// POST Request - CREATING DATA
app.post('/', (req, res) => {
  const { note } = req.body;
  const nextId = data.reduce((max, item) => Math.max(max, item.id), 0) + 1;
  data.push({ id: nextId, note });

  res.status(201).send('Note added successfully!');
});

// PUT Request - UPDATING DATA
app.put('/', (req, res) => {
  const { id, note } = req.body;
  const index = data.findIndex((item) => item.id === id);
  if (index !== -1) {
    data[index] = { id, note };
    res.send('Note updated successfully!');
  } else {
    res.status(404).send('Note not found.');
  }
});

// DELETE Request - DELETING DATA
app.delete('/', (req, res) => {
  const { id } = req.body;
  const index = data.findIndex((item) => item.id === id);
  if (index !== -1) {
    data.splice(index, 1);
    res.send('Note deleted successfully.');
  } else {
    res.status(404).send('Note not found.');
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});