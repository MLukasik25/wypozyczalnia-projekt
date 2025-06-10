const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// GET /api/uzytkownicy/me
router.get('/me', authenticateToken, async (req, res) => {
    const { rola, powiazane_id, email } = req.user;

    let query;
    let values;

    if (rola === 'klient') {
        query = 'SELECT Imie, Nazwisko, Email, Telefon, Adres FROM klienci WHERE idKlient = ?';
        values = [powiazane_id];
    } else if (rola === 'pracownik') {
        query = 'SELECT Imie, Nazwisko, Email, Telefon FROM pracownicy WHERE idPracownicy = ?';
        values = [powiazane_id];
    } else if (rola === 'admin') {
        return res.json({
            email,
            rola: 'admin',
            info: 'Konto administracyjne – brak powiązanych danych osobowych'
        });
    }

    db.query(query, values, (err, results) => {
        if (err) {
            console.error('Błąd przy pobieraniu danych użytkownika:', err);
            return res.status(500).json({ error: 'Błąd serwera' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Nie znaleziono danych użytkownika' });
        }

        res.json({
            rola,
            dane: results[0]
        });
    });
});

const bcrypt = require('bcrypt');

//Zmiana hasła użytkownika (dla zalogowanego)
router.put('/zmiana-hasla', authenticateToken, async (req, res) => {
    const { aktualneHaslo, noweHaslo } = req.body;
    const userId = req.user.id;
  
    if (!aktualneHaslo || !noweHaslo) {
      return res.status(400).json({ error: 'Wymagane aktualne i nowe hasło.' });
    }
  
    try {
      // Pobieramy aktualny hash hasła z bazy
      const [user] = await db.promise().query('SELECT haslo FROM uzytkownicy WHERE id = ?', [userId]);
  
      if (user.length === 0) {
        return res.status(404).json({ error: 'Użytkownik nie znaleziony.' });
      }
  
      // Weryfikacja aktualnego hasła
      const czyHasloPoprawne = await bcrypt.compare(aktualneHaslo, user[0].haslo);
  
      if (!czyHasloPoprawne) {
        return res.status(401).json({ error: 'Aktualne hasło jest niepoprawne.' });
      }
  
      // Hashowanie nowego hasła
      const hashedNoweHaslo = await bcrypt.hash(noweHaslo, 10);
  
      // Aktualizacja hasła w bazie
      await db.promise().query('UPDATE uzytkownicy SET haslo = ? WHERE id = ?', [hashedNoweHaslo, userId]);
  
      res.json({ message: 'Hasło zmienione pomyślnie.' });
  
    } catch (error) {
      console.error('Błąd zmiany hasła:', error);
      res.status(500).json({ error: 'Błąd serwera przy zmianie hasła.' });
    }
  });

  router.get('/admin', authenticateToken, authorizeRoles('admin'), (req, res) => {
    const query = 'SELECT * FROM widok_uzytkownicy_szczegoly';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Błąd pobierania użytkowników:', err);
            return res.status(500).json({ error: 'Błąd serwera' });
        }
        res.json(results);
    });
});
  

module.exports = router;
