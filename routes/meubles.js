import express from "express";
import * as meubleController from "../controllers/meubleController.js";
import * as adminController from "../controllers/adminController.js";
import AuthJWT from "../middleware/auth.js"; // Assurez-vous que AuthJWT est correctement importé

const router = express.Router();

// Route pour afficher la liste des meubles
router.get("/", meubleController.afficherListeMeubles);

// Route pour afficher la page de login
router.get("/login", meubleController.renderLoginPage);

// Route pour gérer la connexion
router.post("/login", meubleController.login);

// Route pour afficher la page d'administration
router.get("/admin", AuthJWT, adminController.renderAdminPage);

export default router;
