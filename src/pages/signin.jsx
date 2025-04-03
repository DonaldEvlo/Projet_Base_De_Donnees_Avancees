import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "../styles/signin.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!email || !password) {
      setError("Tous les champs sont requis !");
      setIsLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email invalide !");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });

      if (authError) throw authError;
      
      navigate(data.user?.user_metadata?.role === 'teacher' 
        ? "/dashboard-prof" 
        : "/dashboard-etudiant");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider) => {
    setError("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({ 
        provider,
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (error) {
      setError(`Erreur avec ${provider}: ${error.message}`);
    }
  };

  return (
    <div className="login-container">
      {/* Navbar cohérente */}
      <nav className="navbar">
        <div className="navbar-brand">Plateforme SGBD</div>
        <Link to="/" className="navbar-link">Retour à l'accueil</Link>
      </nav>

      <main className="login-main">
        <div className="login-card">
          <h1 className="login-title">Connexion</h1>
          <p className="login-subtitle">Accédez à votre espace personnel</p>

          {error && <div className="login-error-message">{error}</div>}

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>

          <div className="login-separator">
            <span>OU</span>
          </div>

          <div className="oauth-buttons">
            <button
              type="button"
              onClick={() => handleOAuthLogin('google')}
              className="oauth-button google"
            >
              <span className="oauth-icon">G</span>
              Continuer avec Google
            </button>

            <button
              type="button"
              onClick={() => handleOAuthLogin('github')}
              className="oauth-button github"
            >
              <span className="oauth-icon">G</span>
              Continuer avec GitHub
            </button>
          </div>

          <p className="register-link">
            Pas encore inscrit ?{' '}
            <Link to="/register" className="register-link-text">
              Créer un compte
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;