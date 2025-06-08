// Register Form
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (response.ok) {
      window.location.href = 'dashboard.html';
    } else {
      alert(data.error || 'Registration failed');
    }
  } catch (err) {
    alert('Network error');
  }
});

// Login Form
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (response.ok) {
      window.location.href = 'dashboard.html';
    } else {
      alert(data.error || 'Login failed');
    }
  } catch (err) {
    alert('Network error');
  }
});

// Dashboard - Check authentication
if (window.location.pathname.includes('dashboard.html')) {
  checkAuth();
}

async function checkAuth() {
  try {
    const response = await fetch('/getUser');
    if (!response.ok) {
      window.location.href = 'login.html';
      return;
    }
    const data = await response.json();
    if (data.user) {
      document.getElementById('usernameDisplay').textContent = data.user;
    }
  } catch (err) {
    window.location.href = 'login.html';
  }
}

// Logout
document.getElementById('logoutForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    await fetch('/logout', { method: 'POST' });
    window.location.href = 'login.html';
  } catch (err) {
    alert('Logout failed');
  }
});