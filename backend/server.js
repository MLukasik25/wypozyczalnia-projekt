require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const authRoutes = require('./routes/auth');
const { authenticateToken, authorizeRoles } = require('./middleware/auth');
const samochodyRoutes = require('./routes/samochody');
const klienciRoutes = require('./routes/klienci');
const pracownicyRoutes = require('./routes/pracownicy');
const wypozyczeniaRoutes = require('./routes/wypozyczenia.js');
const cennikRoutes = require('./routes/cennik');
const ocacRoutes = require('./routes/ocac.js');
const naprawyRoutes = require('./routes/naprawy.js');
const fakturyRoutes = require('./routes/faktury');
const uzytkownicyRoutes = require('./routes/uzytkownicy');




const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoutes);
app.use('/api/samochody', samochodyRoutes);
app.use('/api/klienci', klienciRoutes);
app.use('/api/pracownicy', pracownicyRoutes);
app.use('/api/wypozyczenia', wypozyczeniaRoutes);
app.use('/api/cennik', cennikRoutes);
app.use('/api/ocac', ocacRoutes);
app.use('/api/naprawy', naprawyRoutes);
app.use('/api/faktury', fakturyRoutes);
app.use('/api/uzytkownicy', uzytkownicyRoutes);



// Sprawdzenie połączenia z bazą
db.connect(err => {
    if (err) {
        console.error('Błąd połączenia z bazą danych:', err);
    } else {
        console.log('Połączono z bazą danych MySQL');
    }
});

// Testowy endpoint
app.get('/', (req, res) => {
    res.send('Serwer działa!');
});

// ----------------- START SERWERA -----------------

app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});
