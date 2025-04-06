const API_BASE_URL = "https://healers-odyssey.onrender.com"; // Render backend URL

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

// Fetch a question
async function fetchQuestion() {
  const specialty = document.getElementById('specialty-select').value;
  try {
    const res = await fetch(`${API_BASE_URL}/api/question?topic=${specialty}&userId=localUser`);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to fetch question");
    }
    const question = await res.json();
    displayQuestion(question);
  } catch (error) {
    console.error("Error fetching question:", error);
    document.getElementById('mcq-content').innerText = error.message || "Error fetching question. Please try again.";
  }
}

// Display the question and answers
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

// Submit an answer
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

// Fetch a mission
async function fetchMission() {
  const specialty = document.getElementById('mission-specialty-select').value;
  try {
    const res = await fetch(`${API_BASE_URL}/api/mission?topic=${specialty}&userId=localUser`);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to fetch mission");
    }
    const mission = await res.json();
    displayMission(mission);
  } catch (error) {
    console.error("Error fetching mission:", error);
    document.getElementById('mission-content').innerText = error.message || "Error fetching mission. Please try again.";
  }
}

// Display the mission
function displayMission(mission) {
  const content = document.getElementById('mission-content');
  content.innerHTML = `
    <h3>${mission.title}</h3>
    <p>${mission.story}</p>
    <ul>
      ${Object.entries(mission.options)
        .map(([key, value]) => `<li><button onclick="submitAnswer('${key}', '${mission.correct}', ${mission.xp}, '${mission.explanation}')">${key}: ${value}</button></li>`)
        .join('')}
    </ul>
  `;
}

// Fetch a boss challenge
async function fetchBoss() {
  const specialty = document.getElementById('boss-specialty-select').value;
  try {
    const res = await fetch(`${API_BASE_URL}/api/boss?topic=${specialty}&userId=localUser`);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to fetch boss challenge");
    }
    const boss = await res.json();
    displayBoss(boss);
  } catch (error) {
    console.error("Error fetching boss challenge:", error);
    document.getElementById('boss-content').innerText = error.message || "Error fetching boss challenge. Please try again.";
  }
}

// Display the boss challenge
function displayBoss(boss) {
  const content = document.getElementById('boss-content');
  content.innerHTML = `
    <p><strong>Boss Challenge:</strong> ${boss.question}</p>
    <ul>
      ${Object.entries(boss.options)
        .map(([key, value]) => `<li><button onclick="submitAnswer('${key}', '${boss.correct}', ${boss.xp}, '${boss.explanation}')">${key}: ${value}</button></li>`)
        .join('')}
    </ul>
  `;
}

// Initialize
window.onload = () => {
  fetchUserProgress();
  fetchWorlds();
};
