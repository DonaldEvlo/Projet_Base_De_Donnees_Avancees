import { useEffect, useState } from "react";
import { FaPen } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "../../supabaseClient";

const ModifierExercice = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState("");
  const [deadline, setDeadline] = useState("");
  const [professeurId, setProfesseurId] = useState(null);
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

  // Récupération des données de l'exercice
  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !sessionData.session) {
          throw new Error("Utilisateur non authentifié.");
        }

        const token = sessionData.session.access_token;

        const response = await fetch(`http://localhost:5000/exercices/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        });
        
        if (!response.ok) {
          throw new Error("Exercice non trouvé");
        }

        const data = await response.json();
        console.log("Données de l'exercice:", data);

        setTitle(data.titre || "");
        setComment(data.commentaire || "");
        setProfesseurId(data.professeur_id || null);
        const rawDate = data.date_limite;
        const formattedDate = rawDate
          ? new Date(rawDate).toISOString().split("T")[0]
          : "";
        setDeadline(formattedDate);
      } catch (err) {
        console.error("Erreur :", err);
        setError("Impossible de charger l'exercice.");
      }
    };

    fetchExercise();
  }, [id]);

  // Soumettre les modifications
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      const formData = new FormData();
      formData.append("titre", title);
      if (file) formData.append("file", file);
      formData.append("commentaire", comment);
      formData.append("professeur_id", professeurId);
      formData.append("date_limite", deadline);

      const response = await fetch(`http://localhost:5000/exercices/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert("Exercice modifié avec succès !");
        navigate("/exercices");
      } else {
        const data = await response.json();
        alert("Erreur : " + (data.error || "Erreur inconnue"));
      }
    } catch (err) {
      console.error("Erreur :", err);
      alert("Une erreur s'est produite.");
    }
  };

  if (error) {
    return (
      <div className={`${darkMode ? "dark" : ""} min-h-screen flex flex-col items-center justify-center`}
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/prof.png')",
          backgroundSize: "cover",
          backgroundPosition: "center 20%",
          backgroundRepeat: "no-repeat",
        }}>
        <div className="text-center text-red-500 text-xl font-bold p-10 bg-white/20 dark:bg-gray-800/80 backdrop-blur-lg rounded-lg">
          {error}
        </div>
      </div>
    );
  }

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
          Modifier l'exercice
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/exercices")}
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
      <main className="relative z-10 flex-grow flex items-center justify-center py-8 px-4">
        <div className="bg-white/20 dark:bg-gray-800/80 backdrop-blur-lg p-8 rounded-lg shadow-2xl max-w-3xl w-full">
          <h2 className="text-5xl font-extrabold text-gray-100 mb-6 text-center flex items-center justify-center gap-2">
            <FaPen className="text-blue-500" />
            Modifier l'exercice
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Titre */}
            <div>
              <label className="block text-gray-200 font-bold mb-2 text-xl">
                Titre de l'exercice
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border border-gray-300 rounded-lg p-4 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80 dark:bg-gray-700/90 text-gray-800 dark:text-white text-lg"
                required
              />
            </div>

            {/* Fichier */}
            <div>
              <label className="block text-gray-200 font-bold mb-2 text-xl">
                Ajouter un fichier
              </label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="border border-gray-300 rounded-lg p-4 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80 dark:bg-gray-700/90 text-gray-800 dark:text-white text-lg"
              />
            </div>

            {/* Commentaire */}
            <div>
              <label className="block text-gray-200 font-bold mb-2 text-xl">
                Commentaire
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="border border-gray-300 rounded-lg p-4 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80 dark:bg-gray-700/90 text-gray-800 dark:text-white text-lg"
                rows="3"
              />
            </div>

            {/* Date limite */}
            <div>
              <label className="block text-gray-200 font-bold mb-2 text-xl">
                Date limite
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="border border-gray-300 rounded-lg p-4 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80 dark:bg-gray-700/90 text-gray-800 dark:text-white text-lg"
                required
              />
            </div>

            {/* Bouton */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-extrabold text-xl hover:bg-blue-700 transition duration-300"
              >
                Modifier
              </button>
            </div>
          </form>
        </div>
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

export default ModifierExercice;