import express from "express";
import {
  afficherListeMeubles,
  renderLoginPage,
  login,
  getSignupPage,
  signup,
} from "../controllers/meubleController.js";
import * as adminController from "../controllers/adminController.js";
import AuthJWT from "../middleware/auth.js";

const router = express.Router();

// Route pour afficher la liste des meubles
router.get("/", afficherListeMeubles);

// Route pour afficher la page de login
router.get("/login", renderLoginPage);

// Route pour gérer la connexion
router.post("/login", login);

// Route pour afficher la page d'administration
router.get("/admin", adminController.renderAdminPage);
// Route pour afficher le formulaire d'inscription
router.get("/signup", getSignupPage);

// Route pour gérer l'inscription
router.post("/signup", signup);

// Route pour supprimer un meuble
router.get("/admin/delete/:id", adminController.deleteMeuble);

export default router;
