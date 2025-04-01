import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
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

    // Connexion via Supabase (email/password)
    supabase.auth.signInWithPassword({ email, password })
      .then(({ data, error }) => {
        if (error) {
          setError("Échec de la connexion : " + error.message);
        } else {
          console.log("Connexion réussie :", data);
          navigate("/dashboard-etudiant");
        }
      });
  };

  // Connexion via OAuth2 (Google ou GitHub)
  const handleOAuthLogin = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) {
      setError("Erreur d'authentification via " + provider + ": " + error.message);
    }
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

        <div className="oauth-buttons">
          <button 
            onClick={() => handleOAuthLogin('google')} 
            className="oauth-button google"
          >
            Se connecter avec Google
          </button>
          <button 
            onClick={() => handleOAuthLogin('github')} 
            className="oauth-button github"
          >
            Se connecter avec GitHub
          </button>
        </div>

        <p className="login-register-link">
          Pas encore inscrit ? 
          <a href="/register" className="register-link"> Créer un compte</a>
        </p>
      </div>
    </div>
  );
};

export default Login;

