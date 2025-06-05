// Registration form handler
if (document.getElementById('registerForm')) {
  document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username =
     document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Password strength check (keeps your existing logic)
    const strength = checkPasswordStrength(password);
    document.getElementById('strength').textContent = 'Password Strength: ' + strength;
    if (strength === "Weak") {
      alert("Choose a stronger password!");
      return;
    }

    // Enhanced registration request
    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include' // 👈 Required for sessions
      });

      if (response.ok) {
        window.location.href = '/dashboard'; // Client-side redirect
      } else {
        const error = await response.text();
        alert(`Registration failed: ${error}`);
      }
    } catch (err) {
      alert("Network error - please try again");
      console.error(err);
    }
  });
}

    const res = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (res.ok) {
      // After successful registration, automatically log in
      const loginRes = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (loginRes.ok) {
        window.location.href = '/dashboard';
      }
    } else {
      alert(await res.text());
    };


// Login form handler
if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const res = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (res.ok) {
      window.location.href = '/dashboard';
    } else {
      alert(await res.text());
    }
  });
}

// Password strength checker remains the same
function checkPasswordStrength(pw) {
  let score = 0;
  if (pw.length > 6) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score >= 3 ? "Strong" : "Weak";
}