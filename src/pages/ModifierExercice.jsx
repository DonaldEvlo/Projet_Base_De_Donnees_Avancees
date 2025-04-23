import { useEffect, useState } from "react";
import { FaPen, FaArrowLeft, FaSun, FaMoon, FaCheck } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import supabase from "../../supabaseClient";

const ModifierExercice = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [comment, setComment] = useState("");
  const [deadline, setDeadline] = useState("");
  const [professeurId, setProfesseurId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === "true";
  });

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.2)" },
    tap: { scale: 0.95 },
  };

  // Récupération des données de l'exercice
  useEffect(() => {
    const fetchExercise = async () => {
      setLoading(true);
      try {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();
        if (sessionError || !sessionData.session) {
          throw new Error("Utilisateur non authentifié.");
        }

        const token = sessionData.session.access_token;

        const response = await fetch(`http://localhost:5000/exercices/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
        if (data.fichier_nom) {
          setFileName(data.fichier_nom);
        }
      } catch (err) {
        console.error("Erreur :", err);
        setError("Impossible de charger l'exercice.");
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [id]);

  // Gestion du fichier
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  // Soumettre les modifications
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

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
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/exercices");
        }, 2000);
      } else {
        const data = await response.json();
        throw new Error(data.error || "Erreur inconnue");
      }
    } catch (err) {
      console.error("Erreur :", err);
      setError(err.message || "Une erreur s'est produite.");
    } finally {
      setSaving(false);
    }
  };

  if (error) {
    return (
      <div
        className={`${
          darkMode ? "dark" : ""
        } min-h-screen flex flex-col items-center justify-center`}
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/prof.png')",
          backgroundSize: "cover",
          backgroundPosition: "center 20%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center text-red-500 text-xl font-bold p-10 bg-white/20 dark:bg-gray-800/80 backdrop-blur-lg rounded-lg shadow-lg"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-6xl mb-4"
          >
            ⚠️
          </motion.div>
          {error}
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => navigate("/exercices")}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Retourner aux exercices
          </motion.button>
        </motion.div>
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
      {/* Overlay avec transition */}
      <motion.div
        initial={false}
        animate={{
          backgroundColor: darkMode
            ? "rgba(0, 0, 0, 0.6)"
            : "rgba(255, 255, 255, 0.2)",
        }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 z-0"
      />

      {/* Entête avec animation */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="relative z-10 bg-white/40 dark:bg-black/50 backdrop-blur-md py-4 px-8 flex justify-between items-center shadow-md"
      >
        <h1 className="text-2xl font-extrabold tracking-wide uppercase text-gray-900 dark:text-white">
          PLATEFORME SGBD
        </h1>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/exercices")}
            className="bg-white text-center w-48 rounded-2xl h-14 relative text-black text-xl font-semibold group"
            type="button"
          >
            <div className="bg-green-400 rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1024 1024"
                height="25px"
                width="25px"
              >
                <path
                  d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
                  fill="#000000"
                ></path>
                <path
                  d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
                  fill="#000000"
                ></path>
              </svg>
            </div>
            <p className="translate-x-2">Go Back</p>
          </motion.button>
          <label className="relative inline-flex items-center cursor-pointer self-center">
            <input
              className="sr-only peer"
              id="darkModeToggle"
              type="checkbox"
              checked={darkMode}
              onChange={toggleDarkMode}
            />
            <div
              className={`relative w-14 h-8 rounded-full transition-colors duration-300 flex items-center ${
                darkMode ? "bg-gray-800" : "bg-blue-200"
              }`}
            >
              <div
                className={`absolute size-6 flex items-center justify-center rounded-full transition-all duration-300 ${
                  darkMode
                    ? "translate-x-7 bg-gray-900"
                    : "translate-x-1 bg-yellow-300"
                }`}
              >
                {darkMode ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-white"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-yellow-600"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2" />
                    <path d="M12 20v2" />
                    <path d="m4.93 4.93 1.41 1.41" />
                    <path d="m17.66 17.66 1.41 1.41" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                    <path d="m6.34 17.66-1.41 1.41" />
                    <path d="m19.07 4.93-1.41 1.41" />
                  </svg>
                )}
              </div>
            </div>
          </label>
        </div>
      </motion.header>

      {/* Contenu principal avec animations */}
      <main className="relative z-10 flex-grow flex items-center justify-center py-8 px-4">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mb-4"
              />
              <p className="text-xl font-semibold text-white">
                Chargement de l'exercice...
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white/20 dark:bg-gray-800/80 backdrop-blur-lg p-8 rounded-lg shadow-2xl max-w-3xl w-full"
            >
              <motion.div variants={itemVariants} className="text-center mb-6">
                <h2 className="text-5xl font-extrabold text-gray-100 flex items-center justify-center gap-2">
                  <FaPen className="text-blue-500" />
                  Modifier l'exercice
                </h2>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Titre */}
                <motion.div variants={itemVariants}>
                  <label className="block text-gray-200 font-bold mb-2 text-xl">
                    Titre de l'exercice
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border border-gray-300 rounded-lg p-4 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80 dark:bg-gray-700/90 text-gray-800 dark:text-white text-lg"
                    required
                  />
                </motion.div>

                {/* Fichier */}
                <motion.div variants={itemVariants}>
                  <label className="block text-gray-200 font-bold mb-2 text-xl">
                    Ajouter un fichier
                  </label>
                  <div className="relative">
                    <motion.input
                      type="file"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                    />
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="border border-gray-300 rounded-lg p-4 w-full bg-white/80 dark:bg-gray-700/90 text-gray-800 dark:text-white text-lg flex items-center justify-between"
                    >
                      <span className={fileName ? "" : "text-gray-500"}>
                        {fileName || "Sélectionner un fichier..."}
                      </span>
                      <button
                        type="button"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Parcourir
                      </button>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Commentaire */}
                <motion.div variants={itemVariants}>
                  <label className="block text-gray-200 font-bold mb-2 text-xl">
                    Commentaire
                  </label>
                  <motion.textarea
                    whileFocus={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="border border-gray-300 rounded-lg p-4 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80 dark:bg-gray-700/90 text-gray-800 dark:text-white text-lg"
                    rows="3"
                  />
                </motion.div>

                {/* Date limite */}
                <motion.div variants={itemVariants}>
                  <label className="block text-gray-200 font-bold mb-2 text-xl">
                    Date limite
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="border border-gray-300 rounded-lg p-4 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80 dark:bg-gray-700/90 text-gray-800 dark:text-white text-lg"
                    required
                  />
                </motion.div>

                {/* Bouton avec animation de chargement et succès */}
                <motion.div
                  variants={itemVariants}
                  className="text-center pt-4"
                >
                  <AnimatePresence mode="wait">
                    {success ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center gap-2"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            damping: 10,
                            stiffness: 200,
                          }}
                          className="bg-green-100 dark:bg-green-800 rounded-full p-2"
                        >
                          <FaCheck className="text-3xl text-green-600 dark:text-green-200" />
                        </motion.div>
                        <p className="text-xl font-bold text-green-600 dark:text-green-200">
                          Modifications enregistrées !
                        </p>
                        <p className="text-gray-200">Redirection en cours...</p>
                      </motion.div>
                    ) : (
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        type="submit"
                        disabled={saving}
                        className={`px-8 py-4 rounded-lg font-extrabold text-xl transition duration-300 
                          ${
                            saving
                              ? "bg-gray-500 cursor-not-allowed"
                              : "bg-blue-600 hover:bg-blue-700"
                          } text-white`}
                      >
                        {saving ? (
                          <div className="flex items-center justify-center gap-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                repeat: Infinity,
                                duration: 1,
                                ease: "linear",
                              }}
                              className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                            />
                            <span>Enregistrement...</span>
                          </div>
                        ) : (
                          "Modifier"
                        )}
                      </motion.button>
                    )}
                  </AnimatePresence>
                </motion.div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer avec animation */}
      <motion.footer
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 15 }}
        className="relative z-10 bg-white/40 dark:bg-black/60 backdrop-blur-md text-gray-900 dark:text-white py-4 text-center"
      >
        <p className="text-lg font-semibold">
          © 2025 Plateforme SGBD. Tous droits réservés.
        </p>
      </motion.footer>
    </div>
  );
};

export default ModifierExercice;
