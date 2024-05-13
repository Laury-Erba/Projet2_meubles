import express from "express";
import * as meubleController from "../controllers/meubleController.js";
const router = express.Router();

router.get("/", meubleController.afficherListeMeubles);

export default router;
