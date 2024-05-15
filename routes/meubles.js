import express from "express";
import * as meubleController from "../controllers/meubleController.js";
const router = express.Router();

//middleware
import AuthJWT from "../middleware/auth.js";

// la route pour la page de Liste des meubles
router.get("/", meubleController.afficherListeMeubles);

//ADMIN PAGE
router.get("/admin", AuthJWT);

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", meubleController.signup);

// Route pour afficher le formulaire de connexion
router.get("/login", meubleController.renderLoginPage);

// Route pour gérer la connexion
router.post("/login", meubleController.login);

export default router;
