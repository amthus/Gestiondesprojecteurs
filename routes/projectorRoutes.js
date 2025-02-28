const express = require('express');
const router = express.Router();
const {
  addProjector,
  getProjectors,
  updateProjectorController,
  deleteProjector,
} = require('../src/controllers/projectorController');
const authMiddleware = require('../src/middlewares/authMiddleware');

// Routes
router.post('/', authMiddleware, addProjector);
router.get('/', getProjectors);
router.put('/:id', authMiddleware, updateProjectorController);
router.delete('/:id', authMiddleware, deleteProjector);

module.exports = router;
