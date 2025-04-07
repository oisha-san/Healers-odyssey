import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files

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
app.get('*', (req, res) => res.sendFile(__dirname + '/public/index.html'));

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));