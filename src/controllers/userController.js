
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Constantes pour les messages d'erreur et les codes de statut
const ERROR_MESSAGES = {
  INTERNAL_ERROR: "Une erreur interne est survenue",
  USER_EXISTS: "Utilisateur déjà existant",
  USER_NOT_FOUND: "Utilisateur non trouvé",
  INVALID_PASSWORD: "Mot de passe incorrect",
  INVALID_EMAIL: "Email invalide",
  WEAK_PASSWORD: "Le mot de passe doit contenir au moins 8 caractères, dont une majuscule, une minuscule, un chiffre et un caractère spécial",
  INVALID_ROLE:"Rôle invalide. Veuillez bien entré le role."
};

const STATUS_CODES = {
  INTERNAL_ERROR: 500,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  CREATED: 201,
  SUCCESS: 200,
};

// Fonction pour valider l'email
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Fonction pour valider la force du mot de passe
const validatePassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

// Fonction pour valider le rôle
const validateRole = (role) => {
  const validRoles = ["user", "admin"];
  return validRoles.includes(role);
};

exports.register = async (req, res) => {
  const { email, password, role } = req.body; 

  try {
    // Validation des entrées
    if (!email || !password) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ error: "Email et mot de passe sont obligatoires" });
    }

    if (!validateEmail(email)) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ error: ERROR_MESSAGES.INVALID_EMAIL });
    }

    if (!validatePassword(password)) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ error: ERROR_MESSAGES.WEAK_PASSWORD });
    }

    if (!validateRole(role)) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ error: ERROR_MESSAGES.INVALID_ROLE });
    }

    // Vérifier si l'utilisateur existe déjà
    const userExists = await new Promise((resolve, reject) => {
      User.findByEmail(email, (err, user) => {
        if (err) return reject(err);
        resolve(!!user);
      });
    });

    if (userExists) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ error: ERROR_MESSAGES.USER_EXISTS });
    }

    // Hachage du mot de passe
    const hash = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    await new Promise((resolve, reject) => {
      User.create(email, hash, role, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    return res.status(STATUS_CODES.CREATED).json({ message: "Utilisateur créé avec succès" });
  } catch (err) {
    console.error(err);
    return res.status(STATUS_CODES.INTERNAL_ERROR).json({ error: ERROR_MESSAGES.INTERNAL_ERROR });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validation des entrées
    if (!email || !password) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ error: "Email et mot de passe sont obligatoires" });
    }

    // Recherche de l'utilisateur par email
    const user = await new Promise((resolve, reject) => {
      User.findByEmail(email, (err, user) => {
        if (err) return reject(err);
        resolve(user);
      });
    });

    if (!user) {
      return res.status(STATUS_CODES.NOT_FOUND).json({ error: ERROR_MESSAGES.USER_NOT_FOUND });
    }

    // Comparaison des mots de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({ error: ERROR_MESSAGES.INVALID_PASSWORD });
    }

    // Génération du token JWT
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return res.status(STATUS_CODES.SUCCESS).json({ token });
  } catch (err) {
    console.error(err);
    return res.status(STATUS_CODES.INTERNAL_ERROR).json({ error: ERROR_MESSAGES.INTERNAL_ERROR });
  }
};
