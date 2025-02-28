const {
  createProjector,
  getAll,
  getAvailableProjectors,
  updateStatus,
  deleteById,
} = require('../models/projectorModel');

const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

// Function for send error
const sendServerError = (res) => {
  res.status(STATUS_CODES.SERVER_ERROR).json({ message: 'Erreur serveur' });
}

// Ajoute un nouveau projecteur
const addProjector = (req, res) => {
  try {
    const { name, status } = req.body;

    if (!name || !status) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Nom et statut requis' });
    }

    const validStatuses = ['fonctionnel', 'occupe', 'en panne'];
    if (!validStatuses.includes(status)) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Statut invalide' });
    }

    createProjector(name, status, (err) => {
      if (err) {
        return sendServerError(res);
      }
      res.status(STATUS_CODES.CREATED).json({ message: 'Projecteur ajouté avec succès' });
    });
  } catch (error) {
    console.error(error);
    sendServerError(res);
  }
};

// Récupère la liste de tous les projecteurs
const getProjectors = (req, res) => {
    try {
        getAll((err, projectors) => {
            if (err) {
                return sendServerError(res);
            }
            res.status(STATUS_CODES.SUCCESS).json(projectors);
        });
    } catch (error) {
        console.error(error);
        sendServerError(res);
    }
};

// Met à jour le statut d'un projecteur
const updateProjectorController = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Nouveau statut requis' });
    }

    const validStatuses = ['fonctionnel', 'occupe', 'en panne'];
    if (!validStatuses.includes(status)) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Statut invalide' });
    }

    updateStatus(id, status, (err, updated) => {
        if (err) {
            return sendServerError(res);
        }
        if(!updated){
            return res.status(STATUS_CODES.NOT_FOUND).json({ message: 'Projecteur non trouvé' });
        }
        res.status(STATUS_CODES.SUCCESS).json({ message: 'Statut du projecteur mis à jour' });
    });
  } catch (error) {
    console.error(error);
    sendServerError(res);
  }
};

// Supprime un projecteur
const deleteProjector = (req, res) => {
  try {
    const { id } = req.params;

    deleteById(id, (err, updated) => {
        if (err) {
            return sendServerError(res);
        }
        if(!updated){
            return res.status(STATUS_CODES.NOT_FOUND).json({ message: 'Projecteur non trouvé' });
        }
        res.status(STATUS_CODES.SUCCESS).json({ message: 'Projecteur supprimé' });
    });
  } catch (error) {
    console.error(error);
    sendServerError(res);
  }
};

module.exports = {
  addProjector,
  getProjectors,
  updateProjectorController,
  deleteProjector,
};
