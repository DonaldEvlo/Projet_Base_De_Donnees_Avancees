import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const ExerciceDetails = () => {
  const { id } = useParams(); // Récupère l'ID de l'exercice depuis l'URL
  const [exercise, setExercise] = useState(null);
  const [file, setFile] = useState(null); // Fichier à rendre

  // Récupérer les détails de l'exercice depuis l'API
  useEffect(() => {
    const fetchExerciseDetails = async () => {
      try {
        const response = await fetch(`/api/exercises/${id}`); // Remplacez par l'URL de votre API
        const data = await response.json();
        setExercise(data); // Met à jour les détails de l'exercice
      } catch (error) {
        console.error("Erreur lors de la récupération des détails de l'exercice :", error);
      }
    };

    fetchExerciseDetails();
  }, [id]);

  // Gérer le changement de fichier
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Soumettre le fichier via l'API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Veuillez sélectionner un fichier avant de soumettre.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`/api/exercises/${id}/submit`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Fichier soumis avec succès !");
        setFile(null); // Réinitialise le fichier après soumission
      } else {
        alert("Erreur lors de la soumission du fichier.");
      }
    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
    }
  };

  if (!exercise) {
    return <p>Chargement des détails de l'exercice...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{exercise.title}</h1>
        <p className="text-gray-600 mb-4">{exercise.description}</p>
        <p className="text-gray-800 font-bold mb-2">Date limite : {exercise.deadline}</p>
        <p className="text-gray-800 font-bold mb-4">Commentaire : {exercise.comment}</p>

        {/* Rendre la correction */}
        <form onSubmit={handleSubmit} className="mb-4">
          <label className="block text-gray-800 font-bold mb-2">Rendre la correction :</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="border border-gray-300 rounded-lg p-2 w-full mb-4"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            Soumettre
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExerciceDetails;