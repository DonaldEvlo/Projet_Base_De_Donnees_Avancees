import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../../supabaseClient";

function ExerciseDetail() {
  const { id } = useParams();
  const [exercice, setExercice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submittedFile, setSubmittedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchExercice = async () => {
      try {
        const response = await fetch(`http://localhost:5000/exercices/${id}`);
        if (!response.ok) throw new Error("Erreur lors de la récupération de l'exercice");
        const data = await response.json();
        setExercice(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
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

    const formData = new FormData();
    formData.append("pdf", submittedFile);
    formData.append("etudiant_id", userId);

    try {
      const response = await fetch(`http://localhost:5000/exercices/${id}/submit`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setMessage(response.ok ? "Travail soumis avec succès !" : data.error || "Erreur lors de la soumission.");
    } catch (error) {
      setMessage("Erreur réseau");
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex space-x-8">
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-4">Détails de l'exercice {exercice.id}</h2>
        <p><strong>Commentaire:</strong> {exercice.commentaire}</p>
        <p><strong>Date limite:</strong> {new Date(exercice.date_limite).toLocaleString()}</p>

        {exercice.pdf_url && (
          <div className="mt-4">
            <h3 className="text-xl font-semibold">Aperçu du PDF :</h3>
            <embed src={exercice.pdf_url} type="application/pdf" width="100%" height="600px" className="border rounded-lg" />
          </div>
        )}

        <a href={exercice.pdf_url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-blue-500 hover:text-blue-700">
          Télécharger le PDF
        </a>
      </div>

      <div className="w-1/3 p-6 bg-white shadow-md rounded-lg">
        <h3 className="text-2xl font-semibold mb-4">Soumettre votre travail</h3>
        <form onSubmit={handleSubmitWork} className="space-y-4">
          <input type="file" accept="application/pdf" onChange={handleFileChange} className="block w-full border p-2 rounded" />
          <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
            Soumettre mon travail
          </button>
        </form>

        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </div>
    </div>
  );
}

export default ExerciseDetail;
