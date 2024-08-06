const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database setup
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, email TEXT)");
});

// Serve static files
app.use(express.static(path.join(__dirname)));

// Routes
app.get('/users', (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows);
    });
});

app.post('/users', (req, res) => {
    const { name, email } = req.body;
    db.run(`INSERT INTO users (name, email) VALUES (?, ?)`, [name, email], function(err) {
        if (err) {
            return console.log(err.message);
        }
        res.json({ id: this.lastID });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
