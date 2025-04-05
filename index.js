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
    question: "A 55-year-old male presents with crushing chest pain lasting 30 minutes, radiating to the jaw. ECG shows ST-segment elevation in leads II, III, and aVF. What is the most likely diagnosis?",
    options: { A: "Inferior myocardial infarction", B: "Pericarditis", C: "Aortic dissection" },
    correct: "A",
    explanation: "ST-segment elevation in leads II, III, and aVF is indicative of an inferior myocardial infarction.",
    xp: 20
  },
  {
    topic: "cardiology",
    question: "A 70-year-old female with a history of atrial fibrillation presents with sudden onset of left-sided weakness and slurred speech. What is the most likely cause?",
    options: { A: "Ischemic stroke", B: "Transient ischemic attack", C: "Subarachnoid hemorrhage" },
    correct: "A",
    explanation: "Atrial fibrillation increases the risk of ischemic stroke due to embolism formation.",
    xp: 25
  },
  {
    topic: "cardiology",
    question: "A 60-year-old male with a history of hypertension presents with tearing chest pain radiating to the back. Chest X-ray shows a widened mediastinum. What is the next best step?",
    options: { A: "CT angiography", B: "ECG", C: "Echocardiography" },
    correct: "A",
    explanation: "CT angiography is the diagnostic test of choice for suspected aortic dissection.",
    xp: 30
  },
  // ... add more challenging questions for other topics...
];

const missions = [
  {
    topic: "cardiology",
    title: "The Silent Arrhythmia",
    story: "A 45-year-old patient presents with palpitations and dizziness. ECG reveals an irregularly irregular rhythm with no distinct P waves. What is your diagnosis?",
    options: { A: "Atrial fibrillation", B: "Ventricular tachycardia", C: "Sinus arrhythmia" },
    correct: "A",
    explanation: "An irregularly irregular rhythm with no distinct P waves is characteristic of atrial fibrillation.",
    xp: 30
  },
  {
    topic: "cardiology",
    title: "The Collapsing Patient",
    story: "A 65-year-old male collapses in the emergency room. His blood pressure is 70/40 mmHg, and jugular venous distension is noted. What is the most likely diagnosis?",
    options: { A: "Cardiac tamponade", B: "Pulmonary embolism", C: "Septic shock" },
    correct: "A",
    explanation: "Hypotension, jugular venous distension, and collapse are classic signs of cardiac tamponade.",
    xp: 35
  },
  {
    topic: "cardiology",
    title: "The Racing Pulse",
    story: "A 50-year-old patient presents with a heart rate of 180 bpm and narrow QRS complexes on ECG. What is the first-line treatment?",
    options: { A: "Adenosine", B: "Amiodarone", C: "Beta-blockers" },
    correct: "A",
    explanation: "Adenosine is the first-line treatment for supraventricular tachycardia with narrow QRS complexes.",
    xp: 40
  },
  // ... add more challenging missions for other topics...
];

const bossChallenges = [
  {
    topic: "cardiology",
    question: "A 75-year-old male with a history of coronary artery disease presents with sudden onset of severe dyspnea. Examination reveals a holosystolic murmur at the apex radiating to the axilla. What is the most likely cause?",
    options: { A: "Acute mitral regurgitation", B: "Aortic stenosis", C: "Ventricular septal defect" },
    correct: "A",
    explanation: "Acute mitral regurgitation can occur due to papillary muscle rupture in the setting of myocardial infarction.",
    xp: 50
  },
  {
    topic: "cardiology",
    question: "A 60-year-old female presents with syncope and a systolic crescendo-decrescendo murmur at the right upper sternal border. What is the most likely diagnosis?",
    options: { A: "Aortic stenosis", B: "Hypertrophic cardiomyopathy", C: "Mitral regurgitation" },
    correct: "A",
    explanation: "Aortic stenosis presents with a systolic crescendo-decrescendo murmur and can cause syncope.",
    xp: 45
  },
  {
    topic: "cardiology",
    question: "A 50-year-old male with a history of hypertension presents with sudden onset of chest pain and unequal blood pressure in both arms. What is the most likely diagnosis?",
    options: { A: "Aortic dissection", B: "Pulmonary embolism", C: "Myocardial infarction" },
    correct: "A",
    explanation: "Unequal blood pressure in both arms is a classic finding in aortic dissection.",
    xp: 50
  },
  // ... add more challenging boss challenges for other topics...
];

// API Endpoints

// Retrieve a random question by topic, excluding already answered questions
app.get('/api/question', async (req, res) => {
  try {
    const topic = req.query.topic || "cardiology";
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    await db.read();
    const user = db.data.users[userId] || { answered: [], xp: 0 };

    const filtered = questions.filter(
      q => q.topic.toLowerCase() === topic.toLowerCase() && !user.answered.includes(q.question)
    );

    if (!filtered.length) {
      return res.status(404).json({ error: "No new questions available" });
    }

    res.json(filtered[Math.floor(Math.random() * filtered.length)]);
  } catch (error) {
    console.error("Error fetching question:", error);
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