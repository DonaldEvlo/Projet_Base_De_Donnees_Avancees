import { useEffect, useState } from "react";
import { FaEdit, FaTasks, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";

const ListeExercices = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Récupérer les exercices publiés du professeur
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !sessionData.session) {
          throw new Error("Utilisateur non authentifié.");
        }

        const token = sessionData.session.access_token;
        console.log("Token récupéré côté client:", token);

        const response = await fetch("http://localhost:5000/mes-exercices", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des exercices.");
        }

        const data = await response.json();
        setExercises(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  // Supprimer un exercice
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cet exercice ?");
    if (!confirmDelete) return;

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      const response = await fetch(`http://localhost:5000/exercices/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Exercice supprimé avec succès !");
        setExercises(exercises.filter((exercise) => exercise.id !== id));
      } else {
        alert("Erreur lors de la suppression de l'exercice.");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/prof.png')",
        backgroundSize: "cover",
        backgroundPosition: "center 20%",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Entête */}
      <header className="bg-black/50 text-white py-4 px-8 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-extrabold tracking-wide uppercase">
          Plateforme SGBD
        </h1>
        <button
          onClick={() => navigate("/dashboard-prof")}
          className="text-lg font-semibold underline hover:text-gray-300"
        >
          Retour
        </button>
      </header>

      {/* Contenu principal */}
      <main className="flex-grow flex items-center justify-center py-8 px-4">
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-lg shadow-2xl max-w-4xl w-full">
          <h2 className="text-5xl font-extrabold text-gray-100 mb-6 text-center flex items-center justify-center gap-2">
            <FaTasks className="text-green-500" />
            Liste des Exercices
          </h2>

          {loading ? (
            <p className="text-gray-300 text-center">Chargement...</p>
          ) : error ? (
            <p className="text-red-500 text-center">Erreur: {error}</p>
          ) : exercises.length === 0 ? (
            <p className="text-gray-300 text-center">Aucun exercice disponible.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center hover:shadow-xl transition"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {exercise.titre || "Exercice"}
                  </h3>
                  <p className="text-gray-600 text-center mb-4">
                    {exercise.commentaire?.substring(0, 60) || "Pas de description"}...
                  </p>
                  <div className="flex gap-4">
                    {/* Modifier */}
                    <button
                      onClick={() => navigate(`/edit-exercise/${exercise.id}`)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-yellow-600 transition flex items-center gap-2"
                    >
                      <FaEdit />
                      Modifier
                    </button>
                    {/* Supprimer */}
                    <button
                      onClick={() => handleDelete(exercise.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition flex items-center gap-2"
                    >
                      <FaTrashAlt />
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/70 text-white py-4 text-center">
        <p className="text-lg font-semibold">
          © 2025 Plateforme SGBD. Tous droits réservés.
        </p>
      </footer>
    </div>
  );
};

export default ListeExercices;
