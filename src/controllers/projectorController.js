const Projector = require("../models/projectorModel");

// Constantes pour les messages d'erreur et de succès
const MESSAGES = {
  NAME_REQUIRED: "Le nom du projecteur est requis et doit être une chaîne de caractères valide.",
  STATUS_INVALID: "Statut invalide. Veuillez le bon mot pour l'etat",
  PROJECTOR_NOT_FOUND: "Projecteur non trouvé.",
  PROJECTOR_ADDED: "Projecteur ajouté avec succès.",
  PROJECTOR_UPDATED: "Statut du projecteur mis à jour avec succès.",
  RETRIEVAL_ERROR: "Erreur lors de la récupération des projecteurs.",
  CREATION_ERROR: "Erreur interne lors de l'ajout du projecteur.",
  UPDATE_ERROR: "Erreur lors de la mise à jour du projecteur.",
  PROJECTOR_EXISTS: "Un projecteur avec ce nom existe déjà.", 
  PROJECTOR_NAME :"Nom invalide. Veuillez respectez le nommage des équipements",
  DELETE_ERROR: "Erreur lors de la suppression du projecteur.",
};

// Codes HTTP
const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  CONFLICT: 409, 
};

// Définition des statuts valides
const VALID_STATUSES = ["fonctionnel", "occupe", "en panne"];

// Fonction de validation du statut
const validateStatus = (status) => VALID_STATUSES.includes(status);

// Fonction de validation du nom (string non vide et valide)
const validateName = (name) => {
  const nameRegex = /^[A-Za-z]/; 
  return typeof name === "string" && name.trim().length > 1 && nameRegex.test(name.trim());
};
exports.addProjector = (req, res) => {
  const { name, status } = req.body;

  // Vérifier si le nom est valide
  if (!validateName(name)) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({ error:MESSAGES.PROJECTOR_NAME });
  }
  

  // Vérifier si le projecteur existe déjà
  Projector.findByName(name.trim(), (err, existingProjector) => {
    if (err) {
      return res.status(STATUS_CODES.SERVER_ERROR).json({ error: MESSAGES.CREATION_ERROR });
    }

    if (existingProjector) {
      return res.status(STATUS_CODES.CONFLICT).json({ error: MESSAGES.PROJECTOR_EXISTS });
    }

    // Vérifier si le statut est valide
    if (!validateStatus(status)) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        error: `Statut invalide. Choisissez parmi : ${VALID_STATUSES.join(", ")}`,
      });
    }

    // Créer le projecteur avec un nom et un statut valides
    Projector.create(name.trim(), status, (err) => {
      if (err) {
        return res.status(STATUS_CODES.SERVER_ERROR).json({ error: MESSAGES.CREATION_ERROR });
      }
      res.status(STATUS_CODES.CREATED).json({ message: MESSAGES.PROJECTOR_ADDED });
    });
  });
};

exports.getAllProjectors = (req, res) => {
  Projector.getAll((err, projectors) => {
    if (err) {
      return res.status(STATUS_CODES.SERVER_ERROR).json({ error: MESSAGES.RETRIEVAL_ERROR });
    }
    res.status(STATUS_CODES.SUCCESS).json(projectors);
  });
};

exports.updateProjectorStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({ error: "L'identifiant du projecteur est requis." });
  }

  if (!validateStatus(status)) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({ error: MESSAGES.STATUS_INVALID });
  }

  Projector.updateStatus(id, status, (err, updated) => {
    if (err) {
      return res.status(STATUS_CODES.SERVER_ERROR).json({ error: MESSAGES.UPDATE_ERROR });
    }

    if (!updated) {
      return res.status(STATUS_CODES.NOT_FOUND).json({ error: MESSAGES.PROJECTOR_NOT_FOUND });
    }

    // Success case
    return res.status(STATUS_CODES.SUCCESS).json({ message: MESSAGES.PROJECTOR_UPDATED });
  });
};


exports.deleteProjector = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({ error: "L'identifiant du projecteur est requis." });
  }

  Projector.deleteById(id, (err, deleted) => {
    if (err) {
      return res.status(STATUS_CODES.SERVER_ERROR).json({ error: MESSAGES.DELETE_ERROR });
    }

    if (!deleted) {
      return res.status(STATUS_CODES.NOT_FOUND).json({ error: MESSAGES.PROJECTOR_NOT_FOUND });
    }

    res.status(STATUS_CODES.SUCCESS).json({ message: "Projecteur supprimé avec succès." });
  });
};
