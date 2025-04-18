import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  FaArrowRight,
  FaFileAlt,
  FaLaptopCode,
  FaSearch,
  FaChartLine,
  FaCheckCircle,
  FaTrophy,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "../../backend/services/authServices";

const DashboardEtudiant = () => {
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === "true";
  });
  // Ajout d'un état pour les données de performance
  const [performanceData, setPerformanceData] = useState(null);
  const [loadingPerformance, setLoadingPerformance] = useState(true);

  const searchInputRef = useRef(null);
  const headerRef = useRef(null);

  // Motion values for parallax effects
  const scrollY = useMotionValue(0);
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.8]);
  const headerBlur = useTransform(scrollY, [0, 100], [0, 8]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  };

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/exercices");
        if (!response.ok)
          throw new Error("Erreur lors de la récupération des exercices");
        const data = await response.json();
        setExercises(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();

    // Ajouter la récupération des données de performance
    const fetchPerformanceData = async () => {
      try {
        setLoadingPerformance(true);
        // Remplacer par l'endpoint réel pour récupérer les performances
        const response = await fetch("http://localhost:5000/performances");
        if (!response.ok)
          throw new Error("Erreur lors de la récupération des performances");
        const data = await response.json();
        setPerformanceData(data);
      } catch (err) {
        console.error("Erreur performances:", err.message);
        // Données de test au cas où l'API n'est pas disponible
        setPerformanceData({
          completionRate: 75,
          averageScore: 82,
          bestScore: 95,
          exercisesCompleted: 12,
          totalExercises: 16,
          recentSubmissions: [
            {
              id: 1,
              exerciceId: 101,
              titre: "Requêtes SQL Basiques",
              score: 85,
              date: "2025-04-10",
            },
            {
              id: 2,
              exerciceId: 102,
              titre: "Jointures SQL",
              score: 92,
              date: "2025-04-12",
            },
            {
              id: 3,
              exerciceId: 103,
              titre: "Fonctions d'agrégation",
              score: 78,
              date: "2025-04-15",
            },
          ],
          monthlyProgress: [
            { month: "Jan", score: 65 },
            { month: "Fév", score: 70 },
            { month: "Mar", score: 75 },
            { month: "Avr", score: 82 },
          ],
          skillsRadar: [
            { skill: "SQL Basique", value: 90 },
            { skill: "Jointures", value: 85 },
            { skill: "Agrégation", value: 75 },
            { skill: "Optimisation", value: 60 },
            { skill: "Normalisation", value: 70 },
          ],
        });
      } finally {
        setLoadingPerformance(false);
      }
    };
    fetchPerformanceData();
  }, []);

  useEffect(() => {
    // Focus search input after page loads with animated cursor effect
    const timer = setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 1200);

    // Handle scroll events for parallax
    const handleScroll = () => {
      scrollY.set(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollY]);

  const filteredExercises = exercises.filter((exercise) =>
    exercise.titre
      ? exercise.titre.toLowerCase().includes(searchTerm.toLowerCase())
      : String(exercise.id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = async () => {
    try {
      console.log("Déconnexion en cours...");
      await signOut(); // 🔐 Déconnexion Supabase (ou autre)
      setUser(null); // 🧠 Déconnexion côté client
      console.log("Déconnexion réussie !");

      setIsLoaded(false); // 🎞️ Lance l'animation de sortie
      setTimeout(() => {
        navigate("/"); // 🚀 Redirection après animation
      }, 500);
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error.message);
    }
  };

  // Enhanced animation variants
  const pageTransition = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.6, ease: "easeInOut" },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.08,
        delayChildren: 0.3,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 15,
      },
    },
    exit: {
      y: -20,
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    hover: {
      y: -8,
      scale: 1.04,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
  };

  const buttonVariants = {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)",
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  };

  const searchVariants = {
    initial: { width: "80%", opacity: 0 },
    animate: {
      width: "100%",
      opacity: 1,
      transition: { delay: 0.5, duration: 0.8, ease: "easeOut" },
    },
    focus: {
      boxShadow: "0 0 0 4px rgba(59, 130, 246, 0.5)",
      scale: 1.02,
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
  };

  const loadingCircleVariants = {
    initial: { opacity: 0, rotate: 0 },
    animate: {
      opacity: 1,
      rotate: 360,
      transition: {
        rotate: { duration: 1, ease: "linear", repeat: Infinity },
        opacity: { duration: 0.3 },
      },
    },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const headerTextVariants = {
    initial: { opacity: 0, y: -20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.4,
        duration: 0.6,
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const floatingAnimation = {
    y: [-5, 5],
    transition: {
      y: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    },
  };

  // Card hover effects
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 20,
      },
    },
    hover: {
      y: -12,
      scale: 1.05,
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
  };

  // Nouvelles animations pour la section performance
  const performanceCardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 20,
      },
    },
    hover: {
      y: -8,
      scale: 1.03,
      boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
  };

  const progressBarVariants = {
    hidden: { width: 0 },
    visible: (width) => ({
      width: `${width}%`,
      transition: {
        duration: 1.2,
        ease: "easeOut",
        delay: 0.3,
      },
    }),
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className={`${darkMode ? "dark" : ""} min-h-screen flex flex-col`}
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/etudiant.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Animated particles background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence>
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              initial={{
                opacity: 0.3,
                scale: Math.random() * 0.5 + 0.5,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                opacity: [0.2, 0.5, 0.2],
                y: [
                  Math.random() * window.innerHeight,
                  Math.random() * window.innerHeight - 200,
                  Math.random() * window.innerHeight,
                ],
                x: [
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth + 100,
                  Math.random() * window.innerWidth,
                ],
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
              className={`absolute w-2 h-2 rounded-full ${
                darkMode ? "bg-blue-400" : "bg-white"
              }`}
              style={{ filter: "blur(1px)" }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Background overlay with transition */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          backgroundColor: darkMode
            ? "rgba(0, 0, 0, 0.75)"
            : "rgba(0, 0, 0, 0.5)",
        }}
        transition={{ duration: 1 }}
        className="absolute inset-0 z-0"
      />

      {/* Header with parallax effect */}
      <motion.header
        ref={headerRef}
        style={{
          opacity: headerOpacity,
          backdropFilter: `blur(${headerBlur.get()}px)`,
        }}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
        className="sticky top-0 z-50 bg-white/40 dark:bg-black/50 py-4 px-8 flex justify-between items-center shadow-lg"
      >
        <motion.h1
          variants={headerTextVariants}
          className="text-2xl font-extrabold tracking-wide uppercase text-gray-900 dark:text-white flex items-center gap-2"
        >
          <motion.div animate={floatingAnimation}>
            <FaLaptopCode className="text-blue-500 text-3xl" />
          </motion.div>
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: { delay: 0.5, duration: 0.5 },
            }}
          >
            Plateforme SGBD
          </motion.span>
        </motion.h1>

        <div className="flex gap-3">
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
          <motion.button
            variants={buttonVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
            transition={{ delay: 0.8 }}
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-semibold transition"
          >
            Déconnexion
          </motion.button>
        </div>
      </motion.header>

      {/* Main content */}
      <main className="relative z-10 flex-grow flex flex-col items-center py-8 px-4 md:px-6 lg:px-8 container mx-auto">
        {/* Search bar with animated reveal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            delay: 0.9,
          }}
          className="w-full max-w-xl mb-12 relative"
        >
          <motion.div
            className="relative"
            variants={searchVariants}
            initial="initial"
            animate="animate"
          >
            <motion.input
              ref={searchInputRef}
              variants={searchVariants}
              whileFocus="focus"
              type="text"
              placeholder="Rechercher un exercice..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-lg bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xl transition-all"
            />
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.3, type: "spring", stiffness: 300 }}
              className="absolute top-3.5 left-4"
            >
              <FaSearch className="text-gray-400 dark:text-gray-300 text-lg" />
            </motion.div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.4, duration: 0.8, ease: "easeOut" }}
              className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 origin-left"
            />
          </motion.div>

          {/* Animated search indicator */}
          {searchTerm && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="absolute right-4 -bottom-6 text-sm text-white font-medium"
            >
              <span className="flex items-center gap-1">
                <span>Recherche en cours</span>
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ...
                </motion.span>
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* NOUVELLE SECTION: Dashboard de Performance */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 20, delay: 0.2 }}
          className="w-full max-w-6xl mb-12 px-4 mx-auto" // Ajout de px-4 et mx-auto
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white/20 dark:bg-gray-800/80 backdrop-blur-lg p-4 sm:p-6 lg:p-8 rounded-xl shadow-2xl overflow-hidden" // Ajout de padding responsive et overflow-hidden
          >
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
              className="text-3xl md:text-4xl font-extrabold text-gray-100 mb-8 text-center flex items-center justify-center gap-3"
            >
              <motion.div animate={floatingAnimation}>
                <FaChartLine className="text-blue-500" />
              </motion.div>
              <span>Vos Performances</span>
            </motion.h2>

            {/* Loading state pour les performances */}
            <AnimatePresence mode="wait">
              {loadingPerformance && (
                <motion.div
                  key="loading-performance"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center py-12"
                >
                  <div className="relative w-16 h-16 mb-6">
                    <motion.div
                      variants={loadingCircleVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="absolute inset-0 border-4 border-t-blue-500 border-r-blue-400 border-b-blue-300 border-l-transparent rounded-full"
                    />
                  </div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.3 } }}
                    className="text-center text-lg text-gray-100 font-medium flex items-center"
                  >
                    <span>Chargement de vos performances</span>
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      ...
                    </motion.span>
                  </motion.p>
                </motion.div>
              )}

              {/* Contenu des performances */}
              {!loadingPerformance && performanceData && (
                <motion.div
                  key="performance-content"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {/* Cartes de statistiques */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
                    {/* Carte 1: Taux de complétion */}
                    <motion.div
                      variants={performanceCardVariants}
                      whileHover="hover"
                      className="bg-white/90 dark:bg-gray-700/90 p-6 rounded-lg shadow-lg"
                    >
                      <div className="flex flex-col items-center">
                        <motion.div
                          className="w-16 h-16 mb-3 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"
                          animate={floatingAnimation}
                        >
                          <FaCheckCircle className="text-3xl text-blue-500" />
                        </motion.div>
                        <h3 className="font-bold text-gray-800 dark:text-white text-center text-lg mb-2">
                          Taux de complétion
                        </h3>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 mb-3">
                          <motion.div
                            custom={performanceData.completionRate}
                            variants={progressBarVariants}
                            initial="hidden"
                            animate="visible"
                            className="bg-blue-500 h-3 rounded-full"
                          ></motion.div>
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
                      variants={performanceCardVariants}
                      whileHover="hover"
                      className="bg-white/90 dark:bg-gray-700/90 p-4 sm:p-6 rounded-lg shadow-lg h-full" // Padding responsive et h-full
                    >
                      <div className="flex flex-col items-center">
                        <motion.div
                          className="w-16 h-16 mb-3 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
                          animate={floatingAnimation}
                        >
                          <FaChartLine className="text-3xl text-green-500" />
                        </motion.div>
                        <h3 className="font-bold text-gray-800 dark:text-white text-center text-lg mb-2">
                          Score moyen
                        </h3>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            delay: 0.5,
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                          }}
                          className="w-24 h-24 relative flex items-center justify-center mb-1"
                        >
                          <svg className="w-full h-full" viewBox="0 0 36 36">
                            <circle
                              cx="18"
                              cy="18"
                              r="16"
                              fill="none"
                              stroke="#e6e6e6"
                              strokeWidth="3"
                            />
                            <motion.circle
                              cx="18"
                              cy="18"
                              r="16"
                              fill="none"
                              stroke="#48bb78"
                              strokeWidth="3"
                              strokeDasharray="100"
                              strokeDashoffset="25"
                              strokeLinecap="round"
                              initial={{ strokeDashoffset: 100 }}
                              animate={{
                                strokeDashoffset:
                                  100 - performanceData.averageScore,
                              }}
                              transition={{ duration: 1.5, delay: 0.6 }}
                              transform="rotate(-90 18 18)"
                            />
                          </svg>
                          <p className="absolute text-2xl font-bold text-green-600 dark:text-green-400">
                            {performanceData.averageScore}/100
                          </p>
                        </motion.div>
                        <p className="text-sm text-gray-500 dark:text-gray-300">
                          Moyenne de tous vos exercices
                        </p>
                      </div>
                    </motion.div>

                    {/* Carte 3: Meilleur score */}
                    <motion.div
                      variants={performanceCardVariants}
                      whileHover="hover"
                      className="bg-white/90 dark:bg-gray-700/90 p-6 rounded-lg shadow-lg"
                    >
                      <div className="flex flex-col items-center">
                        <motion.div
                          className="w-16 h-16 mb-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center"
                          animate={floatingAnimation}
                        >
                          <FaTrophy className="text-3xl text-yellow-500" />
                        </motion.div>
                        <h3 className="font-bold text-gray-800 dark:text-white text-center text-lg mb-2">
                          Meilleur score
                        </h3>
                        <motion.p
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{
                            delay: 0.7,
                            type: "spring",
                            stiffness: 300,
                            damping: 15,
                          }}
                          className="text-3xl font-bold text-yellow-600 dark:text-yellow-400"
                        >
                          {performanceData.bestScore}/100
                        </motion.p>
                        <div className="w-full mt-3">
                          <div className="flex justify-center items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <motion.div
                                key={`star-${star}`}
                                initial={{ scale: 0, rotate: -30 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{
                                  delay: 0.8 + star * 0.1,
                                  type: "spring",
                                }}
                              >
                                <svg
                                  className="w-5 h-5 text-yellow-400"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                          Félicitations pour ce score!
                        </p>
                      </div>
                    </motion.div>

                    {/* Carte 4: Progression */}
                    <motion.div
                      variants={performanceCardVariants}
                      whileHover="hover"
                      className="bg-white/90 dark:bg-gray-700/90 p-6 rounded-lg shadow-lg"
                    >
                      <div className="flex flex-col items-center">
                        <motion.div
                          className="w-16 h-16 mb-3 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center"
                          animate={floatingAnimation}
                        >
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
                        </motion.div>
                        <h3 className="font-bold text-gray-800 dark:text-white text-center text-lg mb-4">
                          Progression mensuelle
                        </h3>
                        <div className="w-full h-20">
                          <div className="flex items-end justify-between h-full">
                            {performanceData.monthlyProgress.map(
                              (item, index) => (
                                <div
                                  key={`progress-${index}`}
                                  className="flex flex-col items-center"
                                >
                                  <motion.div
                                    initial={{ height: 0 }}
                                    animate={{
                                      height: `${item.score * 0.2}px`,
                                    }}
                                    transition={{
                                      delay: 0.8 + index * 0.15,
                                      duration: 0.8,
                                      ease: "easeOut",
                                    }}
                                    className="w-5 bg-purple-500 rounded-t-sm"
                                  />
                                  <p className="text-xs mt-1 text-gray-600 dark:text-gray-300">
                                    {item.month}
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-300 mt-3">
                          Evolution positive: +
                          {performanceData.monthlyProgress[
                            performanceData.monthlyProgress.length - 1
                          ].score - performanceData.monthlyProgress[0].score}
                          %
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Graphique principal et soumissions récentes */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Graphique radar des compétences */}
                    <motion.div
                      variants={performanceCardVariants}
                      whileHover="hover"
                      className="lg:col-span-2 bg-white/90 dark:bg-gray-700/90 p-6 rounded-lg shadow-lg"
                    >
                      <h3 className="font-bold text-gray-800 dark:text-white text-center text-xl mb-6">
                        Vos compétences par domaine
                      </h3>

                      {/* Représentation visuelle du radar des compétences */}
                      <div className="relative h-64 w-full">
                        <div className="absolute inset-0 flex items-center justify-center">
                          {/* Cercles concentriques */}
                          {[0.2, 0.4, 0.6, 0.8, 1].map((radius, idx) => (
                            <motion.div
                              key={`circle-${idx}`}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 0.2 }}
                              transition={{
                                delay: 0.5 + idx * 0.1,
                                duration: 0.5,
                              }}
                              className="absolute border border-gray-400 dark:border-gray-500 rounded-full"
                              style={{
                                width: `${radius * 100}%`,
                                height: `${radius * 100}%`,
                              }}
                            />
                          ))}

                          {/* Lignes de division */}
                          {performanceData.skillsRadar.map((skill, idx) => {
                            const angle =
                              (idx * 2 * Math.PI) /
                              performanceData.skillsRadar.length;
                            return (
                              <motion.div
                                key={`line-${idx}`}
                                initial={{ scaleY: 0, opacity: 0 }}
                                animate={{ scaleY: 1, opacity: 0.2 }}
                                transition={{
                                  delay: 0.8 + idx * 0.1,
                                  duration: 0.5,
                                }}
                                className="absolute top-1/2 left-1/2 origin-bottom h-1/2 border-l border-gray-400 dark:border-gray-500"
                                style={{
                                  transformOrigin: "bottom center",
                                  transform: `rotate(${angle}rad) translateX(-50%)`,
                                }}
                              />
                            );
                          })}

                          {/* Points des compétences */}
                          <svg
                            className="absolute inset-0"
                            viewBox="-50 -50 100 100"
                          >
                            <motion.polygon
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 0.7 }}
                              transition={{ delay: 1.2, duration: 0.8 }}
                              points={performanceData.skillsRadar
                                .map((skill, idx) => {
                                  const angle =
                                    (idx * 2 * Math.PI) /
                                    performanceData.skillsRadar.length;
                                  const radius = (skill.value / 100) * 40; // 40 est le rayon maximum
                                  return `${radius * Math.sin(angle)},${
                                    -radius * Math.cos(angle)
                                  }`;
                                })
                                .join(" ")}
                              fill="rgba(59, 130, 246, 0.5)"
                              stroke="#3b82f6"
                              strokeWidth="2"
                            />

                            {performanceData.skillsRadar.map((skill, idx) => {
                              const angle =
                                (idx * 2 * Math.PI) /
                                performanceData.skillsRadar.length;
                              const radius = (skill.value / 100) * 40;
                              return (
                                <motion.circle
                                  key={`point-${idx}`}
                                  initial={{ r: 0 }}
                                  animate={{ r: 3 }}
                                  transition={{
                                    delay: 1.3 + idx * 0.1,
                                    duration: 0.3,
                                  }}
                                  cx={radius * Math.sin(angle)}
                                  cy={-radius * Math.cos(angle)}
                                  fill="#3b82f6"
                                  stroke="#fff"
                                  strokeWidth="2"
                                />
                              );
                            })}
                          </svg>
                        </div>

                        {/* Légendes des compétences */}
                        {performanceData.skillsRadar.map((skill, idx) => {
                          const angle =
                            (idx * 2 * Math.PI) /
                            performanceData.skillsRadar.length;
                          const radius = 48; // Position des étiquettes
                          const x = radius * Math.sin(angle);
                          const y = -radius * Math.cos(angle);
                          return (
                            <motion.div
                              key={`label-${idx}`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 1.5 + idx * 0.1 }}
                              className="absolute text-xs font-medium text-gray-700 dark:text-gray-300 transform -translate-x-1/2 -translate-y-1/2"
                              style={{
                                left: `calc(50% + ${x}px)`,
                                top: `calc(50% + ${y}px)`,
                              }}
                            >
                              {skill.skill}
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>

                    {/* Liste des soumissions récentes */}
                    <motion.div
                      variants={performanceCardVariants}
                      whileHover="hover"
                      className="bg-white/90 dark:bg-gray-700/90 p-6 rounded-lg shadow-lg"
                    >
                      <h3 className="font-bold text-gray-800 dark:text-white text-center text-xl mb-6">
                        Soumissions récentes
                      </h3>

                      <div className="space-y-4">
                        {performanceData.recentSubmissions.map(
                          (submission, idx) => (
                            <motion.div
                              key={`submission-${idx}`}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.9 + idx * 0.2 }}
                              className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600/50 transition-colors"
                            >
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold text-gray-700 dark:text-gray-200 truncate max-w-[70%]">
                                  {submission.titre}
                                </span>
                                <span
                                  className={`text-sm font-bold px-2 py-1 rounded ${
                                    submission.score >= 90
                                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                      : submission.score >= 70
                                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                  }`}
                                >
                                  {submission.score}/100
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Soumis le:{" "}
                                {new Date(submission.date).toLocaleDateString()}
                              </div>
                              <Link
                                to={`/exercice/${submission.exerciceId}`}
                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block"
                              >
                                Voir l'exercice →
                              </Link>
                            </motion.div>
                          )
                        )}
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5 }}
                        className="mt-6 text-center"
                      >
                        <Link
                          to="/historique"
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center"
                        >
                          <span>Voir tout l'historique</span>
                          <svg
                            className="w-4 h-4 ml-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </Link>
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Bouton pour générer un rapport PDF */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8 }}
                    className="mt-8 flex justify-center"
                  >
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-8 rounded-lg font-bold shadow-lg flex items-center gap-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                        />
                      </svg>
                      <span>Télécharger votre rapport complet</span>
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.section>

        {/* Loading state with animated spinner */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center py-16"
            >
              <div className="relative w-24 h-24 mb-8">
                <motion.div
                  variants={loadingCircleVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="absolute inset-0 border-4 border-t-blue-500 border-r-blue-400 border-b-blue-300 border-l-transparent rounded-full"
                />
                <motion.div
                  variants={loadingCircleVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ delay: 0.2 }}
                  className="absolute inset-2 border-4 border-t-indigo-500 border-r-indigo-400 border-b-indigo-300 border-l-transparent rounded-full"
                />
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { delay: 0.3 },
                }}
                className="text-center text-xl text-gray-100 font-medium flex items-center"
              >
                <span>Chargement des exercices</span>
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ...
                </motion.span>
              </motion.p>
            </motion.div>
          )}

          {/* Error state with animation */}
          {!loading && error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 20 }}
              className="text-center p-8 bg-red-50/90 dark:bg-red-900/30 backdrop-blur-md rounded-lg shadow-xl max-w-xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 15, delay: 0.2 }}
                className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-800/50 rounded-full flex items-center justify-center mb-4"
              >
                <motion.div
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-red-500 dark:text-red-300 text-2xl font-bold"
                >
                  !
                </motion.div>
              </motion.div>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center text-red-600 dark:text-red-400 text-lg font-medium mb-4"
              >
                {error}
              </motion.p>
              <motion.button
                variants={buttonVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                whileTap="tap"
                transition={{ delay: 0.5 }}
                onClick={() => window.location.reload()}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md font-bold"
              >
                Réessayer
              </motion.button>
            </motion.div>
          )}

          {/* Exercises list */}
          {!loading && !error && (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-white/20 dark:bg-gray-800/80 backdrop-blur-lg p-8 rounded-xl shadow-2xl max-w-6xl w-full"
            >
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                className="text-3xl md:text-4xl font-extrabold text-gray-100 mb-10 text-center flex items-center justify-center gap-3"
              >
                <motion.div animate={floatingAnimation}>
                  <FaFileAlt className="text-blue-500" />
                </motion.div>
                <span>Vue d'ensemble des Exercices</span>
              </motion.h2>

              {/* Empty state with animation */}
              {filteredExercises.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", damping: 20 }}
                  className="text-center py-16"
                >
                  <motion.div
                    animate={floatingAnimation}
                    className="text-6xl mb-6 text-gray-300 opacity-60 inline-block"
                  >
                    📋
                  </motion.div>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-300 text-xl font-medium mb-6"
                  >
                    {searchTerm
                      ? "Aucun exercice ne correspond à votre recherche."
                      : "Aucun exercice disponible actuellement."}
                  </motion.p>
                  {searchTerm && (
                    <motion.button
                      variants={buttonVariants}
                      initial="initial"
                      animate="animate"
                      whileHover="hover"
                      whileTap="tap"
                      transition={{ delay: 0.5 }}
                      onClick={() => setSearchTerm("")}
                      className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-bold shadow-lg"
                    >
                      Effacer la recherche
                    </motion.button>
                  )}
                </motion.div>
              )}

              {/* Exercises grid with staggered animation */}
              {filteredExercises.length > 0 && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {filteredExercises.map((exercise, index) => (
                    <motion.div
                      key={exercise.id}
                      custom={index}
                      variants={cardVariants}
                      whileHover="hover"
                      className="relative bg-white/90 dark:bg-gray-700/90 overflow-hidden rounded-xl shadow-lg flex flex-col transform-gpu"
                    >
                      {/* Card decorative elements */}
                      <motion.div
                        className="absolute top-0 left-0 right-0 h-1.5 bg-blue-500"
                        whileHover={{
                          scaleX: 1.05,
                          height: "6px",
                          transition: { duration: 0.3 },
                        }}
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{
                          opacity: 0.8,
                          scale: 1,
                          transition: { delay: 0.3 + index * 0.1 },
                        }}
                        className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-blue-500/10 blur-xl"
                      />

                      <div className="p-6">
                        <motion.div className="flex flex-col items-center mb-6 relative">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              delay: 0.4 + index * 0.1,
                              type: "spring",
                              stiffness: 260,
                              damping: 20,
                            }}
                            className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4"
                          >
                            <motion.div animate={floatingAnimation}>
                              <FaFileAlt className="text-3xl text-blue-500" />
                            </motion.div>
                          </motion.div>

                          <motion.h3
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                            className="text-xl font-bold text-gray-800 dark:text-white text-center"
                          >
                            {exercise.titre || `Exercice ${exercise.id}`}
                          </motion.h3>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                        >
                          <p className="text-gray-600 dark:text-gray-300 text-center mb-3">
                            {exercise.commentaire
                              ? exercise.commentaire.substring(0, 60) + "..."
                              : "Pas de description disponible."}
                          </p>
                          <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
                            <strong>Date limite :</strong>{" "}
                            {new Date(
                              exercise.date_limite
                            ).toLocaleDateString()}
                          </p>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                          className="mt-auto self-center flex justify-center w-full"
                        >
                          <Link
                            to={`/exercice/${exercise.id}`}
                            className="group bg-blue-600 text-white w-full py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-md"
                          >
                            <span>Voir les détails</span>
                            <motion.div
                              initial={{ x: 0 }}
                              whileHover={{ x: 5 }}
                              className="inline-block"
                            >
                              <FaArrowRight />
                            </motion.div>
                          </Link>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Animated footer */}
      <motion.footer
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6, ease: "easeOut" }}
        className="relative z-10 bg-white/40 dark:bg-black/60 backdrop-blur-md text-gray-900 dark:text-white py-6 text-center mt-12"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="max-w-xl mx-auto px-4"
        >
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="text-lg font-semibold"
          >
            © 2025 Plateforme SGBD. Tous droits réservés.
          </motion.p>

          {/* Additional footer animation */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
            className="w-24 h-1 bg-blue-500 mx-auto mt-3"
          />
        </motion.div>
      </motion.footer>
    </motion.div>
  );
};

export default DashboardEtudiant;
