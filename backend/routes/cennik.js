// routes/cennik.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// GET – pobierz cały cennik (admin only)
router.get('/', authenticateToken, authorizeRoles('admin'), (req, res) => {
    const query = 'SELECT * FROM cennik';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Błąd przy pobieraniu cennika:', err);
            return res.status(500).json({ error: 'Błąd serwera' });
        }
        res.json(results);
    });
});

// POST – dodaj nowy rocznik z ceną (admin only)
router.post('/', authenticateToken, authorizeRoles('admin'), (req, res) => {
    const { rocznik, cena } = req.body;
    const query = 'INSERT INTO cennik (RocznikCennik, Cena_per_Dzień) VALUES (?, ?)';
    db.query(query, [rocznik, cena], (err, results) => {
        if (err) {
            console.error('Błąd przy dodawaniu do cennika:', err);
            return res.status(500).json({ error: 'Błąd serwera' });
        }
        res.json({ message: 'Nowy rocznik dodany do cennika', results });
    });
});

// PUT – aktualizacja ceny (admin only)
router.put('/:rocznik', authenticateToken, authorizeRoles('admin'), (req, res) => {
    const { rocznik } = req.params;
    const { cena } = req.body;
    const query = 'UPDATE cennik SET Cena_per_Dzień = ? WHERE RocznikCennik = ?';
    db.query(query, [cena, rocznik], (err, results) => {
        if (err) {
            console.error('Błąd przy aktualizacji cennika:', err);
            return res.status(500).json({ error: 'Błąd serwera' });
        } else if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Nie znaleziono rocznika do aktualizacji' });
        }
        res.json({ message: 'Cena zaktualizowana pomyślnie', results });
    });
});

module.exports = router;
