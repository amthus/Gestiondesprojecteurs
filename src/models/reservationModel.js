const db = require("../../config/database");

const Reservation = {
  // Créer une réservation
  create: async (userId, projectorId, startTime, endTime) => {
    const sql = `
      INSERT INTO reservations (user_id, projector_id, start_time, end_time) 
      VALUES (?, ?, ?, ?)
    `;
    return new Promise((resolve, reject) => {
      db.run(sql, [userId, projectorId, startTime, endTime], function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID, userId, projectorId, startTime, endTime });
      });
    });
  },

  // Récupérer toutes les réservations
  getAll: async () => {
    const sql = `
      SELECT r.id, u.name AS user_name, p.name AS projector_name, r.start_time, r.end_time
      FROM reservations r
      JOIN users u ON r.user_id = u.id
      JOIN projectors p ON r.projector_id = p.id
      ORDER BY r.start_time ASC
    `;
    return new Promise((resolve, reject) => {
      db.all(sql, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },

  // Mettre à jour une réservation
  update: async (id, startTime, endTime) => {
    const sql = `
      UPDATE reservations 
      SET start_time = ?, end_time = ?
      WHERE id = ?
    `;
    return new Promise((resolve, reject) => {
      db.run(sql, [startTime, endTime, id], function (err) {
        if (err) return reject(err);
        if (this.changes === 0) return resolve(false); // Aucune réservation trouvée
        resolve(true); // Réservation mise à jour
      });
    });
  },

  // Supprimer une réservation
  deleteById: async (id) => {
    const sql = "DELETE FROM reservations WHERE id = ?";
    return new Promise((resolve, reject) => {
      db.run(sql, [id], function (err) {
        if (err) return reject(err);
        if (this.changes === 0) return resolve(false); // Aucune réservation trouvée
        resolve(true); // Réservation supprimée
      });
    });
  },

  // Vérifier si un créneau horaire est disponible
  isTimeSlotAvailable: async (projectorId, startTime, endTime) => {
    const sql = `
      SELECT COUNT(*) as count 
      FROM reservations 
      WHERE projector_id = ? 
      AND ((start_time BETWEEN ? AND ?) OR (end_time BETWEEN ? AND ?))
    `;
    return new Promise((resolve, reject) => {
      db.get(sql, [projectorId, startTime, endTime, startTime, endTime], (err, row) => {
        if (err) return reject(err);
        resolve(row.count === 0); // true si le créneau est disponible
      });
    });
  },
};

module.exports = Reservation;