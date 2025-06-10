const express = require('express');
const router = express.Router();
const db = require('../config/db'); // jeśli masz zewnętrzny plik z połączeniem
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

//Widok samochodów z cenami (publiczny)
router.get('/ceny', (req, res) => {
    const query = 'SELECT * FROM samochody_z_cenami';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Błąd pobierania widoku:', err);
            return res.status(500).json({ error: 'Błąd serwera' });
        }
        res.json(results);
    });
});

//Pobranie wszystkich samochodów
router.get('/', authenticateToken, authorizeRoles('admin', 'pracownik'), (req, res) => {
    const query = 'SELECT * FROM samochody';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Błąd podczas pobierania samochodów:', err);
            return res.status(500).json({ error: 'Błąd serwera' });
        }
        res.json(results);
    });
});

// Pojedynczy pojazd po numerze rejestracyjnym
router.get('/:nrRej', authenticateToken, authorizeRoles('admin', 'pracownik', 'klient'), (req, res) => {
    const nrRej = req.params.nrRej;
    const query = 'SELECT * FROM samochody WHERE Nr_Rej = ?';

    db.query(query, [nrRej], (err, results) => {
        if (err) {
            console.error('Błąd przy pobieraniu pojazdu:', err);
            return res.status(500).json({ error: 'Błąd serwera' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Pojazd nie znaleziony' });
        }

        res.json(results[0]);
    });
});

//Dodanie samochodu
router.post('/', authenticateToken, authorizeRoles('admin'), (req, res) => {
    const { nr_rej, rocznik, numer_vin, marka, model, klasa, kolor } = req.body;

    const query = `
        INSERT INTO samochody 
        (Nr_Rej, Rocznik, Numer_VIN, Marka, Model, Klasa, Kolor, Dostępność)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `;

    db.query(query, [nr_rej, rocznik, numer_vin, marka, model, klasa, kolor], (err, results) => {
        if (err) {
            console.error('Błąd dodawania samochodu:', err);
            return res.status(500).json({ error: 'Błąd serwera' });
        }
        res.json({ message: 'Samochód dodany pomyślnie' });
    });
});

//Usunięcie samochodu
router.delete('/:nr_rej', authenticateToken, authorizeRoles('admin'), (req, res) => {
    const { nr_rej } = req.params;
    const query = 'DELETE FROM samochody WHERE Nr_Rej = ?';
    db.query(query, [nr_rej], (err, results) => {
        if (err) {
            console.error('Błąd SQL:', err.sqlMessage);
            return res.status(500).json({ error: 'Błąd serwera', details: err.sqlMessage });
        } else if (results.affectedRows === 0) {
            return res.status(404).json({ message: `Nie znaleziono samochodu o Nr_Rej: ${nr_rej}` });
        } else {
            res.json({ message: `Samochód ${nr_rej} usunięty pomyślnie` });
        }
    });
});

module.exports = router;
