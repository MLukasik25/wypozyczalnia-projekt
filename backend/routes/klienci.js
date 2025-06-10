// routes/klienci.js
const express = require('express');
const router = express.Router();
const db = require('../config/db'); // jeśli masz plik z połączeniem
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// GET – pobranie wszystkich klientów (np. tylko admin)
router.get('/', authenticateToken, authorizeRoles('admin', 'pracownik'), (req, res) => {
    const query = 'SELECT * FROM klienci';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Błąd podczas pobierania klientów:', err);
            res.status(500).json({ error: 'Błąd serwera' });
        } else {
            res.json(results);
        }
    });
});

//DELETE – usunięcie klienta (tylko admin)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), (req, res) => {
    db.query('DELETE FROM klienci WHERE idKlient = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Błąd serwera', details: err.sqlMessage });
        res.json({ message: 'Klient usunięty' });
    });
});

module.exports = router;
