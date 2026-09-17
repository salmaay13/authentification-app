import { useState } from "react";

// Remplacez par l'URL de votre backend Vercel en production
const API_URL = "http://localhost:5000/api/auth";

export default function Auth({ onLoginSuccess }) {
  // Mode : true = Connexion, false = Inscription
  const [isLogin, setIsLogin] = useState(true);

  // Formulaire State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Gestion des messages de retour
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  // Mettre à jour l'état quand l'utilisateur tape dans un champ
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setLoading(true);

    const endpoint = isLogin ? `${API_URL}/login` : `${API_URL}/register`;

    // Si on est en mode connexion, on n'envoie pas le champ 'name'
    const bodyData = isLogin
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Une erreur est survenue");
      }

      if (isLogin) {
        // Enregistrer le token JWT dans le navigateur
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setMessage({ type: "success", text: "Connexion réussie !" });

        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        }
      } else {
        setMessage({
          type: "success",
          text: "Compte créé avec succès ! Vous pouvez vous connecter.",
        });
        // Basculer automatiquement vers le formulaire de connexion
        setIsLogin(true);
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2>{isLogin ? "Se connecter" : "Créer un compte"}</h2>

      {message.text && (
        <div
          style={{
            ...styles.alert,
            backgroundColor: message.type === "error" ? "#ffebe9" : "#e6ffed",
            color: message.type === "error" ? "#cf222e" : "#1a7f37",
          }}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        {!isLogin && (
          <div style={styles.inputGroup}>
            <label>Nom complet</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Salma Ayouch"
              required={!isLogin}
              style={styles.input}
            />
          </div>
        )}

        <div style={styles.inputGroup}>
          <label>Adresse e-mail</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="exemple@email.com"
            required
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label>Mot de passe</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            style={styles.input}
          />
        </div>

        <button type="submit" disabled={loading} style={styles.button}>
          {loading
            ? "Chargement..."
            : isLogin
            ? "Se connecter"
            : "S'inscrire"}
        </button>
      </form>

      <p style={styles.toggleText}>
        {isLogin ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"}{" "}
        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage({ type: "", text: "" });
          }}
          style={styles.toggleBtn}
        >
          {isLogin ? "Créer un compte" : "Se connecter"}
        </button>
      </p>
    </div>
  );
}

// Styles basiques en ligne pour démarrer rapidement
const styles = {
  card: {
    maxWidth: "400px",
    margin: "40px auto",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    backgroundColor: "#ffffff",
    textAlign: "left",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  input: {
    padding: "10px 14px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  button: {
    padding: "12px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#0070f3",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "10px",
  },
  alert: {
    padding: "10px 14px",
    borderRadius: "6px",
    marginBottom: "16px",
    fontSize: "14px",
  },
  toggleText: {
    marginTop: "20px",
    fontSize: "14px",
    textAlign: "center",
  },
  toggleBtn: {
    background: "none",
    border: "none",
    color: "#0070f3",
    cursor: "pointer",
    fontWeight: "bold",
  },
};