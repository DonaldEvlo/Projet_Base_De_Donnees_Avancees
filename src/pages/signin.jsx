import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/signin.css"; // Importer le fichier CSS

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    // Vérification des champs
    if (!email || !password) {
      setError("Tous les champs sont requis !");
      return;
    }

    // Vérification du format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email invalide !");
      return;
    }

    // Simuler une connexion réussie (à remplacer par une API plus tard)
    console.log("Connexion réussie :", { email, password });

    // Redirige vers le Dashboard après connexion
    navigate("/dashboard-etudiant");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Connexion</h2>
        
        {error && <p className="login-error">{error}</p>}
        
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="login-button">
            Se connecter
          </button>
        </form>

        <p className="login-register-link">
          Pas encore inscrit ? 
          <a href="/register" className="register-link"> Créer un compte</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
