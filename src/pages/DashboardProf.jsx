import {
  FaBook,
  FaChalkboardTeacher,
  FaChartBar,
  FaHome,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const DashboardProf = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    navigate("/");
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div
      className={`${darkMode ? "dark" : ""} relative`}
      style={{
        backgroundImage: `url("/images/prof.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center 25%", // Position harmonieuse
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 ${
          darkMode ? "bg-black/60" : "bg-white/20"
        } z-0 transition-colors duration-500`}
      />

      {/* Contenu principal */}
      <div className="relative z-10 min-h-screen flex flex-col justify-start">
        {/* Header */}
        <header className="bg-white/40 dark:bg-black/50 backdrop-blur-md py-5 px-8 shadow-md flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">👨‍🏫 Plateforme SGBD</h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold transition"
            >
              Accueil
            </button>
            <button
              onClick={toggleDarkMode}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-semibold transition"
            >
              {darkMode ? "☀️ Mode Clair" : "🌙 Mode Sombre"}
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-semibold transition"
            >
              Déconnexion
            </button>
          </div>
        </header>

        {/* Main content avec positionnement plus bas */}
        <main className="flex-grow flex flex-col items-center justify-start pt-32 pb-16 px-4">
          <div className="bg-white/20 dark:bg-gray-800/80 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-full max-w-6xl">
            <h2 className="text-4xl font-bold text-center mb-10 text-gray-900 dark:text-white">
              🧑‍🏫 Tableau de Bord Professeur
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <DashboardCard
                icon={<FaChalkboardTeacher className="text-5xl text-orange-500 mb-2" />}
                label="Créer un Exercice"
                onClick={() => navigate("/create-exercise")}
              />
              <DashboardCard
                icon={<FaBook className="text-5xl text-green-500 mb-2" />}
                label="Exercices"
                onClick={() => navigate("/exercices")}
              />
              <DashboardCard
                icon={<FaChartBar className="text-5xl text-purple-500 mb-2" />}
                label="Exercices Soumis"
                onClick={() => navigate("/exercices-soumis")}
              />
              <DashboardCard
                icon={<FaSignOutAlt className="text-5xl text-red-500 mb-2" />}
                label="Déconnexion"
                onClick={handleLogout}
              />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white/40 dark:bg-black/60 backdrop-blur-md text-gray-900 dark:text-white text-center py-4 mt-12">
          <p className="text-sm">© 2025 Plateforme SGBD. Tous droits réservés.</p>
        </footer>
      </div>
    </div>
  );
};

const DashboardCard = ({ icon, label, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white/90 dark:bg-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg transition duration-300 flex flex-col items-center justify-between cursor-pointer"
  >
    {icon}
    <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mt-2">{label}</h3>
  </div>
);

export default DashboardProf;
