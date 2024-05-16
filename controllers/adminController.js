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

// Définissez la fonction renderAdminPage
export const renderAdminPage = async (req, res) => {
  try {
    const meubles = await afficherListeMeubles(req, res);
    res.render("admin", { meubles });
  } catch (error) {
    console.error("Erreur lors du rendu de la page d'administration :", error);
    res.status(500).send("Erreur serveur");
  }
};

// Fonction pour afficher la liste des meubles avec les matériaux utilisés et les entreprises fournissant les matériaux
export const afficherListeMeubles = async (req, res) => {
  try {
    const query = `
        SELECT Meubles.Nom AS NomMeuble, Materiaux.Nom AS NomMatiere, MeubleMateriaux.Quantite, Entreprises.Nom AS NomEntreprise
        FROM Meubles
        JOIN MeubleMateriaux ON Meubles.IdMeuble = MeubleMateriaux.IdMeuble
        JOIN Materiaux ON MeubleMateriaux.IdMatiere = Materiaux.IdMatiere
        JOIN Entreprises ON MeubleMateriaux.IdEntreprise = Entreprises.IdEntreprise
      `;
    const [rows] = await pool.query(query);

    const meubles = {};
    rows.forEach((row) => {
      const { NomMeuble, NomMatiere, Quantite, NomEntreprise } = row;
      if (!meubles[NomMeuble]) {
        meubles[NomMeuble] = {
          NomMeuble,
          materiaux: [],
        };
      }
      meubles[NomMeuble].materiaux.push({
        NomMatiere,
        Quantite,
        NomEntreprise,
      });
    });

    res.render("admin", { meubles: Object.values(meubles) });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de la liste des meubles :",
      error
    );
    res.status(500).send("Erreur serveur");
  }
};

// Fonction pour supprimer un meuble
export const deleteMeuble = async (req, res) => {
  const { id } = req.params;
  try {
    // Supprimer le meuble en fonction de l'identifiant
    const connection = await pool.getConnection();
    await connection.execute("DELETE FROM Meubles WHERE IdMeuble = ?", [id]);
    connection.release();

    // Rediriger vers la page admin après la suppression
    res.redirect("/admin");
  } catch (error) {
    console.error("Erreur lors de la suppression du meuble :", error);
    res.status(500).send("Erreur serveur");
  }
};
