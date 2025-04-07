import { FaBook, FaChalkboardTeacher, FaChartBar, FaHome, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/dashboardProf.css";
import { useState } from "react";

const DashboardProf = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = async () => {
    try {
      console.log("Déconnexion en cours...");
      console.log("Déconnexion réussie !");
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error.message);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      console.log("Mode sombre :", !prev);
      return !prev;
    });
  };

  return (
    <div
      className={`dashboard-container min-h-screen flex flex-col bg-cover bg-center ${darkMode ? "dark" : ""}`}
      style={{
        backgroundImage: "url('/images/prof.png')", // Image toujours présente
        backgroundSize: "cover",
        backgroundPosition: "center 30%",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Entête */}
      <header className="bg-transparent text-gray-800 dark:text-white py-4 px-8 flex justify-between items-center shadow-md">
        <h1 className="text-3xl font-bold">Plateforme SGBD</h1>
        <button
          onClick={toggleDarkMode}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          {darkMode ? "Mode Clair" : "Mode Sombre"}
        </button>
      </header>

      {/* Contenu principal */}
      <main className="flex-grow flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-10">Tableau de Bord Professeur</h1>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {/* Accueil */}
          <div
            className="flex flex-col items-center justify-center bg-white/80 dark:bg-gray-800/80 p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition"
            onClick={() => navigate("/")}
          >
            <FaHome className="text-6xl text-blue-500 mb-4" />
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">Accueil</p>
          </div>

          {/* Créer un exercice */}
          <div
            className="flex flex-col items-center justify-center bg-white/80 dark:bg-gray-800/80 p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition"
            onClick={() => navigate("/create-exercise")}
          >
            <FaChalkboardTeacher className="text-6xl text-orange-500 mb-4" />
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">Créer un Exercice</p>
          </div>

          {/* Exercices */}
          <div
            className="flex flex-col items-center justify-center bg-white/80 dark:bg-gray-800/80 p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition"
            onClick={() => navigate("/exercices")}
          >
            <FaBook className="text-6xl text-green-500 mb-4" />
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">Exercices</p>
          </div>

          {/* Exercices Soumis */}
          <div
            className="flex flex-col items-center justify-center bg-white/80 dark:bg-gray-800/80 p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition"
            onClick={() => navigate("/exercices-soumis")}
          >
            <FaChartBar className="text-6xl text-purple-500 mb-4" />
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">Exercices Soumis</p>
          </div>

          {/* Déconnexion */}
          <div
            className="flex flex-col items-center justify-center bg-white/80 dark:bg-gray-800/80 p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="text-6xl text-red-500 mb-4" />
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">Déconnexion</p>
          </div>
        </div>
      </main>

      {/* Pied de page */}
      <footer className="bg-transparent text-gray-800 dark:text-white py-4 text-center shadow-md">
        <p className="text-lg font-semibold">© 2025 Plateforme SGBD. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default DashboardProf;