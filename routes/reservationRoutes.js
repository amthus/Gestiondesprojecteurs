
const express = require('express'); // Framework pour gérer les routes
const {
  createReservationHandler,
  getReservationsHandler,
  deleteReservationHandler,
} = require('../controllers/reservationController'); // Importe les fonctions du contrôleur
const authMiddleware = require('../middlewares/authMiddleware'); // Middleware d'authentification (à compléter par l'étudiant 3)
const router = express.Router(); // Crée un routeur Express

// Route pour créer une réservation (protégée)
router.post('/', authMiddleware, createReservationHandler);

// Route pour lister les réservations (protégée)
router.get('/', authMiddleware, getReservationsHandler);

// Route pour annuler une réservation (protégée)
router.delete('/:id', authMiddleware, deleteReservationHandler);

module.exports = router; // Exporte le routeur
