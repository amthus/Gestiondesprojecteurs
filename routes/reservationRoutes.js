const express = require("express");
const router = express.Router();
const reservationController = require("../src/controllers/reservationController");

router.post("/", reservationController.addReservation);
router.get("/", reservationController.getAllReservations);
router.delete("/:id", reservationController.deleteReservation);

module.exports = router;
