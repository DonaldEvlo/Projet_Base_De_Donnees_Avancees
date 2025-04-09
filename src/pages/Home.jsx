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
      className={`${darkMode ? "dark" : ""} relative`}
      style={{
        backgroundImage: "url('/images/home.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay pour le mode sombre/clair */}
      <div
        className={`absolute inset-0 ${
          darkMode ? "bg-black/60" : "bg-white/20"
        } z-0 transition-colors duration-500`}
      />

      {/* Contenu principal */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navbar minimaliste */}
        <nav className="navbar bg-white/40 dark:bg-black/50 backdrop-blur-md py-5 px-8 shadow-md flex justify-between items-center">
          <div className="navbar-brand text-gray-900 dark:text-white">Plateforme SGBD</div>
          <button
            onClick={toggleDarkMode}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
          >
            {darkMode ? "☀️ Mode Clair" : "🌙 Mode Sombre"}
          </button>
        </nav>

        {/* Contenu principal centré */}
        <main className="main-content flex-grow flex flex-col items-center justify-center">
          <section className="hero-section text-gray-900 dark:text-white">
            <h1>Bienvenue sur notre Plateforme</h1>
            <p className="subtitle text-gray-800 dark:text-gray-200">
              Gestion avancée des bases de données pour étudiants et enseignants
            </p>
          </section>

          {/* Section de connexion stylisée */}
          <section className="auth-card bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg">
            <h2 className="text-gray-900 dark:text-white">Connectez-vous à votre espace</h2>
            <p className="auth-message text-gray-700 dark:text-gray-300">
              Accédez à toutes les fonctionnalités en vous connectant à votre compte
            </p>
            
            <div className="auth-actions">
              <Link to="/login" className="auth-btn login-btn bg-blue-600 hover:bg-blue-700 text-white">Se connecter</Link>
              <p className="auth-divider text-gray-700 dark:text-gray-300">ou</p>
              <Link to="/register" className="auth-btn signup-btn bg-green-600 hover:bg-green-700 text-white">Créer un compte</Link>
            </div>
          </section>

          {/* Section d'information */}
          <section className="info-section">
            <div className="info-card bg-white/90 dark:bg-gray-700 shadow-md">
              <h3 className="text-gray-900 dark:text-white">Pour les Étudiants</h3>
              <p className="text-gray-700 dark:text-gray-300">Accédez à vos ressources pédagogiques et exercices pratiques</p>
            </div>
            <div className="info-card bg-white/90 dark:bg-gray-700 shadow-md">
              <h3 className="text-gray-900 dark:text-white">Pour les Enseignants</h3>
              <p className="text-gray-700 dark:text-gray-300">Gérez vos cours et suivez la progression de vos étudiants</p>
            </div>
          </section>
        </main>

        {/* Pied de page simple */}
        <footer className="footer bg-white/40 dark:bg-black/60 backdrop-blur-md text-gray-900 dark:text-white">
          <p>© 2025 Plateforme SGBD - Tous droits réservés</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;