document.getElementById('signup-btn').addEventListener('click', async () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    document.getElementById('auth-message').innerText = data.message;
  } catch (error) {
    console.error('Error during signup:', error);
  }
});

document.getElementById('login-btn').addEventListener('click', async () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    document.getElementById('auth-message').innerText = data.message;

    if (response.ok) {
      console.log('User logged in:', data.user);
    }
  } catch (error) {
    console.error('Error during login:', error);
  }
});