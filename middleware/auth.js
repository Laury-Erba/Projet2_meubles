import jwt from "jsonwebtoken";

function AuthJWT(req, res, next) {
  // Récupérer le token JWT depuis le cookie
  const token = req.cookies.token;
  console.log(token);

  if (!token) {
    return res
      .status(401)
      .json({ message: "Token d'authentification manquant." });
  }

  // Vérifier et décoder le token JWT
  jwt.verify(token, "votre_secret_jwt", (err, decoded) => {
    if (err) {
      return res.status(403).json({
        message: "Erreur de vérification du token d'authentification.",
      });
    }
    req.user = decoded; // Stocker les informations de l'utilisateur décodées dans l'objet de requête
    next(); // Passer au middleware suivant
  });
}

export default AuthJWT;
