import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import fs from 'fs/promises';
import { specialties } from './data/specialties.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allow all origins for simplicity
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files

// Database setup
const dbPath = process.env.NODE_ENV === 'production' ? '/tmp/db.json' : './db.json';
const adapter = new JSONFile(dbPath);
const db = new Low(adapter);

async function ensureDatabaseFile() {
  try {
    await fs.access(dbPath);
  } catch {
    await fs.writeFile(dbPath, JSON.stringify({ users: {} }, null, 2));
  }
}

async function initializeDatabase() {
  await ensureDatabaseFile();
  await db.read();
  db.data = db.data || { users: {} };
  await db.write();
}

await initializeDatabase();

// API Endpoints
app.get('/api/question', async (req, res) => {
  const { topic, userId } = req.query;
  if (!topic || !userId) return res.status(400).json({ error: "Topic and User ID are required" });

  await db.read();
  const user = db.data.users[userId] || { answered: [], xp: 0 };
  const questions = specialties[topic.toLowerCase()];
  if (!questions) return res.status(404).json({ error: "Specialty not found" });

  const filtered = questions.filter(q => !user.answered.includes(q.question));
  if (!filtered.length) return res.status(404).json({ error: "No new questions available" });

  res.json(filtered[Math.floor(Math.random() * filtered.length)]);
});

app.post('/api/answer', async (req, res) => {
  const { userId, question, selected, correct, xp } = req.body;
  if (!userId || !question || !selected || !correct || typeof xp !== 'number') {
    return res.status(400).json({ error: "Invalid input data" });
  }

  await db.read();
  const user = db.data.users[userId] || { answered: [], xp: 0 };
  if (user.answered.includes(question)) return res.json({ awarded: 0, totalXP: user.xp });

  user.answered.push(question);
  if (selected === correct) user.xp += xp;

  db.data.users[userId] = user;
  await db.write();
  res.json({ awarded: selected === correct ? xp : 0, totalXP: user.xp });
});

app.get('/api/worlds', (req, res) => {
  const worlds = [
    { name: "Internal Medicine", description: "Inspired by Final Fantasy", background: "internal-medicine.jpg" },
    { name: "Pediatrics", description: "Inspired by Dragon Quest XI", background: "pediatrics.jpg" },
    { name: "Surgery", description: "Inspired by Octopath Traveler", background: "surgery.jpg" },
    { name: "Neurology", description: "Inspired by Sea of Stars", background: "neurology.jpg" },
  ];
  res.json(worlds);
});

app.get('/api/adventure', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "User ID is required" });

  await db.read();
  const user = db.data.users[userId] || { adventureProgress: 0 };
  res.json({ progress: user.adventureProgress });
});

// Serve frontend
app.get('*', (req, res) => res.sendFile('/workspaces/Healers-odyssey/public/index.html'));

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));