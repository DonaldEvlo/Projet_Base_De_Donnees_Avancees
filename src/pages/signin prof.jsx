import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getProf,
  listenToAuthChanges,
  signInWithEmail,
  signInWithOAuthProf,
} from "../../backend/services/authServices";
import "../styles/signin.css";

const LoginProf = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [user, setUser] = useState(null); // ✅ Ajouté ici
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🚀 useEffect exécuté");

    const checkUser = async () => {
      try {
        console.log("🔍 Appel de getUser...");
        const userWithData = await getProf();

        if (!userWithData) {
          console.warn("⚠️ Aucun utilisateur trouvé, connexion requise.");
          return;
        }

        console.log("✅ Utilisateur récupéré :", userWithData);
        setUser(userWithData);

        const userRole = userWithData.role;
        if (!userRole) {
          console.error("❌ Erreur : rôle non défini !");
          return;
        }

        const destination = "/dashboard-prof";
        console.log("🔀 Redirection vers :", destination);
        navigate(destination);
      } catch (err) {
        console.error("❌ Erreur lors de la vérification de l'utilisateur:", err);
      }
    };

    checkUser();

    // 🔄 Écouter les changements d'authentification
    listenToAuthChanges(setUser);
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("🔑 Tentative de connexion avec", email, password);
      
      await signInWithEmail(email, password, true); // ✅ Assure-toi que "true" correspond à `role === "professeur"`
      console.log("✅ Connexion réussie !");

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const userWithData = await getProf();
      if (!userWithData || !userWithData.role) {
        throw new Error("Impossible de récupérer les informations de l'utilisateur");
      }

      setUser(userWithData);
      const destination = "/dashboard-prof";
      navigate(destination);
    } catch (err) {
      console.error("❌ Erreur lors de la connexion :", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider) => {
    setError("");
  
    try {
      const user = await signInWithOAuthProf("etudiant", provider);
      if (user) {
        console.log("✅ Connexion OAuth réussie, redirection...");
        navigate("/dashboard-etudiant");
      }
    } catch (error) {
      setError(`Erreur avec ${provider}: ${error.message}`);
    }
  };

  return (
    <div className="login-container">
      {/* Navbar cohérente */}
      <nav className="navbar">
        <div className="navbar-brand">Plateforme SGBD</div>
        <Link to="/" className="navbar-link">
          Retour à l'accueil
        </Link>
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

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </form>

          <div className="login-separator">
            <span>OU</span>
          </div>

          <div className="oauth-buttons">
            <button
              type="button"
              onClick={() => handleOAuthLogin("google")}
              className="oauth-button google"
            >
              <span className="oauth-icon">G</span>
              Continuer avec Google
            </button>

            <button
              type="button"
              onClick={() => handleOAuthLogin("github")}
              className="oauth-button github"
            >
              <span className="oauth-icon">G</span>
              Continuer avec GitHub
            </button>
          </div>

          <p className="register-link">
            Pas encore inscrit ?{" "}
            <Link to="/register" className="register-link-text">
              Créer un compte
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default LoginProf;
