import { useEffect, useState } from "react";
import { FaCalendarAlt, FaCommentDots, FaFileAlt, FaPen, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";
import { motion, AnimatePresence } from "framer-motion";

const CreerExercice = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState("");
  const [deadline, setDeadline] = useState("");
  const [professeurId, setProfesseurId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === "true";
  });
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  };

  useEffect(() => {
    const getUserId = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.log("Erreur lors de la récupération de l'utilisateur :", error);
        setMessage("Utilisateur non authentifié.");
        return;
      }
      const user = data.user;
      if (user) {
        setProfesseurId(user.id);
      } else {
        setMessage("Utilisateur non authentifié.");
      }
    };
    getUserId();
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
        
        // Afficher la notification de succès
        const notification = document.getElementById("notification");
        notification.classList.remove("hidden");
        setTimeout(() => {
          notification.classList.add("hidden");
        }, 3000);
      } else {
        setMessage(data.error || "Erreur lors de l'envoi.");
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
      setMessage("Erreur réseau");
    }
    setLoading(false);
  };

  // Variants pour les animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      boxShadow: "0px 0px 8px rgba(59, 130, 246, 0.7)",
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.95 }
  };

  return (
    <div
      className={`${darkMode ? "dark" : ""} min-h-screen flex flex-col relative overflow-hidden transition-colors duration-700`}
    >
      {/* Fond animé */}
      <div
        className={`absolute inset-0 transition-all duration-700 ease-in-out`}
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/prof.png')",
          backgroundSize: "cover",
          backgroundPosition: "center 20%",
          filter: darkMode ? "brightness(0.7) saturate(0.8)" : "brightness(1) saturate(1.1)",
        }}
      >
        {/* Particules animées pour l'arrière-plan (effet visuel) */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, index) => (
            <motion.div
              key={index}
              className="absolute rounded-full bg-blue-500 opacity-20"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: Math.random() * 0.5 + 0.5
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                transition: {
                  duration: Math.random() * 20 + 10,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "linear"
                }
              }}
              style={{
                width: `${Math.random() * 100 + 50}px`,
                height: `${Math.random() * 100 + 50}px`
              }}
            />
          ))}
        </div>
      </div>

      {/* Overlay avec transition */}
      <motion.div
        className={`absolute inset-0 ${
          darkMode ? "bg-black/60" : "bg-white/20"
        } z-0 transition-colors duration-700`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Notification de succès */}
      <div
        id="notification"
        className="fixed top-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-500 hidden"
      >
        Exercice ajouté avec succès !
      </div>

      {/* Entête animée */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/40 dark:bg-black/50 backdrop-blur-md py-4 px-8 flex justify-between items-center shadow-md z-10 relative"
      >
        <h1 className="text-2xl font-extrabold tracking-wide uppercase text-gray-900 dark:text-white">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Plateforme SGBD
          </motion.span>
        </h1>
        <div className="flex gap-3">
          {/* Bouton modifié avec une flèche devant "Retour" */}
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

          <label className="relative inline-block h-8 w-14 cursor-pointer rounded-full bg-gray-300 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-gray-900 self-center">
            <input
              className="peer sr-only"
              id="darkModeToggle"
              type="checkbox"
              checked={darkMode}
              onChange={toggleDarkMode}
            />
            <span className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-gray-300 ring-[6px] ring-inset ring-white transition-all peer-checked:start-8 peer-checked:w-2 peer-checked:bg-white peer-checked:ring-transparent"></span>
          </label>
        </div>
      </motion.header>

      {/* Contenu principal */}
      <main className="relative z-10 flex-grow flex items-center justify-center py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/20 dark:bg-gray-800/80 backdrop-blur-lg p-8 rounded-lg shadow-2xl max-w-4xl w-full"
        >
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl font-extrabold text-gray-100 mb-6 text-center flex items-center justify-center gap-2"
          >
            <motion.span
              animate={{ 
                rotate: [0, 10, -10, 10, 0],
                transition: {
                  duration: 0.5,
                  delay: 0.5
                }
              }}
            >
              <FaPen className="text-blue-500" />
            </motion.span>
            Créer un exercice
          </motion.h2>

          {/* Nouveau bouton pour la liste des exercices */}
          <motion.div
            className="mb-8 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => navigate("/exercices")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold text-lg shadow-md flex items-center gap-2 transition-all duration-300"
            >
              <FaArrowLeft className="text-xl" />
              Retour à la liste des exercices
            </motion.button>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div variants={itemVariants}>
                <label className="block text-gray-200 font-bold mb-2 text-xl">
                  Titre de l'exercice
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border border-gray-300 rounded-lg p-4 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none pl-12 bg-white/80 text-gray-800 text-lg dark:bg-gray-700 dark:text-white transition-all duration-300 group-hover:shadow-md"
                    placeholder="Entrez le titre de l'exercice"
                    required
                  />
                  <motion.div
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.2, rotate: 15 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  >
                    <FaPen className="absolute top-4 left-4 text-gray-400 text-xl transition-colors duration-300 group-hover:text-blue-500" />
                  </motion.div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-gray-200 font-bold mb-2 text-xl">
                  Ajouter un fichier
                </label>
                <div className="relative group">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="border border-gray-300 rounded-lg p-4 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none pl-12 bg-white/80 text-gray-800 text-lg dark:bg-gray-700 dark:text-white transition-all duration-300 group-hover:shadow-md"
                  />
                  <motion.div
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.2, rotate: 15 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  >
                    <FaFileAlt className="absolute top-4 left-4 text-gray-400 text-xl transition-colors duration-300 group-hover:text-blue-500" />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {file && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-sm text-gray-300 mt-2"
                    >
                      Fichier sélectionné : <span className="font-medium">{file.name}</span>
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-gray-200 font-bold mb-2 text-xl">
                  Commentaire
                </label>
                <div className="relative group">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="border border-gray-300 rounded-lg p-4 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none pl-12 bg-white/80 text-gray-800 text-lg dark:bg-gray-700 dark:text-white transition-all duration-300 group-hover:shadow-md"
                    placeholder="Ajoutez un commentaire (facultatif)"
                    rows="3"
                  />
                  <motion.div
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.2, rotate: 15 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  >
                    <FaCommentDots className="absolute top-4 left-4 text-gray-400 text-xl transition-colors duration-300 group-hover:text-blue-500" />
                  </motion.div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-gray-200 font-bold mb-2 text-xl">
                  Date limite
                </label>
                <div className="relative group">
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="border border-gray-300 rounded-lg p-4 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none pl-12 bg-white/80 text-gray-800 text-lg dark:bg-gray-700 dark:text-white transition-all duration-300 group-hover:shadow-md"
                    required
                  />
                  <motion.div
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.2, rotate: 15 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  >
                    <FaCalendarAlt className="absolute top-4 left-4 text-gray-400 text-xl transition-colors duration-300 group-hover:text-blue-500" />
                  </motion.div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="text-center">
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg font-extrabold text-xl hover:bg-blue-700 relative overflow-hidden group"
                >
                  <motion.span
                    initial={{ width: "0%" }}
                    whileHover={{ width: "100%" }}
                    className="absolute inset-0 bg-blue-400 opacity-30"
                    style={{ originX: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  {loading ? (
                    <motion.span
                      className="flex items-center justify-center gap-2"
                    >
                      <span className="loader-small"></span> Traitement...
                    </motion.span>
                  ) : (
                    "Soumettre"
                  )}
                </motion.button>
              </motion.div>
            </motion.div>
          </form>
          
          <AnimatePresence>
            {message && (
              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className={`mt-4 text-lg font-bold ${
                  message.includes("succès") ? "text-green-500" : "text-red-500"
                }`}
              >
                {message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/40 dark:bg-black/60 backdrop-blur-md text-gray-900 dark:text-white py-4 text-center relative z-10"
      >
        <p className="text-lg font-semibold">
          © 2025 Plateforme SGBD. Tous droits réservés.
        </p>
      </motion.footer>
      
      {/* Styles CSS globaux pour les animations */}
      <style jsx global>{`
        .loader {
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top: 4px solid #3498db;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        
        .loader-small {
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top: 3px solid #ffffff;
          width: 16px;
          height: 16px;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        /* Transition plus douce pour le mode sombre */
        .dark {
          transition: all 0.7s ease;
        }
      `}</style>
    </div>
  );
};

export default CreerExercice;