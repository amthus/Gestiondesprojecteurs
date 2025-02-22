

const express = require("express");
const router = express.Router();
const projectorController = require("../src/controllers/projectorController");
const { authMiddleware } = require("../src/middlewares/authMiddleware");

// Route protégée pour récupérer tous les projecteurs 
router.get("/", authMiddleware, projectorController.getAllProjectors);

// Route pour ajouter un projecteur 
router.post("/add", authMiddleware, projectorController.addProjector);

// Route pour supprimer un projecteur
router.delete("/:id", authMiddleware, projectorController.deleteProjector);

// Route pour mettre à jour le statut d'un projecteur
router.put("/:id", authMiddleware, projectorController.updateProjectorStatus);

module.exports = router;
