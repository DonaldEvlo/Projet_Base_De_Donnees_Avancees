import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
    FaChartLine,
    FaCheckCircle,
    FaChevronDown,
    FaChevronUp,
    FaTrophy,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";

const PerformanceDashboard = () => {
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === "true";
  });
  const [showDetails, setShowDetails] = useState(false);

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

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Vérifier la session Supabase
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session) {
          console.error("Erreur de session:", sessionError);
          navigate("/login"); // Rediriger vers la page de connexion
          return;
        }

        const response = await fetch("https://projet-base-de-donnees-avancees-backend.onrender.com/performances", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(
            errorData?.message || `Erreur HTTP: ${response.status}`
          );
        }

        const data = await response.json();
        setPerformanceData(data);
        showNotification(
          "Données de performance chargées avec succès!",
          "success"
        );
      } catch (err) {
        console.error(
          "Erreur lors de la récupération des performances:",
          err.message
        );
        setError(err.message);
        showNotification(`Erreur: ${err.message}`, "error");

        // Si l'erreur est liée à l'authentification, rediriger vers la page de connexion
        if (
          err.message.includes("Auth session missing") ||
          err.status === 401
        ) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, [navigate]);

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div
      className={`${darkMode ? "dark" : ""} min-h-screen flex flex-col`}
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/performance.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center 20%",
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
            {notification.type === "success" ? (
              <FaCheckCircle className="text-xl" />
            ) : (
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
            )}
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
      <motion.main
        className="relative z-10 flex-grow flex flex-col items-center justify-start py-8 px-4"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={pageTransition}
      >
        <motion.div
          className="bg-white/20 dark:bg-gray-800/80 backdrop-blur-lg p-8 rounded-lg shadow-2xl max-w-4xl w-full"
          variants={containerVariants}
        >
          <motion.h2
            className="text-5xl font-extrabold text-gray-100 mb-6 text-center flex items-center justify-center gap-2"
            variants={itemVariants}
          >
            <FaChartLine className="text-blue-500" />
            Tableau de Performances
          </motion.h2>

          {loading ? (
            <motion.div
              className="flex justify-center py-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </motion.div>
          ) : error ? (
            <motion.p
              className="text-red-500 text-center p-4 bg-red-100/30 rounded-lg"
              variants={itemVariants}
            >
              Erreur: {error}
            </motion.p>
          ) : !performanceData ? (
            <motion.p
              className="text-gray-300 text-center p-6 bg-gray-800/50 rounded-lg"
              variants={itemVariants}
            >
              Aucune donnée de performance disponible.
            </motion.p>
          ) : (
            <motion.div
              className="bg-white/90 dark:bg-gray-700 p-4 rounded-lg shadow-md flex justify-between items-center hover:shadow-xl transition"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <div>
                <p className="text-lg font-bold text-gray-800 dark:text-white">
                  Statistiques de Performance
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Note moyenne: {performanceData.averageScore}/20 | Exercices
                  complétés: {performanceData.exercisesCompleted}/
                  {performanceData.totalExercises}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDetails(!showDetails)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-600 transition flex items-center gap-2"
              >
                {showDetails ? "Masquer les détails" : "Voir les détails"}
                {showDetails ? <FaChevronUp /> : <FaChevronDown />}
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Détails de performance */}
        <AnimatePresence>
          {showDetails && performanceData && (
            <motion.div
              key="details"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={containerVariants}
              className="relative z-10 bg-white/20 dark:bg-gray-800/80 backdrop-blur-lg p-8 rounded-lg shadow-2xl max-w-4xl w-full mt-8"
            >
              <motion.h3
                variants={itemVariants}
                className="text-2xl font-bold text-gray-100 dark:text-white mb-4"
              >
                Détails de vos performances
              </motion.h3>

              {/* Cartes de statistiques */}
              <motion.div
                variants={containerVariants}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6"
              >
                {/* Carte 1: Taux de complétion */}
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white/90 dark:bg-gray-700/90 p-6 rounded-lg shadow-lg"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 mb-3 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <FaCheckCircle className="text-3xl text-blue-500" />
                    </div>
                    <h3 className="font-bold text-gray-800 dark:text-white text-center text-lg mb-2">
                      Taux de complétion
                    </h3>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 mb-3">
                      <div
                        className="bg-blue-500 h-3 rounded-full"
                        style={{ width: `${performanceData.completionRate}%` }}
                      ></div>
                    </div>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {performanceData.completionRate}%
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      {performanceData.exercisesCompleted} sur{" "}
                      {performanceData.totalExercises} exercices
                    </p>
                  </div>
                </motion.div>

                {/* Carte 2: Score moyen */}
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white/90 dark:bg-gray-700/90 p-4 sm:p-6 rounded-lg shadow-lg h-full"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 mb-3 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <FaChartLine className="text-3xl text-green-500" />
                    </div>
                    <h3 className="font-bold text-gray-800 dark:text-white text-center text-lg mb-2">
                      Note moyenne
                    </h3>
                    <div className="w-24 h-24 relative flex items-center justify-center mb-1">
                      <svg className="w-full h-full" viewBox="0 0 36 36">
                        <circle
                          cx="18"
                          cy="18"
                          r="16"
                          fill="none"
                          stroke="#e6e6e6"
                          strokeWidth="3"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="16"
                          fill="none"
                          stroke="#48bb78"
                          strokeWidth="3"
                          strokeDasharray="100"
                          strokeDashoffset={
                            100 - performanceData.averageScore * 5
                          }
                          strokeLinecap="round"
                          transform="rotate(-90 18 18)"
                        />
                      </svg>
                      <p className="absolute text-2xl font-bold text-green-600 dark:text-green-400">
                        {performanceData.averageScore}/20
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      Moyenne de tous vos exercices
                    </p>
                  </div>
                </motion.div>

                {/* Carte 3: Meilleur score */}
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white/90 dark:bg-gray-700/90 p-6 rounded-lg shadow-lg"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 mb-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                      <FaTrophy className="text-3xl text-yellow-500" />
                    </div>
                    <h3 className="font-bold text-gray-800 dark:text-white text-center text-lg mb-2">
                      Meilleure note
                    </h3>
                    <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                      {performanceData.bestScore}/20
                    </p>
                    <div className="w-full mt-3">
                      <div className="flex justify-center items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div key={`star-${star}`}>
                            <svg
                              className="w-5 h-5 text-yellow-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                      Félicitations pour cette note!
                    </p>
                  </div>
                </motion.div>

                {/* Carte 4: Progression */}
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white/90 dark:bg-gray-700/90 p-6 rounded-lg shadow-lg"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 mb-3 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-purple-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                    </div>
                    <h3 className="font-bold text-gray-800 dark:text-white text-center text-lg mb-4">
                      Progression mensuelle
                    </h3>
                    <div className="w-full h-20">
                      <div className="flex items-end justify-between h-full">
                        {performanceData.monthlyProgress &&
                        performanceData.monthlyProgress.length > 0 ? (
                          performanceData.monthlyProgress.map((item, index) => (
                            <div
                              key={`progress-${index}`}
                              className="flex flex-col items-center"
                            >
                              <div
                                className="w-5 bg-purple-500 rounded-t-sm"
                                style={{ height: `${item.score * 4}px` }}
                              />
                              <p className="text-xs mt-1 text-gray-600 dark:text-gray-300">
                                {item.month}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500 dark:text-gray-300">
                            Aucune donnée de progression disponible
                          </p>
                        )}
                      </div>
                    </div>
                    {performanceData.monthlyProgress &&
                    performanceData.monthlyProgress.length > 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-300 mt-3">
                        Evolution positive: +
                        {performanceData.monthlyProgress[
                          performanceData.monthlyProgress.length - 1
                        ].score - performanceData.monthlyProgress[0].score}
                        %
                      </p>
                    ) : null}
                  </div>
                </motion.div>
              </motion.div>

              {/* Recommandations ou statistiques supplémentaires */}
              <motion.div variants={containerVariants} className="mt-6">
                <motion.div
                  variants={itemVariants}
                  className="bg-white/90 dark:bg-gray-700 p-6 rounded-lg shadow-md"
                >
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                    Recommandations pour améliorer vos performances
                  </h3>

                  <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                    <li className="flex items-start">
                      <svg
                        className="w-5 h-5 text-blue-500 mr-2 mt-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        Concentrez-vous sur les exercices avec des notes
                        inférieures à 10/20 pour améliorer votre moyenne.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="w-5 h-5 text-blue-500 mr-2 mt-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        Essayez de compléter au moins 2 exercices par semaine
                        pour maintenir une progression constante.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="w-5 h-5 text-blue-500 mr-2 mt-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        Votre progression montre une amélioration constante,
                        continuez sur cette lancée!
                      </span>
                    </li>
                  </ul>

                  <div className="mt-6 flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowDetails(false)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition"
                    >
                      Fermer
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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

export default PerformanceDashboard;
