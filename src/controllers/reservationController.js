const Reservation = require("../models/reservationModel");

const MESSAGES = {
  RESERVATION_ADDED: "Réservation ajoutée avec succès.",
  RESERVATION_NOT_FOUND: "Réservation non trouvée.",
  RESERVATION_UPDATED: "Réservation mise à jour avec succès.",
  RESERVATION_DELETED: "Réservation supprimée avec succès.",
  TIME_REQUIRED: "L'heure de début et de fin sont requises et doivent être valides.",
  TIME_CONFLICT: "Le créneau horaire demandé est déjà réservé.",
  CREATION_ERROR: "Erreur lors de la création de la réservation.",
  RETRIEVAL_ERROR: "Erreur lors de la récupération des réservations.",
  UPDATE_ERROR: "Erreur lors de la mise à jour de la réservation.",
  DELETE_ERROR: "Erreur lors de la suppression de la réservation.",
};

const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

// Valider les dates
const isValidDate = (date) => !isNaN(new Date(date).getTime());

// Ajouter une réservation
exports.addReservation = async (req, res) => {
  const { user_id, projector_id, start_time, end_time } = req.body;

  // Validation des champs obligatoires
  if (!user_id || !projector_id || !start_time || !end_time) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({ error: MESSAGES.TIME_REQUIRED });
  }

  // Validation des dates
  if (!isValidDate(start_time) || !isValidDate(end_time) || new Date(start_time) >= new Date(end_time)) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({ error: "Les dates de début et de fin doivent être valides et la date de fin doit être postérieure à la date de début." });
  }

  try {
    // Vérifier si le créneau est disponible
    const isAvailable = await Reservation.isTimeSlotAvailable(projector_id, start_time, end_time);
    if (!isAvailable) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ error: MESSAGES.TIME_CONFLICT });
    }

    // Créer la réservation
    const reservation = await Reservation.create(user_id, projector_id, start_time, end_time);
    res.status(STATUS_CODES.CREATED).json({ message: MESSAGES.RESERVATION_ADDED, reservation });
  } catch (err) {
    res.status(STATUS_CODES.SERVER_ERROR).json({ error: MESSAGES.CREATION_ERROR });
  }
};

// Récupérer toutes les réservations
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.getAll();
    res.status(STATUS_CODES.SUCCESS).json(reservations);
  } catch (err) {
    res.status(STATUS_CODES.SERVER_ERROR).json({ error: MESSAGES.RETRIEVAL_ERROR });
  }
};

// Mettre à jour une réservation
exports.updateReservation = async (req, res) => {
  const { id } = req.params;
  const { start_time, end_time } = req.body;

  // Validation des champs obligatoires
  if (!id || !start_time || !end_time) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({ error: MESSAGES.TIME_REQUIRED });
  }

  // Validation des dates
  if (!isValidDate(start_time) || !isValidDate(end_time) || new Date(start_time) >= new Date(end_time)) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({ error: "Les dates de début et de fin doivent être valides et la date de fin doit être postérieure à la date de début." });
  }

  try {
    // Vérifier si le créneau est disponible
    const isAvailable = await Reservation.isTimeSlotAvailable(projector_id, start_time, end_time);
    if (!isAvailable) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ error: MESSAGES.TIME_CONFLICT });
    }

    // Mettre à jour la réservation
    const updated = await Reservation.update(id, start_time, end_time);
    if (!updated) {
      return res.status(STATUS_CODES.NOT_FOUND).json({ error: MESSAGES.RESERVATION_NOT_FOUND });
    }
    res.status(STATUS_CODES.SUCCESS).json({ message: MESSAGES.RESERVATION_UPDATED });
  } catch (err) {
    res.status(STATUS_CODES.SERVER_ERROR).json({ error: MESSAGES.UPDATE_ERROR });
  }
};

// Supprimer une réservation
exports.deleteReservation = async (req, res) => {
  const { id } = req.params;

  // Validation de l'ID
  if (!id) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({ error: "L'identifiant de la réservation est requis." });
  }

  try {
    const deleted = await Reservation.deleteById(id);
    if (!deleted) {
      return res.status(STATUS_CODES.NOT_FOUND).json({ error: MESSAGES.RESERVATION_NOT_FOUND });
    }
    res.status(STATUS_CODES.SUCCESS).json({ message: MESSAGES.RESERVATION_DELETED });
  } catch (err) {
    res.status(STATUS_CODES.SERVER_ERROR).json({ error: MESSAGES.DELETE_ERROR });
  }
};