import { achievements, xp, questionsCompleted, getTotalXPFromCompletedTasks } from './main.js';

function renderAchievements() {
  const unlockedList = document.getElementById("unlocked-achievements");
  const lockedList = document.getElementById("locked-achievements");
  unlockedList.innerHTML = "";
  lockedList.innerHTML = "";

  achievements.forEach((achievement) => {
    let achieved = false;

    // XP achievements check (including XP from tasks)
    if (achievement.xp && xp + getTotalXPFromCompletedTasks() >= achievement.xp) {
      achieved = true;
    }
    // Question completion achievements
    else if (achievement.questions && questionsCompleted >= achievement.questions) {
      achieved = true;
    }
    // Disease-specific achievements
    else if (achievement.diseaseId) {
      specialties.forEach((specialty) => {
        const disease = specialty.tasks.find((t) => t.id === achievement.diseaseId);
        if (disease && disease.completed) {
          achieved = true;
        }
      });
    }
    // Domain achievements for completed specialties
    else if (achievement.specialty) {
      const specialty = specialties.find((s) => s.name === achievement.specialty);
      if (specialty && specialty.tasks.every((task) => task.completed)) {
        achieved = true;
      }
    }
    // Overall achievement when all specialties are completed
    else if (achievement.overall) {
      const allCompleted = specialties.every((specialty) =>
        specialty.tasks.every((task) => task.completed)
      );
      if (allCompleted) {
        achieved = true;
      }
    }

    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        <span>${achievement.icon} ${achievement.name}</span>
        <p class="achievement-description">${achievement.description}</p>
      </div>
    `;

    if (achieved) {
      unlockedList.appendChild(li);
    } else {
      lockedList.appendChild(li);
    }
  });
}

// Initialize the achievements page
window.onload = () => {
  renderAchievements();
};
