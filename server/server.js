import express from 'express'
import mysql from 'mysql2/promise'
import cors from 'cors'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const LOG_DIR = path.join(__dirname, 'logs')
const LOG_FILE = path.join(LOG_DIR, `server-${new Date().toISOString().split('T')[0]}.log`)

function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true })
  }
}

function log(level, message, data = null) {
  ensureLogDir()
  const timestamp = new Date().toISOString()
  const logEntry = {
    timestamp,
    level,
    message,
    ...(data && { data })
  }
  const logLine = JSON.stringify(logEntry) + '\n'
  
  fs.appendFileSync(LOG_FILE, logLine)
  
  const consoleMsg = `[${timestamp}] [${level}] ${message}${data ? ' ' + JSON.stringify(data) : ''}`
  if (level === 'ERROR') {
    console.error(consoleMsg)
  } else if (level === 'WARN') {
    console.warn(consoleMsg)
  } else {
    console.log(consoleMsg)
  }
}

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

const dbConfig = {
  host: 'localhost',
  user: 'appuser',
  password: 'app123456',
  database: 'kids_english',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}

let pool

async function initDatabase() {
  pool = mysql.createPool(dbConfig)
  try {
    const connection = await pool.getConnection()
    log('INFO', 'MySQL connected successfully')
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        display_name VARCHAR(100),
        avatar VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        token VARCHAR(255) NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS progress (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        category VARCHAR(50) NOT NULL,
        item_id VARCHAR(50),
        value INT DEFAULT 0,
        completed BOOLEAN DEFAULT FALSE,
        stars INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY uk_user_category_item (user_id, category, item_id)
      )
    `)
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS achievements (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        achievement_id VARCHAR(50) NOT NULL,
        earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY uk_user_achievement (user_id, achievement_id)
      )
    `)
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS game_scores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        game_type VARCHAR(50) NOT NULL,
        score INT NOT NULL,
        played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS daily_activity (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        activity_date DATE NOT NULL,
        words_learned INT DEFAULT 0,
        time_spent INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY uk_user_date (user_id, activity_date)
      )
    `)
    
    connection.release()
    log('INFO', 'Database tables initialized')
  } catch (error) {
    log('ERROR', 'MySQL connection failed', { error: error.message })
    process.exit(1)
  }
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password + 'kids_english_salt').digest('hex')
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex')
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }
  
  pool.execute(
    'SELECT user_id FROM user_sessions WHERE token = ? AND expires_at > NOW()',
    [token]
  ).then(([rows]) => {
    if (rows.length === 0) {
      return res.status(403).json({ error: 'Invalid or expired token' })
    }
    req.userId = rows[0].user_id
    next()
  }).catch(() => {
    res.status(500).json({ error: 'Authentication failed' })
  })
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, displayName } = req.body
    log('INFO', 'Registration attempt', { username })
    
    if (!username || !password) {
      log('WARN', 'Registration failed: missing credentials', { username })
      return res.status(400).json({ error: 'Username and password required' })
    }
    
    if (username.length < 2 || username.length > 50) {
      log('WARN', 'Registration failed: invalid username length', { username, length: username.length })
      return res.status(400).json({ error: 'Username must be 2-50 characters' })
    }
    
    if (password.length < 4) {
      log('WARN', 'Registration failed: password too short', { username })
      return res.status(400).json({ error: 'Password must be at least 4 characters' })
    }
    
    const passwordHash = hashPassword(password)
    
    try {
      const [result] = await pool.execute(
        'INSERT INTO users (username, password_hash, display_name) VALUES (?, ?, ?)',
        [username, passwordHash, displayName || username]
      )
      
      const token = generateToken()
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      
      await pool.execute(
        'INSERT INTO user_sessions (user_id, token, expires_at) VALUES (?, ?, ?)',
        [result.insertId, token, expiresAt]
      )
      
      log('INFO', 'Registration successful', { userId: result.insertId, username })
      
      res.json({
        success: true,
        user: {
          id: result.insertId,
          username,
          displayName: displayName || username
        },
        token
      })
    } catch (insertError) {
      if (insertError.code === 'ER_DUP_ENTRY') {
        log('WARN', 'Registration failed: duplicate username', { username })
        return res.status(409).json({ error: 'Username already exists' })
      }
      throw insertError
    }
  } catch (error) {
    log('ERROR', 'Registration error', { error: error.message })
    res.status(500).json({ error: 'Registration failed' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body
    log('INFO', 'Login attempt', { username })
    
    if (!username || !password) {
      log('WARN', 'Login failed: missing credentials', { username })
      return res.status(400).json({ error: 'Username and password required' })
    }
    
    const passwordHash = hashPassword(password)
    
    const [users] = await pool.execute(
      'SELECT id, username, display_name, avatar FROM users WHERE username = ? AND password_hash = ?',
      [username, passwordHash]
    )
    
    if (users.length === 0) {
      log('WARN', 'Login failed: invalid credentials', { username })
      return res.status(401).json({ error: 'Invalid username or password' })
    }
    
    const user = users[0]
    
    const token = generateToken()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    
    await pool.execute(
      'INSERT INTO user_sessions (user_id, token, expires_at) VALUES (?, ?, ?)',
      [user.id, token, expiresAt]
    )
    
    await pool.execute(
      'UPDATE users SET last_visit = NOW() WHERE id = ?',
      [user.id]
    )
    
    log('INFO', 'Login successful', { userId: user.id, username })
    
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.display_name,
        avatar: user.avatar
      },
      token
    })
  } catch (error) {
    log('ERROR', 'Login error', { error: error.message })
    res.status(500).json({ error: 'Login failed' })
  }
})

app.post('/api/auth/logout', authenticateToken, async (req, res) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader.split(' ')[1]
    
    await pool.execute('DELETE FROM user_sessions WHERE token = ?', [token])
    log('INFO', 'Logout successful', { userId: req.userId })
    
    res.json({ success: true })
  } catch (error) {
    log('ERROR', 'Logout error', { error: error.message })
    res.status(500).json({ error: 'Logout failed' })
  }
})

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, username, display_name, avatar, created_at, last_visit FROM users WHERE id = ?',
      [req.userId]
    )
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    res.json({ user: users[0] })
  } catch (error) {
    log('ERROR', 'Get user error', { error: error.message })
    res.status(500).json({ error: 'Failed to get user' })
  }
})

app.get('/api/progress/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const [rows] = await pool.execute(
      'SELECT category, item_id, value, completed, stars FROM progress WHERE user_id = ?',
      [userId]
    )

    const progress = {
      alphabet: 0,
      vocabulary: {},
      sentences: 0,
      gamesPlayed: 0,
      totalStars: 0
    }

    rows.forEach(row => {
      if (row.category === 'alphabet') {
        progress.alphabet = row.value
      } else if (row.category === 'vocabulary' && row.item_id) {
        progress.vocabulary[row.item_id] = row.value
      } else if (row.category === 'sentences') {
        progress.sentences = row.value
      } else if (row.category === 'games') {
        progress.gamesPlayed = row.value
      } else if (row.category === 'stars') {
        progress.totalStars = row.value
      }
    })

    res.json(progress)
  } catch (error) {
    log('ERROR', 'Error fetching progress', { error: error.message })
    res.status(500).json({ error: 'Failed to fetch progress' })
  }
})

app.post('/api/progress/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const { category, itemId, value, completed, stars } = req.body

    await pool.execute(
      `INSERT INTO progress (user_id, category, item_id, value, completed, stars)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE value = ?, completed = ?, stars = ?`,
      [userId, category, itemId || null, value || 0, completed || false, stars || 0, value || 0, completed || false, stars || 0]
    )

    res.json({ success: true })
  } catch (error) {
    log('ERROR', 'Error saving progress', { error: error.message })
    res.status(500).json({ error: 'Failed to save progress' })
  }
})

app.get('/api/achievements/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const [rows] = await pool.execute(
      'SELECT achievement_id, earned_at FROM achievements WHERE user_id = ?',
      [userId]
    )
    res.json(rows.map(row => row.achievement_id))
  } catch (error) {
    log('ERROR', 'Error fetching achievements', { error: error.message })
    res.status(500).json({ error: 'Failed to fetch achievements' })
  }
})

app.post('/api/achievements/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const { achievementId } = req.body

    await pool.execute(
      'INSERT IGNORE INTO achievements (user_id, achievement_id) VALUES (?, ?)',
      [userId, achievementId]
    )

    res.json({ success: true })
  } catch (error) {
    log('ERROR', 'Error saving achievement', { error: error.message })
    res.status(500).json({ error: 'Failed to save achievement' })
  }
})

app.get('/api/game-scores/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const [rows] = await pool.execute(
      'SELECT game_type, score, played_at FROM game_scores WHERE user_id = ? ORDER BY played_at DESC LIMIT 50',
      [userId]
    )
    res.json(rows)
  } catch (error) {
    log('ERROR', 'Error fetching game scores', { error: error.message })
    res.status(500).json({ error: 'Failed to fetch game scores' })
  }
})

app.post('/api/game-scores/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const { gameType, score } = req.body

    await pool.execute(
      'INSERT INTO game_scores (user_id, game_type, score) VALUES (?, ?, ?)',
      [userId, gameType, score]
    )

    res.json({ success: true })
  } catch (error) {
    log('ERROR', 'Error saving game score', { error: error.message })
    res.status(500).json({ error: 'Failed to save game score' })
  }
})

app.post('/api/daily-activity/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const { wordsLearned, timeSpent } = req.body
    const today = new Date().toISOString().split('T')[0]

    await pool.execute(
      `INSERT INTO daily_activity (user_id, activity_date, words_learned, time_spent)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE words_learned = words_learned + ?, time_spent = time_spent + ?`,
      [userId, today, wordsLearned || 0, timeSpent || 0, wordsLearned || 0, timeSpent || 0]
    )

    res.json({ success: true })
  } catch (error) {
    log('ERROR', 'Error saving daily activity', { error: error.message })
    res.status(500).json({ error: 'Failed to save daily activity' })
  }
})

initDatabase().then(() => {
  app.listen(PORT, () => {
    log('INFO', `Server running on http://localhost:${PORT}`)
  })
})
