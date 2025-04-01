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
    },
    achievements: [
        {
            id: "first-mission",
            name: "First Steps",
            description: "Complete your first mission",
            xp: 50,
            unlocked: false
        },
        {
            id: "xp-100",
            name: "Scholar",
            description: "Earn 100 XP",
            xp: 100,
            unlocked: false
        }
    ]
};

// ========== INITIALIZATION ==========
function initGame() {
    loadGame();
    setupMissions();
    checkDailyLogin();
    updatePlayerStats();
    renderAchievements();
}

// ========== DAILY LOGIN REWARDS ==========
function checkDailyLogin() {
    const lastPlayed = new Date(gameData.player.lastPlayed);
    const today = new Date();
    
    if ((today - lastPlayed) / (1000 * 60 * 60 * 24) >= 1) {
        gameData.player.streak++;
        gameData.player.xp += 50;
        saveGame();
        alert(`Daily reward: +50 XP! Streak: ${gameData.player.streak} days`);
    }

    gameData.player.lastPlayed = today.toISOString();
}

// ========== MISSIONS ==========
function startMission(missionId) {
    const world = gameData.worlds[gameData.player.currentWorld];
    const mission = world.missions.find(m => m.id === missionId);
    
    if (!mission) {
        alert("Mission not found!");
        return;
    }
    
    gameData.player.currentMission = mission;
    gameData.player.currentQuestion = 0;
    
    loadQuestion(mission.questions[0]);
}

function loadQuestion(questionId) {
    const world = gameData.worlds[gameData.player.currentWorld];
    const question = world.questions.find(q => q.id === questionId);
    
    document.getElementById('questionText').textContent = question.text;
    
    const optionsList = document.getElementById('optionsList');
    optionsList.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-item';
        button.textContent = option;
        button.onclick = () => checkAnswer(question, index);
        optionsList.appendChild(button);
    });
}

function checkAnswer(question, selectedIndex) {
    if (selectedIndex === question.correct) {
        gameData.player.xp += question.xp;
        alert("Correct!");
    } else {
        alert("Incorrect!");
    }

    nextQuestion();
}

function nextQuestion() {
    const mission = gameData.player.currentMission;
    gameData.player.currentQuestion++;
    
    if (gameData.player.currentQuestion < mission.questions.length) {
        loadQuestion(mission.questions[gameData.player.currentQuestion]);
    } else {
        completeMission();
    }
}

function completeMission() {
    gameData.player.completedMissions.push(gameData.player.currentMission.id);
    alert(`Mission Completed! +${gameData.player.currentMission.xp} XP`);
    gameData.player.xp += gameData.player.currentMission.xp;
    
    checkAchievements();
    saveGame();
}

// ========== ACHIEVEMENTS ==========
function checkAchievements() {
    gameData.achievements.forEach(ach => {
        if (!ach.unlocked) {
            if (ach.id === "first-mission" && gameData.player.completedMissions.length > 0) {
                unlockAchievement(ach);
            }
            if (ach.id === "xp-100" && gameData.player.xp >= 100) {
                unlockAchievement(ach);
            }
        }
    });
}

function unlockAchievement(achievement) {
    achievement.unlocked = true;
    gameData.player.achievements.push(achievement.id);
    alert(`Achievement Unlocked: ${achievement.name}!`);
}

function renderAchievements() {
    const achievementsList = document.getElementById('achievementsList');
    achievementsList.innerHTML = '';

    gameData.achievements.forEach(ach => {
        const item = document.createElement('li');
        item.textContent = `${ach.name} - ${ach.unlocked ? "✅" : "❌"}`;
        achievementsList.appendChild(item);
    });
}

// ========== SAVE/LOAD ==========
function saveGame() {
    gameData.player.lastPlayed = new Date().toISOString();
    localStorage.setItem('healersOdysseySave', JSON.stringify(gameData.player));
}

function loadGame() {
    const savedGame = localStorage.getItem('healersOdysseySave');
    if (savedGame) {
        Object.assign(gameData.player, JSON.parse(savedGame));
    }
}

// ========== START ==========
document.addEventListener('DOMContentLoaded', initGame);
