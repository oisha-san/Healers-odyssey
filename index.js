import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import fs from 'fs/promises';
import path from 'path';
import { Configuration, OpenAIApi } from 'openai';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
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

// Worlds data
const worlds = [
  {
    id: "internal-medicine",
    name: "Internal Medicine",
    description: "Inspired by Final Fantasy",
    theme: "internal-medicine.css",
  },
  {
    id: "pediatrics",
    name: "Pediatrics",
    description: "Inspired by Dragon Quest XI",
    theme: "pediatrics.css",
  },
  {
    id: "surgery",
    name: "Surgery",
    description: "Inspired by Octopath Traveler",
    theme: "surgery.css",
  },
  {
    id: "neurology",
    name: "Neurology",
    description: "Inspired by Sea of Stars",
    theme: "neurology.css",
  },
];

// Missions and boss battles data
const missions = {
  "internal-medicine": [
    {
      title: "Diagnose the Patient",
      question: "A 55-year-old male presents with crushing chest pain lasting 30 minutes. What is the most likely diagnosis?",
      options: { A: "Myocardial infarction", B: "Pericarditis", C: "Aortic dissection" },
      correct: "A",
      explanation: "Crushing chest pain is a hallmark of myocardial infarction.",
      xp: 20,
    },
  ],
  // ...other worlds...
};

const bosses = {
  "internal-medicine": [
    {
      bossName: "Heartbreaker",
      question: "What is the most common cause of myocardial infarction?",
      options: { A: "Atherosclerosis", B: "Hypertension", C: "Diabetes" },
      correct: "A",
      explanation: "Atherosclerosis is the most common cause of myocardial infarction.",
      damage: 20,
    },
  ],
  // ...other worlds...
};

// API Endpoints
app.get('/api/worlds', (req, res) => {
  res.json(worlds);
});

app.get('/api/missions', (req, res) => {
  const { worldId } = req.query;
  if (!worldId || !missions[worldId]) {
    return res.status(404).json({ error: "World not found or no missions available" });
  }
  res.json(missions[worldId]);
});

app.get('/api/bosses', (req, res) => {
  const { worldId } = req.query;
  if (!worldId || !bosses[worldId]) {
    return res.status(404).json({ error: "World not found or no bosses available" });
  }
  res.json(bosses[worldId]);
});

// Serve frontend
app.get('*', (req, res) => res.sendFile('/workspaces/Healers-odyssey/public/index.html'));

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));