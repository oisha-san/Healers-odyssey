import { achievements, xp, questionsCompleted, specialties, getTotalXPFromCompletedTasks } from './main.js';

// Add debugging logs to verify achievements rendering
function renderAchievements() {
  console.log('Rendering achievements with current progress:', { xp, questionsCompleted, specialties });

  const unlockedList = document.getElementById("unlocked-achievements");
  const lockedList = document.getElementById("locked-achievements");
  if (!unlockedList || !lockedList) {
    console.error('Achievements lists not found in the DOM.');
    return;
  }

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

    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        <span>${achievement.icon} ${achievement.name}</span>
        <p class="achievement-description">${achievement.description}</p>
      </div>
    `;

    if (achieved) {
      console.log('Unlocked achievement:', achievement.name);
      unlockedList.appendChild(li);
    } else {
      lockedList.appendChild(li);
    }
  });

  // Log DOM content for verification
  console.log('Unlocked Achievements DOM:', unlockedList.innerHTML);
  console.log('Locked Achievements DOM:', lockedList.innerHTML);
}

// Add debugging elements to display raw progress data
async function fetchUserProgress() {
  try {
    const username = localStorage.getItem('username');
    console.log('Fetching progress for user:', username);

    if (!username) {
      console.error('No username found in localStorage.');
      return;
    }

    const response = await fetch(`/api/user-progress?username=${username}`);

    if (response.ok) {
      const data = await response.json();
      console.log('User progress fetched:', data);

      // Display raw progress data for debugging
      const debugContainer = document.getElementById('debug-progress');
      if (debugContainer) {
        debugContainer.innerText = JSON.stringify(data, null, 2);
      }

      xp = data.user.xp;
      questionsCompleted = data.user.questionsCompleted;
      specialties.forEach((specialty) => {
        specialty.tasks.forEach((task) => {
          task.completed = data.user[specialty.name]?.[task.id] || false;
        });
      });
      renderAchievements();
    } else {
      console.error('Failed to fetch user progress:', await response.text());
    }
  } catch (error) {
    console.error('Error fetching user progress:', error);
  }
}

// Add a container for debugging raw progress data
window.onload = () => {
  const debugContainer = document.createElement('div');
  debugContainer.id = 'debug-progress';
  debugContainer.style.border = '1px solid blue';
  debugContainer.style.padding = '10px';
  debugContainer.style.margin = '10px';
  debugContainer.innerText = 'Debugging raw progress data will appear here.';
  document.body.appendChild(debugContainer);

  fetchUserProgress();
};
