// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'wypożyczalnia'
};

//Middleware autoryzacji admina
function onlyAdmin(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Brak tokena' });

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tajnyklucz');
        if (decoded.rola !== 'admin') {
            return res.status(403).json({ error: 'Brak dostępu (wymagany admin)' });
        }
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ error: 'Nieprawidłowy token' });
    }
}

// routes/auth.js
router.post('/dodaj-admina', async (req, res) => {
    const { email, haslo } = req.body;

    if (!email || !haslo) {
        return res.status(400).json({ error: 'Email i hasło są wymagane' });
    }

    try {
        const conn = await mysql.createConnection(dbConfig);
        const [existingUser] = await conn.execute('SELECT * FROM uzytkownicy WHERE email = ?', [email]);

        if (existingUser.length > 0) {
            return res.status(409).json({ error: 'Użytkownik już istnieje' });
        }

        const hashedPassword = await bcrypt.hash(haslo, 10);

        await conn.execute(
            'INSERT INTO uzytkownicy (email, haslo, rola) VALUES (?, ?, ?)',
            [email, hashedPassword, 'admin']
        );

        res.status(201).json({ message: 'Admin dodany pomyślnie' });
    } catch (error) {
        console.error('Błąd dodawania admina:', error);
        res.status(500).json({ error: 'Błąd serwera' });
    }
});


//Rejestracja pracownika (admin-only)
router.post('/register/pracownik', onlyAdmin, async (req, res) => {
    const { email, haslo, imie, nazwisko, telefon, email_kontakt, oddzial } = req.body;

    if (!email || !haslo || !imie || !nazwisko || !oddzial) {
        return res.status(400).json({ error: 'Brakuje wymaganych danych' });
    }

    try {
        const conn = await mysql.createConnection(dbConfig);

        const [existing] = await conn.execute('SELECT * FROM uzytkownicy WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(409).json({ error: 'Użytkownik już istnieje' });
        }

        const [pracownikResult] = await conn.execute(
            'INSERT INTO pracownicy (Imie, Nazwisko, Telefon, Email, Oddział) VALUES (?, ?, ?, ?, ?)',
            [imie, nazwisko, telefon || null, email_kontakt || null, oddzial]
        );
        const pracownikId = pracownikResult.insertId;

        const hashedPassword = await bcrypt.hash(haslo, 10);
        await conn.execute(
            'INSERT INTO uzytkownicy (email, haslo, rola, powiazane_id) VALUES (?, ?, ?, ?)',
            [email, hashedPassword, 'pracownik', pracownikId]
        );

        res.status(201).json({ message: 'Pracownik zarejestrowany' });
    } catch (error) {
        console.error('Błąd przy rejestracji pracownika:', error);
        res.status(500).json({ error: 'Błąd serwera' });
    }
});


// Rejestracja klienta z danymi kontaktowymi
router.post('/register', async (req, res) => {
    const { email, haslo, imie, nazwisko, telefon, adres } = req.body;

    if (!email || !haslo || !imie || !nazwisko) {
        return res.status(400).json({ error: 'Brak wymaganych danych' });
    }

    try {
        const conn = await mysql.createConnection(dbConfig);

        // Sprawdzenie czy email już istnieje
        const [existing] = await conn.execute('SELECT * FROM uzytkownicy WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(409).json({ error: 'Użytkownik o tym emailu już istnieje' });
        }

        // Hashowanie hasła
        const hashedPassword = await bcrypt.hash(haslo, 10);

        // Dodanie do tabeli `klienci`
        const [klientResult] = await conn.execute(
            'INSERT INTO klienci (Imie, Nazwisko, Telefon, Email, Adres) VALUES (?, ?, ?, ?, ?)',
            [imie, nazwisko, telefon || null, email, adres || null]
        );

        const klientId = klientResult.insertId;

        // Dodanie do tabeli `uzytkownicy`
        await conn.execute(
            'INSERT INTO uzytkownicy (email, haslo, rola, powiazane_id) VALUES (?, ?, ?, ?)',
            [email, hashedPassword, 'klient', klientId]
        );

        res.status(201).json({ message: 'Klient zarejestrowany pomyślnie' });
    } catch (err) {
        console.error('Błąd podczas rejestracji:', err);
        res.status(500).json({ error: 'Błąd serwera' });
    }
});


//Logowanie użytkownika
router.post('/login', async (req, res) => {
    const { email, haslo } = req.body;

    try {
        const conn = await mysql.createConnection(dbConfig);
        const [users] = await conn.execute('SELECT * FROM uzytkownicy WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(401).json({ error: 'Nieprawidłowy email lub hasło' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(haslo, user.haslo);

        if (!isMatch) {
            return res.status(401).json({ error: 'Nieprawidłowy email lub hasło' });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                rola: user.rola,
                powiazane_id: user.powiazane_id
            },
            process.env.JWT_SECRET || 'tajnyklucz',
            { expiresIn: '2h' }
        );

        res.json({ message: 'Zalogowano pomyślnie', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Błąd serwera' });
    }
});



module.exports = router;
