<<<<<<< HEAD
const API_BASE_URL = "https://healers-odyssey-1.onrender.com"; // Render backend URL

async function fetchUserProgress() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/user?userId=localUser`);
    const data = await res.json();
    document.getElementById('current-xp').innerText = data.xp || 0;
    document.getElementById('current-level').innerText = Math.floor((data.xp || 0) / 100) + 1;
  } catch (error) {
    console.error("Error fetching user progress:", error);
  }
}

async function fetchQuestion() {
  const specialty = document.getElementById('specialty-select').value;
  try {
    const res = await fetch(`${API_BASE_URL}/api/question?topic=${specialty}&userId=localUser`);
    if (!res.ok) throw new Error("Failed to fetch question");
    const question = await res.json();
    displayQuestion(question);
  } catch (error) {
    console.error("Error fetching question:", error);
    document.getElementById('mcq-content').innerText = "Error fetching question. Please try again.";
  }
}

function displayQuestion(question) {
  const content = document.getElementById('mcq-content');
  content.innerHTML = `
    <p><strong>Question:</strong> ${question.question}</p>
    <ul>
      ${Object.entries(question.options)
        .map(([key, value]) => `<li><button onclick="submitAnswer('${key}', '${question.correct}', ${question.xp}, '${question.explanation}')">${key}: ${value}</button></li>`)
        .join('')}
    </ul>
  `;
}

function submitAnswer(selected, correct, xp, explanation) {
  const explanationDiv = document.getElementById('mcq-explanation');
  if (selected === correct) {
    explanationDiv.innerHTML = `Correct! You earned ${xp} XP.<br>${explanation}`;
  } else {
    explanationDiv.innerHTML = `Incorrect. The correct answer is ${correct}.<br>${explanation}`;
  }
}

async function fetchWorlds() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/worlds`);
    if (!res.ok) throw new Error("Failed to fetch worlds");
    const worlds = await res.json();
    displayWorlds(worlds);
  } catch (error) {
    console.error("Error fetching worlds:", error);
    document.getElementById('worlds-content').innerText = "Error fetching worlds. Please try again.";
  }
}

function displayWorlds(worlds) {
  const content = document.getElementById('worlds-content');
  content.innerHTML = worlds.map(world => `
    <div class="world" onclick="setBackground('${world.background}')">
      <h3>${world.name}</h3>
      <p>${world.description}</p>
    </div>
  `).join('');
}

function setBackground(image) {
  document.getElementById('background-overlay').style.backgroundImage = `url('./assets/${image}')`;
}

async function startAdventure() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/adventure?userId=localUser`);
    const data = await res.json();
    alert(`Adventure progress: ${data.progress}`);
  } catch (error) {
    console.error("Error starting adventure:", error);
  }
}

window.onload = () => {
  fetchUserProgress();
  fetchWorlds();
=======
const API_BASE_URL = "https://healers-odyssey-1.onrender.com";
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

// Fetch User Progress on Load
window.onload = () => {
  fetchUserProgress();
>>>>>>> main
};
