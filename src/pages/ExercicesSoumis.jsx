import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";

const ExercicesSoumis = () => {
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [grade, setGrade] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === "true";
  });

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  };

  // Récupérer les exercices depuis l'API
  useEffect(() => {
    const fetchUserAndExercises = async () => {
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
            "Authorization": `Bearer ${token}`,
          },
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

    fetchUserAndExercises();
  }, []);

  // Récupérer les soumissions pour un exercice spécifique
  const fetchSubmissions = async (exerciseId) => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        throw new Error("Utilisateur non authentifié.");
      }

      const token = sessionData.session.access_token;

      const response = await fetch(`http://localhost:5000/exercices/${exerciseId}/soumissions`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des soumissions.");
      }

      const data = await response.json();

      // Vérifie si la réponse contient un message spécifique ou si la liste est vide
      if (data.message === "Aucune soumission trouvée pour cet exercice." || data.length === 0) {
        setSubmissions([]);
        setError("Aucune soumission trouvée pour cet exercice.");
        return;
      }

      setSubmissions(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // Soumettre la note
  const handleGradeSubmit = async (submissionId, exerciseId) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      // Vérifier si la note est présente
      if (!grade) {
        alert("Veuillez entrer une note.");
        return;
      }

      const response = await fetch(`http://localhost:5000/${submissionId}/noter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          grade,
          exerciseId,
        }),
      });

      if (!response.ok) throw new Error("Erreur lors de l'envoi de la note.");

      alert("Note soumise avec succès !");
      setSelectedSubmission(null);
      setGrade("");
    } catch (err) {
      alert("Erreur : " + err.message);
    }
  };

  return (
    <div
      className={`${darkMode ? "dark" : ""} min-h-screen flex flex-col`}
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/prof.png')",
        backgroundSize: "cover",
        backgroundPosition: "center 20%",
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
            onClick={() => navigate("/dashboard-prof")}
            className="text-lg font-semibold underline text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
          >
            Retour
          </button>
          <button
            onClick={toggleDarkMode}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-semibold transition"
          >
            {darkMode ? "☀️ Mode Clair" : "🌙 Mode Sombre"}
          </button>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-start py-8 px-4">
        <div className="bg-white/20 dark:bg-gray-800/80 backdrop-blur-lg p-8 rounded-lg shadow-2xl max-w-4xl w-full">
          <h2 className="text-5xl font-extrabold text-gray-100 mb-6 text-center flex items-center justify-center gap-2">
            <FaUser className="text-blue-500" />
            Liste des Exercices Soumis
          </h2>

          {loading ? (
            <p className="text-gray-300 text-center">Chargement...</p>
          ) : error && !selectedExercise ? (
            <p className="text-red-500 text-center">Erreur: {error}</p>
          ) : exercises.length === 0 ? (
            <p className="text-gray-300 text-center">Aucun exercice disponible.</p>
          ) : (
            <div className="space-y-4">
              {exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="bg-white/90 dark:bg-gray-700 p-4 rounded-lg shadow-md flex justify-between items-center hover:shadow-xl transition"
                >
                  <div>
                    <p className="text-lg font-bold text-gray-800 dark:text-white">
                      Exercice : {exercise.titre ?? "Sans titre"}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Description : {exercise.commentaire?.substring(0, 60) ?? "Aucune description"}...
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedExercise(exercise);
                      fetchSubmissions(exercise.id);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-600 transition"
                  >
                    Voir les soumissions
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Afficher les soumissions de l'exercice sélectionné */}
        {selectedExercise && (
          <div className="relative z-10 bg-white/20 dark:bg-gray-800/80 backdrop-blur-lg p-8 rounded-lg shadow-2xl max-w-4xl w-full mt-8">
            <h3 className="text-2xl font-bold text-gray-100 dark:text-white mb-4">
              Soumissions pour l'exercice "{selectedExercise.titre}"
            </h3>

            {error ? (
              <p className="text-red-500 text-center">{error}</p>
            ) : submissions.length === 0 ? (
              <p className="text-gray-300 text-center">
                Aucune soumission pour cet exercice.
              </p>
            ) : (
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="bg-white/90 dark:bg-gray-700 p-4 rounded-lg shadow-md flex justify-between items-center hover:shadow-xl transition"
                  >
                    <div>
                      <p className="text-lg font-bold text-gray-800 dark:text-white">
                        Étudiant : {submission.studentName ?? "Inconnu"}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedSubmission(submission)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-600 transition"
                    >
                      Noter
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Visualisation et notation de la soumission */}
        {selectedSubmission && (
          <div className="relative z-10 bg-white/20 dark:bg-gray-800/80 backdrop-blur-lg p-8 rounded-lg shadow-2xl max-w-4xl w-full mt-8">
            <h3 className="text-2xl font-bold text-gray-100 dark:text-white mb-4">
              Soumission de {selectedSubmission.studentName}
            </h3>
            <div className="bg-white/90 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-800 dark:text-gray-200 mb-2">
                <strong>Titre :</strong> {selectedSubmission.exerciseTitle}
              </p>
              <p className="text-gray-800 dark:text-gray-200 mb-2">
                <strong>Description :</strong> {selectedSubmission.description}
              </p>
              <a
                href={selectedSubmission.fichier_reponse}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 dark:text-blue-400 underline"
              >
                Télécharger le fichier soumis
              </a>
            </div>

            {/* Formulaire pour attribuer une note */}
            <div className="mt-6 bg-white/90 dark:bg-gray-700 p-4 rounded-lg">
              <label className="block text-gray-800 dark:text-white font-bold mb-2">
                Attribuer une note :
              </label>
              <input
                type="number"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white focus:outline-none"
                placeholder="Entrez une note"
              />
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => handleGradeSubmit(selectedSubmission.id, selectedExercise.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-600 transition"
                >
                  Soumettre la note
                </button>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition"
                >
                  Fermer
                </button>
              </div>
            </div>
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

export default ExercicesSoumis;