// ========== GAME DATA ==========
const gameData = {
    players: {},
    currentPlayer: null,
    defaultPlayer: {
        xp: 0,
        level: 1,
        streak: 0,
        currentWorld: 'internal-medicine',
        currentBossHealth: 100,
        unlockedWorlds: ['internal-medicine'],
        completedMissions: [],
        defeatedBosses: [],
        achievements: [],
        lastPlayed: new Date().toISOString(),
        joinedDate: new Date().toISOString()
    },
    worlds: {
        'internal-medicine': {
            name: 'Internal Medicine',
            icon: 'fa-heartbeat',
            theme: 'Final Fantasy',
            requiredLevel: 1,
            progress: 0,
            questions: [
                {
                    id: 'copd-1',
                    text: "A 65-year-old male with a 40-pack-year smoking history presents with worsening dyspnea...",
                    options: ["Asthma", "COPD", "Pulmonary fibrosis", "Bronchiectasis"],
                    correct: 1,
                    explanation: "The patient's history of heavy smoking...",
                    difficulty: "medium",
                    xp: 10
                }
            ],
            boss: {
                name: "Pathophysiology Phantom",
                icon: "fa-ghost",
                health: 100,
                rewards: {
                    xp: 500,
                    title: "Pulmonary Master",
                    item: "Wizard Hat"
                }
            },
            missions: [
                {
                    id: "copd-case",
                    name: "COPD Case Study",
                    icon: "fa-lungs",
                    difficulty: "medium",
                    xp: 50,
                    questions: ['copd-1'],
                    description: "A series of cases exploring chronic obstructive pulmonary disease"
                }
            ]
        }
    }
};

// ========== PROFILE SYSTEM ==========
function setupProfileSystem() {
    // Load saved players
    const savedPlayers = localStorage.getItem('healersOdysseyPlayers');
    if (savedPlayers) {
        gameData.players = JSON.parse(savedPlayers);
    }

    // Check for current player
    const currentPlayer = localStorage.getItem('currentPlayer');
    if (currentPlayer && gameData.players[currentPlayer]) {
        gameData.currentPlayer = currentPlayer;
        gameData.player = gameData.players[currentPlayer];
    } else {
        showLoginModal();
    }

    // Login form
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        if (gameData.players[username] && gameData.players[username].password === password) {
            loginPlayer(username);
        } else {
            alert("Invalid credentials!");
        }
    });

    // Registration
    document.getElementById('registerBtn').addEventListener('click', function() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        if (!username || !password) {
            alert("Please enter both username and password");
            return;
        }

        if (gameData.players[username]) {
            alert("Username already exists!");
            return;
        }

        // Create new player
        gameData.players[username] = {
            ...gameData.defaultPlayer,
            username,
            password,
            joinedDate: new Date().toISOString()
        };
        
        loginPlayer(username);
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', function() {
        gameData.currentPlayer = null;
        localStorage.removeItem('currentPlayer');
        showLoginModal();
    });
}

function loginPlayer(username) {
    gameData.currentPlayer = username;
    gameData.player = gameData.players[username];
    localStorage.setItem('currentPlayer', username);
    localStorage.setItem('healersOdysseyPlayers', JSON.stringify(gameData.players));
    document.getElementById('loginModal').classList.remove('active');
    updateProfileDisplay();
    initGame();
}

function showLoginModal() {
    document.getElementById('loginModal').classList.add('active');
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

function updateProfileDisplay() {
    const profileContent = document.getElementById('profileContent');
    if (!profileContent) return;
    
    profileContent.innerHTML = `
        <div class="profile-section">
            <div class="profile-avatar">
                <i class="fas fa-user-md"></i>
            </div>
            <div class="profile-details">
                <h3>${gameData.currentPlayer}</h3>
                <p>Level ${gameData.player.level} Healer</p>
                <p>Member since: ${new Date(gameData.player.joinedDate).toLocaleDateString()}</p>
                
                <div class="profile-stats">
                    <div class="profile-stat">
                        <h4>Missions</h4>
                        <p>${gameData.player.completedMissions.length} completed</p>
                    </div>
                    <div class="profile-stat">
                        <h4>Bosses</h4>
                        <p>${gameData.player.defeatedBosses.length} defeated</p>
                    </div>
                    <div class="profile-stat">
                        <h4>XP</h4>
                        <p>${gameData.player.xp} total</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ========== MISSION SYSTEM ==========
function renderMissions() {
    const missionList = document.getElementById('missionList');
    const allMissionsContainer = document.getElementById('allMissionsContainer');
    
    if (!missionList && !allMissionsContainer) return;
    
    const currentWorld = gameData.worlds[gameData.player.currentWorld];
    const containers = [
        { element: missionList, missions: currentWorld.missions },
        { element: allMissionsContainer, missions: Object.values(gameData.worlds).flatMap(w => w.missions) }
    ];
    
    containers.forEach(container => {
        if (!container.element) return;
        
        container.element.innerHTML = '';
        
        if (!container.missions || container.missions.length === 0) {
            container.element.innerHTML = `
                <div class="no-missions">
                    <i class="fas fa-question-circle"></i>
                    <p>No missions available yet!</p>
                </div>
            `;
            return;
        }

        container.missions.forEach(mission => {
            const world = Object.values(gameData.worlds).find(w => 
                w.missions && w.missions.some(m => m.id === mission.id)
            );
            
            const isCompleted = gameData.player.completedMissions.includes(mission.id);
            const missionCard = document.createElement('div');
            missionCard.className = `mission-card ${isCompleted ? 'completed' : ''}`;
            missionCard.innerHTML = `
                <div class="mission-icon">
                    <i class="fas ${mission.icon}"></i>
                </div>
                <div class="mission-content">
                    <h3>${mission.name}</h3>
                    <p><strong>World:</strong> ${world.name}</p>
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
                <button class="btn btn-primary btn-start-mission" 
                    ${isCompleted ? 'disabled' : ''}>
                    ${isCompleted ? 'Completed' : 'Start Mission'}
                </button>
            `;

            if (!isCompleted) {
                missionCard.querySelector('button').addEventListener('click', () => {
                    startMission(mission.id);
                });
            }
            
            container.element.appendChild(missionCard);
        });
    });
}

// [Keep all other existing functions like startMission, loadQuestion, etc.]

// ========== GAME INITIALIZATION ==========
function initGame() {
    setupProfileSystem();
    setupNavigation();
    setupWorldSelection();
    setupBossBattle();
    setupQuestionModal();
    updatePlayerStats();
    renderWorldProgress();
    renderMissions();
    renderBossStatus();
    updateProfileDisplay();
    
    console.log("Game initialized!");
}

document.addEventListener('DOMContentLoaded', function() {
    // Show login modal if no player
    if (!gameData.currentPlayer) {
        showLoginModal();
    } else {
        initGame();
    }
});
