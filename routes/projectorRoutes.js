

const express = require('express'); // Framework pour gérer les routes
const {
  addProjector,
  getProjectors,
  updateProjector,
  deleteProjector,
} = require('../controllers/projectorController'); // Importe les fonctions du contrôleur
const authMiddleware = require('../middlewares/authMiddleware'); // Middleware d'authentification (à compléter par l'étudiant 3)
const router = express.Router(); // Crée un routeur Express

// Route pour ajouter un projecteur (protégée)
router.post('/', authMiddleware, addProjector);

// Route pour lister les projecteurs disponibles (publique)
router.get('/', getProjectors);

// Route pour modifier un projecteur (protégée)
router.put('/:id', authMiddleware, updateProjector);

// Route pour supprimer un projecteur (protégée)
router.delete('/:id', authMiddleware, deleteProjector);

module.exports = router; // Exporte le routeur
