const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const mysql = require('mysql2');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const verifyToken = require('./authMiddleware');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// MySQL Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) throw err;
  console.log('Database connected!');
});



// Rate limiting to prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Test route
app.get('/test', (req, res) => {
  res.send("Test route works!");
});

// Register Route
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  // Check if user already exists
  const checkUserSql = 'SELECT * FROM users WHERE username = ?';
  db.query(checkUserSql, [username], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length > 0) return res.status(400).json({ error: 'Username already exists' });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const insertUserSql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(insertUserSql, [username, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to register user' });
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
});


// Login Route
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const sql = 'SELECT * FROM users WHERE username = ?';
  db.query(sql, [username], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    // Check if the user exists
    if (results.length === 0) {
      // Log the failed login attempt
      const logSql = 'INSERT INTO login_attempts (user_id, timestamp, status) VALUES (?, NOW(), ?)';
      db.query(logSql, [null, 'failure'], (err) => {
        if (err) console.error('Login logging failed for user not found');
      });

      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // Log the failed login attempt
      const logSql = 'INSERT INTO login_attempts (user_id, timestamp, status) VALUES (?, NOW(), ?)';
      db.query(logSql, [user.id, 'failure'], (err) => {
        if (err) console.error('Login logging failed for incorrect password');
      });

      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Successful login
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, userId: user.id  });

    // Log the successful login
    const logSql = 'INSERT INTO login_attempts (user_id, timestamp, status) VALUES (?, NOW(), ?)';
    db.query(logSql, [user.id, 'success'], (err) => {
      if (err) console.error('Login logging failed for success');
    });
  });
});


//protected route
app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ message: "Protected data accessed successfully", userId: req.userId });
});



// Get all bookmark-able items
// Get all bookmark-able items
app.get('/api/items', (req, res) => {
  const sql = 'SELECT * FROM items';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to retrieve items' });
    res.json(results);
  });
});

// Add a bookmark for the logged-in user
app.post('/api/bookmarks', verifyToken, (req, res) => {
  const userId = req.userId;
  const { itemId } = req.body;

  const sql = 'INSERT INTO bookmarks (user_id, item_id) VALUES (?, ?)';
  db.query(sql, [userId, itemId], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Bookmark already exists' });
      }
      return res.status(500).json({ error: 'Failed to add bookmark' });
    }
    res.status(201).json({ message: 'Bookmark added successfully' });
  });
});


// Get all bookmarks for the logged-in user
app.get('/api/bookmarks', verifyToken, (req, res) => {
  const userId = req.userId; // retrieved from the verifyToken middleware

  const sql = `
    SELECT items.id, items.title, items.url
    FROM bookmarks
    JOIN items ON bookmarks.item_id = items.id
    WHERE bookmarks.user_id = ?
  `;
  
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to retrieve bookmarks' });
    res.json({ bookmarks: results });
  });
});


// Remove a bookmark for the logged-in user
app.delete('/api/bookmarks', verifyToken, (req, res) => {
  const userId = req.userId;
  const { itemId } = req.body;

  const sql = 'DELETE FROM bookmarks WHERE user_id = ? AND item_id = ?';
  db.query(sql, [userId, itemId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to remove bookmark' });
    }
    res.status(200).json({ message: 'Bookmark removed successfully' });
  });
});























const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
