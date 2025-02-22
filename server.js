require("dotenv").config();
const express = require("express");

const userRoutes = require("./routes/userRoutes");
const projectorRoutes = require("./routes/projectorRoutes");
const reservationRoutes = require("./routes/reservationRoutes");

const app = express();
app.use(express.json());

// Definir une route pour URL
app.get('/', (req, res) => {
    res.send('Bienvenue sur l\'API!');
  });

app.use("/users", userRoutes);
app.use("/projectors", projectorRoutes);
app.use("/reservations", reservationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur en écoute sur le port ${PORT}...`));
