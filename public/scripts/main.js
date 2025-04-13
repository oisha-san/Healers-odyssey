export let xp = 0;
export let level = 1;
export let questionsCompleted = 0;

// Expanded achievements with descriptions
export const achievements = [
  // XP Achievements
  { xp: 100, name: "Novice Healer", icon: "🏅", description: "Earn 100 XP to unlock this achievement." },
  { xp: 300, name: "Intermediate Healer", icon: "🥈", description: "Earn 300 XP to unlock this achievement." },
  { xp: 600, name: "Advanced Healer", icon: "🥇", description: "Earn 600 XP to unlock this achievement." },
  { xp: 1000, name: "Master Healer", icon: "🏆", description: "Earn 1000 XP to unlock this achievement." },
  { xp: 2000, name: "Legendary Healer", icon: "🌟", description: "Earn 2000 XP to unlock this achievement." },
  { xp: 5000, name: "Immortal Healer", icon: "🔥", description: "Earn 5000 XP to unlock this achievement." },
  // Question Completion Achievements
  { questions: 50, name: "Question Novice", icon: "📘", description: "Complete 50 questions to unlock this achievement." },
  { questions: 100, name: "Question Enthusiast", icon: "📗", description: "Complete 100 questions to unlock this achievement." },
  { questions: 250, name: "Question Master", icon: "📙", description: "Complete 250 questions to unlock this achievement." },
  { questions: 500, name: "Question Legend", icon: "📚", description: "Complete 500 questions to unlock this achievement." },
  { questions: 1000, name: "Question Grandmaster", icon: "🏅", description: "Complete 1000 questions to unlock this achievement." },
  { questions: 2000, name: "Question Conqueror", icon: "👑", description: "Complete 2000 questions to unlock this achievement." },
  // Specialty Completion Achievements
  { overall: true, name: "Omniscient Healer", icon: "👑", description: "Complete all tasks in all specialties to unlock this achievement." },
  // Domain achievements for each specialty will be added after defining specialties
];

// Expanded specialties and their diseases
export const specialties = [
  {
    name: "Hematology",
    tasks: [
      { id: "anemia", name: "Anemia", completed: false },
      { id: "leukemia", name: "Leukemia", completed: false },
      { id: "hemophilia", name: "Hemophilia", completed: false },
      { id: "thalassemia", name: "Thalassemia", completed: false },
    ],
  },
  {
    name: "Cardiology",
    tasks: [
      { id: "hypertension", name: "Hypertension", completed: false },
      { id: "mi", name: "Myocardial Infarction", completed: false },
      { id: "arrhythmia", name: "Arrhythmia", completed: false },
      { id: "heart-failure", name: "Heart Failure", completed: false },
    ],
  },
  {
    name: "Neurology",
    tasks: [
      { id: "stroke", name: "Stroke", completed: false },
      { id: "epilepsy", name: "Epilepsy", completed: false },
      { id: "parkinson", name: "Parkinson's Disease", completed: false },
      { id: "migraine", name: "Migraine", completed: false },
      { id: "multiple-sclerosis", name: "Multiple Sclerosis", completed: false },
      { id: "alzheimer", name: "Alzheimer's Disease", completed: false },
      { id: "als", name: "Amyotrophic Lateral Sclerosis", completed: false },
      { id: "huntington", name: "Huntington's Disease", completed: false },
      { id: "neuropathy", name: "Neuropathy", completed: false },
      { id: "brain-tumor", name: "Brain Tumor", completed: false },
      { id: "guillain-barre", name: "Guillain-Barre Syndrome", completed: false },
      { id: "trigeminal-neuralgia", name: "Trigeminal Neuralgia", completed: false },
    ],
  },
  {
    name: "Pulmonology",
    tasks: [
      { id: "asthma", name: "Asthma", completed: false },
      { id: "copd", name: "COPD", completed: false },
      { id: "pneumonia", name: "Pneumonia", completed: false },
      { id: "tb", name: "Tuberculosis", completed: false },
      { id: "bronchitis", name: "Bronchitis", completed: false },
      { id: "lung-cancer", name: "Lung Cancer", completed: false },
      { id: "pulmonary-embolism", name: "Pulmonary Embolism", completed: false },
      { id: "cystic-fibrosis", name: "Cystic Fibrosis", completed: false },
      { id: "interstitial-lung-disease", name: "Interstitial Lung Disease", completed: false },
      { id: "sleep-apnea", name: "Sleep Apnea", completed: false },
      { id: "sarcoidosis", name: "Sarcoidosis", completed: false },
    ],
  },
  {
    name: "Gastroenterology",
    tasks: [
      { id: "gerd", name: "GERD", completed: false },
      { id: "peptic-ulcer", name: "Peptic Ulcer Disease", completed: false },
      { id: "crohns", name: "Crohn's Disease", completed: false },
      { id: "ulcerative-colitis", name: "Ulcerative Colitis", completed: false },
      { id: "hepatitis", name: "Hepatitis", completed: false },
      { id: "cirrhosis", name: "Cirrhosis", completed: false },
      { id: "pancreatitis", name: "Pancreatitis", completed: false },
      { id: "ibs", name: "Irritable Bowel Syndrome", completed: false },
      { id: "celiac", name: "Celiac Disease", completed: false },
      { id: "gallstones", name: "Gallstones", completed: false },
      { id: "diverticulitis", name: "Diverticulitis", completed: false },
    ],
  },
  {
    name: "Endocrinology",
    tasks: [
      { id: "diabetes", name: "Diabetes Mellitus", completed: false },
      { id: "hypothyroidism", name: "Hypothyroidism", completed: false },
      { id: "hyperthyroidism", name: "Hyperthyroidism", completed: false },
      { id: "cushings", name: "Cushing's Syndrome", completed: false },
      { id: "addisons", name: "Addison's Disease", completed: false },
      { id: "pcos", name: "Polycystic Ovary Syndrome", completed: false },
      { id: "osteoporosis", name: "Osteoporosis", completed: false },
      { id: "acromegaly", name: "Acromegaly", completed: false },
      { id: "pheochromocytoma", name: "Pheochromocytoma", completed: false },
      { id: "hyperparathyroidism", name: "Hyperparathyroidism", completed: false },
      { id: "diabetes-insipidus", name: "Diabetes Insipidus", completed: false },
    ],
  },
  {
    name: "Nephrology",
    tasks: [
      { id: "ckd", name: "Chronic Kidney Disease", completed: false },
      { id: "nephrotic-syndrome", name: "Nephrotic Syndrome", completed: false },
      { id: "nephritic-syndrome", name: "Nephritic Syndrome", completed: false },
      { id: "acute-kidney-injury", name: "Acute Kidney Injury", completed: false },
      { id: "renal-stones", name: "Renal Stones", completed: false },
      { id: "glomerulonephritis", name: "Glomerulonephritis", completed: false },
      { id: "polycystic-kidney-disease", name: "Polycystic Kidney Disease", completed: false },
      { id: "renal-vascular-disease", name: "Renal Vascular Disease", completed: false },
      { id: "renal-tubular-acidosis", name: "Renal Tubular Acidosis", completed: false },
      { id: "hydronephrosis", name: "Hydronephrosis", completed: false },
    ],
  },
  {
    name: "Rheumatology",
    tasks: [
      { id: "rheumatoid-arthritis", name: "Rheumatoid Arthritis", completed: false },
      { id: "lupus", name: "Systemic Lupus Erythematosus", completed: false },
      { id: "gout", name: "Gout", completed: false },
      { id: "ankylosing-spondylitis", name: "Ankylosing Spondylitis", completed: false },
      { id: "sjogrens", name: "Sjogren's Syndrome", completed: false },
      { id: "vasculitis", name: "Vasculitis", completed: false },
      { id: "scleroderma", name: "Scleroderma", completed: false },
      { id: "polymyositis", name: "Polymyositis", completed: false },
      { id: "dermatomyositis", name: "Dermatomyositis", completed: false },
      { id: "fibromyalgia", name: "Fibromyalgia", completed: false },
    ],
  },
];

// Debugging: Log specialties data during initialization
console.log('Specialties at initialization:', specialties);

// Temporary: Display specialties data on the page for debugging
const debugContainer = document.createElement('div');
debugContainer.id = 'debug-specialties';
debugContainer.style.border = '1px solid red';
debugContainer.style.padding = '10px';
debugContainer.style.margin = '10px';
debugContainer.innerHTML = `<pre>${JSON.stringify(specialties, null, 2)}</pre>`;
document.body.appendChild(debugContainer);

// After defining specialties, automatically add disease-specific achievements
specialties.forEach((specialty) => {
  specialty.tasks.forEach((task) => {
    achievements.push({
      diseaseId: task.id,
      name: `Conquered ${task.name}`,
      icon: "✅",
      description: `Complete the task "${task.name}" to unlock this achievement.`,
    });
  });
});

// Add specialty completion achievements (Domain Conqueror) for each specialty
specialties.forEach((specialty) => {
  achievements.push({
    specialty: specialty.name,
    name: `Domain Conqueror: ${specialty.name}`,
    icon: "🏅",
    description: `Complete all tasks in the ${specialty.name} specialty to unlock this achievement.`,
  });
});

// Update XP and level display
function updateProgress() {
  document.getElementById("current-xp").innerText = xp;
  document.getElementById("current-level").innerText = level;

  const progressBar = document.getElementById("xp-progress");
  const xpForNextLevel = level * 200;
  const progressPercentage = (xp / xpForNextLevel) * 100;
  progressBar.style.width = `${Math.min(progressPercentage, 100)}%`;

  if (xp >= xpForNextLevel) {
    level++;
    xp -= xpForNextLevel;
    showLevelUpAnimation();
    updateProgress();
  }
}

// Show level-up animation
function showLevelUpAnimation() {
  const header = document.querySelector("header h1");
  header.innerText = `Level Up! You are now Level ${level}! 🎉`;
  header.classList.add("level-up");
  setTimeout(() => {
    header.innerText = "Healer's Odyssey";
    header.classList.remove("level-up");
  }, 3000);
}

// Log task completions and add XP
export function logTask() {
  const taskInput = document.getElementById("task-input");
  const questions = parseInt(taskInput.value, 10);

  if (!isNaN(questions) && questions > 0) {
    const xpGained = questions * 5; // Reduced XP per question to increase challenge
    xp += xpGained;
    questionsCompleted += questions; // Increment questions completed
    updateProgress();
    checkAchievements();
    taskInput.value = "";
    alert(`You gained ${xpGained} XP and completed ${questions} questions!`);
  } else {
    alert("Please enter a valid number of questions.");
  }
}

// Check for new achievements and display them
function checkAchievements() {
  const unlockedList = document.getElementById("unlocked-achievements");
  const lockedList = document.getElementById("locked-achievements");
  unlockedList.innerHTML = "";
  lockedList.innerHTML = "";

  achievements.forEach((achievement) => {
    let achieved = false;

    // XP achievements check (including XP from tasks)
    if (achievement.xp && xp + getTotalXPFromCompletedTasks() >= achievement.xp) {
      achieved = true;
    }
    // Question completion achievements
    else if (achievement.questions && questionsCompleted >= achievement.questions) {
      achieved = true;
    }
    // Disease-specific achievements
    else if (achievement.diseaseId) {
      specialties.forEach((specialty) => {
        const disease = specialty.tasks.find((t) => t.id === achievement.diseaseId);
        if (disease && disease.completed) {
          achieved = true;
        }
      });
    }
    // Domain achievements for completed specialties
    else if (achievement.specialty) {
      const specialty = specialties.find((s) => s.name === achievement.specialty);
      if (specialty && specialty.tasks.every((task) => task.completed)) {
        achieved = true;
      }
    }
    // Overall achievement when all specialties are completed
    else if (achievement.overall) {
      const allCompleted = specialties.every((specialty) =>
        specialty.tasks.every((task) => task.completed)
      );
      if (allCompleted) {
        achieved = true;
      }
    }

    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        <span>${achievement.icon} ${achievement.name}</span>
        <p class="achievement-description">${achievement.description}</p>
      </div>
    `;

    if (achieved) {
      unlockedList.appendChild(li);
    } else {
      lockedList.appendChild(li);
    }
  });
}

// Helper function to calculate total XP earned from completed tasks (each task awards 50 XP)
export function getTotalXPFromCompletedTasks() {
  let total = 0;
  specialties.forEach((specialty) => {
    specialty.tasks.forEach((task) => {
      if (task.completed) total += 50;
    });
  });
  return total;
}

// Render the specialties and their tasks
export function renderSpecialties() {
  console.log('Rendering specialties:', specialties);
  const container = document.getElementById("specialty-container");
  container.innerHTML = ""; // Clear existing content

  specialties.forEach((specialty) => {
    const specialtyDiv = document.createElement("div");
    specialtyDiv.className = "specialty";

    const specialtyTitle = document.createElement("h3");
    specialtyTitle.innerText = specialty.name;
    specialtyDiv.appendChild(specialtyTitle);

    const taskList = document.createElement("ul");
    specialty.tasks.forEach((task) => {
      const taskItem = document.createElement("li");
      taskItem.innerHTML = `
        <input type="checkbox" id="${task.id}" ${task.completed ? "checked" : ""} />
        <label for="${task.id}">${task.name}</label>
      `;
      taskItem.querySelector("input").addEventListener("change", (e) => {
        task.completed = e.target.checked;
        if (task.completed) {
          xp += 50; // XP for each completed task
          updateProgress();
        }
      });
      taskList.appendChild(taskItem);
    });

    specialtyDiv.appendChild(taskList);
    container.appendChild(specialtyDiv);
  });
}

// Initialize the app on window load
window.onload = () => {
  updateProgress();
  renderSpecialties();
};

// Authentication functions
let currentUser = null;

const BASE_URL = 'https://healers-odyssey.onrender.com'; // Updated to the actual Render backend URL

// Ensure specialties and achievements are dynamically updated after login
function updateUIAfterLogin(user) {
  document.getElementById('auth-section').style.display = 'none';
  document.getElementById('xp-section').style.display = 'block';
  document.getElementById('task-section').style.display = 'block';
  document.getElementById('specialty-section').style.display = 'block';
  document.getElementById('achievements-link').style.display = 'block';
  document.getElementById('auth-message').innerText = `Welcome, ${user.username}!`;
  renderSpecialties();
  checkAchievements();
}

// Modify signUp function to provide better feedback
async function signUp() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  console.log('Sign-Up Request:', { username, password });

  try {
    const response = await fetch(`${BASE_URL}/api/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    console.log('Sign-Up Response:', data);
    document.getElementById('auth-message').innerText = data.message;

    if (response.ok) {
      logIn(); // Automatically log in after sign-up
    }
  } catch (error) {
    console.error('Error signing up:', error);
  }
}

// Modify logIn function to update UI dynamically
async function logIn() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  console.log('Login Request:', { username, password });

  try {
    const response = await fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    console.log('Login Response:', data);
    document.getElementById('auth-message').innerText = data.message;

    if (response.ok) {
      currentUser = data.user;
      localStorage.setItem('username', username); // Store username in localStorage
      loadUserProgress();
      updateUIAfterLogin(currentUser);
    }
  } catch (error) {
    console.error('Error logging in:', error);
  }
}

// Load user progress
function loadUserProgress() {
  if (currentUser) {
    xp = currentUser.xp;
    level = currentUser.level;
    questionsCompleted = currentUser.questionsCompleted;
    updateProgress();
    renderSpecialties();
    document.getElementById('auth-section').style.display = 'none';
  }
}

// Save user progress
async function saveUserProgress() {
  if (currentUser) {
    currentUser.xp = xp;
    currentUser.level = level;
    currentUser.questionsCompleted = questionsCompleted;

    try {
      await fetch(`${BASE_URL}/api/save-progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: currentUser.username, progress: currentUser }),
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }
}

// Call saveUserProgress whenever progress changes
window.addEventListener('beforeunload', saveUserProgress);