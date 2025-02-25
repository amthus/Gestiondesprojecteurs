const express = require("express");
const router = express.Router();
const reservationController = require("../src/controllers/reservationController");
const { authMiddleware } = require("../src/middlewares/authMiddleware");
const { roleMiddleware } = require("../src/middlewares/roleMiddleware");


router.post("/", authMiddleware, reservationController.addReservation);
router.get("/", authMiddleware, roleMiddleware, reservationController.getAllReservations);
router.delete("/:id", authMiddleware, reservationController.deleteReservation);

module.exports = router;
