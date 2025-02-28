
require('dotenv').config();
const express = require('express');
const userRoutes = require('./routes/userRoutes');
const projectorRoutes = require('./routes/projectorRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

const app = express();

app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/projectors', projectorRoutes);
app.use('/api/reservations', reservationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});