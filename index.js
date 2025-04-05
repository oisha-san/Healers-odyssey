// Ensure "type": "module" is set in package.json
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import fs from 'fs/promises';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the root directory
app.use(express.static('.'));

// Database setup using JSONFile adapter (async)
const adapter = new JSONFile('/tmp/db.json'); // Use Render's writable directory
const db = new Low(adapter);

async function ensureDatabaseFile() {
  try {
    await fs.access('/tmp/db.json');
  } catch {
    await fs.writeFile('/tmp/db.json', JSON.stringify({ users: {} }, null, 2));
  }
}

async function initializeDatabase() {
  try {
    await db.read();
    db.data = db.data || { users: {} };
    await db.write();
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Ensure the database file and initialize it
await ensureDatabaseFile();
await initializeDatabase();

// Local datasets for questions, missions, and boss challenges
const questions = [
  {
    topic: "cardiology",
    question: "What is the normal resting heart rate for an adult?",
    options: { A: "60-100 bpm", B: "40-60 bpm", C: "100-120 bpm" },
    correct: "A",
    explanation: "The normal resting heart rate for an adult is between 60 and 100 beats per minute.",
    xp: 10
  },
  {
    topic: "cardiology",
    question: "A 65-year-old male presents with chest pain radiating to the left arm. What is the most likely diagnosis?",
    options: { A: "Myocardial infarction", B: "Pneumothorax", C: "Gastroesophageal reflux disease" },
    correct: "A",
    explanation: "Chest pain radiating to the left arm is a classic symptom of myocardial infarction.",
    xp: 20
  },
  {
    topic: "cardiology",
    question: "A patient with a history of hypertension presents with shortness of breath and bilateral leg swelling. What is the most likely cause?",
    options: { A: "Heart failure", B: "Pulmonary embolism", C: "Asthma" },
    correct: "A",
    explanation: "Shortness of breath and bilateral leg swelling are common symptoms of heart failure.",
    xp: 20
  },
  // ... add other questions as needed
];

const missions = [
  {
    topic: "cardiology",
    title: "The Lost Pulse",
    story: "A mysterious patient arrives with irregular heartbeats. Investigate the cause and determine your first diagnostic step.",
    options: { A: "Order an ECG", B: "Schedule an MRI", C: "Prescribe medication immediately" },
    correct: "A",
    explanation: "An ECG is the essential first step in diagnosing cardiac irregularities.",
    xp: 20
  },
  {
    topic: "cardiology",
    title: "The Silent Killer",
    story: "A 55-year-old patient with no prior symptoms suddenly collapses. You suspect a cardiac event. What is your immediate action?",
    options: { A: "Perform CPR", B: "Administer aspirin", C: "Call for an MRI" },
    correct: "A",
    explanation: "Immediate CPR is critical in cases of sudden cardiac arrest.",
    xp: 30
  },
  {
    topic: "cardiology",
    title: "The Racing Heart",
    story: "A 40-year-old patient complains of a racing heart and dizziness. What is your first diagnostic step?",
    options: { A: "Order an ECG", B: "Perform a stress test", C: "Administer beta-blockers" },
    correct: "A",
    explanation: "An ECG is the first diagnostic step to evaluate arrhythmias.",
    xp: 25
  },
  // ... add other missions as needed
];

const bossChallenges = [
  {
    topic: "cardiology",
    question: "Which electrolyte imbalance is most likely to cause dangerous cardiac arrhythmias?",
    options: { A: "Hyperkalemia", B: "Hypokalemia", C: "Hyponatremia" },
    correct: "A",
    explanation: "Hyperkalemia can lead to life-threatening arrhythmias.",
    xp: 30
  },
  {
    topic: "cardiology",
    question: "A 70-year-old patient presents with severe chest pain, hypotension, and jugular venous distension. What is the most likely diagnosis?",
    options: { A: "Cardiac tamponade", B: "Aortic dissection", C: "Pulmonary embolism" },
    correct: "A",
    explanation: "The triad of chest pain, hypotension, and jugular venous distension is classic for cardiac tamponade.",
    xp: 40
  },
  {
    topic: "cardiology",
    question: "A patient with atrial fibrillation is at risk of which serious complication?",
    options: { A: "Stroke", B: "Myocardial infarction", C: "Heart failure" },
    correct: "A",
    explanation: "Atrial fibrillation increases the risk of stroke due to thrombus formation in the atria.",
    xp: 35
  },
  // ... add other boss challenges as needed
];

// API Endpoints

// Retrieve a random question by topic
app.get('/api/question', (req, res) => {
  try {
    const topic = req.query.topic || "cardiology";
    const filtered = questions.filter(q => q.topic.toLowerCase() === topic.toLowerCase());
    if (!filtered.length) {
      return res.status(404).json({ error: "No questions found" });
    }
    res.json(filtered[Math.floor(Math.random() * filtered.length)]);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Retrieve a random mission by topic
app.get('/api/mission', (req, res) => {
  try {
    const topic = req.query.topic || "cardiology";
    const filtered = missions.filter(m => m.topic.toLowerCase() === topic.toLowerCase());
    if (!filtered.length) {
      return res.status(404).json({ error: "No missions found" });
    }
    res.json(filtered[Math.floor(Math.random() * filtered.length)]);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Retrieve a random boss challenge by topic
app.get('/api/boss', (req, res) => {
  try {
    const topic = req.query.topic || "cardiology";
    const filtered = bossChallenges.filter(b => b.topic.toLowerCase() === topic.toLowerCase());
    if (!filtered.length) {
      return res.status(404).json({ error: "No bosses found" });
    }
    res.json(filtered[Math.floor(Math.random() * filtered.length)]);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to fetch user progress
app.get('/api/user', async (req, res) => {
  try {
    const { userId } = req.query;

    // Validate input
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    await db.read();
    const user = db.data.users[userId] || { answered: [], xp: 0 };

    res.json({ userId, xp: user.xp, answered: user.answered });
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Submit an answer for a question, mission, or boss challenge
app.post('/api/answer', async (req, res) => {
  try {
    const { userId, question, selected, correct, xp } = req.body;

    // Validate input
    if (!userId || !question || !selected || !correct || typeof xp !== 'number') {
      return res.status(400).json({ error: "Invalid input data" });
    }

    await db.read();
    const user = db.data.users[userId] || { answered: [], xp: 0 };

    if (user.answered.includes(question)) {
      return res.json({ awarded: 0, totalXP: user.xp });
    }

    user.answered.push(question);
    if (selected === correct) {
      user.xp += xp;
    }

    db.data.users[userId] = user;
    await db.write(); // Save progress to db.json
    res.json({ awarded: selected === correct ? xp : 0, totalXP: user.xp });
  } catch (error) {
    console.error('Error processing answer:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Reset (prestige) endpoint to clear user progress
app.post('/api/reset', async (req, res) => {
  try {
    const { userId } = req.body;

    // Validate input
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    db.data.users[userId] = { answered: [], xp: 0 };
    await db.write();
    res.json({ success: true });
  } catch (error) {
    console.error('Error resetting user progress:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});