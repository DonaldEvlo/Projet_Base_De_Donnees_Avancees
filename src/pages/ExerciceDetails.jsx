import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";

function ExerciseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exercice, setExercice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submittedFile, setSubmittedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchExercice = async () => {
      try {
        const response = await fetch(`http://localhost:5000/exercices/${id}`);
        if (!response.ok)
          throw new Error("Erreur lors de la récupération de l'exercice");
        const data = await response.json();
        setExercice(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
      else console.error("Erreur utilisateur:", error);
    };

    fetchExercice();
    fetchUser();
  }, [id]);

  const handleFileChange = (event) => setSubmittedFile(event.target.files[0]);

  const handleSubmitWork = async (event) => {
    event.preventDefault();
    if (!submittedFile || !userId) {
      setMessage("Veuillez sélectionner un fichier PDF et être connecté.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("pdf", submittedFile);
    formData.append("etudiant_id", userId);

    try {
      const response = await fetch(
        `http://localhost:5000/exercices/${id}/submit`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setMessage(
        response.ok
          ? "✅ Travail soumis avec succès !"
          : data.error || "❌ Erreur lors de la soumission."
      );
    } catch (error) {
      setMessage("❌ Erreur réseau");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div
      className={`${darkMode ? "dark" : ""} relative min-h-screen`}
      style={{
        backgroundImage: `url("/images/etudiant.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-0" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col bg-gray-100/70 dark:bg-gray-900/70 transition-colors duration-500">
        {/* Header */}
        <header className="bg-white/30 dark:bg-black/40 backdrop-blur-lg py-5 px-8 shadow-md flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            📘 Plateforme SGBD
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/dashboard-etudiant")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold transition"
            >
              Retour
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

        {/* Main */}
        <main className="flex-grow flex justify-center items-start py-12 px-4">
          {loading ? (
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Chargement...
            </p>
          ) : error ? (
            <p className="text-red-500 dark:text-red-400">{error}</p>
          ) : (
            <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-2xl p-8">
              {/* Détails exercice */}
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-4 dark:text-white">
                  Détails de l'exercice {exercice.id}
                </h2>
                <p className="mb-2">
                  <strong>Commentaire:</strong> {exercice.commentaire}
                </p>
                <p>
                  <strong>Date limite:</strong>{" "}
                  {new Date(exercice.date_limite).toLocaleString()}
                </p>

                {exercice.pdf_url && (
                  <div className="mt-4">
                    <h3 className="text-xl font-semibold mb-2">
                      Aperçu du PDF :
                    </h3>
                    <embed
                      src={exercice.pdf_url}
                      type="application/pdf"
                      width="100%"
                      height="600px"
                      className="border rounded-lg"
                    />
                  </div>
                )}

                <a
                  href={exercice.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Télécharger le PDF
                </a>
              </div>

              {/* Soumission */}
              <div className="w-full lg:w-1/3 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl">
                <h3 className="text-2xl font-semibold mb-4">
                  Soumettre votre travail
                </h3>
                <form onSubmit={handleSubmitWork} className="space-y-4">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="block w-full border p-2 rounded dark:bg-gray-900 dark:border-gray-700"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex items-center justify-center gap-2 ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600"
                    } text-white font-semibold py-2 px-4 rounded-md transition`}
                  >
                    {isSubmitting
                      ? "Soumission..."
                      : "✅ Soumettre mon travail"}
                  </button>
                </form>

                {message && (
                  <p
                    className={`mt-4 text-center font-medium ${
                      message.includes("succès")
                        ? "text-green-600"
                        : "text-red-500 dark:text-red-400"
                    }`}
                  >
                    {message}
                  </p>
                )}
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-black/40 dark:bg-black/60 backdrop-blur-md text-white text-center py-4">
          <p className="text-sm">
            © 2025 Plateforme SGBD. Tous droits réservés.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default ExerciseDetail;
