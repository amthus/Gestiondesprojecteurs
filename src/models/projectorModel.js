const db = require("../../config/database");

const Projector = {
    create: (name, status, callback) => {
        const sql = "INSERT INTO projectors (name, status) VALUES (?, ?)";
        db.run(sql, [name, status], callback);
    },

    getAll: (callback) => {
        const sql = "SELECT * FROM projectors";
        db.all(sql, [], callback);
    },

    getAvailableProjectors: (callback) => {
        const sql = "SELECT * FROM projectors WHERE status = 'fonctionnel'";
        db.all(sql, [], callback);
    },

    updateStatus: (id, status, callback) => {
        const sql = "UPDATE projectors SET status = ? WHERE id = ?";

        db.run(sql, [status, id], function (err) {
            if (err) {
                return callback(err, null);
            }
            if (this.changes === 0) {
                return callback(null, false);
            }
            return callback(null, true);
        });
    },

    findByName: (name, callback) => {
        const query = "SELECT * FROM projectors WHERE name = ?";
        db.all(query, [name], callback);
    },

    deleteById: (id, callback) => {
        const query = "DELETE FROM projectors WHERE id = ?";
        db.run(query, [id], function (err) {
            if (err) {
                return callback(err, null);
            }
            if (this.changes === 0) {
                return callback(null, false);
            }
            return callback(null, true);
        });
    },

     createProjector: (name, status, callback) => {
         const sql = "INSERT INTO projectors (name, status) VALUES (?, ?)";
         db.run(sql, [name, status], function(err) {
             if (err) {
                 return callback(err, null);
             }
             callback(null, this.lastID);
         });
     },
};

module.exports = Projector;
