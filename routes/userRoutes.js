// const express = require("express");
// const router = express.Router();

// router.get('/', (req, res) => {
//   res.send('Liste des réservations');
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const userController = require("../src/controllers/userController");


router.post("/register", userController.register);
router.post("/login", userController.login);

module.exports = router;
