import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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

export const renderLoginPage = (req, res) => {
  res.render("login", { error: null });
};

export const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render("login", {
      error: "Veuillez saisir un email et un mot de passe.",
    });
  }

  pool.query("SELECT * FROM Users WHERE email = ?", [email], (err, results) => {
    if (err) {
      console.error(
        "Erreur lors de la recherche de l'utilisateur dans la base de données :",
        err
      );
      return res.render("login", { error: "Erreur interne du serveur." });
    }

    if (results.length === 0) {
      return res.render("login", { error: "Email ou mot de passe incorrect." });
    }

    bcrypt.compare(password, results[0].password, (bcryptErr, bcryptResult) => {
      if (bcryptErr) {
        console.error(
          "Erreur lors de la comparaison des mots de passe :",
          bcryptErr
        );
        return res.render("login", { error: "Erreur interne du serveur." });
      }

      if (!bcryptResult) {
        return res.render("login", {
          error: "Email ou mot de passe incorrect.",
        });
      }

      const token = jwt.sign({ userId: results[0].id }, "votre_secret_jwt", {
        expiresIn: "1h",
      });
      res.cookie("token", token, { maxAge: 3600000, httpOnly: true });

      console.log("Redirection vers /admin");
      res.redirect("/admin");
    });
  });
};

export const getSignupPage = (req, res) => {
  res.render("signup", { error: null });
};

export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query("SELECT * FROM Users WHERE email = ?", [
      email,
    ]);

    if (rows.length > 0) {
      return res.render("signup", { error: "L'email est déjà utilisé." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query("INSERT INTO Users (email, password) VALUES (?, ?)", [
      email,
      hashedPassword,
    ]);
    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.render("signup", {
      error: "Une erreur s'est produite, veuillez réessayer.",
    });
  }
};
// function pour gérer les mots clefs
export const getMeubleDetailsByKeyword = async (req, res) => {
  const keyword = req.params.keyword;

  try {
    const query = `
      SELECT Meubles.Nom AS NomMeuble, Materiaux.Nom AS NomMatiere, MeubleMateriaux.Quantite, Entreprises.Nom AS NomEntreprise
      FROM Meubles
      JOIN MeubleMateriaux ON Meubles.IdMeuble = MeubleMateriaux.IdMeuble
      JOIN Materiaux ON MeubleMateriaux.IdMatiere = Materiaux.IdMatiere
      JOIN Entreprises ON MeubleMateriaux.IdEntreprise = Entreprises.IdEntreprise
      WHERE Materiaux.MotsCles LIKE ?
    `;
    const [rows] = await pool.query(query, [`%${keyword}%`]);

    res.render("keywordDetails", { keyword, details: rows });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des détails par mot-clé :",
      error
    );
    res.status(500).send("Erreur serveur");
  }
};
export const renderAdminPage = async (req, res) => {
  try {
    const query = `
      SELECT Meubles.Nom AS NomMeuble, Materiaux.Nom AS NomMatiere, MeubleMateriaux.Quantite, Entreprises.Nom AS NomEntreprise, Materiaux.MotsCles
      FROM Meubles
      JOIN MeubleMateriaux ON Meubles.IdMeuble = MeubleMateriaux.IdMeuble
      JOIN Materiaux ON MeubleMateriaux.IdMatiere = Materiaux.IdMatiere
      JOIN Entreprises ON MeubleMateriaux.IdEntreprise = Entreprises.IdEntreprise
    `;
    const [rows] = await pool.query(query);

    const meubles = {};
    rows.forEach((row) => {
      const { NomMeuble, NomMatiere, Quantite, NomEntreprise, MotsCles } = row;
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
        motsCles: MotsCles.split(",").map((motCle) => motCle.trim()), // Assuming keywords are comma-separated
      });
    });

    res.render("admin", { meubles: Object.values(meubles) });
  } catch (error) {
    console.error("Erreur lors du rendu de la page d'administration :", error);
    res.status(500).send("Erreur serveur");
  }
};
