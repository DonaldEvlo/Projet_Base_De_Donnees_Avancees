import { Link } from "react-router-dom";
import "../styles/home.css";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Home = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      console.log("Mode sombre :", !prev);
      return !prev;
    });
  };

  // Splash screen
if (loading) {
  return (
    <div className="flex items-center justify-center h-screen bg-white dark:bg-black transition-colors duration-500">
      <motion.div
        className="text-center animate-splash-entry"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <motion.h1
          className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 drop-shadow-lg"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          Plateforme SGBD 🚀
        </motion.h1>
        <motion.p
          className="mt-4 text-lg text-gray-600 dark:text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          Chargement en cours...
        </motion.p>
      </motion.div>
    </div>
  );
}

  return (
    <motion.div
      className={`${darkMode ? "dark" : ""} relative`}
      style={{
        backgroundImage: "url('/images/home.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <div className={`absolute inset-0 ${darkMode ? "bg-black/60" : "bg-white/20"} z-0 transition-colors duration-500`} />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navbar */}
        <nav className="navbar bg-white/40 dark:bg-black/50 backdrop-blur-md py-5 px-8 shadow-md flex justify-between items-center animate-fade-slide-in">
          <div className="navbar-brand text-gray-900 dark:text-white text-xl font-bold">Plateforme SGBD</div>
          <button
            onClick={toggleDarkMode}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition animate-pop-in"
          >
            {darkMode ? "☀️ Mode Clair" : "🌙 Mode Sombre"}
          </button>
        </nav>

        {/* Contenu principal */}
        <main className="main-content flex-grow flex flex-col items-center justify-center">
          <section className="hero-section text-gray-900 dark:text-white text-center animate-fade-slide-in">
            <h1 className="text-4xl font-bold mb-4">Bienvenue sur notre Plateforme</h1>
            <p className="subtitle text-lg text-gray-800 dark:text-gray-200">
              Gestion avancée des bases de données pour étudiants et enseignants
            </p>
          </section>

          {/* Auth */}
          <section className="auth-card mt-10 p-6 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg w-[90%] max-w-md text-center animate-fade-in">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Connectez-vous à votre espace</h2>
            <p className="auth-message text-gray-700 dark:text-gray-300 mb-4">
              Accédez à toutes les fonctionnalités en vous connectant à votre compte
            </p>

            <div className="auth-actions flex flex-col gap-3">
              <Link
                to="/login"
                className="auth-btn login-btn bg-blue-600 hover:bg-blue-700 hover:shadow-glow text-white py-2 rounded-lg animate-pop-in transition-all duration-300"
              >
                Se connecter
              </Link>
              <p className="auth-divider text-gray-700 dark:text-gray-300">ou</p>
              <Link
                to="/register"
                className="auth-btn signup-btn bg-green-600 hover:bg-green-700 hover:shadow-glow text-white py-2 rounded-lg animate-pop-in transition-all duration-300"
              >
                Créer un compte
              </Link>
            </div>
          </section>

          {/* Informations */}
          <section className="info-section mt-12 flex flex-col md:flex-row gap-6 animate-fade-slide-in">
            <div className="info-card p-5 rounded-xl bg-white/90 dark:bg-gray-700 shadow-md w-[90%] max-w-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Pour les Étudiants</h3>
              <p className="text-gray-700 dark:text-gray-300">Accédez à vos ressources pédagogiques et exercices pratiques</p>
            </div>
            <div className="info-card p-5 rounded-xl bg-white/90 dark:bg-gray-700 shadow-md w-[90%] max-w-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Pour les Enseignants</h3>
              <p className="text-gray-700 dark:text-gray-300">Gérez vos cours et suivez la progression de vos étudiants</p>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="footer bg-white/40 dark:bg-black/60 backdrop-blur-md text-gray-900 dark:text-white py-4 text-center">
          <p>© 2025 Plateforme SGBD - Tous droits réservés</p>
        </footer>
      </div>
    </motion.div>
  );
};

export default Home;
