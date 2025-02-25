const jwt = require("jsonwebtoken"); 
 
exports.authMiddleware = (req, res, next) => { 
  console.log("Headers reçus :", req.headers); // Vérifier les headers 
 
  // Récupère le token 
  const authHeader = req.header("Authorization"); 
  console.log("Auth Header :", authHeader);  
 
  const token = authHeader && authHeader.split(" ")[1]; 
  console.log("Token reçu :", token);  
 
  if (!token) { 
    return res.status(401).json({ error: "Token manquant. Accès refusé." }); 
  } 
 
  try { 
    // Vérifie le token 
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    console.log("Payload JWT :", decoded);  
    req.user = decoded; 
    next(); 
  } catch (err) { 
    console.error("Erreur JWT :", err.message); 
    return res.status(400).json({ error: "Token invalide." }); 
  } 
}; 
