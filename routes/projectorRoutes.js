const express = require("express");
const router = express.Router();
const projectorController = require("../src/controllers/projectorController");
const { authMiddleware } = require("../src/middlewares/authMiddleware");
const { roleMiddleware } = require("../src/middlewares/roleMiddleware");

// Route protégée pour récupérer tous les projecteurs
router.get("/", authMiddleware, projectorController.getAllProjectors);

// Route pour ajouter un projecteur
router.post("/", authMiddleware, roleMiddleware, projectorController.addProjector);

// Route pour supprimer un projecteur
router.delete("/:id", authMiddleware, roleMiddleware, projectorController.deleteProjector);

// Route pour mettre à jour le statut d'un projecteur
router.put("/:id", authMiddleware, roleMiddleware, projectorController.updateProjectorStatus);

module.exports = router;
