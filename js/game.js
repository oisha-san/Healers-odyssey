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
            name: 'Internal Medicine',
            theme: '#1e90ff',
            missions: [
                {
                    id: 'copd-case',
                    name: 'COPD Case Study',
                    questions: [
                        {
                            text: 'A 65-year-old smoker presents with progressive dyspnea...',
                            options: ['Asthma', 'COPD', 'Pneumonia'],
                            correct: 1,
                            explanation: 'COPD is characterized by persistent respiratory symptoms...',
                            xp: 20
                        },
                        {
                            text: 'Which test confirms COPD diagnosis?',
                            options: ['Chest X-ray', 'Spirometry', 'Blood Test'],
                            correct: 1,
                            explanation: 'Spirometry shows airflow limitation...',
                            xp: 25
                        }
                    ]
                }
            ],
            boss: {
                name: 'The Black Death',
                maxHealth: 100
            }
        },
        'surgery': {
            name: 'Surgery',
            theme: '#a0522d',
            missions: [
                {
                    id: 'appendectomy',
                    name: 'Appendicitis Case',
                    questions: [
                        {
                            text: 'McBurney\'s point tenderness indicates:',
                            options: ['Appendicitis', 'Kidney Stone', 'Pancreatitis'],
                            correct: 0,
                            explanation: 'McBurney\'s point is classic for appendicitis...',
                            xp: 30
                        }
                    ]
                }
            ],
            boss: {
                name: 'The Butcher',
                maxHealth: 150
            }
        }
    }
};

let currentMission = null;
let currentQuestionIndex = 0;

// Initialize
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
            card.innerHTML = `
                <h3>${mission.name}</h3>
                <p>${mission.questions.length} Questions</p>
            `;
            card.addEventListener('click', () => startMission(mission));
            container.appendChild(card);
        }
    });
}

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
        btn.className = 'attack-btn';
        btn.textContent = option;
        btn.addEventListener('click', () => handleAnswer(i, question));
        optionsContainer.appendChild(btn);
    });
    
    document.getElementById('explanation').classList.add('hidden');
    document.getElementById('nextBtn').classList.add('hidden');
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
    
    document.getElementById('nextBtn').classList.remove('hidden');
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentMission.questions.length) {
        showQuestion(currentQuestionIndex);
    } else {
        completeMission();
    }
}

function completeMission() {
    gameData.player.completedMissions.push(currentMission.id);
    document.getElementById('questionModal').style.display = 'none';
    renderMissions();
    updateUI();
}

// Boss Battle System
function startBossBattle() {
    const world = gameData.worlds[gameData.player.currentWorld];
    const boss = world.boss;
    boss.health = boss.maxHealth;
    
    document.getElementById('bossName').textContent = boss.name;
    updateBossUI();
    document.getElementById('bossModal').style.display = 'flex';
    
    // Generate attack options
    const attackContainer = document.getElementById('attackOptions');
    attackContainer.innerHTML = '';
    
    const attacks = [
        { type: 'easy', text: 'Basic Attack' },
        { type: 'medium', text: 'Special Attack' },
        { type: 'hard', text: 'Critical Strike' }
    ];
    
    attacks.forEach(attack => {
        const btn = document.createElement('button');
        btn.className = 'attack-btn';
        btn.textContent = attack.text;
        btn.addEventListener('click', () => performAttack(attack.type));
        attackContainer.appendChild(btn);
    });
}

function performAttack(attackType) {
    const world = gameData.worlds[gameData.player.currentWorld];
    const boss = world.boss;
    const damage = { easy: 10, medium: 20, hard: 30 }[attackType];
    
    if (Math.random() > 0.5) { // 50% success chance
        boss.health = Math.max(boss.health - damage, 0);
        updateBossUI();
        if (boss.health === 0) endBossBattle();
    } else {
        gameData.player.health = Math.max(gameData.player.health - 10, 0);
        if (gameData.player.health === 0) endBossBattle(true);
    }
    
    updateBossUI();
}

function updateBossUI() {
    document.getElementById('bossHealthBar').style.width = 
        (gameData.worlds[gameData.player.currentWorld].boss.health / 
        gameData.worlds[gameData.player.currentWorld].boss.maxHealth) * 100 + '%';
    
    document.getElementById('playerHealthBar').style.width = 
        gameData.player.health + '%';
}

function endBossBattle(defeated = false) {
    const message = defeated 
        ? 'You have been defeated!' 
        : 'Boss defeated! You gained 100 XP!';
    
    alert(message);
    
    if (!defeated) gameData.player.xp += 100;
    gameData.player.health = 100;
    
    document.getElementById('bossModal').style.display = 'none';
    updateUI();
}

// Persistence
function saveGame() {
    localStorage.setItem('healersOdyssey', JSON.stringify(gameData));
}

function loadGame() {
    const saved = localStorage.getItem('healersOdyssey');
    if (saved) Object.assign(gameData, JSON.parse(saved));
}

// UI Updates
function updateUI() {
    document.getElementById('playerLevel').textContent = gameData.player.level;
    document.getElementById('xpBar').style.width = 
        (gameData.player.xp % 100) + '%';
    
    saveGame();
}
