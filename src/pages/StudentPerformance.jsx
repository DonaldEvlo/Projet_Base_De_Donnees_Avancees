import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import {
    FaArrowLeft,
    FaBook,
    FaChartBar,
    FaChartLine,
    FaCheckCircle,
    FaExclamationTriangle,
    FaMedal,
    FaUserGraduate,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";

const StudentPerformanceDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState(null);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [user, setUser] = useState(null);
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

  
  // Vérifier l'authentification au chargement du composant
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Récupérer la session de l'utilisateur actuel
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        
        if (authError) {
          throw authError;
        }

        if (!session) {
          throw new Error("Veuillez vous connecter pour accéder à cette page");
        }

        // Récupérer les détails du professeur à partir de l'ID utilisateur
        const { data: professorData, error: professorError } = await supabase
          .from('professeurs')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (professorError) {
          throw professorError;
        }

        if (!professorData) {
          throw new Error("Profil de professeur introuvable");
        }

        setUser({
          id: professorData.id,
          userId: session.user.id,
          email: session.user.email,
          name: professorData.nom || 'Professeur'
        });

      } catch (err) {
        console.error("Erreur d'authentification:", err);
        setError("Veuillez vous connecter pour accéder à cette page");
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return; // Ne pas exécuter si l'utilisateur n'est pas connecté
      
      try {
        // Récupérer le token d'authentification
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          throw new Error("Session expirée");
        }

        // Changer l'URL par celle de votre API
        const response = await fetch('https://projet-base-de-donnees-avancees-backend.onrender.com/performance-etudiants', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}` // Envoyer le token pour l'authentification
          }
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Non autorisé: veuillez vous reconnecter");
          }
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        setPerformanceData(data);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors de la récupération des données:", err);
        setError(err.message || "Impossible de charger les données de performance");
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  // Fonction pour afficher les notifications
  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Composant pour les cartes de statistiques
  const StatCard = ({ icon, value, label, color, variants, progress }) => (
    <motion.div
      variants={variants}
      whileHover={{ scale: 1.02 }}
      className={`bg-white/70 dark:bg-gray-700/70 p-6 rounded-xl shadow-lg relative overflow-hidden hover:shadow-xl transition`}
    >
      <div className="relative z-10 flex items-center gap-4">
        <div
          className={`p-3 bg-${color}-100 dark:bg-${color}-900/30 rounded-lg`}
        >
          {icon}
        </div>
        <div>
          <h4 className="text-2xl font-bold text-gray-800 dark:text-white">
            {value}
          </h4>
          <p className="text-gray-500 dark:text-gray-300">{label}</p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 h-1 bg-gray-200 dark:bg-gray-600 w-full">
        <motion.div
          className={`h-full bg-${color}-500`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ delay: 0.5, duration: 0.8 }}
        />
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-4"
          >
            <FaChartLine className="text-5xl text-blue-500" />
          </motion.div>
          <h2 className="text-xl font-medium text-gray-700 dark:text-gray-200">
            Chargement des données...
          </h2>
        </div>
      </div>
    );
  }

  if (error && !performanceData) {
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
            onClick={() => navigate("/dashboard-prof")}
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
        {performanceData && (
          <motion.div
            key="performance"
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
                Performance des Étudiants
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

            {/* Performance stats overview */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              <StatCard
                icon={<FaChartLine className="text-2xl text-blue-500" />}
                value={`${performanceData.averageScore}/20`}
                label="Note Moyenne"
                color="blue"
                variants={itemVariants}
                progress={parseFloat(performanceData.averageScore) * 5}
              />

              <StatCard
                icon={<FaUserGraduate className="text-2xl text-green-500" />}
                value={performanceData.totalStudents}
                label="Étudiants Actifs"
                color="green"
                variants={itemVariants}
                progress={90}
              />

              <StatCard
                icon={<FaCheckCircle className="text-2xl text-indigo-500" />}
                value={`${performanceData.completionRate}%`}
                label="Taux de Complétion"
                color="indigo"
                variants={itemVariants}
                progress={performanceData.completionRate}
              />

              <StatCard
                icon={<FaChartBar className="text-2xl text-purple-500" />}
                value={performanceData.recentSubmissions}
                label="Soumissions Récentes"
                color="purple"
                variants={itemVariants}
                progress={65}
              />
            </motion.div>

            {/* Students performance detail */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Top performers */}
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="bg-white/90 dark:bg-gray-700/90 rounded-xl p-6 shadow-lg h-full hover:shadow-xl transition"
              >
                <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-4">
                  <FaMedal className="text-yellow-500" />
                  <span>Top Performances</span>
                </h3>

                <div className="space-y-4">
                  {performanceData.topPerformers.map((student, index) => (
                    <motion.div
                      key={student.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        transition: { delay: 0.5 + index * 0.1 },
                      }}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full ${
                            index === 0
                              ? "bg-yellow-500"
                              : index === 1
                              ? "bg-gray-500"
                              : "bg-orange-500"
                          } flex items-center justify-center text-white font-bold`}
                        >
                          {student.avatar}
                        </div>
                        <span className="font-medium dark:text-white">
                          {student.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-green-600 dark:text-green-400">
                          {student.score}/20
                        </span>
                        <div className="text-xs px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full font-medium">
                          {index === 0 ? "1er" : index === 1 ? "2ème" : "3ème"}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { delay: 0.8 },
                  }}
                  className="mt-6 text-center"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => showNotification('Fonctionnalité à venir!', 'info')}
                    className="px-4 py-2 bg-yellow-100 dark:bg-yellow-800/40 text-yellow-800 dark:text-yellow-200 rounded-md font-medium hover:bg-yellow-200 dark:hover:bg-yellow-700/50 transition-all"
                  >
                    Voir les performances détaillées
                  </motion.button>
                </motion.div>
              </motion.div>

              {/* Students needing help */}
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="bg-white/90 dark:bg-gray-700/90 rounded-xl p-6 shadow-lg h-full hover:shadow-xl transition"
              >
                <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-4">
                  <FaExclamationTriangle className="text-orange-500" />
                  <span>Étudiants en Difficulté</span>
                </h3>

                <div className="space-y-4">
                  {performanceData.needHelp.map((student, index) => (
                    <motion.div
                      key={student.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        transition: { delay: 0.5 + index * 0.1 },
                      }}
                      className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/30 rounded-lg border-l-4 border-red-500"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
                          {student.avatar}
                        </div>
                        <span className="font-medium dark:text-white">
                          {student.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-red-600 dark:text-red-400">
                          {student.score}/20
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                    onClick={() => showNotification('Fonctionnalité à venir!', 'info')}

                          className="text-xs px-3 py-1 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 rounded-full font-medium hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
                        >
                          Contacter
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}

                  {performanceData.needHelp.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1,
                        transition: { delay: 0.7 },
                      }}
                      className="mt-4 text-center"
                    >
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    onClick={() => showNotification('Fonctionnalité à venir!', 'info')}

                        className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-800/40 text-red-800 dark:text-red-200 rounded-md font-medium hover:bg-red-200 dark:hover:bg-red-700/50 transition-all flex items-center gap-2 mx-auto"
                      >
                        <span>Voir tous les étudiants en difficulté</span>
                        <span className="text-xs bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                          {performanceData.needHelp.length}
                        </span>
                      </motion.button>
                    </motion.div>
                  )}

                  {performanceData.needHelp.length === 0 && (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      Aucun étudiant en difficulté pour le moment.
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Courses performance */}
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="bg-white/90 dark:bg-gray-700/90 rounded-xl p-6 shadow-lg h-full hover:shadow-xl transition"
              >
                <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-4">
                  <FaBook className="text-indigo-500" />
                  <span>Performance par Exercice</span>
                </h3>

                <div className="space-y-6">
                  {performanceData.courseStats.map((course, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: { delay: 0.5 + index * 0.1 },
                      }}
                      className="space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          {course.name}
                        </span>
                        <span
                          className={`font-bold ${
                            course.averageScore >= 80
                              ? "text-green-600 dark:text-green-400"
                              : course.averageScore >= 60
                              ? "text-yellow-600 dark:text-yellow-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {course.averageScore}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                        <motion.div
                          className={`h-2.5 rounded-full ${
                            course.averageScore >= 80
                              ? "bg-green-500"
                              : course.averageScore >= 60
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          custom={course.averageScore}
                          variants={progressVariants}
                          initial="initial"
                          animate="animate"
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{course.submissions} soumissions</span>
                        <span>{course.completion}% de complétion</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { delay: 0.8 },
                  }}
                  className="mt-6 text-center"
                >
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => showNotification('Fonctionnalité à venir!', 'info')}

                    className="px-4 py-2 bg-indigo-100 dark:bg-indigo-800/40 text-indigo-800 dark:text-indigo-200 rounded-md font-medium hover:bg-indigo-200 dark:hover:bg-indigo-700/50 transition-all"
                  >
                    Rapport détaillé par Exercice
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>

            {/* View detailed report button */}
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
                whileTap={{ scale: 0.97 }}
                onClick={() => showNotification('Fonctionnalité à venir!', 'info')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
              >
                <FaChartLine />
                <span>Voir le rapport analytique complet</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
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

export default StudentPerformanceDashboard;
