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

// Serve static files from the "public" directory
app.use(express.static('public')); // Ensure static files are served from the "public" directory

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

const specialties = {
  cardiology: [
    {
      question: "A 55-year-old male presents with crushing chest pain lasting 30 minutes, radiating to the jaw. ECG shows ST-segment elevation in leads II, III, and aVF. What is the most likely diagnosis?",
      options: { A: "Inferior myocardial infarction", B: "Pericarditis", C: "Aortic dissection" },
      correct: "A",
      explanation: "ST-segment elevation in leads II, III, and aVF is indicative of an inferior myocardial infarction.",
      xp: 20
    },
    {
      question: "A 70-year-old female with a history of atrial fibrillation presents with sudden onset of left-sided weakness and slurred speech. What is the most likely cause?",
      options: { A: "Ischemic stroke", B: "Transient ischemic attack", C: "Subarachnoid hemorrhage" },
      correct: "A",
      explanation: "Atrial fibrillation increases the risk of ischemic stroke due to embolism formation.",
      xp: 25
    },
    // ...add 48 more cardiology questions...
  ],
  neurology: [
    {
      question: "A 65-year-old male presents with resting tremor, bradykinesia, and rigidity. What is the most likely diagnosis?",
      options: { A: "Parkinson's disease", B: "Essential tremor", C: "Multiple sclerosis" },
      correct: "A",
      explanation: "Resting tremor, bradykinesia, and rigidity are hallmark features of Parkinson's disease.",
      xp: 20
    },
    {
      question: "A 30-year-old female presents with sudden onset of unilateral vision loss and pain with eye movement. What is the most likely diagnosis?",
      options: { A: "Optic neuritis", B: "Retinal detachment", C: "Migraine with aura" },
      correct: "A",
      explanation: "Optic neuritis is a common presentation of multiple sclerosis and causes unilateral vision loss with pain on eye movement.",
      xp: 25
    },
    // ...add 48 more neurology questions...
  ],
  pulmonology: [
    {
      question: "A 60-year-old male with a 40-pack-year smoking history presents with chronic cough, sputum production, and dyspnea. What is the most likely diagnosis?",
      options: { A: "Chronic obstructive pulmonary disease (COPD)", B: "Asthma", C: "Bronchiectasis" },
      correct: "A",
      explanation: "Chronic cough, sputum production, and dyspnea in a smoker are classic features of COPD.",
      xp: 20
    },
    {
      question: "A 35-year-old female presents with sudden onset of pleuritic chest pain and dyspnea. She recently underwent surgery. What is the most likely diagnosis?",
      options: { A: "Pulmonary embolism", B: "Pneumothorax", C: "Pneumonia" },
      correct: "A",
      explanation: "Sudden onset of pleuritic chest pain and dyspnea in a postoperative patient is highly suggestive of pulmonary embolism.",
      xp: 25
    },
    // ...add 48 more pulmonology questions...
  ],
  // ...add more specialties like gastroenterology, nephrology, endocrinology, etc...
};

const missions = {
  cardiology: [
    {
      title: "The Silent Arrhythmia",
      story: "A 45-year-old patient presents with palpitations and dizziness. ECG reveals an irregularly irregular rhythm with no distinct P waves. What is your diagnosis?",
      options: { A: "Atrial fibrillation", B: "Ventricular tachycardia", C: "Sinus arrhythmia" },
      correct: "A",
      explanation: "An irregularly irregular rhythm with no distinct P waves is characteristic of atrial fibrillation.",
      xp: 30
    },
    // ...add more cardiology missions...
  ],
  neurology: [
    {
      title: "The Collapsing Patient",
      story: "A 65-year-old male collapses in the emergency room. His blood pressure is 70/40 mmHg, and jugular venous distension is noted. What is the most likely diagnosis?",
      options: { A: "Cardiac tamponade", B: "Pulmonary embolism", C: "Septic shock" },
      correct: "A",
      explanation: "Hypotension, jugular venous distension, and collapse are classic signs of cardiac tamponade.",
      xp: 35
    },
    // ...add more neurology missions...
  ],
  // ...add more specialties...
};

const bossChallenges = {
  cardiology: [
    {
      question: "A 75-year-old male with a history of coronary artery disease presents with sudden onset of severe dyspnea. Examination reveals a holosystolic murmur at the apex radiating to the axilla. What is the most likely cause?",
      options: { A: "Acute mitral regurgitation", B: "Aortic stenosis", C: "Ventricular septal defect" },
      correct: "A",
      explanation: "Acute mitral regurgitation can occur due to papillary muscle rupture in the setting of myocardial infarction.",
      xp: 50
    },
    // ...add more cardiology boss challenges...
  ],
  neurology: [
    {
      question: "A 60-year-old female presents with syncope and a systolic crescendo-decrescendo murmur at the right upper sternal border. What is the most likely diagnosis?",
      options: { A: "Aortic stenosis", B: "Hypertrophic cardiomyopathy", C: "Mitral regurgitation" },
      correct: "A",
      explanation: "Aortic stenosis presents with a systolic crescendo-decrescendo murmur and can cause syncope.",
      xp: 45
    },
    // ...add more neurology boss challenges...
  ],
  // ...add more specialties...
};

// API Endpoints

// Retrieve a random question by specialty, excluding already answered questions
app.get('/api/question', async (req, res) => {
  try {
    const topic = req.query.topic; // Ensure topic is provided
    const userId = req.query.userId; // Ensure userId is provided

    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    await db.read();
    const user = db.data.users[userId] || { answered: [], xp: 0 };

    const questions = specialties[topic.toLowerCase()];
    if (!questions) {
      return res.status(404).json({ error: "Specialty not found" });
    }

    const filtered = questions.filter(q => !user.answered.includes(q.question));

    if (!filtered.length) {
      return res.status(404).json({ error: "No new questions available" });
    }

    res.json(filtered[Math.floor(Math.random() * filtered.length)]);
  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Retrieve a random mission by topic, excluding already completed missions
app.get('/api/mission', async (req, res) => {
  try {
    const topic = req.query.topic; // Ensure topic is provided
    const userId = req.query.userId; // Ensure userId is provided

    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    await db.read();
    const user = db.data.users[userId] || { completedMissions: [], xp: 0 };

    const missionsForTopic = missions[topic.toLowerCase()];
    if (!missionsForTopic) {
      return res.status(404).json({ error: "Specialty not found" });
    }

    const filtered = missionsForTopic.filter(m => !user.completedMissions?.includes(m.title));

    if (!filtered.length) {
      return res.status(404).json({ error: "No new missions available" });
    }

    res.json(filtered[Math.floor(Math.random() * filtered.length)]);
  } catch (error) {
    console.error("Error fetching mission:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Retrieve a random boss challenge by topic, excluding already defeated bosses
app.get('/api/boss', async (req, res) => {
  try {
    const topic = req.query.topic; // Ensure topic is provided
    const userId = req.query.userId; // Ensure userId is provided

    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    await db.read();
    const user = db.data.users[userId] || { defeatedBosses: [], xp: 0 };

    const bossesForTopic = bossChallenges[topic.toLowerCase()];
    if (!bossesForTopic) {
      return res.status(404).json({ error: "Specialty not found" });
    }

    const filtered = bossesForTopic.filter(b => !user.defeatedBosses?.includes(b.question));

    if (!filtered.length) {
      return res.status(404).json({ error: "No new bosses available" });
    }

    res.json(filtered[Math.floor(Math.random() * filtered.length)]);
  } catch (error) {
    console.error("Error fetching boss challenge:", error);
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