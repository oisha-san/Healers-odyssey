let xp = 0;
let level = 1;
let questionsCompleted = 0;

// Expanded achievements with descriptions
const achievements = [
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

// Expanded disease lists for each specialty
const specialties = [
  {
    name: "Hematology",
    tasks: [
      { id: "anemia", name: "Anemia", completed: false },
      { id: "leukemia", name: "Leukemia", completed: false },
      { id: "hemophilia", name: "Hemophilia", completed: false },
      { id: "thalassemia", name: "Thalassemia", completed: false },
      { id: "iron-deficiency", name: "Iron Deficiency", completed: false },
      { id: "sickle-cell", name: "Sickle Cell Disease", completed: false },
      { id: "polycythemia-vera", name: "Polycythemia Vera", completed: false },
      { id: "lymphoma", name: "Lymphoma", completed: false },
      { id: "myelodysplastic-syndrome", name: "Myelodysplastic Syndrome", completed: false },
      { id: "hemolytic-uremic-syndrome", name: "Hemolytic Uremic Syndrome", completed: false }
    ],
  },
  {
    name: "Cardiology",
    tasks: [
      { id: "hypertension", name: "Hypertension", completed: false },
      { id: "mi", name: "Myocardial Infarction", completed: false },
      { id: "arrhythmia", name: "Arrhythmia", completed: false },
      { id: "heart-failure", name: "Heart Failure", completed: false },
      { id: "atrial-fibrillation", name: "Atrial Fibrillation", completed: false },
      { id: "endocarditis", name: "Endocarditis", completed: false },
      { id: "cardiomyopathy", name: "Cardiomyopathy", completed: false },
      { id: "coronary-artery-disease", name: "Coronary Artery Disease", completed: false },
      { id: "valvular-heart-disease", name: "Valvular Heart Disease", completed: false },
      { id: "peripheral-artery-disease", name: "Peripheral Artery Disease", completed: false },
      { id: "congenital-heart-disease", name: "Congenital Heart Disease", completed: false }
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
      { id: "guillain-barre", name: "Guillain-Barre Syndrome", completed: false }
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
      { id: "pulmonary-hypertension", name: "Pulmonary Hypertension", completed: false }
    ],
  },
];

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
  const xpForNextLevel = level * 200; // Increased XP requirement per level
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

// Check for new achievements and display them
function checkAchievements() {
  const achievementList = document.getElementById("achievement-list");
  achievementList.innerHTML = "";

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

    if (achieved) {
      const li = document.createElement("li");
      li.innerHTML = `
        <div>
          <span>${achievement.icon} ${achievement.name}</span>
          <p class="achievement-description">${achievement.description}</p>
        </div>
      `;
      achievementList.appendChild(li);
    }
  });
}

// Helper function to calculate total XP earned from completed tasks (each task awards 50 XP)
function getTotalXPFromCompletedTasks() {
  let total = 0;
  specialties.forEach((specialty) => {
    specialty.tasks.forEach((task) => {
      if (task.completed) total += 50;
    });
  });
  return total;
}

// Log task completions and add XP
function logTask() {
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

// Render the specialties and their tasks
function renderSpecialties() {
  const container = document.getElementById("specialty-container");
  container.innerHTML = "";

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
          checkAchievements();
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
  checkAchievements();
  renderSpecialties();
};