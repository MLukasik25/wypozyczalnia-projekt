const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// GET – wszystkie naprawy (admin/pracownik)
router.get('/', authenticateToken, authorizeRoles('admin', 'pracownik'), (req, res) => {
    const query = 'SELECT * FROM naprawy';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Błąd przy pobieraniu napraw:', err);
            return res.status(500).json({ error: 'Błąd serwera' });
        }
        res.json(results);
    });
});

// POST – dodanie naprawy (admin)
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  const { NrWypożyczenia, Koszt, Opis } = req.body;

  if (!NrWypożyczenia || !Koszt || !Opis) {
    return res.status(400).json({ error: 'Wszystkie pola są wymagane.' });
  }

  try {
    const [rows] = await db.promise().query(
      'SELECT Status FROM wypożyczenia WHERE idWypożyczenia = ?',
      [NrWypożyczenia]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Wypożyczenie nie istnieje' });
    }

    if (rows[0].Status !== 'zatwierdzone') {
      return res.status(400).json({ error: 'Naprawę można dodać tylko do wypożyczenia ze statusem \"zatwierdzone\"' });
    }

    const query = 'INSERT INTO naprawy (NrWypożyczenia, Koszt, Opis) VALUES (?, ?, ?)';
    await db.promise().query(query, [NrWypożyczenia, Koszt, Opis]);

    res.json({ message: 'Naprawa dodana pomyślnie' });
  } catch (err) {
    console.error('Błąd przy dodawaniu naprawy:', err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

// DELETE – usunięcie naprawy (admin)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM naprawy WHERE idNaprawa = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Błąd przy usuwaniu naprawy:', err);
            return res.status(500).json({ error: 'Błąd serwera' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Nie znaleziono naprawy o podanym ID' });
        }
        res.json({ message: 'Naprawa usunięta' });
    });
});

module.exports = router;
