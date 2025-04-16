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
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !sessionData.session) {
          throw new Error("Utilisateur non authentifié.");
        }

        const token = sessionData.session.access_token;

        const response = await fetch("http://localhost:5000/mes-exercices", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
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
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cet exercice ?");
    if (!confirmDelete) return;

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      const response = await fetch(`http://localhost:5000/exercices/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Animation de suppression
        setExercises(exercises.filter((exercise) => exercise.id !== id));
        
        // Notification de succès animée
        const notification = document.createElement("div");
        notification.className = "fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50";
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
    ? exercises.filter(ex => 
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
        staggerChildren: 0.1
      }
    }
  };

  const exerciseVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    },
    exit: { 
      scale: 0.8, 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  const headerVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        delay: 0.2 
      }
    }
  };

  return (
    <div
      className={`${darkMode ? "dark" : ""} min-h-screen flex flex-col transition-colors duration-500`}
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
            className="text-lg font-semibold underline text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
          >
            Retour
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-semibold transition"
          >
            {darkMode ? "☀️ Mode Clair" : "🌙 Mode Sombre"}
          </motion.button>
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
              <p className="text-gray-300 text-xl mb-4">Aucun exercice disponible.</p>
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
                    whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                  >
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                      {exercise.titre || "Exercice"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
                      {exercise.commentaire?.substring(0, 60) || "Pas de description"}...
                    </p>
                    <div className="flex gap-4">
                      {/* Modifier */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/edit-exercise/${exercise.id}`)}
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