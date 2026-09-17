import { useState, useEffect } from "react";
import Auth from "./Auth";

function App() {
  const [user, setUser] = useState(null);

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
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5", padding: "20px" }}>
      {user ? (
        <div style={{ textAlign: "center", marginTop: "80px", color: "#333" }}>
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
              marginTop: "20px",
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