import { useEffect, useState } from "react";
import { FaFileAlt, FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const DashboardEtudiant = () => {
  const navigate = useNavigate();

  const [exercises, setExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupération des exercices
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch("http://localhost:5000/exercices");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des exercices");
        }
        const data = await response.json();
        console.log("Données récupérées :", data);
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
    console.log("Déconnexion...");
    navigate("/");
  };

  if (loading) {
    return <p className="text-white text-center mt-10 text-lg">Chargement des exercices...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center mt-10">Erreur : {error}</p>;
  }

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/etudiant.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Entête */}
      <header className="bg-transparent text-white py-4 px-8 flex justify-between items-center shadow-md">
        <h1 className="text-3xl font-bold">Plateforme SGBD</h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            Accueil
          </button>
          <button
            onClick={handleLogout}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            Déconnexion
          </button>
        </div>
      </header>

      {/* Barre de recherche */}
      <div className="flex justify-center mt-6">
        <div className="relative w-2/3 max-w-lg">
          <input
            type="text"
            placeholder="Rechercher un exercice..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-4 pl-12 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80 text-gray-800"
          />
          <FaSearch className="absolute top-4 left-4 text-gray-400 text-xl" />
        </div>
      </div>

      {/* Vue d'ensemble des exercices */}
      <main className="flex-grow flex flex-col items-center justify-center mt-10">
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-lg shadow-2xl max-w-6xl w-full">
          <h2 className="text-4xl font-extrabold text-gray-100 mb-6 text-center">
            Vue d'ensemble des Exercices
          </h2>

          {/* Liste des exercices */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExercises.map((exercise) => (
              <div
                key={exercise.id}
                className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center hover:shadow-xl transition"
              >
                <FaFileAlt className="text-6xl text-blue-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {exercise.id}
                </h3>
                <p className="text-gray-600 text-center mb-2">
                  <strong>Commentaire :</strong>{" "}
                  {exercise.commentaire ? exercise.commentaire.slice(0, 50) + "..." : "Aucun"}
                </p>
                <p className="text-gray-600 text-center mb-4">
                  <strong>Date limite :</strong>{" "}
                  {new Date(exercise.date_limite).toLocaleDateString()}
                </p>
                <Link
                  to={`/exercice/${exercise.id}`}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition"
                >
                  Voir les détails
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Pied de page */}
      <footer className="bg-transparent text-white py-4 text-center shadow-md">
        <p className="text-lg font-semibold">© 2025 Plateforme SGBD. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default DashboardEtudiant;
