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
            missions: [
                {
                    id: 'copd-case',
                    name: 'COPD Case Study',
                    xp: 50,
                    questions: [
                        {
                            text: 'A 65-year-old smoker presents with dyspnea...',
                            options: ['Asthma', 'COPD', 'Bronchiectasis'],
                            correct: 1
                        }
                    ]
                }
            ]
        }
    },
    boss: {
        name: 'The Black Death',
        health: 100,
        maxHealth: 100
    }
};

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    loadGame();
    renderMissions();
    updateUI();
});

// Save/Load System
function saveGame() {
    localStorage.setItem('healersOdyssey', JSON.stringify(gameData));
}

function loadGame() {
    const saved = localStorage.getItem('healersOdyssey');
    if (saved) Object.assign(gameData, JSON.parse(saved));
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
                <p>Reward: ${mission.xp} XP</p>
            `;
            card.addEventListener('click', () => startMission(mission));
            container.appendChild(card);
        }
    });
}

// Boss Battle System
function startBossBattle() {
    document.getElementById('bossModal').style.display = 'flex';
    updateBossUI();
}

function attackBoss() {
    const damage = Math.floor(Math.random() * 20) + 10;
    gameData.boss.health -= damage;
    
    if (gameData.boss.health <= 0) {
        endBossBattle();
    }
    
    updateBossUI();
}

function updateBossUI() {
    document.getElementById('bossHealth').style.width = 
        (gameData.boss.health / gameData.boss.maxHealth) * 100 + '%';
}

function endBossBattle() {
    alert('Boss defeated! You gained 100 XP!');
    gameData.player.xp += 100;
    gameData.boss.health = gameData.boss.maxHealth;
    document.getElementById('bossModal').style.display = 'none';
    updateUI();
}

// UI Updates
function updateUI() {
    document.getElementById('playerLevel').textContent = gameData.player.level;
    document.getElementById('playerHealth').textContent = gameData.player.health;
    document.getElementById('xpBar').style.width = 
        (gameData.player.xp % 100) + '%';
    
    saveGame();
}
