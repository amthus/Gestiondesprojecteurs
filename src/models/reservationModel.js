const db = require("../../config/database");

const Reservation = {
  create: (user_id, projector_id, date, callback) => {
    const sql = "INSERT INTO reservations (user_id, projector_id, date) VALUES (?, ?, ?)";
    db.run(sql, [user_id, projector_id, date], callback);
  },

  getByUser: (user_id, callback) => {
    const sql = "SELECT * FROM reservations WHERE user_id = ?";
    db.all(sql, [user_id], callback);
  }
};

module.exports = Reservation;
