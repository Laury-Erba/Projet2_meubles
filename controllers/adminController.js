import mysql from "mysql2/promise";
import Chart from "chart.js/auto";

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

// Action pour afficher la liste des meubles
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

// Fonction pour afficher la page de détails d'un meuble
export const afficherDetailsMeuble = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
        SELECT Meubles.Nom AS NomMeuble, Materiaux.Nom AS NomMatiere, MeubleMateriaux.Quantite
        FROM Meubles
        JOIN MeubleMateriaux ON Meubles.IdMeuble = MeubleMateriaux.IdMeuble
        JOIN Materiaux ON MeubleMateriaux.IdMatiere = Materiaux.IdMatiere
        WHERE Meubles.IdMeuble = ?
      `;
    const [rows] = await pool.query(query, [id]);

    const meuble = {
      NomMeuble: rows[0].NomMeuble,
      materiaux: rows.map((row) => ({
        NomMatiere: row.NomMatiere,
        Quantite: row.Quantite,
      })),
    };

    res.render("details", { meuble });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des détails du meuble :",
      error
    );
    res.status(500).send("Erreur serveur");
  }
};
