const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json()); // Permet à Express de lire le JSON envoyé dans les requêtes

// Attribution des routes
app.use("/api/auth", authRoutes);

module.exports = app;

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Serveur prêt sur http://localhost:${PORT}`));
}