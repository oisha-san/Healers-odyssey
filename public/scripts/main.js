const API_BASE_URL = ""; // Use relative URLs for Render and GitHub Pages

// Fetch and display worlds
async function loadWorlds() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/worlds`);
    if (!response.ok) {
      throw new Error(`Failed to fetch worlds: ${response.statusText}`);
    }
    const worlds = await response.json();
    const container = document.getElementById("worlds-container");
    container.innerHTML = worlds
      .map(
        (world) => `
        <div class="world" onclick="enterWorld('${world.id}', '${world.name}', '${world.description}')">
          <h3>${world.name}</h3>
          <p>${world.description}</p>
        </div>
      `
      )
      .join("");
  } catch (error) {
    console.error("Error loading worlds:", error);
    const container = document.getElementById("worlds-container");
    container.innerHTML = `<p style="color: red;">Failed to load worlds. Please try again later.</p>`;
  }
}

// Enter a world
function enterWorld(id, name, description) {
  alert(`Entering the world: ${name}\nDescription: ${description}`);
}

// Initialize the app
window.onload = loadWorlds;
