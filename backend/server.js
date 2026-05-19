require('dotenv').config()

const express = require('express')
const cors = require('cors')
const sqlite3 = require('sqlite3').verbose()

const app = express()

const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

const db = new sqlite3.Database('./database.db')

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer TEXT,
      title TEXT,
      description TEXT,
      priority TEXT,
      status TEXT
    )
  `)
})

app.get('/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', [], (err, rows) => {
    if (err) {
      return res.status(500).json(err)
    }

    res.json(rows)
  })
})

app.post('/tasks', (req, res) => {
  const {
    customer,
    title,
    description,
    priority
  } = req.body

  db.run(
    `
      INSERT INTO tasks (
        customer,
        title,
        description,
        priority,
        status
      )
      VALUES (?, ?, ?, ?, ?)
    `,
    [
      customer,
      title,
      description,
      priority,
      'Aberto'
    ],
    function (err) {
      if (err) {
        return res.status(500).json(err)
      }

      res.json({
        id: this.lastID,
        success: true
      })
    }
  )
})

app.put('/tasks/:id', (req, res) => {
  const { status } = req.body

  db.run(
    `
      UPDATE tasks
      SET status = ?
      WHERE id = ?
    `,
    [status, req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json(err)
      }

      res.json({
        success: true
      })
    }
  )
})

app.delete('/tasks/:id', (req, res) => {
  db.run(
    `
      DELETE FROM tasks
      WHERE id = ?
    `,
    [req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json(err)
      }

      res.json({
        success: true
      })
    }
  )
})

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})