import express from "express";
import mysql from "mysql2/promise";
import cookieParser from "cookie-parser";
import meubles from "./routes/meubles.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path"; // Assurez-vous que cette ligne est présente pour importer 'path'

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

// utilisation des templates EJS
app.set("views", "./views");
app.set("view engine", "ejs");
app.set("view options", { pretty: true });

app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cookieParser());

// appel du routeur
app.use("/", meubles);

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});

export { pool };
