const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

//GET – lista pracowników, tylko dla admina
router.get('/', authenticateToken, authorizeRoles('admin'), (req, res) => {
    db.query('SELECT * FROM pracownicy', (err, results) => {
        if (err) return res.status(500).json({ error: 'Błąd serwera' });
        res.json(results);
    });
});

//DELETE – usuwanie pracownika, tylko dla admina
router.delete('/:id', authenticateToken, authorizeRoles('admin'), (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM pracownicy WHERE idPracownicy = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Błąd serwera', details: err.sqlMessage });
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Nie znaleziono pracownika' });
        }
        res.json({ message: 'Pracownik usunięty' });
    });
});

module.exports = router;
