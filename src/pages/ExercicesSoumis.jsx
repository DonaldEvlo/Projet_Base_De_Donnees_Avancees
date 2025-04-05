import { useState, useEffect } from "react";
import { FaUser, FaFileAlt, FaPen } from "react-icons/fa";
import { Link } from "react-router-dom";

const ExercicesSoumis = () => {
  const [submissions, setSubmissions] = useState([]); // Liste des soumissions
  const [selectedSubmission, setSelectedSubmission] = useState(null); // Soumission sélectionnée
  const [grade, setGrade] = useState(""); // Note attribuée

  // Récupérer les soumissions depuis l'API
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch("/api/submissions"); // Remplacez par l'URL de votre API
        const data = await response.json();
        setSubmissions(data); // Met à jour la liste des soumissions
      } catch (error) {
        console.error("Erreur lors de la récupération des soumissions :", error);
      }
    };

    fetchSubmissions();
  }, []);

  // Attribuer une note
  const handleGradeSubmit = async (submissionId) => {
    try {
      const response = await fetch(`/api/submissions/${submissionId}/grade`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ grade }),
      });

      if (response.ok) {
        alert("Note attribuée avec succès !");
        setGrade(""); // Réinitialise la note
        setSelectedSubmission(null); // Ferme la visualisation
      } else {
        alert("Erreur lors de l'attribution de la note.");
      }
    } catch (error) {
      console.error("Erreur lors de l'attribution de la note :", error);
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
        <Link
          to="/dashboard-prof"
          className="text-lg font-semibold underline hover:text-gray-300"
        >
          Retour
        </Link>
      </header>

      {/* Contenu principal */}
      <main className="flex-grow flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-lg shadow-2xl max-w-4xl w-full">
          <h2 className="text-5xl font-extrabold text-gray-100 mb-6 text-center flex items-center justify-center gap-2">
            <FaUser className="text-blue-500" />
            Liste des Exercices Soumis
          </h2>

          {submissions.length === 0 ? (
            <p className="text-gray-300 text-center">Aucune soumission disponible.</p>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
                >
                  <div>
                    <p className="text-lg font-bold text-gray-800">
                      Étudiant : {submission.studentName}
                    </p>
                    <p className="text-gray-600">Titre : {submission.exerciseTitle}</p>
                  </div>
                  <button
                    onClick={() => setSelectedSubmission(submission)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-600 transition"
                  >
                    Visualiser
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Visualisation d'une soumission */}
        {selectedSubmission && (
          <div className="bg-white/90 backdrop-blur-lg p-8 rounded-lg shadow-2xl max-w-3xl w-full mt-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Soumission de {selectedSubmission.studentName}
            </h3>
            <p className="text-gray-600 mb-4">
              <strong>Titre :</strong> {selectedSubmission.exerciseTitle}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Description :</strong> {selectedSubmission.description}
            </p>
            <a
              href={selectedSubmission.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Télécharger le fichier soumis
            </a>

            {/* Formulaire pour attribuer une note */}
            <div className="mt-6">
              <label className="block text-gray-800 font-bold mb-2">Attribuer une note :</label>
              <input
                type="number"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Entrez une note"
              />
              <button
                onClick={() => handleGradeSubmit(selectedSubmission.id)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-600 transition mt-4"
              >
                Soumettre la note
              </button>
            </div>

            <button
              onClick={() => setSelectedSubmission(null)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600 transition mt-4"
            >
              Fermer
            </button>
          </div>
        )}
      </main>

      {/* Pied de page */}
      <footer className="bg-black/70 text-white py-4 text-center">
        <p className="text-lg font-semibold">
          © 2025 Plateforme SGBD. Tous droits réservés.
        </p>
      </footer>
    </div>
  );
};

export default ExercicesSoumis;