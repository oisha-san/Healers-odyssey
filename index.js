// Ensure "type": "module" is set in package.json
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import low from 'lowdb';
import { FileSync } from 'lowdb';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Database setup
const adapter = new FileSync('db.json');
const db = low(adapter);

// Initialize the database if empty
await db.read();
db.data = db.data || { users: {} };
await db.write();

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
  // ... add other boss challenges as needed
];

// API Endpoints

// Retrieve a random question by topic
app.get('/api/question', (req, res) => {
  const topic = req.query.topic || "cardiology";
  const filtered = questions.filter(q => q.topic.toLowerCase() === topic.toLowerCase());
  if (!filtered.length) {
    return res.status(404).json({ error: "No questions found" });
  }
  res.json(filtered[Math.floor(Math.random() * filtered.length)]);
});

// Retrieve a random mission by topic
app.get('/api/mission', (req, res) => {
  const topic = req.query.topic || "cardiology";
  const filtered = missions.filter(m => m.topic.toLowerCase() === topic.toLowerCase());
  if (!filtered.length) {
    return res.status(404).json({ error: "No missions found" });
  }
  res.json(filtered[Math.floor(Math.random() * filtered.length)]);
});

// Retrieve a random boss challenge by topic
app.get('/api/boss', (req, res) => {
  const topic = req.query.topic || "cardiology";
  const filtered = bossChallenges.filter(b => b.topic.toLowerCase() === topic.toLowerCase());
  if (!filtered.length) {
    return res.status(404).json({ error: "No bosses found" });
  }
  res.json(filtered[Math.floor(Math.random() * filtered.length)]);
});

// Submit an answer for a question
app.post('/api/answer', async (req, res) => {
  const { userId, question, selected, correct, xp } = req.body;
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
  await db.write();
  res.json({ awarded: selected === correct ? xp : 0, totalXP: user.xp });
});

// Chat endpoint for in-game dialogue or hints
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  let response = "I sense a great journey ahead.";
  if (message.toLowerCase().includes("challenge")) {
    response = "Prepare yourself for the next mission – danger and glory await!";
  } else if (/(lore|story)/i.test(message)) {
    response = "Long ago, the realms were forged in healing light. Each specialty holds its own secrets.";
  } else if (message.includes("help")) {
    response = "Ask me about missions, bosses, or lore!";
  }
  res.json({ response });
});

// Reset (prestige) endpoint to clear user progress
app.post('/api/reset', async (req, res) => {
  const { userId } = req.body;
  db.data.users[userId] = { answered: [], xp: 0 };
  await db.write();
  res.json({ success: true });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 
