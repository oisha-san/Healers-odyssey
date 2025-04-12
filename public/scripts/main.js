const API_BASE_URL = ""; // Use relative URLs for Render

let currentWorld = null;

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

// Fetch a dynamically generated question
async function generateQuestion() {
  const specialty = document.getElementById('specialty-select').value;
  try {
    const res = await fetch(`${API_BASE_URL}/api/generate-question`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: specialty }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to generate question");
    }
    const question = await res.json();
    displayQuestion(question);
  } catch (error) {
    console.error("Error generating question:", error);
    document.getElementById('mcq-content').innerText = error.message || "Error generating question. Please try again.";
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

// Show missions
async function showMissions() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/missions?worldId=${currentWorld}`);
    const missions = await res.json();
    const container = document.getElementById('missions-container');
    container.style.display = 'block';
    container.innerHTML = missions.map(mission => `
      <div class="mission">
        <h4>${mission.title}</h4>
        <p>${mission.question}</p>
        <ul>
          ${Object.entries(mission.options).map(([key, value]) => `
            <li><button onclick="submitAnswer('${key}', '${mission.correct}', '${mission.explanation}', ${mission.xp})">${key}: ${value}</button></li>
          `).join('')}
        </ul>
      </div>
    `).join('');
  } catch (error) {
    console.error("Error loading missions:", error);
  }
}

// Show boss battles
async function showBossBattles() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/bosses?worldId=${currentWorld}`);
    const bosses = await res.json();
    const container = document.getElementById('bosses-container');
    container.style.display = 'block';
    container.innerHTML = bosses.map(boss => `
      <div class="boss">
        <h4>${boss.bossName}</h4>
        <p>${boss.question}</p>
        <ul>
          ${Object.entries(boss.options).map(([key, value]) => `
            <li><button onclick="submitAnswer('${key}', '${boss.correct}', '${boss.explanation}', ${boss.damage})">${key}: ${value}</button></li>
          `).join('')}
        </ul>
      </div>
    `).join('');
  } catch (error) {
    console.error("Error loading boss battles:", error);
  }
}

// Submit an answer
function submitAnswer(selected, correct, explanation, reward) {
  if (selected === correct) {
    alert(`Correct! You earned ${reward} points.\nExplanation: ${explanation}`);
  } else {
    alert(`Incorrect. The correct answer is ${correct}.\nExplanation: ${explanation}`);
  }
}

// Go back to the main menu
function goBackToMainMenu() {
  document.getElementById('main-menu').style.display = 'block';
  document.getElementById('world-view').style.display = 'none';
  document.getElementById('missions-container').style.display = 'none';
  document.getElementById('bosses-container').style.display = 'none';
}

// Initialize
window.onload = loadWorlds;
