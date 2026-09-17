const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const router = express.Router();

// INSCRIPTION
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validation basique
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    // 2. Vérification si l'utilisateur existe déjà
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: "Cet e-mail est déjà utilisé" });
    }

    // 3. Hachage du mot de passe (10 rounds de salt)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Insertion dans Neon
    const newUser = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name, email, hashedPassword]
    );

    res.status(201).json({
      message: "Utilisateur créé avec succès !",
      user: newUser.rows[0],
    });

  } catch (error) {
    console.error("Erreur Register :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});
// CONNEXION
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "E-mail et mot de passe requis" });
    }

    // 1. Chercher l'utilisateur par e-mail
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    const user = result.rows[0];

    // 2. Comparer le mot de passe avec le hash en BDD
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    // 3. Générer le jeton JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 4. Réponse
    res.json({
      message: "Connexion réussie",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Erreur Login :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;