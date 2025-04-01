// Game Data Structure
const gameData = {
    players: {},
    currentPlayer: null,
    worlds: {
        'internal-medicine': {
            missions: [
                {
                    id: 'copd-case',
                    name: 'COPD Case Study',
                    icon: 'fa-lungs',
                    difficulty: 'medium',
                    xp: 50,
                    questions: ['copd-1'],
                    description: 'Diagnose and treat COPD cases'
                }
            ],
            questions: [
                {
                    id: 'copd-1',
                    text: 'A 65-year-old smoker presents with dyspnea...',
                    options: ['Asthma', 'COPD', 'Bronchiectasis'],
                    correct: 1,
                    explanation: 'COPD is most likely...',
                    xp: 20
                }
            ]
        }
    }
};

// Game Initialization
function initGame() {
    setupEventListeners();
    loadPlayerData();
    renderMissions();
    updatePlayerStats();
}

// Event Listeners
function setupEventListeners() {
    // Login/Register
    document.getElementById('loginForm').addEventListener('submit', e => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (gameData.players[username]) {
            if (gameData.players[username].password === password) {
                loginUser(username);
            }
        } else {
            registerUser(username, password);
        }
    });

    // Mission Start
    document.addEventListener('click', e => {
        if (e.target.classList.contains('btn-start-mission')) {
            const missionId = e.target.closest('.mission-card').dataset.missionId;
            startMission(missionId);
        }
    });

    // Answer Selection
    document.getElementById('optionsList').addEventListener('click', e => {
        if (e.target.classList.contains('option-item')) {
            handleAnswer(e.target.dataset.index);
        }
    });
}

// Mission System
function renderMissions() {
    const missionList = document.getElementById('missionList');
    missionList.innerHTML = '';
    
    const currentWorld = gameData.worlds[gameData.currentPlayer.currentWorld];
    currentWorld.missions.forEach(mission => {
        const missionCard = document.createElement('div');
        missionCard.className = 'mission-card';
        missionCard.innerHTML = `
            <div class="mission-icon">
                <i class="fas ${mission.icon}"></i>
            </div>
            <div class="mission-content">
                <h3>${mission.name}</h3>
                <p>${mission.description}</p>
                <div class="mission-meta">
                    <span class="mission-difficulty difficulty-${mission.difficulty}">
                        ${mission.difficulty}
                    </span>
                    <span class="mission-xp">
                        <i class="fas fa-bolt"></i> ${mission.xp} XP
                    </span>
                </div>
            </div>
            <button class="btn btn-primary btn-start-mission">
                Start Mission
            </button>
        `;
        missionList.appendChild(missionCard);
    });
}

function startMission(missionId) {
    const mission = gameData.worlds[gameData.currentPlayer.currentWorld]
        .missions.find(m => m.id === missionId);
    
    gameData.currentPlayer.currentMission = mission;
    gameData.currentPlayer.currentQuestion = 0;
    showQuestion(mission.questions[0]);
}

function showQuestion(questionId) {
    const question = gameData.worlds[gameData.currentPlayer.currentWorld]
        .questions.find(q => q.id === questionId);
    
    document.getElementById('mcqModal').classList.add('active');
    document.getElementById('questionText').textContent = question.text;
    
    const optionsList = document.getElementById('optionsList');
    optionsList.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const li = document.createElement('li');
        li.className = 'option-item';
        li.textContent = option;
        li.dataset.index = index;
        optionsList.appendChild(li);
    });
}

function handleAnswer(selectedIndex) {
    const question = gameData.currentPlayer.currentMission
        .questions[gameData.currentPlayer.currentQuestion];
    
    if (selectedIndex == question.correct) {
        gameData.currentPlayer.xp += question.xp;
        updatePlayerStats();
    }
    
    gameData.currentPlayer.currentQuestion++;
    
    if (gameData.currentPlayer.currentQuestion < question.options.length) {
        showQuestion(question.id);
    } else {
        completeMission();
    }
}

// User System
function registerUser(username, password) {
    gameData.players[username] = {
        ...gameData.defaultPlayer,
        username,
        password
    };
    loginUser(username);
}

function loginUser(username) {
    gameData.currentPlayer = username;
    localStorage.setItem('currentPlayer', username);
    document.getElementById('loginModal').classList.remove('active');
    initGame();
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    const savedPlayers = localStorage.getItem('players');
    if (savedPlayers) gameData.players = JSON.parse(savedPlayers);
    
    const currentPlayer = localStorage.getItem('currentPlayer');
    if (currentPlayer) loginUser(currentPlayer);
    else document.getElementById('loginModal').classList.add('active');
});
