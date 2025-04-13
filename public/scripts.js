document.addEventListener("DOMContentLoaded", () => {
  const diseasesStudiedEl = document.getElementById("diseases-studied");
  const questionsCompletedEl = document.getElementById("questions-completed");
  const motivationalMessageEl = document.getElementById("motivational-message");
  const levelEl = document.getElementById("level");
  const xpEl = document.getElementById("xp");
  const achievementListEl = document.getElementById("achievement-list");

  let diseasesStudied = 0;
  let questionsCompleted = 0;
  let xp = 0;
  let level = 1;
  const xpPerDisease = 10;
  const xpPerQuestion = 5;
  const xpThreshold = 100;

  const achievements = [
    { name: "First Steps", condition: () => diseasesStudied >= 1, unlocked: false },
    { name: "Quiz Master", condition: () => questionsCompleted >= 10, unlocked: false },
    { name: "Medical Prodigy", condition: () => xp >= 200, unlocked: false },
  ];

  const updateAchievements = () => {
    achievements.forEach((achievement) => {
      if (!achievement.unlocked && achievement.condition()) {
        achievement.unlocked = true;
        const li = document.createElement("li");
        li.textContent = `${achievement.name}: Unlocked!`;
        achievementListEl.appendChild(li);
        alert(`Achievement Unlocked: ${achievement.name}!`);
      }
    });
  };

  const levelUp = () => {
    if (xp >= xpThreshold) {
      xp -= xpThreshold;
      level++;
      levelEl.textContent = level;
      alert("Level Up! You're now level " + level + "!");
    }
  };

  const updateMotivationalMessage = () => {
    if (diseasesStudied > 10 && questionsCompleted > 20) {
      motivationalMessageEl.textContent = "You're a medical champion! Keep conquering!";
    } else if (diseasesStudied > 5 || questionsCompleted > 10) {
      motivationalMessageEl.textContent = "Amazing progress! Stay consistent!";
    } else {
      motivationalMessageEl.textContent = "Keep going! You're doing great!";
    }
  };

  document.getElementById("increment-diseases").addEventListener("click", () => {
    diseasesStudied++;
    diseasesStudiedEl.textContent = diseasesStudied;
    xp += xpPerDisease;
    xpEl.textContent = xp;
    updateMotivationalMessage();
    updateAchievements();
    levelUp();
  });

  document.getElementById("increment-questions").addEventListener("click", () => {
    questionsCompleted++;
    questionsCompletedEl.textContent = questionsCompleted;
    xp += xpPerQuestion;
    xpEl.textContent = xp;
    updateMotivationalMessage();
    updateAchievements();
    levelUp();
  });
});