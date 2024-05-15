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

// fonction pour afficher la page de login
export const renderLoginPage = (req, res) => {
  res.render("login", { error: null });
};

// Fonction pour gérer la connexion
export const login = (req, res, next) => {
  const { email, password } = req.body;

  // Vérifiez les champs email et mot de passe
  if (!email || !password) {
    return res.render("login", {
      error: "Veuillez saisir un email et un mot de passe.",
    });
  }

  // Requête MySQL pour récupérer l'utilisateur avec l'email spécifié
  pool.query("SELECT * FROM Users WHERE email = ?", [email], (err, results) => {
    if (err) {
      console.error(
        "Erreur lors de la recherche de l'utilisateur dans la base de données :",
        err
      );
      return res.render("login", { error: "Erreur interne du serveur." });
    }

    // Vérifiez si l'utilisateur existe
    if (results.length === 0) {
      return res.render("login", { error: "Email ou mot de passe incorrect." });
    }

    // Vérifiez le mot de passe en utilisant bcrypt
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

      // Générez un token JWT pour l'authentification
      const token = jwt.sign({ userId: results[0].id }, "votre_secret_jwt", {
        expiresIn: "1h",
      });
      res.cookie("token", token, { maxAge: 3600000, httpOnly: true });

      // Redirection vers le tableau de bord ou une autre page
      res.redirect("/admin");
    });
  });
};

// Fonction pour afficher le formulaire d'inscription
export const getSignupPage = (req, res) => {
  res.render("signup", { error: null });
};

// Fonction pour gérer l'inscription

export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query("SELECT * FROM Users WHERE email = ?", [
      email,
    ]);

    if (rows.length > 0) {
      return res.render("signup", { error: "L'email est déjà utilisé." });
    }

    await pool.query("INSERT INTO Users (email, password) VALUES (?, ?)", [
      email,
      password,
    ]);
    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.render("signup", {
      error: "Une erreur s'est produite, veuillez réessayer.",
    });
  }
};
