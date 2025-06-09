// Register Form
// Registration form submit handler
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('Email').value;
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const strengthText = document.getElementById('strength').textContent;
  const emailError = document.getElementById('emailError');

  // Reset errors
  emailError.style.display = 'none';

  // Validate email
  if (!validateEmail(email)) {
    emailError.textContent = 'Please enter a valid email address';
    emailError.style.display = 'block';
    return;
  }

  // Password strength enforcement
  if (!strengthText.includes('Strong') && !strengthText.includes('Very Strong')) {
    alert('Password must be at least "Strong" strength (requires uppercase + number)');
    document.getElementById('password').focus();
    return;
  }

  try {
    const response = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password })
    });

    const data = await response.json();
    if (response.ok) {
      window.location.href = 'dashboard.html';
    } else {
      const errorMsg = data.error.includes('E11000') 
        ? 'Email already registered' 
        : data.error;
      emailError.textContent = errorMsg;
      emailError.style.display = 'block';
    }
  } catch (err) {
    alert('Network error - please check your connection');
  }
});
// Login Form
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Get form values
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Basic validation
  if (!username || !password) {
    alert('Please fill in both username and password');
    return;
  }

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ 
        username, 
        password 
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      window.location.href = 'dashboard.html';
    } else {
      alert(data.error || 'Login failed. Please check your credentials.');
    }
  } catch (err) {
    console.error('Login error:', err);
    alert('Network error. Please try again.');
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
// Password strength checker
document.getElementById('password')?.addEventListener('input', function(e) {
  const password = e.target.value;
  const strengthText = document.getElementById('strength');
  
// Real-time email validation
document.getElementById('Email')?.addEventListener('input', function(e) {
  const email = e.target.value;
  const emailError = document.getElementById('emailError');
  
  if (email === '') {
    emailError.style.display = 'none';
  } else if (!validateEmail(email)) {
    emailError.textContent = 'Invalid email format (e.g., user@example.com)';
    emailError.style.display = 'block';
  } else {
    emailError.style.display = 'none';
  }
});

  // Define requirements
  const hasNumber = /\d/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?~]/.test(password);
  const lengthOk = password.length >= 8;

  // Determine strength level
  let strength = 0;
  let message = '';
  let color = 'red';

  if (password.length === 0) {
      message = '';
  } else if (!lengthOk) {
      message = 'Weak (too short)';
      color = 'red';
  } else {
      strength += hasNumber ? 1 : 0;
      strength += hasUpper ? 1 : 0;
      strength += hasSpecial ? 1 : 0;

      switch(strength) {
          case 0:
              message = 'Weak';
              color = 'red';
              break;
          case 1:
              message = 'Basic';
              color = 'orange';
              break;
          case 2:
              message = 'Moderate';
              color = 'goldenrod';
              break;
          case 3:
              message = 'Strong (Recommended)';
              color = 'darkgreen';
              break;
      }
  }

  // Update UI
  strengthText.textContent = `Password Strength: ${message}`;
  strengthText.style.color = color;
  
  // Add colored indicator
  strengthText.innerHTML = `Password Strength: <span style="font-weight:bold;color:${color}">${message}</span>`;
});


// Registration form submit handler
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const strengthText = document.getElementById('strength').textContent;
  const emailError = document.getElementById('emailError');

  // Reset errors
  emailError.style.display = 'none';

  // Validate email
  if (!validateEmail(email)) {
    emailError.textContent = 'Please enter a valid email address';
    emailError.style.display = 'block';
    return;
  }

  // Validate password strength
  if (!strengthText.includes('Strong') && !strengthText.includes('Very Strong')) {
    alert('Password must be at least "Strong" strength');
    return;
  }

  try {
    const response = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username: email, password }) // Send both email and username
    });

    if (response.ok) {
      window.location.href = 'dashboard.html';
    } else {
      const error = await response.json();
      if (error.error.includes('E11000')) {
        emailError.textContent = 'Email already registered';
        emailError.style.display = 'block';
      } else {
        alert(error.error || 'Registration failed');
      }
    }
  } catch (err) {
    alert('Network error - please try again');
  }
});
// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme') || 'light';

// Apply saved theme
document.documentElement.setAttribute('data-theme', savedTheme);
updateToggleIcon(savedTheme);

// Toggle handler
themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateToggleIcon(newTheme);
});

function updateToggleIcon(theme) {
  themeToggle.textContent = theme === 'light' ? '🌓' : '🌞';
}
// Email validation function
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}