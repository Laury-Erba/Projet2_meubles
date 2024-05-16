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

export const deleteMeuble = (req, res) => {
  //on récupère l'id de l'article à supprimer, il a été passé en paramètre de l'url
  let id = req.params.id;

  // requete de suppresion en BDD
  let sql = "DELETE FROM Meubles WHERE id = ?";

  pool.query(sql, [id], function (error, result, fields) {
    // redirection vers admin une fois effectué
    res.redirect("/admin");
  });
};
