const API_BASE_URL = ""; // Use relative URLs for Render and GitHub Pages
const userId = "localUser"; // Replace with dynamic ID in real applications

// Dark Mode Toggle
const darkModeToggle = document.getElementById('dark-mode-toggle');
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

// Fetch User Progress
async function fetchUserProgress() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/user?userId=${userId}`);
    const data = await res.json();
    if (data.xp !== undefined) {
      updateXP(data.xp);
    }
  } catch (err) {
    console.error("Failed to fetch user progress:", err);
  }
}

// Update XP
function updateXP(newTotalXP) {
  const currentXP = newTotalXP;
  const currentLevel = Math.floor(currentXP / 100) + 1;
  const progress = currentXP % 100;

  document.getElementById('current-xp').innerText = currentXP;
  document.getElementById('current-level').innerText = currentLevel;
  document.getElementById('xp-progress').style.width = `${progress}%`;
}

// Reset XP
async function resetXP() {
  if (confirm("Reset all progress? This cannot be undone.")) {
    try {
      await fetch(`${API_BASE_URL}/api/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      updateXP(0);
      document.getElementById('prestige-message').innerText = 'Prestige Mode Activated!';
    } catch (err) {
      alert("Reset failed. Please try again.");
    }
  }
}

function startAdventure() {
  alert("Adventure mode is not yet implemented!");
}

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

// Initialize the app
window.onload = () => {
  fetchUserProgress();
  loadWorlds();
};
