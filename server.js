const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

const db = new sqlite3.Database('./todos.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

db.run(`CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    priority TEXT,
    isComplete BOOLEAN,
    isFun BOOLEAN
)`);

app.get('/todos', (req, res) => {
    db.all(`SELECT * FROM todos`, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.get('/todos/:id', (req, res) => {
    const id = req.params.id;
    db.get(`SELECT * FROM todos WHERE id = ?`, [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (row) {
            res.json(row);
        } else {
            res.status(404).json({ message: 'Todo not found' });
        }
    });
});

app.post('/todos', (req, res) => {
    const { name, priority, isComplete, isFun } = req.body;
    db.run(`INSERT INTO todos (name, priority, isComplete, isFun) VALUES (?, ?, ?, ?)`,
        [name, priority, isComplete, isFun],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.status(201).json({ id: this.lastID, name, priority, isComplete, isFun });
        }
    );
});

app.delete('/todos/:id', (req, res) => {
    const id = req.params.id;
    db.run(`DELETE FROM todos WHERE id = ?`, [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Todo deleted successfully' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
