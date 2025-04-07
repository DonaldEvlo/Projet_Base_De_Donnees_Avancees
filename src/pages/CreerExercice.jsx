import { useEffect, useState } from "react";
import { FaCalendarAlt, FaCommentDots, FaFileAlt, FaPen } from "react-icons/fa";
import { Link } from "react-router-dom";

const CreerExercice = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState("");
  const [deadline, setDeadline] = useState("");
  const [professeurId, setProfesseurId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // À remplacer par un vrai contexte/auth plus tard
    const currentProfesseurId = "47d74aee-bed1-41a8-a516-ead864bf66bc";
    setProfesseurId(currentProfesseurId);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !professeurId) {
      setMessage("Veuillez sélectionner un fichier et vous assurer que l'identifiant du professeur est disponible.");
      return;
    }

    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("titre", title);
    formData.append("pdf", file);
    formData.append("commentaire", comment);
    formData.append("date_limite", deadline);
    formData.append("professeur_id", professeurId);

    try {
      const response = await fetch("http://localhost:5000/exercices", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Exercice ajouté avec succès !");
        setTitle("");
        setFile(null);
        setComment("");
        setDeadline("");
      } else {
        setMessage(data.error || "Erreur lors de l'envoi.");
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
      setMessage("Erreur réseau");
    }

    setLoading(false);
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

      <main className="flex-grow flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-lg shadow-2xl max-w-3xl w-full">
          <h2 className="text-5xl font-extrabold text-gray-100 mb-6 text-center flex items-center justify-center gap-2">
            <FaPen className="text-blue-500" />
            Créer un exercice
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div>
              <label className="block text-gray-200 font-bold mb-2 text-xl">
                Ajouter un fichier
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="application/pdf"
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

            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-extrabold text-xl hover:bg-blue-700 transition duration-300"
              >
                {loading ? "Envoi..." : "Soumettre"}
              </button>
              {message && (
                <p className="mt-4 text-lg font-bold text-white">{message}</p>
              )}
            </div>
          </form>
        </div>
      </main>

      <footer className="bg-black/70 text-white py-4 text-center">
        <p className="text-lg font-semibold">
          © 2025 Plateforme SGBD. Tous droits réservés.
        </p>
      </footer>
    </div>
  );
};

export default CreerExercice;
