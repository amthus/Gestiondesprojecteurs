const db = require("../../config/database");

const User = {
  create: (email, password, role, callback) => {
    const sql = "INSERT INTO users (email, password, role) VALUES (?, ?, ?)";
    db.run(sql, [email, password, role], callback);
  },
  
  findByEmail: (email, callback) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    db.get(sql, [email], callback);
  },
};


module.exports = User;
