const express = require('express');
const router = express.Router();
const reservationController = require("../src/controllers/reservationController");

router.get('/', (req, res) => {
  res.send('Liste des réservations');
});

router.post("/book", reservationController.bookProjector);
router.get("/user/:user_id", reservationController.getUserReservations);

module.exports = router;

