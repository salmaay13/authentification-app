const { Pool } = require("pg");

// Configuration du pool de connexions PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    // Requis par Neon pour garantir une connexion sécurisée SSL
    rejectUnauthorized: false,
  },
});

module.exports = pool;