import { Link } from "react-router-dom";
import "../styles/home.css";
import { useState } from "react";

const Home = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      console.log("Mode sombre :", !prev);
      return !prev;
    });
  };

  return (
    <div
      className={`home-container ${darkMode ? "dark" : ""}`}
      style={{
        backgroundImage: "url('/images/student-image.png')", // Déplacé ici pour tester
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Navbar minimaliste */}
      <nav className="navbar">
        <div className="navbar-brand">Plateforme SGBD</div>
        <button
          onClick={toggleDarkMode}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          {darkMode ? "Mode Clair" : "Mode Sombre"}
        </button>
      </nav>

      {/* Contenu principal centré */}
      <main className="main-content">
        <section className="hero-section">
          <h1>Bienvenue sur notre Plateforme</h1>
          <p className="subtitle">
            Gestion avancée des bases de données pour étudiants et enseignants
          </p>
        </section>

        {/* Section de connexion stylisée */}
        <section className="auth-card">
          <h2>Connectez-vous à votre espace</h2>
          <p className="auth-message">
            Accédez à toutes les fonctionnalités en vous connectant à votre compte
          </p>
          
          <div className="auth-actions">
            <Link to="/login" className="auth-btn login-btn">Se connecter</Link>
            <p className="auth-divider">ou</p>
            <Link to="/register" className="auth-btn signup-btn">Créer un compte</Link>
          </div>
        </section>

        {/* Section d'information */}
        <section className="info-section">
          <div className="info-card">
            <h3>Pour les Étudiants</h3>
            <p>Accédez à vos ressources pédagogiques et exercices pratiques</p>
          </div>
          <div className="info-card">
            <h3>Pour les Enseignants</h3>
            <p>Gérez vos cours et suivez la progression de vos étudiants</p>
          </div>
        </section>
      </main>

      {/* Pied de page simple */}
      <footer className="footer">
        <p>© 2025 Plateforme SGBD - Tous droits réservés</p>
      </footer>
    </div>
  );
};

export default Home;