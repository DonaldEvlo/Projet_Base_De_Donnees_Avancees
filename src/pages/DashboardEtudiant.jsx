import { useEffect, useState } from "react";
import { FaFileAlt, FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const DashboardEtudiant = () => {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === "true";
  });

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  };

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

  return (
    <div
      className={`${darkMode ? "dark" : ""} min-h-screen flex flex-col`}
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/etudiant.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 ${
          darkMode ? "bg-black/60" : "bg-white/20"
        } z-0 transition-colors duration-500`}
      />

      {/* Entête */}
      <header className="relative z-10 bg-white/40 dark:bg-black/50 backdrop-blur-md py-4 px-8 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-extrabold tracking-wide uppercase text-gray-900 dark:text-white">
          Plateforme SGBD
        </h1>
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

      {/* Contenu principal */}
      <main className="relative z-10 flex-grow flex flex-col items-center py-8 px-4">
        {/* Search bar */}
        <div className="w-full max-w-xl mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un exercice..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
            />
            <FaSearch className="absolute top-3.5 left-4 text-gray-400 dark:text-gray-300 text-lg" />
          </div>
        </div>

        {/* Loading / Error */}
        {loading && (
          <p className="text-center text-lg text-gray-100 mt-12">
            Chargement des exercices...
          </p>
        )}
        {error && (
          <p className="text-center text-red-500 mt-12">Erreur : {error}</p>
        )}

        {/* Liste des exercices */}
        {!loading && !error && (
          <div className="bg-white/20 dark:bg-gray-800/80 backdrop-blur-lg p-8 rounded-lg shadow-2xl max-w-6xl w-full">
            <h2 className="text-4xl font-extrabold text-gray-100 mb-8 text-center flex items-center justify-center gap-2">
              <FaFileAlt className="text-blue-500" />
              Vue d'ensemble des Exercices
            </h2>

            {filteredExercises.length === 0 ? (
              <p className="text-gray-300 text-center">Aucun exercice trouvé.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="bg-white/90 dark:bg-gray-700 p-6 rounded-lg shadow-lg flex flex-col items-center hover:shadow-xl transition"
                  >
                    <div className="flex flex-col items-center mb-4">
                      <FaFileAlt className="text-5xl text-blue-500 mb-2" />
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                        {exercise.titre || `Exercice ${exercise.id}`}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-center mb-2">
                      {exercise.commentaire
                        ? exercise.commentaire.substring(0, 60) + "..."
                        : "Pas de description disponible."}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      <strong>Date limite :</strong>{" "}
                      {new Date(exercise.date_limite).toLocaleDateString()}
                    </p>
                    <Link
                      to={`/exercice/${exercise.id}`}
                      className="mt-auto bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition flex items-center gap-2"
                    >
                      Voir les détails
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-white/40 dark:bg-black/60 backdrop-blur-md text-gray-900 dark:text-white py-4 text-center">
        <p className="text-lg font-semibold">
          © 2025 Plateforme SGBD. Tous droits réservés.
        </p>
      </footer>
    </div>
  );
};

export default DashboardEtudiant;