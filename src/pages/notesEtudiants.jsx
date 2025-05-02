import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import {
    FaArrowDown,
    FaArrowLeft,
    FaBook,
    FaChartBar,
    FaExclamationTriangle,
    FaMedal,
    FaUserGraduate,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";

const NotesEtudiant = () => {
  const [exercices, setExercices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [notification, setNotification] = useState(null);
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
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
      transition: { type: "spring", stiffness: 100 },
    },
    exit: {
      y: -20,
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  const pageTransition = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 20, stiffness: 100 },
    },
    exit: {
      opacity: 0,
      y: -30,
      transition: { duration: 0.3 },
    },
  };

  const progressVariants = {
    initial: { width: 0 },
    animate: (value) => ({
      width: `${value}%`,
      transition: { duration: 0.8, ease: "easeOut", delay: 0.3 },
    }),
  };

  const floatingAnimation = {
    y: [0, -8, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "reverse",
    },
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (error) {
          throw new Error("Erreur lors de la récupération de l'utilisateur");
        }

        if (data?.user) {
          setUserId(data.user.id);
        } else {
          throw new Error("Utilisateur non connecté");
        }
      } catch (err) {
        console.error("Erreur d'authentification:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchExercicesEtNotes = async () => {
        try {
          // Récupérer le token d'authentification
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (!session) {
            throw new Error("Session expirée");
          }

          const response = await fetch(
            `https://projet-base-de-donnees-avancees-backend.onrender.com/etudiant/${userId}/notes`,
            {
              headers: {
                Authorization: `Bearer ${session.access_token}`,
              },
            }
          );

          const data = await response.json();

          if (response.ok) {
            setExercices(data);
          } else {
            throw new Error(
              data.message ||
                "Erreur lors de la récupération des exercices et notes"
            );
          }
        } catch (err) {
          console.error("Erreur:", err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchExercicesEtNotes();
    }
  }, [userId]);

  // Fonction pour afficher les notifications
  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Calcul des statistiques
  const calculateStats = () => {
    if (exercices.length === 0) return { moyenne: 0, max: 0, min: 0 };

    const notes = exercices
      .map((ex) => ex.note)
      .filter((note) => note !== null);
    if (notes.length === 0) return { moyenne: 0, max: 0, min: 0 };

    const sum = notes.reduce((acc, note) => acc + note, 0);
    return {
      moyenne: (sum / notes.length).toFixed(2),
      max: Math.max(...notes),
      min: Math.min(...notes),
    };
  };

  const stats = calculateStats();

  // Déterminer la performance globale
  const determinePerformance = (moyenne) => {
    if (moyenne >= 16) return { text: "Excellent", color: "green" };
    if (moyenne >= 14) return { text: "Très Bien", color: "emerald" };
    if (moyenne >= 12) return { text: "Bien", color: "blue" };
    if (moyenne >= 10) return { text: "Satisfaisant", color: "indigo" };
    if (moyenne >= 8) return { text: "Passable", color: "yellow" };
    return { text: "À améliorer", color: "red" };
  };

  const performance = determinePerformance(stats.moyenne);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-4"
          >
            <FaBook className="text-5xl text-blue-500" />
          </motion.div>
          <h2 className="text-xl font-medium text-gray-700 dark:text-gray-200">
            Chargement des exercices et notes...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="text-red-500 text-5xl mb-4">
            <FaExclamationTriangle />
          </div>
          <h2 className="text-2xl font-medium text-gray-800 dark:text-gray-200 mb-4">
            {error}
          </h2>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${darkMode ? "dark" : ""} min-h-screen flex flex-col`}
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/performance.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay avec transition */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={`absolute inset-0 ${
          darkMode ? "bg-black/60" : "bg-white/20"
        } z-0 transition-colors duration-500`}
      />

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
              notification.type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white font-bold flex items-center space-x-2`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Entête avec animation */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="relative z-10 bg-white/40 dark:bg-black/50 backdrop-blur-md py-4 px-8 flex justify-between items-center shadow-md"
      >
        <motion.h1
          className="text-2xl font-extrabold tracking-wide uppercase text-gray-900 dark:text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Plateforme SGBD
        </motion.h1>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/dashboard-etudiant")}
            className="bg-white text-center w-48 rounded-2xl h-14 relative text-black text-xl font-semibold group"
            type="button"
          >
            <div className="bg-blue-400 rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500">
              <FaArrowLeft size={20} />
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
      <motion.main
        className="relative z-10 flex-grow flex flex-col items-center justify-start py-8 px-4"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={pageTransition}
      >
        <motion.div
          key="notes"
          variants={containerVariants}
          className="bg-white/20 dark:bg-gray-800/80 backdrop-blur-lg p-10 rounded-2xl shadow-2xl w-full max-w-7xl mx-auto border border-white/20 mb-8 overflow-hidden"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: 0.2, duration: 0.6 },
            }}
            className="flex flex-col items-center mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.3,
              }}
            >
              <motion.span
                animate={floatingAnimation}
                className="text-5xl mb-3 inline-block"
              >
                <FaUserGraduate className="text-5xl text-blue-500" />
              </motion.span>
            </motion.div>

            <motion.h2
              className="text-4xl font-extrabold text-center text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  delay: 0.4,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
            >
              Mes Notes et Exercices
            </motion.h2>

            <motion.div
              className="h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded mt-4"
              initial={{ width: 0, opacity: 0 }}
              animate={{
                width: 120,
                opacity: 1,
                transition: {
                  delay: 0.6,
                  duration: 0.5,
                },
              }}
            />
          </motion.div>

          {/* Stats overview */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-white/90 dark:bg-gray-700/90 p-6 rounded-xl shadow-lg relative overflow-hidden hover:shadow-xl transition"
            >
              <div className="relative z-10 flex items-center gap-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <FaArrowDown className="text-2xl text-red-500" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {stats.min}/20
                  </h4>
                  <p className="text-gray-500 dark:text-gray-300">
                    Faible Note
                  </p>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 h-1 bg-gray-200 dark:bg-gray-600 w-full">
                <motion.div
                  className="h-full bg-red-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(stats.moyenne / 20) * 100}%` }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-white/90 dark:bg-gray-700/90 p-6 rounded-xl shadow-lg relative overflow-hidden hover:shadow-xl transition"
            >
              <div className="relative z-10 flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <FaMedal className="text-2xl text-green-500" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {stats.max}/20
                  </h4>
                  <p className="text-gray-500 dark:text-gray-300">
                    Meilleure Note
                  </p>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 h-1 bg-gray-200 dark:bg-gray-600 w-full">
                <motion.div
                  className="h-full bg-green-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(stats.max / 20) * 100}%` }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-white/90 dark:bg-gray-700/90 p-6 rounded-xl shadow-lg relative overflow-hidden hover:shadow-xl transition"
            >
              <div className="relative z-10 flex items-center gap-4">
                <div
                  className={`p-3 bg-${performance.color}-100 dark:bg-${performance.color}-900/30 rounded-lg`}
                >
                  <FaBook
                    className={`text-2xl text-${performance.color}-500`}
                  />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {performance.text}
                  </h4>
                  <p className="text-gray-500 dark:text-gray-300">
                    Performance Globale
                  </p>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 h-1 bg-gray-200 dark:bg-gray-600 w-full">
                <motion.div
                  className={`h-full bg-${performance.color}-500`}
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Notes table */}
          <motion.div
            variants={itemVariants}
            className="bg-white/90 dark:bg-gray-700/90 rounded-xl p-6 shadow-lg overflow-hidden"
          >
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <FaBook className="text-blue-500" />
              <span>Mes Exercices</span>
            </h3>

            {exercices.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center py-10 text-gray-500 dark:text-gray-400"
              >
                <FaExclamationTriangle className="text-4xl mx-auto mb-4 text-yellow-500" />
                <p className="text-lg">
                  Aucun exercice disponible pour le moment.
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="overflow-x-auto"
              >
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800 text-left">
                      <th className="py-3 px-6 rounded-tl-lg">Exercice</th>
                      <th className="py-3 px-6">Titre</th>
                      <th className="py-3 px-6 rounded-tr-lg text-center">
                        Note
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {exercices.map((item, index) => (
                      <motion.tr
                        key={item.exercice_id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: { delay: 0.1 + index * 0.05 },
                        }}
                        className={`border-b dark:border-gray-600 ${
                          index % 2 === 0
                            ? "bg-gray-50 dark:bg-gray-800/50"
                            : ""
                        } hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors`}
                      >
                        <td className="py-4 px-6">{item.exercice}</td>
                        <td className="py-4 px-6">{item.titre}</td>
                        <td className="py-4 px-6 text-center">
                          <span
                            className={`px-3 py-1 rounded-full font-medium ${
                              !item.note
                                ? "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                                : item.note >= 16
                                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                                : item.note >= 14
                                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300"
                                : item.note >= 12
                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                                : item.note >= 10
                                ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300"
                                : item.note >= 8
                                ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                                : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                            }`}
                          >
                            {item.note !== null
                              ? `${item.note}/20`
                              : "Non noté"}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
          </motion.div>

          {/* View detailed analytics button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: 0.9, duration: 0.5 },
            }}
            className="mt-8 text-center"
          >
            <motion.button
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/mes-performances")}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
            >
              <FaChartBar />
              <span>Voir mon analyse de performance détaillée</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.main>

      {/* Footer avec animation */}
      <motion.footer
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 50, damping: 20, delay: 0.2 }}
        className="relative z-10 bg-white/40 dark:bg-black/60 backdrop-blur-md text-gray-900 dark:text-white py-4 text-center"
      >
        <p className="text-lg font-semibold">
          © 2025 Plateforme SGBD. Tous droits réservés.
        </p>
      </motion.footer>
    </div>
  );
};

export default NotesEtudiant;
