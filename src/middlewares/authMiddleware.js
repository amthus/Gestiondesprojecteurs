// const jwt = require("jsonwebtoken");

// exports.authMiddleware = (req, res, next) => {
//   // Récupère le token depuis l'en-tête 'Authorization' (au format 'Bearer <token>')
//   const token = req.header("Authorization") && req.header("Authorization").split(" ")[1];

//   // Si le token n'existe pas, renvoie une erreur 401
//   if (!token) {
//     return res.status(401).json({ error: "Token manquant. Accès refusé." });
//   }

//   try {
    
//     // Vérifie et décode le token avec la clé secrète
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Attache l'utilisateur décodé à la requête pour l'utiliser dans les routes suivantes
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(400).json({ error: "Token invalide." });
//   }
// };

const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
  console.log("Headers reçus :", req.headers); // Vérifier les headers

  // Récupère le token
  const authHeader = req.header("Authorization");
  console.log("Auth Header :", authHeader); // Debug 1

  const token = authHeader && authHeader.split(" ")[1];
  console.log("Token reçu :", token); // Debug 2

  if (!token) {
    return res.status(401).json({ error: "Token manquant. Accès refusé." });
  }

  try {
    // Vérifie le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Payload JWT :", decoded); // Debug 3

    req.user = decoded;
    next();
  } catch (err) {
    console.error("Erreur JWT :", err.message); // Debug 4
    return res.status(400).json({ error: "Token invalide." });
  }
};
