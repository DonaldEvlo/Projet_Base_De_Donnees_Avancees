import { useState } from "react";
import { FaFileAlt, FaCalendarAlt, FaCommentDots, FaPen } from "react-icons/fa";
import { Link } from "react-router-dom";

const CreerExercice = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Exercice créé :", {
      title,
      description,
      file,
      comment,
      deadline,
    });
    // Réinitialiser les champs après soumission
    setTitle("");
    setDescription("");
    setFile(null);
    setComment("");
    setDeadline("");
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/prof.png')",
        backgroundSize: "cover", // Assure que l'image couvre toute la page
        backgroundPosition: "center 20%", // Descend l'image pour qu'elle cadre bien
        backgroundRepeat: "no-repeat", // Empêche la répétition de l'image
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
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-lg shadow-2xl max-w-3xl w-full">
          <h2 className="text-5xl font-extrabold text-gray-100 mb-6 text-center flex items-center justify-center gap-2">
            <FaPen className="text-blue-500" />
            Créer un exercice
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Titre */}
            <div>
              <label className="block text-gray-200 font-bold mb-2 text-xl">
                Titre de l'exercice
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border border-gray-300 rounded-lg p-4 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none pl-12 bg-white/80 text-gray-800 text-lg"
                  placeholder="Entrez le titre de l'exercice"
                  required
                />
                <FaPen className="absolute top-4 left-4 text-gray-400 text-xl" />
              </div>
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
                placeholder="Entrez une description pour l'exercice"
                rows="4"
                required
              />
            </div>

            {/* Fichier */}
            <div>
              <label className="block text-gray-200 font-bold mb-2 text-xl">
                Ajouter un fichier
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="border border-gray-300 rounded-lg p-4 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80 text-gray-800 text-lg"
                />
                <FaFileAlt className="absolute top-4 left-4 text-gray-400 text-xl" />
              </div>
              {file && (
                <p className="text-sm text-gray-300 mt-2">
                  Fichier sélectionné :{" "}
                  <span className="font-medium">{file.name}</span>
                </p>
              )}
            </div>

            {/* Commentaire */}
            <div>
              <label className="block text-gray-200 font-bold mb-2 text-xl">
                Commentaire
              </label>
              <div className="relative">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="border border-gray-300 rounded-lg p-4 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80 text-gray-800 text-lg"
                  placeholder="Ajoutez un commentaire (facultatif)"
                  rows="3"
                />
                <FaCommentDots className="absolute top-4 left-4 text-gray-400 text-xl" />
              </div>
            </div>

            {/* Date limite */}
            <div>
              <label className="block text-gray-200 font-bold mb-2 text-xl">
                Date limite
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="border border-gray-300 rounded-lg p-4 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80 text-gray-800 text-lg"
                  required
                />
                <FaCalendarAlt className="absolute top-4 left-4 text-gray-400 text-xl" />
              </div>
            </div>

            {/* Bouton Soumettre */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-extrabold text-xl hover:bg-blue-700 transition duration-300"
              >
                Soumettre
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

export default CreerExercice;