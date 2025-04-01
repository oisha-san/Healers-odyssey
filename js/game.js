const gameData = {
    player: {
        xp: 0,
        level: 1,
        health: 100,
        currentWorld: 'internal-medicine',
        completedMissions: []
    },
    worlds: {
        'internal-medicine': {
            name: 'Final Fantasy Realm',
            theme: '#1e90ff',
            missions: [
                {
                    id: 'copd-case',
                    name: 'COPD Case Study',
                    questions: [
                        {
                            text: 'A 65-year-old smoker presents with dyspnea...',
                            options: ['Asthma', 'COPD', 'Bronchiectasis'],
                            correct: 1,
                            explanation: 'COPD is characterized by persistent respiratory symptoms...',
                            xp: 20
                        }
                    ]
                }
            ],
            boss: {
                name: 'The Black Death',
                health: 100,
                maxHealth: 100
            }
        },
        'surgery': {
            name: 'Octopath Surgery Trials',
            theme: '#a0522d',
            missions: [
                {
                    id: 'appendectomy',
                    name: 'Emergency Appendectomy',
                    questions: [
                        {
                            text: 'What is the most common position for appendicitis?',
                            options: ['RUQ', 'LUQ', 'RLQ', 'LLQ'],
                            correct: 2,
                            explanation: 'Appendicitis typically presents with pain in the right lower quadrant...',
                            xp: 30
                        }
                    ]
                }
            ],
            boss: {
                name: 'The Butcher',
                health: 150,
                maxHealth: 150
            }
        }
    }
};

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    loadGame();
    switchWorld(gameData.player.currentWorld);
    updateUI();
});

// World System
function switchWorld(worldKey) {
    gameData.player.currentWorld = worldKey;
    document.documentElement.style.setProperty('--world-color', gameData.worlds[worldKey].theme);
    renderMissions();
    updateUI();
}

// Mission System
function renderMissions() {
    const container = document.getElementById('missionList');
    container.innerHTML = '';
    
    gameData.worlds[gameData.player.currentWorld].missions.forEach(mission => {
        if (!gameData.player.completedMissions.includes(mission.id)) {
            const card = document.createElement('div');
            card.className = 'mission-card';
            card.style.borderColor = gameData.worlds[gameData.player.currentWorld].theme;
            card.innerHTML = `
                <h3>${mission.name}</h3>
                <p>${mission.questions.length} Questions</p>
            `;
            card.addEventListener('click', () => startMission(mission));
            container.appendChild(card);
        }
    });
}

// Question System
function startMission(mission) {
    currentMission = mission;
    currentQuestionIndex = 0;
    showQuestion(currentQuestionIndex);
    document.getElementById('questionModal').style.display = 'flex';
}

function showQuestion(index) {
    const question = currentMission.questions[index];
    document.getElementById('questionTitle').textContent = `Question ${index + 1}`;
    document.getElementById('questionText').textContent = question.text;
    
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, i) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option;
        btn.addEventListener('click', () => handleAnswer(i, question));
        optionsContainer.appendChild(btn);
    });
    
    document.getElementById('explanation').classList.add('hidden');
    document.getElementById('nextQuestion').classList.add('hidden');
}

function handleAnswer(selectedIndex, question) {
    const explanation = document.getElementById('explanation');
    explanation.textContent = question.explanation;
    explanation.classList.remove('hidden');
    
    if (selectedIndex === question.correct) {
        gameData.player.xp += question.xp;
        explanation.style.color = 'var(--success)';
    } else {
        explanation.style.color = 'var(--danger)';
    }
    
    document.getElementById('nextQuestion').classList.remove('hidden');
}

// Boss Battle System
function startBossBattle() {
    const world = gameData.worlds[gameData.player.currentWorld];
    document.getElementById('bossName').textContent = world.boss.name;
    updateBossUI();
    document.getElementById('bossModal').style.display = 'flex';
}

function attackBoss() {
    const world = gameData.worlds[gameData.player.currentWorld];
    const damage = Math.floor(Math.random() * 20) + 10;
    
    world.boss.health -= damage;
    
    if (world.boss.health <= 0) {
        endBossBattle();
    }
    
    updateBossUI();
}

// UI Updates
function updateUI() {
    document.getElementById('playerLevel').textContent = gameData.player.level;
    document.getElementById('playerHealth').textContent = gameData.player.health;
    document.getElementById('xpBar').style.width = 
        (gameData.player.xp % 100) + '%';
    
    saveGame();
}

// Persistence
function saveGame() {
    localStorage.setItem('healersOdyssey', JSON.stringify(gameData));
}

function loadGame() {
    const saved = localStorage.getItem('healersOdyssey');
    if (saved) Object.assign(gameData, JSON.parse(saved));
}
