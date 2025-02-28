const {
  createProjector,
  getAvailableProjectors,
  updateProjector,
  deleteProjector,
} = require('../models/projectorModel'); // Importe les fonctions du modèle

// Ajoute un nouveau projecteur
const addProjector = (req, res) => {
  try {
    const { name, status } = req.body; // Récupère les données de la requête

    // Vérifie que les champs obligatoires sont présents
    if (!name || !status) {
      return res.status(400).json({ message: 'Nom et statut requis' });
    }

    // Liste des statuts valides définie dans la table
    const validStatuses = ['fonctionnel', 'occupe', 'en panne'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Statut invalide' });
    }

    // Crée le projecteur dans la base de données
    createProjector(name, status, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Erreur lors de l\'ajout, peut-être un nom déjà utilisé' });
      }
      res.status(201).json({ message: 'Projecteur ajouté avec succès' });
    });
  } catch (error) {
    console.error(error); // Log l'erreur pour le débogage
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupère la liste des projecteurs disponibles
const getProjectors = (req, res) => {
  try {
    getAvailableProjectors((err, projectors) => {
      if (err) {
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      res.status(200).json(projectors); // Renvoie la liste des projecteurs
    });
  } catch (error) {
    console.error(error); // Log l'erreur pour le débogage
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Met à jour le statut d'un projecteur
const updateProjector = (req, res) => {
  try {
    const { id } = req.params; // Récupère l'ID du projecteur depuis l'URL
    const { status } = req.body; // Récupère le nouveau statut

    if (!status) {
      return res.status(400).json({ message: 'Statut requis' });
    }

    const validStatuses = ['fonctionnel', 'occupe', 'en panne'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Statut invalide' });
    }

    updateProjector(id, status, (err, changes) => {
      if (err) {
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      if (changes === 0) {
        return res.status(404).json({ message: 'Projecteur non trouvé' });
      }
      res.status(200).json({ message: 'Projecteur mis à jour' });
    });
  } catch (error) {
    console.error(error); // Log l'erreur pour le débogage
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprime un projecteur
const deleteProjector = (req, res) => {
  try {
    const { id } = req.params; // Récupère l'ID du projecteur depuis l'URL

    deleteProjector(id, (err, changes) => {
      if (err) {
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      if (changes === 0) {
        return res.status(404).json({ message: 'Projecteur non trouvé' });
      }
      res.status(200).json({ message: 'Projecteur supprimé' });
    });
  } catch (error) {
    console.error(error); // Log l'erreur pour le débogage
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { addProjector, getProjectors, updateProjector, deleteProjector };