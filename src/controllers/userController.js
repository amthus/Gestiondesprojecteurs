
const bcrypt = require('bcrypt'); // Bibliothèque pour hacher les mots de passe
const jwt = require('jsonwebtoken'); // Bibliothèque pour générer des tokens JWT
const { createUser, findUserByEmail } = require('../models/userModel'); // Importe les fonctions du modèle

const JWT_SECRET = process.env.JWT_SECRET ;

// Codes HTTP
const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  CONFLICT: 409, 
};

// Fonction pour gérer l'inscription d'un utilisateur
const register = async (req, res) => {
  try {
    const { email, password, role } = req.body; // Récupère les données de la requête

    // Vérifie que les champs obligatoires sont présents
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    // Vérifie si l'email est déjà utilisé
    findUserByEmail(email, async (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      if (user) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé' });
      }

      // Hache le mot de passe avec un facteur de 10
      const hashedPassword = await bcrypt.hash(password, 10);
      // Définit le rôle par défaut à 'etudiant' si non spécifié ou invalide
      const userRole = role && ['etudiant', 'enseignant', 'admin'].includes(role) ? role : 'etudiant';

      // Crée l'utilisateur dans la base de données
      createUser(email, hashedPassword, userRole, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Erreur lors de l\'inscription' });
        }
        res.status(201).json({ message: 'Utilisateur inscrit avec succès' });
      });
    });
  } catch (error) {
    console.error(error); // Log l'erreur pour le débogage
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Fonction pour gérer la connexion d'un utilisateur
const login = async (req, res) => {
  try {
    const { email, password } = req.body; // Récupère les données de la requête

    // Vérifie que les champs obligatoires sont présents
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    // Recherche l'utilisateur par email
    findUserByEmail(email, async (err, user) => {
      if (err || !user) {
        return res.status(401).json({ message: 'Utilisateur non trouvé' });
      }

      // Compare le mot de passe fourni avec celui haché dans la base
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Mot de passe incorrect' });
      }

      // Génère un token JWT avec les informations de l'utilisateur
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
        expiresIn: '1h', // Le token expire après 1 heure
      });
      res.status(200).json({ token }); // Renvoie le token au client
    });
  } catch (error) {
    console.error(error); // Log l'erreur pour le débogage
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { register, login };
