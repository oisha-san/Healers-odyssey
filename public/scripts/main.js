const API_BASE_URL = ""; // Use relative URLs for Render and GitHub Pages

// Fetch and display worlds
async function loadWorlds() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/worlds`);
    if (!response.ok) {
      throw new Error(`Failed to fetch worlds: ${response.statusText}`);
    }
    const worlds = await response.json();
    const container = document.getElementById("worlds-container");
    container.innerHTML = worlds
      .map(
        (world) => `
        <div class="world" onclick="enterWorld('${world.id}', '${world.name}', '${world.description}')">
          <h3>${world.name}</h3>
          <p>${world.description}</p>
        </div>
      `
      )
      .join("");
  } catch (error) {
    console.error("Error loading worlds:", error);
    const container = document.getElementById("worlds-container");
    container.innerHTML = `<p style="color: red;">Failed to load worlds. Please try again later.</p>`;
  }
}

// Enter a world
function enterWorld(id, name, description) {
  alert(`Entering the world: ${name}\nDescription: ${description}`);
}

let xp = 0;
let level = 1;
const achievements = [
  { xp: 50, name: "Novice Healer", icon: "🏅" },
  { xp: 100, name: "Intermediate Healer", icon: "🥈" },
  { xp: 200, name: "Advanced Healer", icon: "🥇" },
  { xp: 500, name: "Master Healer", icon: "🏆" },
  { xp: 1000, name: "Legendary Healer", icon: "🌟" },
  { xp: 2000, name: "Immortal Healer", icon: "🔥" },
];

const specialties = [
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
      { id: "myocardial-infarction", name: "Myocardial Infarction", completed: false },
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
    ],
  },
  {
    name: "Pulmonology",
    tasks: [
      { id: "asthma", name: "Asthma", completed: false },
      { id: "copd", name: "COPD", completed: false },
      { id: "pneumonia", name: "Pneumonia", completed: false },
      { id: "tuberculosis", name: "Tuberculosis", completed: false },
    ],
  },
];

// Update XP and level display
function updateProgress() {
  document.getElementById("current-xp").innerText = xp;
  document.getElementById("current-level").innerText = level;

  const progressBar = document.getElementById("xp-progress");
  const xpForNextLevel = level * 100;
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

// Check for new achievements
function checkAchievements() {
  const achievementList = document.getElementById("achievement-list");
  achievementList.innerHTML = "";

  achievements.forEach((achievement) => {
    if (xp >= achievement.xp) {
      const li = document.createElement("li");
      li.innerHTML = `${achievement.icon} ${achievement.name}`;
      achievementList.appendChild(li);
    }
  });
}

// Log a task and add XP
function logTask() {
  const taskInput = document.getElementById("task-input");
  const questionsCompleted = parseInt(taskInput.value, 10);

  if (!isNaN(questionsCompleted) && questionsCompleted > 0) {
    const xpGained = questionsCompleted * 10; // 10 XP per question
    xp += xpGained;
    updateProgress();
    checkAchievements();
    taskInput.value = "";
    alert(`You gained ${xpGained} XP!`);
  } else {
    alert("Please enter a valid number of questions.");
  }
}

// Render specialties and tasks
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
          xp += 20; // 20 XP per completed task
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

// Initialize the app
window.onload = () => {
  loadWorlds();
  updateProgress();
  checkAchievements();
  renderSpecialties();
};
