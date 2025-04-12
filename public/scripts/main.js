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
  { xp: 50, name: "Novice Healer" },
  { xp: 100, name: "Intermediate Healer" },
  { xp: 200, name: "Advanced Healer" },
  { xp: 500, name: "Master Healer" },
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
    updateProgress();
  }
}

// Check for new achievements
function checkAchievements() {
  const achievementList = document.getElementById("achievement-list");
  achievementList.innerHTML = "";

  achievements.forEach((achievement) => {
    if (xp >= achievement.xp) {
      const li = document.createElement("li");
      li.innerText = achievement.name;
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

// Initialize the app
window.onload = () => {
  loadWorlds();
  updateProgress();
  checkAchievements();
};
