import { useEffect, useState } from "react";
import { FaEdit, FaTasks, FaTrashAlt, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";
import { motion, AnimatePresence } from "framer-motion";

const ListeExercices = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
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

  // Récupérer les exercices publiés du professeur
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();
        if (sessionError || !sessionData.session) {
          throw new Error("Utilisateur non authentifié.");
        }

        const token = sessionData.session.access_token;

        const response = await fetch("http://localhost:5000/mes-exercices", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
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

    fetchExercises();
  }, []);

  // Supprimer un exercice
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer cet exercice ?"
    );
    if (!confirmDelete) return;

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      const response = await fetch(`http://localhost:5000/exercices/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Animation de suppression
        setExercises(exercises.filter((exercise) => exercise.id !== id));

        // Notification de succès animée
        const notification = document.createElement("div");
        notification.className =
          "fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50";
        notification.textContent = "Exercice supprimé avec succès !";
        document.body.appendChild(notification);

        setTimeout(() => {
          notification.style.opacity = "0";
          notification.style.transition = "opacity 0.5s ease";
          setTimeout(() => document.body.removeChild(notification), 500);
        }, 2000);
      } else {
        alert("Erreur lors de la suppression de l'exercice.");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  // Filtrer les exercices en fonction du terme de recherche
  const filteredExercises = searchTerm
    ? exercises.filter(
        (ex) =>
          ex.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ex.commentaire?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : exercises;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const exerciseVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const headerVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        delay: 0.2,
      },
    },
  };

  return (
    <div
      className={`${
        darkMode ? "dark" : ""
      } min-h-screen flex flex-col transition-colors duration-500`}
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/prof.png')",
        backgroundSize: "cover",
        backgroundPosition: "center 20%",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay avec animation de fondu */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className={`absolute inset-0 ${
          darkMode ? "bg-black/60" : "bg-white/20"
        } z-0 transition-colors duration-500`}
      />

      {/* Entête avec animation */}
      <motion.header
        initial="hidden"
        animate="visible"
        variants={headerVariants}
        className="relative z-10 bg-white/40 dark:bg-black/50 backdrop-blur-md py-4 px-8 flex justify-between items-center shadow-lg"
      >
        <motion.h1
          className="text-2xl font-extrabold tracking-wide uppercase text-gray-900 dark:text-white"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          Plateforme SGBD
        </motion.h1>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/dashboard-prof")}
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/20 dark:bg-gray-800/80 backdrop-blur-lg p-8 rounded-lg shadow-2xl max-w-4xl w-full"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.h2
              className="text-5xl font-extrabold text-gray-100 mb-6 text-center flex items-center justify-center gap-2"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              >
                <FaTasks className="text-green-500" />
              </motion.div>
              Liste des Exercices
            </motion.h2>
          </motion.div>

          {/* Barre de recherche animée */}
          <motion.div
            initial={{ opacity: 0, width: "80%" }}
            animate={{ opacity: 1, width: "100%" }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mb-6"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un exercice..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/80 dark:bg-gray-700/70 text-gray-800 dark:text-white placeholder-gray-500 
                border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full"
                onClick={() => navigate("/create-exercise")}
              >
                <FaPlus />
              </motion.button>
            </div>
          </motion.div>

          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center items-center h-40"
            >
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </motion.div>
          ) : error ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-center p-4 bg-red-100 dark:bg-red-900/30 rounded-lg"
            >
              Erreur: {error}
            </motion.p>
          ) : exercises.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center p-8"
            >
              <p className="text-gray-300 text-xl mb-4">
                Aucun exercice disponible.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/create-exercise")}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition flex items-center gap-2 mx-auto"
              >
                <FaPlus /> Créer un exercice
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <AnimatePresence>
                {filteredExercises.map((exercise) => (
                  <motion.div
                    key={exercise.id}
                    variants={exerciseVariants}
                    exit="exit"
                    layout
                    className="bg-white/90 dark:bg-gray-700 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center hover:shadow-xl transition"
                    whileHover={{
                      y: -5,
                      boxShadow:
                        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    }}
                  >
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                      {exercise.titre || "Exercice"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
                      {exercise.commentaire?.substring(0, 60) ||
                        "Pas de description"}
                      ...
                    </p>
                    <div className="flex gap-4">
                      {/* Modifier */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          navigate(`/edit-exercise/${exercise.id}`)
                        }
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-yellow-600 transition flex items-center gap-2"
                      >
                        <FaEdit />
                        Modifier
                      </motion.button>
                      {/* Supprimer */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(exercise.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition flex items-center gap-2"
                      >
                        <FaTrashAlt />
                        Supprimer
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>
      </main>

      {/* Footer avec animation */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="relative z-10 bg-white/40 dark:bg-black/60 backdrop-blur-md text-gray-900 dark:text-white py-4 text-center"
      >
        <p className="text-lg font-semibold">
          © 2025 Plateforme SGBD. Tous droits réservés.
        </p>
      </motion.footer>
    </div>
  );
};

export default ListeExercices;
