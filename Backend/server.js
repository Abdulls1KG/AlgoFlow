const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();
const users = {};

// Middleware
app.use(express.static('public', { index: false }));
app.use(express.json());
app.use(session({
  secret: 'super-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Registration with auto-login
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (users[username]) return res.status(400).send("Username exists");
    
    const hashed = await bcrypt.hash(password, 10);
    users[username] = { password: hashed };
    req.session.user = username;
    res.status(200).send("Registered");
  } catch (err) {
    res.status(500).send("Registration error");
  }
  console.log(users);
});

// Dashboard (protected)
app.get('/dashboard', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Logout
app.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

// Send current user to client (for dashboard)
app.get('/getUser', (req, res) => {
  if (!req.session.user) return res.status(401).json({ user: null });
  res.json({ user: req.session.user });
});

// Fallback
app.get('*', (req, res) => {
  res.redirect('/');
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));