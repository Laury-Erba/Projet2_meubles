import express from "express";
import {
  afficherListeMeubles,
  renderLoginPage,
  login,
  getSignupPage,
  signup,
} from "../controllers/meubleController.js";

import {
  renderAdminPage,
  getMeubleDetailsByCategory,
  deleteMeuble,
} from "../controllers/adminController.js";

import AuthJWT from "../middleware/auth.js";

const router = express.Router();

// Route pour afficher la liste des meubles
router.get("/", afficherListeMeubles);

// Route pour afficher la page de login
router.get("/login", renderLoginPage);

// Route pour gérer la connexion
router.post("/login", login);

// Route pour afficher le formulaire d'inscription
router.get("/signup", getSignupPage);

// Route pour gérer l'inscription
router.post("/signup", signup);

router.get("/admin", renderAdminPage);
router.get("/admin/categorie/:idCategorie", getMeubleDetailsByCategory);
router.get("/admin/delete/:id", deleteMeuble);

export default router;
