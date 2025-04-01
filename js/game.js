// ========== GAME DATA ==========
const gameData = {
    player: {
        xp: 0,
        level: 1,
        streak: 0,
        currentWorld: 'internal-medicine',
        currentBossHealth: 100,
        unlockedWorlds: ['internal-medicine'],
        completedMissions: [],
        defeatedBosses: [],
        achievements: [],
        lastPlayed: new Date().toISOString()
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
                },
                {
                    id: 'acs-1',
                    text: "A 58-year-old female presents with crushing substernal chest pain radiating to her left arm...",
                    options: ["Left anterior descending", "Left circumflex", "Right coronary artery"],
                    correct: 2,
                    explanation: "ST elevation in the inferior leads...",
                    difficulty: "hard",
                    xp: 20
                }
                // Add more questions as needed
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
                // Add more missions as needed
            ]
        }
        // Add more worlds as needed
    },
    achievements: [
        {
            id: "first-blood",
            name: "First Blood",
            description: "Defeat your first boss",
            icon: "fa-tint",
            xp: 100,
            unlocked: false
        }
        // Add more achievements as needed
    ]
};

// ========== GAME FUNCTIONS ==========
function initGame() {
    loadGame();
    setupNavigation();
    setupWorldSelection();
    setupMissions();
    setupBossBattle();
    setupQuestionModal();
    updatePlayerStats();
    renderWorldProgress();
    renderMissions();
    renderBossStatus();
    
    console.log("Game initialized!");
}

function setupNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            
            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Show selected section
            document.querySelectorAll('.content-section').forEach(sec => {
                sec.style.display = 'none';
            });
            document.getElementById(section).style.display = 'block';
        });
    });
}

function startMission(missionId) {
    const world = gameData.worlds[gameData.player.currentWorld];
    const mission = world.missions.find(m => m.id === missionId);
    
    if (!mission) {
        alert("Mission not found!");
        return;
    }
    
    gameData.player.currentMission = mission;
    gameData.player.currentQuestion = 0;
    gameData.player.correctAnswers = 0;
    
    loadQuestion(mission.questions[0]);
}

// ========== CORE GAME LOGIC ==========
function loadQuestion(questionId) {
    const world = gameData.worlds[gameData.player.currentWorld];
    const question = world.questions.find(q => q.id === questionId);
    
    document.getElementById('questionTitle').textContent = `Mission: ${gameData.player.currentMission.name}`;
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
    
    document.getElementById('explanationText').textContent = question.explanation;
    document.getElementById('xpGainedText').textContent = `+${question.xp} XP (${question.difficulty})`;
    document.getElementById('streakCounter').textContent = `${gameData.player.streak}-day streak`;
    
    document.getElementById('feedbackSection').classList.remove('show');
    document.getElementById('mcqModal').classList.add('active');
}

// ========== SAVE/LOAD SYSTEM ==========
function saveGame() {
    try {
        gameData.player.lastPlayed = new Date().toISOString();
        localStorage.setItem('healersOdysseySave', JSON.stringify(gameData.player));
    } catch (e) {
        console.error("Failed to save game:", e);
    }
}

function loadGame() {
    const savedGame = localStorage.getItem('healersOdysseySave');
    if (savedGame) {
        try {
            const savedData = JSON.parse(savedGame);
            Object.assign(gameData.player, savedData);
            console.log("Game loaded from save");
        } catch (e) {
            console.error("Error loading save:", e);
        }
    }
}

// ========== START THE GAME ==========
document.addEventListener('DOMContentLoaded', initGame);
