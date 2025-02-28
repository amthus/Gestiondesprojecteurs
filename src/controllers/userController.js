require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../models/userModel');
const { sendServerError } = require( '../utils/errorHandlers');
const JWT_SECRET = process.env.JWT_SECRET;

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
        const { email, password, role } = req.body;

        if (!email || !password) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Email et mot de passe requis' });
        }

        findUserByEmail(email, async (err, user) => {
            if (err) {
                return sendServerError(res, err);
            }
            if (user) {
                return res.status(STATUS_CODES.CONFLICT).json({ message: 'Cet email est déjà utilisé' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const userRole = role && ['etudiant', 'enseignant', 'admin'].includes(role) ? role : 'etudiant';

            createUser(email, hashedPassword, userRole, (err) => {
                if (err) {
                    return sendServerError(res, err);
                }
                res.status(STATUS_CODES.CREATED).json({ message: 'Utilisateur inscrit avec succès' });
            });
        });
    } catch (error) {
        sendServerError(res, error);
    }
};

// Fonction pour gérer la connexion d'un utilisateur
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Email et mot de passe requis' });
        }

        findUserByEmail(email, async (err, user) => {
            if (err) {
                return sendServerError(res, err);
            }

            if (!user) {
                return res.status(STATUS_CODES.NOT_FOUND).json({ message: 'Utilisateur non trouvé' });
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(STATUS_CODES.NOT_FOUND).json({ message: 'Mot de passe incorrect' });
            }

            const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
                expiresIn: '1h',
            });
            res.status(STATUS_CODES.SUCCESS).json({ token });
        });
    } catch (error) {
        sendServerError(res, error);
    }
};

module.exports = { register, login };
