import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files

// Database setup
const adapter = new JSONFile('./db.json');
const db = new Low(adapter);

async function initializeDatabase() {
  try {
    await db.read();
    db.data = db.data || { users: {} };
    await db.write();
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

await initializeDatabase();

// API Endpoints
app.get('/api/worlds', (req, res) => {
  const worlds = [
    { id: "internal-medicine", name: "Internal Medicine", description: "Inspired by Final Fantasy" },
    { id: "pediatrics", name: "Pediatrics", description: "Inspired by Dragon Quest XI" },
    { id: "surgery", name: "Surgery", description: "Inspired by Octopath Traveler" },
    { id: "neurology", name: "Neurology", description: "Inspired by Sea of Stars" },
  ];
  res.json(worlds);
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // Use path.join for cross-platform compatibility
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
