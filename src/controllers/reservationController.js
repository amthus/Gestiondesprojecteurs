const {
  createReservation,
  getReservations,
  findReservationById,
  deleteReservation,
  updateProjectorStatus,
  checkAvailability,
} = require('../models/reservationModel'); // Importe les fonctions du modèle


const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};


// Crée une nouvelle réservation
const createReservationHandler = (req, res) => {
  try {
    const { userId, projectorId, startTime, endTime } = req.body; // Récupère les données de la requête

    // Vérifie que tous les champs nécessaires sont présents
    if (!userId || !projectorId || !startTime || !endTime) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    // Vérifie si le créneau est disponible
    checkAvailability(projectorId, startTime, endTime, (err, conflict) => {
      if (err) {
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      if (conflict) {
        return res.status(400).json({ message: 'Créneau déjà réservé' });
      }

      // Crée la réservation dans la base de données
      createReservation(userId, projectorId, startTime, endTime, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Erreur lors de la réservation' });
        }
        // Met à jour le statut du projecteur à 'occupe'
        updateProjectorStatus(projectorId, 'occupe', (err) => {
          if (err) {
            return res.status(500).json({ message: 'Erreur lors de la mise à jour du statut' });
          }
          res.status(201).json({ message: 'Réservation effectuée' });
        });
      });
    });
  } catch (error) {
    console.error(error); // Log l'erreur pour le débogage
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupère la liste des réservations
const getReservationsHandler = (req, res) => {
  try {
    getReservations((err, reservations) => {
      if (err) {
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      res.status(200).json(reservations); // Renvoie la liste des réservations
    });
  } catch (error) {
    console.error(error); // Log l'erreur pour le débogage
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Annule une réservation
const deleteReservationHandler = (req, res) => {
  try {
    const { id } = req.params; // Récupère l'ID de la réservation depuis l'URL

    // Recherche la réservation à supprimer
    findReservationById(id, (err, reservation) => {
      if (err || !reservation) {
        return res.status(404).json({ message: 'Réservation non trouvée' });
      }

      const projectorId = reservation.projector_id; // Récupère l'ID du projecteur associé

      // Supprime la réservation
      deleteReservation(id, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Erreur lors de l\'annulation' });
        }
        // Remet le projecteur à 'fonctionnel'
        updateProjectorStatus(projectorId, 'fonctionnel', (err) => {
          if (err) {
            return res.status(500).json({ message: 'Erreur lors de la mise à jour du statut' });
          }
          res.status(200).json({ message: 'Réservation annulée' });
        });
      });
    });
  } catch (error) {
    console.error(error); // Log l'erreur pour le débogage
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  createReservationHandler,
  getReservationsHandler,
  deleteReservationHandler,
};