// config/db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'zaq1@WSX',
    database: process.env.DB_NAME || 'wypożyczalnia'
});

db.connect((err) => {
    if (err) {
        console.error('Błąd połączenia z bazą danych:', err.message);
    } else {
        console.log('Połączono z bazą danych MySQL');
    }
});

module.exports = db;
