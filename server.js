import express from "express";
import mysql from "mysql2/promise";
import fs from "fs";
import * as meubleController from "./controllers/meubleController.js";
import meubles from "./routes/meubles.js";
import { fileURLToPath } from "url";
import { dirname } from "path"; // Importez 'dirname' depuis le module 'path'
import path from "path"; // Ajoutez cette ligne pour importer 'path'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// Configuration de la connexion à MySQL
const pool = await mysql.createPool({
  host: "localhost",
  user: "root",
  port: 8889,
  password: "root",
  database: "Projet_2",
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0,
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", meubles);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
