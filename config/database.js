const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Connexion à la base SQLite
const db = new sqlite3.Database(path.join(__dirname, "../gestion_projecteurs.db"), (err) => {
  if (err) console.error("Erreur de connexion à SQLite :", err.message);
  else console.log("Connexion à la base de données réussie !");
});

// Création des tables si elles n'existent pas
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('etudiant', 'enseignant', 'admin')) DEFAULT 'etudiant'
  )`);
  
  db.run(`CREATE TABLE IF NOT EXISTS projectors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    status TEXT CHECK(status IN ('fonctionnel','occupe', 'en panne')) DEFAULT 'fonctionnel'
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    projector_id INTEGER NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (projector_id) REFERENCES projectors(id) ON DELETE CASCADE
  )`);
});

module.exports = db;
