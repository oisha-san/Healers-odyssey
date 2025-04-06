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

  // Validate input
  if (!topic || !userId) {
    return res.status(400).json({ error: "Topic and User ID are required" });
  }

  try {
    await db.read();
    const user = db.data.users[userId] || { answered: [], xp: 0 };

    // Fetch questions for the given topic
    const questions = specialties[topic.toLowerCase()];
    if (!questions) {
      return res.status(404).json({ error: "Specialty not found" });
    }

    // Filter out already answered questions
    const filtered = questions.filter(q => !user.answered.includes(q.question));
    if (!filtered.length) {
      return res.status(404).json({ error: "No new questions available" });
    }

    // Return a random question
    const randomQuestion = filtered[Math.floor(Math.random() * filtered.length)];
    res.json(randomQuestion);
  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(500).json({ error: "Internal server error" });
  }
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

const missions = {
  cardiology: [
    {
      title: "The Silent Arrhythmia",
      story: "A 45-year-old patient presents with palpitations and dizziness. ECG reveals an irregularly irregular rhythm with no distinct P waves. What is your diagnosis?",
      options: { A: "Atrial fibrillation", B: "Ventricular tachycardia", C: "Sinus arrhythmia" },
      correct: "A",
      explanation: "An irregularly irregular rhythm with no distinct P waves is characteristic of atrial fibrillation.",
      xp: 30
    }
    // Add more missions as needed
  ],
  neurology: [
    {
      title: "The Collapsing Patient",
      story: "A 65-year-old male collapses in the emergency room. His blood pressure is 70/40 mmHg, and jugular venous distension is noted. What is the most likely diagnosis?",
      options: { A: "Cardiac tamponade", B: "Pulmonary embolism", C: "Septic shock" },
      correct: "A",
      explanation: "Hypotension, jugular venous distension, and collapse are classic signs of cardiac tamponade.",
      xp: 35
    }
    // Add more missions as needed
  ]
};

const bossChallenges = {
  cardiology: [
    {
      question: "A 75-year-old male with a history of coronary artery disease presents with sudden onset of severe dyspnea. Examination reveals a holosystolic murmur at the apex radiating to the axilla. What is the most likely cause?",
      options: { A: "Acute mitral regurgitation", B: "Aortic stenosis", C: "Ventricular septal defect" },
      correct: "A",
      explanation: "Acute mitral regurgitation can occur due to papillary muscle rupture in the setting of myocardial infarction.",
      xp: 50
    }
    // Add more boss challenges as needed
  ],
  neurology: [
    {
      question: "A 60-year-old female presents with syncope and a systolic crescendo-decrescendo murmur at the right upper sternal border. What is the most likely diagnosis?",
      options: { A: "Aortic stenosis", B: "Hypertrophic cardiomyopathy", C: "Mitral regurgitation" },
      correct: "A",
      explanation: "Aortic stenosis presents with a systolic crescendo-decrescendo murmur and can cause syncope.",
      xp: 45
    }
    // Add more boss challenges as needed
  ]
};

// Missions endpoint
app.get('/api/mission', async (req, res) => {
  const { topic, userId } = req.query;

  if (!topic || !userId) {
    return res.status(400).json({ error: "Topic and User ID are required" });
  }

  try {
    await db.read();
    const user = db.data.users[userId] || { completedMissions: [] };

    const missionsForTopic = missions[topic.toLowerCase()];
    if (!missionsForTopic) {
      return res.status(404).json({ error: "Specialty not found" });
    }

    const filtered = missionsForTopic.filter(m => !user.completedMissions.includes(m.title));
    if (!filtered.length) {
      return res.status(404).json({ error: "No new missions available" });
    }

    res.json(filtered[Math.floor(Math.random() * filtered.length)]);
  } catch (error) {
    console.error("Error fetching mission:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Boss battles endpoint
app.get('/api/boss', async (req, res) => {
  const { topic, userId } = req.query;

  if (!topic || !userId) {
    return res.status(400).json({ error: "Topic and User ID are required" });
  }

  try {
    await db.read();
    const user = db.data.users[userId] || { defeatedBosses: [] };

    const bossesForTopic = bossChallenges[topic.toLowerCase()];
    if (!bossesForTopic) {
      return res.status(404).json({ error: "Specialty not found" });
    }

    const filtered = bossesForTopic.filter(b => !user.defeatedBosses.includes(b.question));
    if (!filtered.length) {
      return res.status(404).json({ error: "No new bosses available" });
    }

    res.json(filtered[Math.floor(Math.random() * filtered.length)]);
  } catch (error) {
    console.error("Error fetching boss challenge:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Serve frontend
app.get('*', (req, res) => res.sendFile('/workspaces/Healers-odyssey/public/index.html'));

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));