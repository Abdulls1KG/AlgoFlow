const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const session = require('express-session');
const path = require('path');

const app = express();
const saltRounds = 10;

// SQLite Database Setup
const db = new sqlite3.Database('./auth.db', (err) => {
  if (err) return console.error(err.message);
  console.log('Connected to SQLite database');
  
  // Create users table if it doesn't exist
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);
});

// Middleware
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'super-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// Routes
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  
  // Check if user exists
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (row) return res.status(400).json({ error: 'Username exists' });
    
    // Hash password and create user
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) return res.status(500).json({ error: 'Password hashing failed' });
      
      db.run('INSERT INTO users (username, password) VALUES (?, ?)', 
        [username, hash], 
        function(err) {
          if (err) return res.status(500).json({ error: 'Registration failed' });
          req.session.userId = this.lastID;
          res.json({ success: true });
        }
      );
    });
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    
    bcrypt.compare(password, user.password, (err, result) => {
      if (err || !result) return res.status(400).json({ error: 'Invalid credentials' });
      req.session.userId = user.id;
      res.json({ success: true });
    });
  });
});

app.get('/getUser', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });
  
  db.get('SELECT username FROM users WHERE id = ?', [req.session.userId], (err, user) => {
    if (err || !user) return res.status(500).json({ error: 'User not found' });
    res.json({ user: user.username });
  });
});

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.json({ success: true });
  });
});

// Serve HTML files
app.get(['/', '/login', '/register'], (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(3000, () => console.log('Server running on http://localhost:3000')); 
// Update user schema


// Registration endpoint
app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Additional email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ 
      email,
      username: email, // Using email as username
      password: hashedPassword 
    });
    
    await newUser.save();
    req.session.userId = newUser._id;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});