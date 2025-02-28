
const express = require('express'); // Framework pour gérer les routes
const { register, login } = require('../controllers/userController'); // Importe les fonctions du contrôleur
const router = express.Router(); // Crée un routeur Express

// Route pour l'inscription (publique)
router.post('/register', register);

// Route pour la connexion (publique)
router.post('/login', login);

module.exports = router; // Exporte le routeur pour utilisation dans app.js
