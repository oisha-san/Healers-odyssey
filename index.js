import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
const mongoURI = 'mongodb+srv://acezimabdk:Abdo5340@healers.uri1zc0.mongodb.net/?retryWrites=true&w=majority&appName=Healers';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Define UserProgress schema and model
const userProgressSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  xp: { type: Number, default: 0 },
  cp: { type: Number, default: 0 },
  achievements: { type: Array, default: [] },
  completedSpecialties: { type: Array, default: [] },
  completedDiseases: { type: Array, default: [] },
  completedQuestions: { type: Array, default: [] },
});
const UserProgress = mongoose.model('UserProgress', userProgressSchema);

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Middleware to parse JSON request bodies

// Predefined checklist for specialties and diseases
const checklist = {
  specialties: ['Cardiology', 'Neurology', 'Pediatrics', 'Dermatology', 'Oncology'],
  diseases: ['Diabetes', 'Hypertension', 'Asthma', 'Cancer', 'Arthritis'],
};

// Achievement icons mapping (using emojis)
const achievementIcons = {
  'Novice Healer': '🩺',
  'Skilled Medic': '💉',
  'Master Physician': '🏥',
  'Legendary Healer': '🌟',
  'Ultimate Healer': '🔥',
  'Immortal Healer': '👑',
  'Specialist Master': '🎓',
  'Disease Expert': '🔬',
  'Specialty Explorer': '🧭',
  'Disease Investigator': '🕵️‍♂️',
  'Medical Genius': '🧠',
  'Specialty Conqueror': '🏆',
  'Disease Conqueror': '🥇',
  'Question Explorer': '📖',
  'Question Master': '📚',
  'Question Legend': '📝',
  'Question Conqueror': '🏅',
  'Question Immortal': '🌌',
};

// Helper function to attach icons to achievements
function attachAchievementIcons(achievements) {
  return achievements.map((achievement) => ({
    name: achievement,
    icon: achievementIcons[achievement] || '❓', // Default emoji if not found
  }));
}

// Fetch progress route
app.get('/api/progress', async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ message: 'Username is required.' });
  }

  try {
    const progress = await UserProgress.findOne({ username });
    if (!progress) {
      return res.status(404).json({ message: 'No progress found for this user.' });
    }

    res.status(200).json({ username, progress });
  } catch (err) {
    console.error('Error fetching progress:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Save progress route
app.post('/api/save-progress', async (req, res) => {
  const { username, progress } = req.body;

  if (!username || !progress) {
    return res.status(400).json({ message: 'Username and progress data are required.' });
  }

  try {
    const xpGained = progress.hoursStudied * 10; // Example: 10 XP per hour studied
    const achievements = [];
    if (progress.hoursStudied >= 10) achievements.push('Novice Healer');
    if (progress.hoursStudied >= 50) achievements.push('Skilled Medic');
    if (progress.hoursStudied >= 100) achievements.push('Master Physician');
    if (progress.hoursStudied >= 200) achievements.push('Legendary Healer');
    if (progress.hoursStudied >= 500) achievements.push('Ultimate Healer');
    if (progress.hoursStudied >= 1000) achievements.push('Immortal Healer');

    const updatedProgress = await UserProgress.findOneAndUpdate(
      { username },
      {
        $setOnInsert: { username },
        $inc: { xp: xpGained },
        $addToSet: { achievements: { $each: achievements } },
      },
      { new: true, upsert: true }
    );

    updatedProgress.achievements = attachAchievementIcons(updatedProgress.achievements);

    res.status(200).json({
      message: 'Progress saved successfully.',
      progress: updatedProgress,
    });
  } catch (err) {
    console.error('Error saving progress:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Update checklist progress route
app.post('/api/update-checklist', async (req, res) => {
  const { username, completedSpecialties, completedDiseases } = req.body;

  if (!username || (!completedSpecialties && !completedDiseases)) {
    return res.status(400).json({ message: 'Username and completed items are required.' });
  }

  try {
    const xpGained = (completedSpecialties?.length || 0) * 20 + (completedDiseases?.length || 0) * 15;

    const updatedProgress = await UserProgress.findOneAndUpdate(
      { username },
      {
        $setOnInsert: { username },
        $inc: { xp: xpGained },
        $addToSet: {
          completedSpecialties: { $each: completedSpecialties || [] },
          completedDiseases: { $each: completedDiseases || [] },
        },
      },
      { new: true, upsert: true }
    );

    updatedProgress.achievements = attachAchievementIcons(updatedProgress.achievements);

    res.status(200).json({
      message: 'Checklist updated successfully.',
      progress: updatedProgress,
    });
  } catch (err) {
    console.error('Error updating checklist:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Add completed questions route
app.post('/api/add-questions', async (req, res) => {
  const { username, completedQuestions } = req.body;

  if (!username || !completedQuestions || !Array.isArray(completedQuestions)) {
    return res.status(400).json({ message: 'Username and a list of completed questions are required.' });
  }

  try {
    const cpGained = completedQuestions.length * 5;

    const updatedProgress = await UserProgress.findOneAndUpdate(
      { username },
      {
        $setOnInsert: { username },
        $inc: { cp: cpGained },
        $addToSet: { completedQuestions: { $each: completedQuestions } },
      },
      { new: true, upsert: true }
    );

    updatedProgress.achievements = attachAchievementIcons(updatedProgress.achievements);

    res.status(200).json({
      message: 'Questions added successfully.',
      progress: updatedProgress,
    });
  } catch (err) {
    console.error('Error adding questions:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Basic route
app.get('/', (req, res) => {
  res.send('Welcome to the RPG-themed site!');
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
