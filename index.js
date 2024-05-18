const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

// Middleware pour analyser les corps de requête JSON
app.use(express.json());

// Middleware pour les sessions
app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

// Middleware d'authentification
app.use("/customer/auth/*", function auth(req, res, next) {
    const token = req.headers['authorization'];
    if (token) {
        jwt.verify(token, 'fingerprint_customer', (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid token' });
            } else {
                req.user = decoded;
                next();
            }
        });
    } else {
        return res.status(403).json({ message: 'Token required' });
    }
});

// Routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Démarrage du serveur
const PORT = 5000;
app.listen(PORT, () => console.log("Server is running on port " + PORT));
module.exports = app;

