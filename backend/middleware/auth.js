// middleware/auth.js
const jwt = require('jsonwebtoken');

// Middleware do sprawdzania tokena JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ error: 'Brak tokena autoryzacyjnego' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'tajnyklucz', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Nieprawidłowy token' });
        }

        req.user = user; // dodajemy dane użytkownika do requestu
        next();
    });
}

// Middleware do sprawdzania roli
function authorizeRoles(...dozwoloneRole) {
    return (req, res, next) => {
        if (!req.user || !dozwoloneRole.includes(req.user.rola)) {
            return res.status(403).json({ error: 'Brak uprawnień' });
        }
        next();
    };
}

module.exports = {
    authenticateToken,
    authorizeRoles
};
