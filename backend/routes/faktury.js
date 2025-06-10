const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// GET – wszystkie faktury
router.get('/', authenticateToken, authorizeRoles('admin', 'pracownik'), (req, res) => {
    const query = 'SELECT * FROM faktury';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Błąd przy pobieraniu faktur:', err);
            return res.status(500).json({ error: 'Błąd serwera' });
        }
        res.json(results);
    });
});
// POST /faktury/generuj/:id — generuje fakturę dla wypożyczenia
router.post('/generuj/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  const id = req.params.id;

  try {
    const [rows] = await db.promise().query(
      'SELECT Status FROM wypożyczenia WHERE idWypożyczenia = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Wypożyczenie nie istnieje' });
    }

    const status = rows[0].Status;

    if (status !== 'zakończone') {
      return res.status(400).json({ error: 'Fakturę można wystawić tylko dla zakończonego wypożyczenia' });
    }

    const [existing] = await db.promise().query(
      'SELECT 1 FROM faktury WHERE NrWypożyczenia = ? LIMIT 1',
      [id]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: 'Faktura dla tego wypożyczenia już istnieje' });
    }

    await db.promise().query('CALL FakturaWystaw(?)', [id]);

    res.status(201).json({ message: 'Faktura została wygenerowana' });
  } catch (err) {
    console.error('Błąd podczas generowania faktury:', err);
    res.status(500).json({ error: 'Błąd serwera podczas generowania faktury' });
  }
});


  
// DELETE – usunięcie faktury
router.delete('/:id', authenticateToken, authorizeRoles('admin'), (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM faktury WHERE idFaktury = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Błąd przy usuwaniu faktury:', err);
            return res.status(500).json({ error: 'Błąd serwera' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Nie znaleziono faktury o podanym ID' });
        }
        res.json({ message: 'Faktura usunięta' });
    });
});
//Faktury konkretnego klienta (na podstawie tokena)
router.get('/moje', authenticateToken, authorizeRoles('klient'), (req, res) => {
    const idKlienta = req.user.powiazane_id;

    const query = `
        SELECT * FROM faktury_klient WHERE idKlienta = ?
    `;

    db.query(query, [idKlienta], (err, results) => {
        if (err) {
            console.error('Błąd podczas pobierania faktur klienta:', err);
            res.status(500).json({ error: 'Błąd serwera' });
        } else {
            res.json(results);
        }
    });
});


module.exports = router;
