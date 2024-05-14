import express from "express";
import * as meubleController from "../controllers/meubleController.js";
const router = express.Router();

// la route pour la page de Liste des meubles
router.get("/", meubleController.afficherListeMeubles);

// la route pour la page de login
router.get("/login", meubleController.renderLoginPage);

export default router;
