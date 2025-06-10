// routes/wypozyczenia.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

//Pobranie wszystkich wypożyczeń (dla admina i pracownika)
router.get('/', authenticateToken, authorizeRoles('admin', 'pracownik'), (req, res) => {
    const query = 'SELECT * FROM wypożyczenia';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Błąd przy pobieraniu wypożyczeń:', err);
            res.status(500).json({ error: 'Błąd serwera' });
        } else {
            res.json(results);
        }
    });
});

//ADMIN: Wszystkie wypożyczenia z widoku rozszerzonego
router.get('/admin', authenticateToken, authorizeRoles('admin'), (req, res) => {
    const query = 'SELECT * FROM widok_wypozyczenia_admin';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Błąd pobierania wypożyczeń dla admina:', err);
            return res.status(500).json({ error: 'Błąd serwera' });
        }
        res.json(results);
    });
});

module.exports = router;


//Dodawanie wypożyczenia przez pracownika
router.post('/pracownik', authenticateToken, authorizeRoles('pracownik'), async (req, res) => {
    const { id_klient, nr_rej, pakiet_ubezpieczen } = req.body;
    const pracownik_id = req.user.powiazane_id;

    if (!id_klient || !nr_rej || !pakiet_ubezpieczen) {
        return res.status(400).json({ error: 'Brakuje wymaganych danych (klient, numer rejestracyjny, pakiet)' });
    }

    try {
        const [klienci] = await db.promise().query('SELECT * FROM klienci WHERE idKlient = ?', [id_klient]);
        if (klienci.length === 0) {
            return res.status(404).json({ error: 'Klient nie istnieje' });
        }

        const [samochody] = await db.promise().query('SELECT Dostępność FROM samochody WHERE Nr_Rej = ?', [nr_rej]);
        if (samochody.length === 0) {
            return res.status(404).json({ error: 'Samochód nie istnieje' });
        }

        if (samochody[0].Dostępność === 0) {
            return res.status(400).json({ error: 'Samochód jest aktualnie niedostępny' });
        }

        await db.promise().query(`
            INSERT INTO wypożyczenia (Klient, Pracownik, NrRej, Data_wypożyczenia, Pakiet_ubezpieczeń, Status)
            VALUES (?, ?, ?, NOW(), ?, 'zatwierdzone')
        `, [id_klient, pracownik_id, nr_rej, pakiet_ubezpieczen]);

        res.status(201).json({ message: 'Wypożyczenie zostało dodane i zatwierdzone' });
    } catch (err) {
        console.error('Błąd podczas dodawania wypożyczenia:', err);
        res.status(500).json({ error: 'Błąd serwera' });
    }
});

//Zatwierdzanie wypożyczenia przez pracownika
router.put('/zatwierdz/:id', authenticateToken, authorizeRoles('pracownik'), (req, res) => {
    const id = req.params.id;
    const idPracownika = req.user.powiazane_id;

    if (!idPracownika) {
        return res.status(400).json({ error: 'Brak powiązanego ID pracownika w tokenie' });
    }

    const query = `
        UPDATE wypożyczenia
        SET Pracownik = ?, Status = 'zatwierdzone'
        WHERE idWypożyczenia = ? AND Status = 'oczekujące'
    `;

    db.query(query, [idPracownika, id], (err, result) => {
        if (err) {
            console.error('Błąd przy aktualizacji wypożyczenia:', err);
            return res.status(500).json({ error: 'Błąd serwera' });
        }

        if (result.affectedRows === 0) {
            return res.status(400).json({ error: 'Nie znaleziono wypożyczenia oczekującego o podanym ID' });
        }

        res.json({ message: `Wypożyczenie nr ${id} zatwierdzone przez pracownika ID ${idPracownika}` });
    });
});



//Aktualizacja wypożyczenia – tylko zakończone lub anulowane + generowanie faktury
router.put('/:id', authenticateToken, authorizeRoles('admin', 'pracownik'), async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const fields = [];
    const values = [];

    if (!status) {
        return res.status(400).json({ error: 'Status jest wymagany' });
    }

    const allowedStatuses = ['zakończone', 'anulowane'];
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ error: `Dozwolone statusy to: ${allowedStatuses.join(', ')}` });
    }

    fields.push('Status = ?');
    values.push(status);

    if (status === 'zakończone') {
        fields.push('Data_zwrotu = CURDATE()');
    }

    values.push(id);

    const query = `UPDATE wypożyczenia SET ${fields.join(', ')} WHERE idWypożyczenia = ?`;

    try {
        await db.promise().query(query, values);

        if (status === 'zakończone') {
            const [faktura] = await db.promise().query(
              'SELECT 1 FROM faktury WHERE NrWypożyczenia = ? LIMIT 1',
              [id]
            );

            if (faktura.length === 0) {
                await db.promise().query('CALL FakturaWystaw(?)', [id]);
            }
        }

        res.json({ message: `Status wypożyczenia nr ${id} zaktualizowany na "${status}"` });

    } catch (err) {
        console.error('Błąd podczas aktualizacji wypożyczenia lub generowania faktury:', err);
        res.status(500).json({ error: 'Błąd serwera' });
    }
});




//Usunięcie wypożyczenia (opcjonalne – tylko admin)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM wypożyczenia WHERE idWypożyczenia = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Błąd przy usuwaniu wypożyczenia:', err);
            res.status(500).json({ error: 'Błąd serwera' });
        } else if (results.affectedRows === 0) {
            res.status(404).json({ message: 'Nie znaleziono wypożyczenia' });
        } else {
            res.json({ message: 'Wypożyczenie usunięte' });
        }
    });
});

// Dodanie wypożyczenia przez klienta
router.post('/klient', authenticateToken, authorizeRoles('klient'), (req, res) => {
    const { NrRej, Pakiet_ubezpieczeń } = req.body;
    const Klient = req.user.powiazane_id;

    const checkAvailabilityQuery = 'SELECT Dostępność FROM samochody WHERE Nr_Rej = ?';

    db.query(checkAvailabilityQuery, [NrRej], (err, result) => {
        if (err) {
            console.error('Błąd przy sprawdzaniu dostępności:', err);
            return res.status(500).json({ error: 'Błąd serwera przy sprawdzaniu dostępności samochodu' });
        }

        if (result.length === 0) {
            console.log('Brak wyników! Sprawdź dokładnie nr rejestracyjny:', NrRej);
            db.query('SELECT Nr_Rej FROM samochody', (e, r) => console.log('📋 Wszystkie NR_REJ w bazie:', r));
            return res.status(404).json({ error: 'Samochód nie istnieje' });
        }

        const rawDostepnosc = result[0].Dostępność;
        const dostepnosc = parseInt(rawDostepnosc);
        console.log('Dostępność:', rawDostepnosc, '| Typ:', typeof rawDostepnosc);

        if (isNaN(dostepnosc)) {
            return res.status(500).json({ error: 'Błąd danych: Dostępność nie jest liczbą' });
        }

        if (dostepnosc === 0) {
            return res.status(400).json({ error: 'Samochód jest aktualnie niedostępny' });
        }

        const insertQuery = `
            INSERT INTO wypożyczenia 
            (Klient, NrRej, Pakiet_ubezpieczeń, Status)
            VALUES (?, ?, ?, 'oczekujące')
        `;

        db.query(insertQuery, [Klient, NrRej, Pakiet_ubezpieczeń], (err, result) => {
            if (err) {
                console.error('Błąd przy dodawaniu rezerwacji:', err);
                return res.status(500).json({ error: 'Błąd serwera przy dodawaniu rezerwacji' });
            }

            res.status(201).json({ message: 'Rezerwacja złożona pomyślnie' });
        });
    });
});




//Tylko dla zalogowanego klienta – jego własne wypożyczenia
router.get('/moje-klient', authenticateToken, authorizeRoles('klient'), (req, res) => {
    const idKlienta = req.user.powiazane_id;

    const query = `
        SELECT w.*, s.Marka, s.Model, s.Kolor
        FROM wypożyczenia w
        JOIN samochody s ON w.NrRej = s.Nr_Rej
        WHERE w.Klient = ?
    `;

    db.query(query, [idKlienta], (err, results) => {
        if (err) {
            console.error('Błąd podczas pobierania wypożyczeń klienta:', err);
            res.status(500).json({ error: 'Błąd serwera' });
        } else {
            res.json(results);
        }
    });
});

//Wypożyczenia obsługiwane przez zalogowanego pracownika
router.get('/moje-pracownik', authenticateToken, authorizeRoles('pracownik'), (req, res) => {
    const idPracownika = req.user.powiazane_id;

    const query = `
        SELECT 
            w.*, 
            CONCAT(k.Imie, ' ', k.Nazwisko) AS Klient, 
            s.Marka, 
            s.Model, 
            s.Kolor
        FROM wypożyczenia w
        JOIN samochody s ON w.NrRej = s.Nr_Rej
        JOIN klienci k ON w.Klient = k.idKlient
        WHERE w.Pracownik = ?
    `;

    db.query(query, [idPracownika], (err, results) => {
        if (err) {
            console.error('Błąd podczas pobierania wypożyczeń pracownika:', err);
            res.status(500).json({ error: 'Błąd serwera' });
        } else {
            res.json(results);
        }
    });
});


//GET: Oczekujące wypożyczenia
router.get('/oczekujace', authenticateToken, authorizeRoles('admin', 'pracownik'), (req, res) => {
    const query = 'SELECT * FROM oczekujące_wypozyczenia;';
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('Błąd pobierania oczekujących wypożyczeń:', err);
        return res.status(500).json({ error: 'Błąd serwera' });
      }
  
      res.json(results);
    });
  });
  
module.exports = router;
