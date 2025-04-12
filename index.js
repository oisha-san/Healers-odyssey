import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs'; // Import fs module

// Updated to use nedb for database management
import Datastore from 'nedb';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ensure db.json is created dynamically if missing
const dbPath = path.join(__dirname, 'db.json');
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({ users: {} }, null, 2));
}

// Debugging: Log db.json path and contents
console.log('Database Path:', dbPath);
if (fs.existsSync(dbPath)) {
  console.log('Database Contents:', fs.readFileSync(dbPath, 'utf-8'));
} else {
  console.log('Database file does not exist.');
}

// Updated to use nedb for database management
const db = new Datastore({ filename: dbPath, autoload: true });

// Handle potential data corruption gracefully
db.persistence.setAutocompactionInterval(5000); // Enable auto-compaction to prevent corruption

// Clean up unnecessary entries during database initialization
db.remove({}, { multi: true }, (err) => {
  if (err) {
    console.error('Error cleaning up database:', err);
  } else {
    console.log('Database cleaned up successfully.');
  }
});

// Reinitialize database if corrupt
db.loadDatabase((err) => {
  if (err) {
    console.error('Database corruption detected. Reinitializing database.');
    db.remove({}, { multi: true }, () => {
      db.insert({ users: {} }, (err) => {
        if (err) console.error('Error reinitializing database:', err);
      });
    });
  }
});

// Ensure db is initialized with default data without overwriting existing users
db.find({}, (err, docs) => {
  if (err) {
    console.error('Error loading database:', err);
    return;
  }

  if (docs.length === 0) {
    db.insert({ users: {} }, (err) => {
      if (err) console.error('Error initializing database:', err);
    });
  } else {
    console.log('Database already initialized with existing data.');
  }
});

// Refactor database logic to handle users as separate documents

// Sign-up route
app.post('/api/signup', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  db.findOne({ username }, (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Database error.' });
    }

    if (user) {
      return res.status(400).json({ message: 'Username already exists.' });
    }

    const newUser = { username, password, xp: 0, level: 1, questionsCompleted: 0 };
    db.insert(newUser, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Database error.' });
      }
      res.status(201).json({ message: 'User registered successfully.' });
    });
  });
});

// Login route
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  db.findOne({ username }, (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Database error.' });
    }

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    res.status(200).json({ message: 'Login successful.', user });
  });
});

// Save progress route
app.post('/api/save-progress', (req, res) => {
  const { username, progress } = req.body;

  if (!username || !progress) {
    return res.status(400).json({ message: 'Username and progress data are required.' });
  }

  db.findOne({ username }, (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Database error.' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const updatedUser = { ...user, ...progress };
    db.update({ username }, updatedUser, {}, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Database error.' });
      }
      res.status(200).json({ message: 'Progress saved successfully.' });
    });
  });
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
