import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node'; // Correct import for JSONFile adapter
import bodyParser from 'body-parser';
import cors from 'cors';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database setup
const db = new Low(new JSONFile(path.join(__dirname, 'db.json')));
await db.read();
if (!db.data) {
  db.data = { users: {} }; // Initialize default structure for the database
  await db.write(); // Write default data if the database was empty
}

// Sign-up route
app.post('/api/signup', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  if (db.data.users[username]) {
    return res.status(400).json({ message: 'Username already exists.' });
  }

  db.data.users[username] = { password, xp: 0, level: 1, questionsCompleted: 0 };
  db.write();
  res.status(201).json({ message: 'User registered successfully.' });
});

// Login route
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  const user = db.data.users[username];
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid username or password.' });
  }

  res.status(200).json({ message: 'Login successful.', user: { username, ...user } });
});

// Save progress route
app.post('/api/save-progress', (req, res) => {
  const { username, progress } = req.body;

  if (!username || !progress) {
    return res.status(400).json({ message: 'Username and progress data are required.' });
  }

  const user = db.data.users[username];
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  db.data.users[username] = { ...user, ...progress };
  db.write();
  res.status(200).json({ message: 'Progress saved successfully.' });
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
