const {
  createReservation,
  getReservations,
  findReservationById,
  deleteReservation,
  updateProjectorStatus,
  checkAvailability,
} = require('../models/reservationModel');

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

// Crée une nouvelle réservation
const createReservationHandler = (req, res) => {
  try {
      const { userId, projectorId, startTime, endTime } = req.body;

      if (!userId || !projectorId || !startTime || !endTime) {
          return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Tous les champs sont requis' });
      }

      checkAvailability(projectorId, startTime, endTime, (err, conflict) => {
          if (err) {
              return sendServerError(res);
          }
          if (conflict) {
              return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Créneau déjà réservé' });
          }

          createReservation(userId, projectorId, startTime, endTime, (err) => {
              if (err) {
                  return sendServerError(res);
              }
              updateProjectorStatus(projectorId, 'occupe', (err, updated) => {
                  if (err) {
                      return sendServerError(res);
                  }
                  if(!updated){
                      return res.status(STATUS_CODES.NOT_FOUND).json({ message: 'Projecteur non trouvé' });
                  }
                  res.status(STATUS_CODES.CREATED).json({ message: 'Réservation effectuée' });
              });
          });
      });
  } catch (error) {
      console.error(error);
      sendServerError(res);
  }
};

// Récupère la liste des réservations
const getReservationsHandler = (req, res) => {
  try {
      getReservations((err, reservations) => {
          if (err) {
              return sendServerError(res);
          }
          res.status(STATUS_CODES.SUCCESS).json(reservations);
      });
  } catch (error) {
      console.error(error);
      sendServerError(res);
  }
};

// Annule une réservation
const deleteReservationHandler = (req, res) => {
  try {
      const { id } = req.params;

      findReservationById(id, (err, reservation) => {
          if (err || !reservation) {
              return res.status(STATUS_CODES.NOT_FOUND).json({ message: 'Réservation non trouvée' });
          }

          const projectorId = reservation.projector_id;

          deleteReservation(id, (err) => {
              if (err) {
                  return sendServerError(res);
              }
              updateProjectorStatus(projectorId, 'fonctionnel', (err, updated) => {
                  if (err) {
                      return sendServerError(res);
                  }
                  if(!updated){
                      return res.status(STATUS_CODES.NOT_FOUND).json({ message: 'Projecteur non trouvé' });
                  }
                  res.status(STATUS_CODES.SUCCESS).json({ message: 'Réservation annulée' });
              });
          });
      });
  } catch (error) {
      console.error(error);
      sendServerError(res);
  }
};

module.exports = {
  createReservationHandler,
  getReservationsHandler,
  deleteReservationHandler,
};
