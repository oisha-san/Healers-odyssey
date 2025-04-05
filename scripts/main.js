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
    <div class="world">
      <h3>${world.name}</h3>
      <p>${world.description}</p>
    </div>
  `).join('');
}

window.onload = () => {
  fetchUserProgress();
  fetchWorlds();
};
