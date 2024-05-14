// services/meublesService.js
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  port: 8889,
  password: "root",
  database: "Projet_2",
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0,
});

export const afficherListeMeubles = async (req, res) => {
  try {
    const query = `
        SELECT Meubles.Nom AS NomMeuble, Materiaux.Nom AS NomMatiere, MeubleMateriaux.Quantite
        FROM Meubles
        JOIN MeubleMateriaux ON Meubles.IdMeuble = MeubleMateriaux.IdMeuble
        JOIN Materiaux ON MeubleMateriaux.IdMatiere = Materiaux.IdMatiere
      `;
    const [rows] = await pool.query(query);

    const meubles = {};
    rows.forEach((row) => {
      const { NomMeuble, NomMatiere, Quantite } = row;
      if (!meubles[NomMeuble]) {
        meubles[NomMeuble] = {
          NomMeuble,
          materiaux: [],
        };
      }
      meubles[NomMeuble].materiaux.push({ NomMatiere, Quantite });
    });

    res.render("liste", { meubles: Object.values(meubles) });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de la liste des meubles :",
      error
    );
    res.status(500).send("Erreur serveur");
  }
};

// fonction pour afficher la page de login
export const renderLoginPage = (req, res) => {
  res.render("login");
};
