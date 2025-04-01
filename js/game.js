const gameData = {
    players: {},
    currentPlayer: null,
    defaultPlayer: {
        username: '',
        password: '',
        xp: 0,
        currentWorld: 'internal-medicine',
        currentMission: null,
        currentQuestion: 0
    },
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

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    loadGameData();
    setupEventListeners();
    checkAuthentication();
});

function loadGameData() {
    const savedPlayers = localStorage.getItem('players');
    if (savedPlayers) gameData.players = JSON.parse(savedPlayers);
}

function checkAuthentication() {
    const currentPlayer = localStorage.getItem('currentPlayer');
    if (currentPlayer && gameData.players[currentPlayer]) {
        gameData.currentPlayer = gameData.players[currentPlayer];
        initGame();
    } else {
        showLoginModal();
    }
}

function showLoginModal() {
    document.getElementById('loginModal').classList.add('active');
}

function setupEventListeners() {
    // Close modals
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.modal.active').classList.remove('active');
        });
    });

    // Login/Register
    document.getElementById('loginForm').addEventListener('submit', handleAuth);

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('currentPlayer');
        location.reload();
    });

    // Mission Start
    document.addEventListener('click', e => {
        if (e.target.closest('.btn-start-mission')) {
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

    // Next Question
    document.getElementById('nextQuestionBtn').addEventListener('click', () => {
        const mission = gameData.currentPlayer.currentMission;
        if (gameData.currentPlayer.currentQuestion < mission.questions.length) {
            showQuestion(mission.questions[gameData.currentPlayer.currentQuestion]);
        } else {
            completeMission();
        }
    });
}

function handleAuth(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    if (gameData.players[username]) {
        if (gameData.players[username].password === password) {
            loginUser(username);
        } else {
            errorMessage.textContent = 'Incorrect password';
            errorMessage.style.display = 'block';
        }
    } else {
        registerUser(username, password);
    }
}

function registerUser(username, password) {
    gameData.players[username] = {
        ...gameData.defaultPlayer,
        username,
        password
    };
    saveGameData();
    loginUser(username);
}

function loginUser(username) {
    gameData.currentPlayer = gameData.players[username];
    localStorage.setItem('currentPlayer', username);
    document.getElementById('loginModal').classList.remove('active');
    initGame();
}

function initGame() {
    renderMissions();
    updatePlayerStats();
}

function renderMissions() {
    const missionList = document.getElementById('missionList');
    missionList.innerHTML = '';
    
    gameData.worlds[gameData.currentPlayer.currentWorld].missions.forEach(mission => {
        const missionCard = document.createElement('div');
        missionCard.className = 'mission-card';
        missionCard.dataset.missionId = mission.id;
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
    document.getElementById('questionTitle').textContent = question.text;
    document.getElementById('questionText').textContent = question.text;
    document.getElementById('explanationText').textContent = '';
    document.getElementById('xpGainedText').textContent = '+0 XP';
    document.getElementById('feedbackSection').style.display = 'none';
    
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
    const mission = gameData.currentPlayer.currentMission;
    const question = gameData.worlds[gameData.currentPlayer.currentWorld]
        .questions.find(q => q.id === mission.questions[gameData.currentPlayer.currentQuestion]);
    
    const feedbackSection = document.getElementById('feedbackSection');
    feedbackSection.style.display = 'block';
    document.getElementById('explanationText').textContent = question.explanation;
    
    if (selectedIndex == question.correct) {
        const xpGained = question.xp;
        gameData.currentPlayer.xp += xpGained;
        document.getElementById('xpGainedText').textContent = `+${xpGained} XP`;
        updatePlayerStats();
    }
    
    gameData.currentPlayer.currentQuestion++;
    saveGameData();
}

function completeMission() {
    document.getElementById('mcqModal').classList.remove('active');
    gameData.currentPlayer.currentMission = null;
    gameData.currentPlayer.currentQuestion = 0;
    saveGameData();
    renderMissions();
}

function updatePlayerStats() {
    document.getElementById('playerLevel').textContent = calculateLevel(gameData.currentPlayer.xp);
    document.getElementById('playerTitle').textContent = getPlayerTitle(gameData.currentPlayer.xp);
    document.getElementById('xpText').textContent = `${gameData.currentPlayer.xp}/100 XP`;
    document.getElementById('xpBar').style.width = `${(gameData.currentPlayer.xp % 100)}%`;
}

function calculateLevel(xp) {
    return Math.floor(xp / 100) + 1;
}

function getPlayerTitle(xp) {
    const titles = ['Medical Student', 'Resident', 'Attending', 'Specialist'];
    return titles[Math.min(Math.floor(xp / 100), titles.length - 1)];
}

function saveGameData() {
    localStorage.setItem('players', JSON.stringify(gameData.players));
}
