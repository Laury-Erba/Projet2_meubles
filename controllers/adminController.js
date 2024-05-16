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
    const meubles = await afficherListeMeubles();
    const categories = await getCategories();
    res.render("admin", { meubles, categories });
  } catch (error) {
    console.error("Erreur lors du rendu de la page d'administration :", error);
    res.status(500).send("Erreur serveur");
  }
};

export const afficherListeMeubles = async (idCategorie = null) => {
  try {
    let query = `
      SELECT Meubles.IdMeuble, Meubles.Nom AS NomMeuble, Materiaux.Nom AS NomMatiere, MeubleMateriaux.Quantite, Entreprises.Nom AS NomEntreprise, Categories.Nom AS NomCategorie
      FROM Meubles
      JOIN MeubleMateriaux ON Meubles.IdMeuble = MeubleMateriaux.IdMeuble
      JOIN Materiaux ON MeubleMateriaux.IdMatiere = Materiaux.IdMatiere
      JOIN Entreprises ON MeubleMateriaux.IdEntreprise = Entreprises.IdEntreprise
      JOIN Categories ON Meubles.IdCategorie = Categories.IdCategorie
    `;
    const params = [];
    if (idCategorie) {
      query += ` WHERE Categories.IdCategorie = ?`;
      params.push(idCategorie);
    }
    const [rows] = await pool.query(query, params);

    const meubles = {};
    rows.forEach((row) => {
      const {
        IdMeuble,
        NomMeuble,
        NomMatiere,
        Quantite,
        NomEntreprise,
        NomCategorie,
      } = row;
      if (!meubles[IdMeuble]) {
        meubles[IdMeuble] = {
          id: IdMeuble,
          NomMeuble,
          NomCategorie,
          materiaux: [],
        };
      }
      meubles[IdMeuble].materiaux.push({
        NomMatiere,
        Quantite,
        NomEntreprise,
      });
    });

    return Object.values(meubles);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de la liste des meubles :",
      error
    );
    throw new Error("Erreur serveur");
  }
};

export const getCategories = async () => {
  try {
    const query = `SELECT IdCategorie, Nom AS NomCategorie FROM Categories`;
    const [rows] = await pool.query(query);
    return rows;
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories :", error);
    throw new Error("Erreur serveur");
  }
};

export const getMeubleDetailsByCategory = async (req, res) => {
  const idCategorie = req.params.idCategorie;

  try {
    const meubles = await afficherListeMeubles(idCategorie);
    const categories = await getCategories();
    res.render("meubleDetails", {
      meubles,
      categories,
      selectedCategory: idCategorie,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des meubles par catégorie :",
      error
    );
    res.status(500).send("Erreur serveur");
  }
};

export const deleteMeuble = (req, res) => {
  const id = req.params.id;

  const sql = "DELETE FROM Meubles WHERE IdMeuble = ?";
  pool.query(sql, [id], function (error, result, fields) {
    if (error) {
      console.error("Erreur lors de la suppression du meuble :", error);
      return res.status(500).send("Erreur serveur");
    }
    res.redirect("/admin");
  });
};
