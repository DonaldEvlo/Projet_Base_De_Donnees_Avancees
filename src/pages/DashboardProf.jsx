import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  FaBook,
  FaChalkboardTeacher,
  FaChartBar,
  FaChartLine,
  FaLaptopCode,
  FaSignOutAlt
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { signOut } from "../../backend/services/authServices"; // Assurez-vous que le chemin est correct

const DashboardProf = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === "true";
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [activePage, setActivePage] = useState(null);
  const [loading, setLoading] = useState(true); // État pour contrôler l'animation de chargement
  const headerRef = useRef(null);

  // État pour les données de performance (simulées)
  const [performanceData, setPerformanceData] = useState(null);

  // Motion values for parallax effects
  const scrollY = useMotionValue(0);
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.8]);
  const headerBlur = useTransform(scrollY, [0, 100], [0, 8]);

  useEffect(() => {
    // Effet d'entrée progressif
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    // Simulation du chargement de données
    const loadingTimer = setTimeout(() => {
      setLoading(false);

      // Charger les données de performance simulées
      setPerformanceData({
        completionRate: 78,
        averageScore: 72,
        totalStudents: 45,
        recentSubmissions: 12,
        topPerformers: [
          { id: 1, name: "Antoine Dupont", score: 98, avatar: "AD" },
          { id: 2, name: "Sophie Martin", score: 95, avatar: "SM" },
          { id: 3, name: "Lucas Bernard", score: 92, avatar: "LB" },
        ],
        needHelp: [
          { id: 4, name: "Julie Lefèvre", score: 42, avatar: "JL" },
          { id: 5, name: "Maxime Petit", score: 38, avatar: "MP" },
        ],
        courseStats: [
          {
            name: "SQL Fondamentaux",
            averageScore: 84,
            submissions: 42,
            completion: 93,
          },
          {
            name: "Modélisation",
            averageScore: 76,
            submissions: 39,
            completion: 87,
          },
          {
            name: "Transactions",
            averageScore: 68,
            submissions: 31,
            completion: 69,
          },
        ],
      });
    }, 2500); // 2.5 secondes de chargement simulé

    // Handle scroll events for parallax
    const handleScroll = () => {
      scrollY.set(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(timer);
      clearTimeout(loadingTimer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollY]);

  const handleNavigation = (path) => {
    // Animer la sortie avant navigation
    setActivePage(path);
    setIsLoaded(false);
    setTimeout(() => {
      navigate(path);
    }, 500);
  };

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

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  };

  // Animation variants avec timing amélioré
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1], // Ease-out cubic pour un mouvement plus naturel
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: [0.65, 0, 0.35, 1], // Ease-in-out cubic
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        when: "beforeChildren",
        staggerChildren: 0.12,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    hover: {
      y: -8,
      scale: 1.03,
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.08)",
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
    tap: {
      scale: 0.97,
      transition: { duration: 0.1 },
    },
  };

  const buttonVariants = {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    hover: {
      scale: 1.05,
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1,
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

  const textRevealVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
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

  // Variants pour la section de performance
  const performanceVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        when: "beforeChildren",
        staggerChildren: 0.1,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.2,
      },
    },
  };

  const statCardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    hover: {
      y: -5,
      scale: 1.03,
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
  };

  const progressVariants = {
    initial: { width: 0 },
    animate: (width) => ({
      width: `${width}%`,
      transition: {
        duration: 1.2,
        ease: "easeOut",
        delay: 0.5,
      },
    }),
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="dashboard"
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        exit="exit"
        variants={pageVariants}
        className={`${
          darkMode ? "dark" : ""
        } relative overflow-hidden min-h-screen`}
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/prof.png')",
          backgroundSize: "cover",
          backgroundPosition: "center 25%",
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

        {/* Contenu principal */}
        <div className="relative z-10 min-h-screen flex flex-col justify-start">
          {/* Header with parallax effect */}
          <motion.header
            ref={headerRef}
            style={{
              opacity: headerOpacity,
              backdropFilter: `blur(${headerBlur.get()}px)`,
            }}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              delay: 0.2,
            }}
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
                <span className="flex items-center gap-2">
                  <FaSignOutAlt />
                  <span>Déconnexion</span>
                </span>
              </motion.button>
            </div>
          </motion.header>

          {/* Main content */}
          <main className="flex-grow flex flex-col items-center justify-start pt-16 pb-16 px-4">
            <AnimatePresence mode="wait">
              {/* Loading state with animated spinner */}
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
                    <span>Chargement du tableau de bord</span>
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      ...
                    </motion.span>
                  </motion.p>
                </motion.div>
              )}

              {/* Content when loaded */}
              {!loading && (
                <div className="w-full max-w-6xl flex flex-col gap-8">
                  <motion.div
                    key="content"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white/20 dark:bg-gray-800/70 backdrop-blur-lg p-10 rounded-2xl shadow-2xl w-full border border-white/20 mt-8"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        transition: {
                          delay: 0.3,
                          duration: 0.5,
                          type: "spring",
                          stiffness: 150,
                          damping: 15,
                        },
                      }}
                      className="flex flex-col items-center mb-12"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                          delay: 0.5,
                        }}
                      >
                        <motion.span
                          animate={floatingAnimation}
                          className="text-5xl mb-3 inline-block"
                        >
                          🧑‍🏫
                        </motion.span>
                      </motion.div>

                      <motion.h2
                        className="text-4xl font-bold text-center text-gray-900 dark:text-white"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: {
                            delay: 0.7,
                            duration: 0.6,
                            ease: [0.22, 1, 0.36, 1],
                          },
                        }}
                      >
                        Tableau de Bord Professeur
                      </motion.h2>

                      <motion.div
                        className="h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded mt-4"
                        initial={{ width: 0, opacity: 0 }}
                        animate={{
                          width: 100,
                          opacity: 1,
                          transition: {
                            delay: 0.9,
                            duration: 0.5,
                          },
                        }}
                      />
                    </motion.div>

                    <motion.div
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <DashboardCard
                        icon={
                          <FaChalkboardTeacher className="text-5xl text-orange-500 mb-2" />
                        }
                        label="Créer un Exercice"
                        description="Développez de nouveaux exercices pour vos étudiants"
                        onClick={() => handleNavigation("/create-exercise")}
                        variants={cardVariants}
                        delay={0.2}
                        darkMode={darkMode}
                        isActive={activePage === "/create-exercise"}
                      />
                      <DashboardCard
                        icon={
                          <FaBook className="text-5xl text-green-500 mb-2" />
                        }
                        label="Exercices"
                        description="Gérez votre bibliothèque d'exercices"
                        onClick={() => handleNavigation("/exercices")}
                        variants={cardVariants}
                        delay={0.3}
                        darkMode={darkMode}
                        isActive={activePage === "/exercices"}
                      />
                      <DashboardCard
                        icon={
                          <FaChartBar className="text-5xl text-purple-500 mb-2" />
                        }
                        label="Exercices Soumis"
                        description="Consultez et évaluez les réponses des étudiants"
                        onClick={() => handleNavigation("/exercices-soumis")}
                        variants={cardVariants}
                        delay={0.4}
                        darkMode={darkMode}
                        isActive={activePage === "/exercices-soumis"}
                      />

                      <DashboardCard
                        icon={
                          <FaChartLine className="text-5xl text-purple-500 mb-2" />
                        }
                        label="Performance"
                        description="Consultez vos statistiques"
                        onClick={() => handleNavigation("/student-performance")}
                        variants={cardVariants}
                        delay={0.4}
                        darkMode={darkMode}
                        isActive={activePage === "/student-performance"}
                      />

                      <DashboardCard
                        icon={
                          <FaChartLine className="text-5xl text-purple-500 mb-2" />
                        }
                        label="Notes"
                        description="Consultez les notes attriuées"
                        onClick={() => handleNavigation("/notes-attribuées")}
                        variants={cardVariants}
                        delay={0.4}
                        darkMode={darkMode}
                        isActive={activePage === "/notes-attribuées"}
                      />
                    </motion.div>
                  </motion.div>
                </div>
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
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Composant pour les cartes du dashboard
const DashboardCard = ({
  icon,
  label,
  description,
  onClick,
  variants,
  delay,
  darkMode,
  isActive,
}) => {
  // Animation spécifique pour l'icône
  const iconVariants = {
    hidden: { scale: 0, rotate: -10 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        delay: delay + 0.2,
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: delay + 0.3, duration: 0.4 },
    },
  };

  // Style conditionnel basé sur l'état actif
  const cardBaseClass = `
    bg-white/90 dark:bg-gray-700/90 
    rounded-xl p-6 shadow-lg
    hover:shadow-xl transition-all duration-300 
    flex flex-col items-center justify-between 
    cursor-pointer overflow-hidden transform-gpu
    ${isActive ? "ring-2 ring-blue-500 dark:ring-blue-400" : ""}
  `;

  // Animation de fond au survol
  const bgVariants = {
    hover: {
      backgroundPosition: ["0% 0%", "100% 100%"],
      transition: { duration: 3, repeat: Infinity, repeatType: "reverse" },
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

  return (
    <motion.div
      variants={variants}
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      className={cardBaseClass}
      style={{
        position: "relative",
      }}
    >
      {/* Effet de surbrillance au survol */}
      <motion.div
        variants={bgVariants}
        className="absolute inset-0 opacity-0 hover:opacity-10 bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 dark:from-blue-600 dark:via-purple-600 dark:to-pink-600"
        style={{
          backgroundSize: "200% 200%",
        }}
      />

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
        animate={{ opacity: 0.8, scale: 1, transition: { delay: 0.3 } }}
        className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-blue-500/10 blur-xl"
      />

      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          variants={iconVariants}
          animate={floatingAnimation}
          className="flex justify-center mb-3"
        >
          {icon}
        </motion.div>
        <motion.h3
          variants={textVariants}
          className="text-xl font-bold text-center text-gray-900 dark:text-white"
        >
          {label}
        </motion.h3>
        <motion.p
          variants={textVariants}
          className="text-sm text-gray-600 dark:text-gray-300 mt-2 text-center"
        >
          {description}
        </motion.p>
      </div>
    </motion.div>
  );
};

// Nouveau composant pour les cartes de statistiques
const StatCard = ({ icon, value, label, color, variants, progress }) => {
  // Animation spécifique pour l'icône
  const iconVariants = {
    hidden: { scale: 0, rotate: -10 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, delay: 0.2 },
    },
  };

  const progressVariants = {
    initial: { width: 0 },
    animate: {
      width: `${progress}%`,
      transition: {
        duration: 1.2,
        ease: "easeOut",
        delay: 0.5,
      },
    },
  };

  const statCardBaseClass = `
    bg-white/90 dark:bg-gray-700/90 
    rounded-xl p-5 shadow-lg
    transition-all duration-300 
    overflow-hidden transform-gpu
    relative
  `;

  const floatingAnimation = {
    y: [-3, 3],
    transition: {
      y: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      variants={variants}
      whileHover="hover"
      className={statCardBaseClass}
    >
      {/* Background decoration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 0.07, scale: 1, transition: { delay: 0.3 } }}
        className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-${color}-500 blur-xl`}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <motion.div
            variants={iconVariants}
            animate={floatingAnimation}
            className={`w-12 h-12 rounded-lg bg-${color}-100 dark:bg-${color}-900/30 flex items-center justify-center`}
          >
            {icon}
          </motion.div>
          <motion.span
            variants={textVariants}
            className={`text-3xl font-bold text-${color}-600 dark:text-${color}-400`}
          >
            {value}
          </motion.span>
        </div>

        <motion.div variants={textVariants} className="mb-3">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {label}
          </h4>
        </motion.div>

        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mb-1">
          <motion.div
            variants={progressVariants}
            initial="initial"
            animate="animate"
            className={`h-1.5 rounded-full bg-${color}-500`}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardProf;
