const Reservation = require("../models/reservationModel");

exports.bookProjector = (req, res) => {
  const { user_id, projector_id, date } = req.body;

  Reservation.create(user_id, projector_id, date, (err) => {
    if (err) return res.status(500).json({ error: "Erreur lors de la réservation" });
    res.status(201).json({ message: "Réservation effectuée avec succès" });
  });
};

exports.getUserReservations = (req, res) => {
  const { user_id } = req.params;

  Reservation.getByUser(user_id, (err, reservations) => {
    if (err) return res.status(500).json({ error: "Erreur lors de la récupération des réservations" });
    res.json(reservations);
  });
};
