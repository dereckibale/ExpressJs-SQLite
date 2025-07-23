const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.json());
const PORT = 3000;

// Connect to SQLite database file (will create if not exists)
const db = new sqlite3.Database('mydatabase.sqlite', (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Create a simple table if it doesn't exist
// db.serialize(() => {
//     db.run(`CREATE TABLE IF NOT EXISTS products (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       name TEXT NOT NULL,
//       selling_price REAL NOT NULL,
//       purchase_price REAL NOT NULL,
//       barcode TEXT NOT NULL,
//       Description TEXT NULL
//     )`, (err) => {
//       if (err) {
//         console.error('Error creating products table:', err);
//       } else {
//         console.log('Products table created');
//       }
//     });
//   });



//-------------------------------------------------------------------------------------------------------
// Basic route to test server and DB connection
    app.get('/', (req, res) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) {
        res.status(500).send('Database error');
        return;
        }
        res.json(rows);
    });
    });
//---------------------------------------------------------------------------------------------------------
    // POST route to insert product details
    app.post('/add', (req, res) => {
    const { name, selling_price, purchase_price, barcode, Description } = req.body;

    const sql = `INSERT INTO products (name, selling_price, purchase_price, barcode, Description)
                VALUES (?, ?, ?, ?, ?)`;

    db.run(sql, [name, selling_price, purchase_price, barcode, Description], function(err) {
        if (err) {
        return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Product added', productId: this.lastID });
    });
    });
//------------------------------------------------------------------------------------------------------------
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
