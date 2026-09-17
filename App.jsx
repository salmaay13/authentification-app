import { useState, useEffect } from "react";
import Auth from "./Auth";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  // Au chargement, vérifier si l'utilisateur est déjà connecté (Session persistante)
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      {user ? (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h1>Bienvenue, {user.name} 👋</h1>
          <p>Email : {user.email}</p>
          <button
            onClick={handleLogout}
            style={{
              padding: "10px 20px",
              backgroundColor: "#ff4d4f",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Se déconnecter
          </button>
        </div>
      ) : (
        <Auth onLoginSuccess={(userData) => setUser(userData)} />
      )}
    </div>
  );
}

export default App;