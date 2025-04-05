import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getEtudiant, listenToAuthChanges, signInWithEmail, signInWithOAuthEtudiant, updateEtudiantProfile } from "../../backend/services/authServices";
import "../styles/signin.css";

const LoginEtudiant = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [classe, setClasse] = useState(""); // Nouvelle classe
  const [filiere, setFiliere] = useState(""); // Nouvelle filière
  const [showAdditionalForm, setShowAdditionalForm] = useState(false); // Afficher le formulaire supplémentaire
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userWithData = await getEtudiant();

        if (!userWithData) {
          return;
        }

        setUser(userWithData);

        if (!userWithData.role) {
          return;
        }

        navigate("/dashboard-etudiant");
      } catch (err) {
        console.error("Erreur lors de la vérification de l'utilisateur:", err);
      }
    };

    checkUser();
    listenToAuthChanges(setUser);
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmail(email, password, false);

      const userWithData = await getEtudiant();
      if (!userWithData || !userWithData.role) {
        throw new Error("Impossible de récupérer les informations de l'utilisateur");
      }

      setUser(userWithData);
      navigate("/dashboard-etudiant");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider) => {
    setError("");

    try {
      const user = await signInWithOAuthEtudiant("etudiant", provider);
      if (user) {
        console.log("Connexion OAuth réussie, redirection...");
        setShowAdditionalForm(true); // Affiche le formulaire pour classe et filière
      }
    } catch (error) {
      setError(`Erreur avec ${provider}: ${error.message}`);
    }
  };

  const handleAdditionalInfoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mettre à jour les informations de l'utilisateur
      await updateEtudiantProfile({ classe, filiere });
      console.log("Informations supplémentaires enregistrées avec succès !");
      navigate("/dashboard-etudiant");
    } catch (err) {
      console.error("Erreur lors de l'enregistrement des informations supplémentaires :", err);
      setError("Erreur lors de l'enregistrement des informations supplémentaires.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <nav className="navbar">
        <div className="navbar-brand">Plateforme SGBD</div>
        <Link to="/" className="navbar-link">Retour à l'accueil</Link>
      </nav>

      <main className="login-main">
        <div className="login-card">
          <h1 className="login-title">Connexion</h1>
          <p className="login-subtitle">Accédez à votre espace étudiant</p>

          {error && <div className="login-error-message">{error}</div>}

          {!showAdditionalForm ? (
            <>
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
                <button type="button" onClick={() => handleOAuthLogin("google")} className="oauth-button google">
                  <span className="oauth-icon">G</span>
                  Continuer avec Google
                </button>

                <button type="button" onClick={() => handleOAuthLogin("github")} className="oauth-button github">
                  <span className="oauth-icon">G</span>
                  Continuer avec GitHub
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleAdditionalInfoSubmit} className="additional-info-form">
              <h2 className="login-title">Informations supplémentaires</h2>
              <p className="login-subtitle">Veuillez renseigner votre classe et votre filière</p>

              <div className="form-group">
                <input
                  type="text"
                  name="classe"
                  placeholder="Classe"
                  value={classe}
                  onChange={(e) => setClasse(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="filiere"
                  placeholder="Filière"
                  value={filiere}
                  onChange={(e) => setFiliere(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <button type="submit" className="login-button" disabled={isLoading}>
                {isLoading ? "Enregistrement..." : "Enregistrer"}
              </button>
            </form>
          )}

          <p className="register-link">
            Pas encore inscrit ?{" "}
            <Link to="/register" className="register-link-text">Créer un compte</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default LoginEtudiant;