import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaPen, FaFileAlt, FaCalendarAlt, FaCommentDots } from "react-icons/fa";

const ModifierExercice = () => {
  const { id } = useParams(); // Récupère l'ID de l'exercice depuis l'URL
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState("");
  const [deadline, setDeadline] = useState("");

  // Récupérer les détails de l'exercice
  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const response = await fetch(`/api/exercises/${id}`); // Remplacez par l'URL de votre API
        const data = await response.json();
        setTitle(data.title);
        setDescription(data.description);
        setComment(data.comment);
        setDeadline(data.deadline);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'exercice :", error);
      }
    };

    fetchExercise();
  }, [id]);

  // Soumettre les modifications
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (file) formData.append("file", file);
    formData.append("comment", comment);
    formData.append("deadline", deadline);

    try {
      const response = await fetch(`/api/exercises/${id}`, {
        method: "PUT", // Méthode PUT pour mettre à jour
        body: formData,
      });

      if (response.ok) {
        alert("Exercice modifié avec succès !");
        navigate("/exercices"); // Redirige vers la liste des exercices
      } else {
        alert("Erreur lors de la modification de l'exercice.");
      }
    } catch (error) {
      console.error("Erreur lors de la modification :", error);
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
          Modifier l'exercice
        </h1>
        <button
          onClick={() => navigate("/exercices")}
          className="text-lg font-semibold underline hover:text-gray-300"
        >
          Retour
        </button>
      </header>

      {/* Contenu principal */}
      <main className="flex-grow flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-lg shadow-2xl max-w-3xl w-full">
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
                className="border border-gray-300 rounded-lg p-4 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80 text-gray-800 text-lg"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-200 font-bold mb-2 text-xl">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border border-gray-300 rounded-lg p-4 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80 text-gray-800 text-lg"
                rows="4"
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
                className="border border-gray-300 rounded-lg p-4 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80 text-gray-800 text-lg"
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
                className="border border-gray-300 rounded-lg p-4 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80 text-gray-800 text-lg"
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
                className="border border-gray-300 rounded-lg p-4 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80 text-gray-800 text-lg"
                required
              />
            </div>

            {/* Bouton Soumettre */}
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

      {/* Pied de page */}
      <footer className="bg-black/70 text-white py-4 text-center">
        <p className="text-lg font-semibold">
          © 2025 Plateforme SGBD. Tous droits réservés.
        </p>
      </footer>
    </div>
  );
};

export default ModifierExercice;