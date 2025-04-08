import { useEffect, useState } from "react";
import { FaFileAlt, FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const DashboardEtudiant = () => {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch("http://localhost:5000/exercices");
        if (!response.ok) throw new Error("Erreur lors de la récupération des exercices");
        const data = await response.json();
        setExercises(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, []);

  const filteredExercises = exercises.filter((exercise) =>
    String(exercise.id).toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        backgroundImage: `url("/images/etudiant.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-0" />

      {/* Contenu principal */}
      <div className="relative z-10 min-h-screen flex flex-col bg-gray-100/70 dark:bg-gray-900/70 transition-colors duration-500">
        {/* Header */}
        <header className="bg-white/30 dark:bg-black/40 backdrop-blur-lg py-5 px-8 shadow-md flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">📘 Plateforme SGBD</h1>
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

        {/* Search bar */}
        <div className="flex justify-center mt-8">
          <div className="relative w-4/5 max-w-xl">
            <input
              type="text"
              placeholder="Rechercher un exercice..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
            <FaSearch className="absolute top-3.5 left-4 text-gray-400 dark:text-gray-300 text-lg" />
          </div>
        </div>

        {/* Loading / Error */}
        {loading && (
          <p className="text-center text-lg text-gray-700 dark:text-gray-300 mt-12">
            Chargement des exercices...
          </p>
        )}
        {error && (
          <p className="text-center text-red-500 dark:text-red-400 mt-12">Erreur : {error}</p>
        )}

        {/* Main */}
        {!loading && !error && (
          <main className="flex-grow flex flex-col items-center mt-12 px-4">
            <div className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-7xl">
              <h2 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">
                📂 Vue d'ensemble des Exercices
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg transition duration-300 flex flex-col justify-between"
                  >
                    <div className="flex flex-col items-center mb-4">
                      <FaFileAlt className="text-5xl text-blue-500 mb-2" />
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                        {exercise.id}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      <strong>Commentaire :</strong>{" "}
                      {exercise.commentaire ? exercise.commentaire.slice(0, 60) + "..." : "Aucun"}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                      <strong>Date limite :</strong>{" "}
                      {new Date(exercise.date_limite).toLocaleDateString()}
                    </p>
                    <Link
                      to={`/exercice/${exercise.id}`}
                      className="mt-auto inline-block text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold transition"
                    >
                      Voir les détails
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </main>
        )}

        {/* Footer */}
        <footer className="bg-black/40 dark:bg-black/60 backdrop-blur-md text-white text-center py-4 mt-12">
          <p className="text-sm">© 2025 Plateforme SGBD. Tous droits réservés.</p>
        </footer>
      </div>
    </div>
  );
};

export default DashboardEtudiant;
