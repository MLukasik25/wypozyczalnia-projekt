const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// GET – dostępne pakiety ubezpieczeń
router.get('/', (req, res) => {
    const query = 'SELECT * FROM ocac';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Błąd podczas pobierania pakietów OCAC:', err);
            return res.status(500).json({ error: 'Błąd serwera' });
        }
        res.json(results);
    });
});

// POST – dodawanie nowego pakietu (admin)
router.post('/', authenticateToken, authorizeRoles('admin'), (req, res) => {
    const { Pakiet, OC, AC, NNW, Assistance, Cena } = req.body;
    const query = 'INSERT INTO ocac (Pakiet, OC, AC, NNW, Assistance, Cena) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [Pakiet, OC, AC, NNW, Assistance, Cena], (err, results) => {
        if (err) {
            console.error('Błąd przy dodawaniu pakietu OCAC:', err);
            return res.status(500).json({ error: 'Błąd serwera' });
        }
        res.json({ message: 'Pakiet dodany pomyślnie', results });
    });
});

// DELETE – usuwanie pakietu (admin)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM ocac WHERE idOCAC = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Błąd przy usuwaniu pakietu OCAC:', err);
            return res.status(500).json({ error: 'Błąd serwera' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Nie znaleziono pakietu o podanym ID' });
        }
        res.json({ message: 'Pakiet OCAC usunięty' });
    });
});

module.exports = router;
