const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get the token
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token manquant. Accès refusé.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Erreur JWT :', err.message);
    return res.status(400).json({ error: 'Token invalide.' });
  }
};

module.exports = authMiddleware;
