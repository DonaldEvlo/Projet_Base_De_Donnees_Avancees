import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  FaBook,
  FaChalkboardTeacher,
  FaChartBar,
  FaHome,
  FaLaptopCode,
  FaSignOutAlt,
  FaUserGraduate,
  FaChartLine,
  FaExclamationTriangle,
  FaCheckCircle,
  FaMedal,
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
          { name: "SQL Fondamentaux", averageScore: 84, submissions: 42, completion: 93 },
          { name: "Modélisation", averageScore: 76, submissions: 39, completion: 87 },
          { name: "Transactions", averageScore: 68, submissions: 31, completion: 69 },
        ]
      });
    }, 2500); // 2.5 secondes de chargement simulé

    // Handle scroll events for parallax
    const handleScroll = () => {
      scrollY.set(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timer);
      clearTimeout(loadingTimer);
      window.removeEventListener('scroll', handleScroll);
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
      setUser(null);    // 🧠 Déconnexion côté client
      console.log("Déconnexion réussie !");
      
      setIsLoaded(false); // 🎞️ Lance l'animation de sortie
      setTimeout(() => {
        navigate("/");    // 🚀 Redirection après animation
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
        ease: [0.22, 1, 0.36, 1] // Ease-out cubic pour un mouvement plus naturel
      }
    },
    exit: { 
      opacity: 0,
      transition: { 
        duration: 0.4, 
        ease: [0.65, 0, 0.35, 1] // Ease-in-out cubic
      }
    }
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
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.4, 
        ease: [0.22, 1, 0.36, 1]
      }
    },
    hover: {
      y: -8,
      scale: 1.03,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.08)",
      transition: { 
        duration: 0.3,
        type: "spring", 
        stiffness: 300, 
        damping: 15
      }
    },
    tap: {
      scale: 0.97,
      transition: { duration: 0.1 }
    }
  };

  const buttonVariants = {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    hover: { 
      scale: 1.05, 
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: { 
        duration: 0.3,
        type: "spring", 
        stiffness: 400, 
        damping: 10
      } 
    },
    tap: { 
      scale: 0.95, 
      transition: { 
        duration: 0.1 
      } 
    }
  };

  const loadingCircleVariants = {
    initial: { opacity: 0, rotate: 0 },
    animate: { 
      opacity: 1, 
      rotate: 360, 
      transition: { 
        rotate: { duration: 1, ease: "linear", repeat: Infinity },
        opacity: { duration: 0.3 }
      }
    },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  const textRevealVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const floatingAnimation = {
    y: [-5, 5],
    transition: {
      y: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
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
        stiffness: 100 
      }
    }
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
        delay: 0.2
      }
    }
  };

  const statCardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { 
        duration: 0.4, 
        ease: [0.22, 1, 0.36, 1]
      }
    },
    hover: {
      y: -5,
      scale: 1.03,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: { 
        duration: 0.3,
        type: "spring", 
        stiffness: 300, 
        damping: 15
      }
    }
  };

  const progressVariants = {
    initial: { width: 0 },
    animate: (width) => ({
      width: `${width}%`,
      transition: { 
        duration: 1.2, 
        ease: "easeOut",
        delay: 0.5
      }
    })
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="dashboard"
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        exit="exit"
        variants={pageVariants}
        className={`${darkMode ? "dark" : ""} relative overflow-hidden min-h-screen`}
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
                  y: Math.random() * window.innerHeight 
                }}
                animate={{ 
                  opacity: [0.2, 0.5, 0.2], 
                  y: [
                    Math.random() * window.innerHeight,
                    Math.random() * window.innerHeight - 200,
                    Math.random() * window.innerHeight
                  ],
                  x: [
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerWidth + 100,
                    Math.random() * window.innerWidth
                  ],
                }}
                transition={{ 
                  duration: Math.random() * 20 + 10, 
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut" 
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
            backgroundColor: darkMode ? "rgba(0, 0, 0, 0.75)" : "rgba(0, 0, 0, 0.5)"
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
              backdropFilter: `blur(${headerBlur.get()}px)`
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
              <motion.div
                animate={floatingAnimation}
              >
                <FaLaptopCode className="text-blue-500 text-3xl" />
              </motion.div>
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  transition: { delay: 0.5, duration: 0.5 }
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
                      transition: { delay: 0.3 }
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
                          damping: 15
                        }
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
                          delay: 0.5
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
                            ease: [0.22, 1, 0.36, 1]
                          }
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
                            duration: 0.5
                          }
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
                        icon={<FaChalkboardTeacher className="text-5xl text-orange-500 mb-2" />}
                        label="Créer un Exercice"
                        description="Développez de nouveaux exercices pour vos étudiants"
                        onClick={() => handleNavigation("/create-exercise")}
                        variants={cardVariants}
                        delay={0.2}
                        darkMode={darkMode}
                        isActive={activePage === "/create-exercise"}
                      />
                      <DashboardCard
                        icon={<FaBook className="text-5xl text-green-500 mb-2" />}
                        label="Exercices"
                        description="Gérez votre bibliothèque d'exercices"
                        onClick={() => handleNavigation("/exercices")}
                        variants={cardVariants}
                        delay={0.3}
                        darkMode={darkMode}
                        isActive={activePage === "/exercices"}
                      />
                      <DashboardCard
                        icon={<FaChartBar className="text-5xl text-purple-500 mb-2" />}
                        label="Exercices Soumis"
                        description="Consultez et évaluez les réponses des étudiants"
                        onClick={() => handleNavigation("/exercices-soumis")}
                        variants={cardVariants}
                        delay={0.4}
                        darkMode={darkMode}
                        isActive={activePage === "/exercices-soumis"}
                      />
                      <DashboardCard
                        icon={<FaSignOutAlt className="text-5xl text-red-500 mb-2" />}
                        label="Déconnexion"
                        description="Quitter votre session"
                        onClick={handleLogout}
                        variants={cardVariants}
                        delay={0.5}
                        darkMode={darkMode}
                        isActive={false}
                      />
                    </motion.div>
                  </motion.div>
                  
                  {/* Section Performance des Étudiants */}
                  {performanceData && (
                    <motion.div
                      key="performance"
                      variants={performanceVariants}
                      initial="hidden"
                      animate="visible"
                      className="bg-white/20 dark:bg-gray-800/70 backdrop-blur-lg p-10 rounded-2xl shadow-2xl w-full border border-white/20 mb-8 overflow-hidden"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0,
                          transition: { delay: 0.2, duration: 0.6 }
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
                            delay: 0.3
                          }}
                        >
                          <motion.span
                            animate={floatingAnimation}
                            className="text-4xl mb-3 inline-block"
                          >
                            <FaUserGraduate className="text-4xl text-blue-500" />
                          </motion.span>
                        </motion.div>
                        
                        <motion.h2 
                          className="text-3xl font-bold text-center text-gray-900 dark:text-white"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ 
                            opacity: 1, 
                            y: 0,
                            transition: { 
                              delay: 0.4, 
                              duration: 0.6,
                              ease: [0.22, 1, 0.36, 1]
                            }
                          }}
                        >
                          Performance des Étudiants
                        </motion.h2>
                        
                        <motion.div 
                          className="h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded mt-4"
                          initial={{ width: 0, opacity: 0 }}
                          animate={{ 
                            width: 80, 
                            opacity: 1,
                            transition: {
                              delay: 0.6,
                              duration: 0.5
                            }
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
                          value={`${performanceData.averageScore}%`}
                          label="Note Moyenne"
                          color="blue"
                          variants={statCardVariants}
                          progress={performanceData.averageScore}
                        />
                        
                        <StatCard 
                          icon={<FaUserGraduate className="text-2xl text-green-500" />}
                          value={performanceData.totalStudents}
                          label="Étudiants Actifs"
                          color="green"
                          variants={statCardVariants}
                          progress={90}
                        />
                        
                        <StatCard 
                          icon={<FaCheckCircle className="text-2xl text-indigo-500" />}
                          value={`${performanceData.completionRate}%`}
                          label="Taux de Complétion"
                          color="indigo"
                          variants={statCardVariants}
                          progress={performanceData.completionRate}
                        />
                        
                        <StatCard 
                          icon={<FaChartBar className="text-2xl text-purple-500" />}
                          value={performanceData.recentSubmissions}
                          label="Soumissions Récentes"
                          color="purple"
                          variants={statCardVariants}
                          progress={65}
                        />
                      </motion.div>

                      {/* Students performance detail */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Top performers */}
                        <motion.div
                          variants={cardVariants}
                          className="bg-white/70 dark:bg-gray-700/70 rounded-xl p-6 shadow-lg h-full"
                        >
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                            <FaMedal className="text-yellow-500" />
                            <span>Top Performers</span>
                          </h3>
                          
                          <div className="space-y-4">
                            {performanceData.topPerformers.map((student, index) => (
                              <motion.div
                                key={student.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ 
                                  opacity: 1, 
                                  x: 0,
                                  transition: { delay: 0.5 + index * 0.1 }
                                }}
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-full bg-${index === 0 ? 'yellow' : index === 1 ? 'gray' : 'orange'}-500 flex items-center justify-center text-white font-bold`}>
                                    {student.avatar}
                                  </div>
                                  <span className="font-medium dark:text-white">{student.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-green-600 dark:text-green-400">{student.score}%</span>
                                  <div className="text-xs px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full font-medium">
                                    {index === 0 ? '1er' : index === 1 ? '2ème' : '3ème'}
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                        
                        {/* Students needing help */}
                        <motion.div
                          variants={cardVariants}
                          className="bg-white/70 dark:bg-gray-700/70 rounded-xl p-6 shadow-lg h-full"
                        >
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
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
                                  transition: { delay: 0.5 + index * 0.1 }
                                }}
                                className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/30 rounded-lg border-l-4 border-red-500"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
                                    {student.avatar}
                                  </div>
                                  <span className="font-medium dark:text-white">{student.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-red-600 dark:text-red-400">{student.score}%</span>
                                  <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="text-xs px-3 py-1 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 rounded-full font-medium hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
                                  >
                                    Contacter
                                  </motion.button>
                                </div>
                              </motion.div>
                            ))}
                            
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ 
                                opacity: 1,
                                transition: { delay: 0.7 }
                              }}
                              className="mt-4 text-center"
                            >
                              <motion.button 
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-800/40 text-red-800 dark:text-red-200 rounded-md font-medium hover:bg-red-200 dark:hover:bg-red-700/50 transition-all flex items-center gap-2 mx-auto"
                              >
                                <span>Voir tous les étudiants en difficulté</span>
                                <span className="text-xs bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                                  8
                                </span>
                              </motion.button>
                            </motion.div>
                          </div>
                        </motion.div>
                        
                        {/* Courses performance */}
                        <motion.div
                          variants={cardVariants}
                          className="bg-white/70 dark:bg-gray-700/70 rounded-xl p-6 shadow-lg h-full"
                        >
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
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
                                  transition: { delay: 0.5 + index * 0.1 }
                                }}
                                className="space-y-2"
                              >
                                <div className="flex justify-between items-center">
                                  <span className="font-medium text-gray-800 dark:text-gray-200">{course.name}</span>
                                  <span className={`font-bold ${
                                    course.averageScore >= 80 ? 'text-green-600 dark:text-green-400' :
                                    course.averageScore >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                                    'text-red-600 dark:text-red-400'
                                  }`}>
                                    {course.averageScore}%
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                                  <motion.div 
                                    className={`h-2.5 rounded-full ${
                                      course.averageScore >= 80 ? 'bg-green-500' :
                                      course.averageScore >= 60 ? 'bg-yellow-500' :
                                      'bg-red-500'
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
                              transition: { delay: 0.8 }
                            }}
                            className="mt-6 text-center"
                          >
                            <motion.button 
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
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
                          transition: { delay: 0.9, duration: 0.5 }
                        }}
                        className="mt-8 text-center"
                      >
                        <motion.button
                          whileHover={{ scale: 1.03, y: -3 }}
                          whileTap={{ scale: 0.97 }}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
                        >
                          <FaChartLine />
                          <span>Voir le rapport analytique complet</span>
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  )}
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
const DashboardCard = ({ icon, label, description, onClick, variants, delay, darkMode, isActive }) => {
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
        damping: 20
      }
    },
    hover: { 
      scale: 1.1,
      transition: { 
        duration: 0.3, 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { delay: delay + 0.3, duration: 0.4 }
    }
  };

  // Style conditionnel basé sur l'état actif
  const cardBaseClass = `
    bg-white/90 dark:bg-gray-700/90 
    rounded-xl p-6 shadow-lg
    hover:shadow-xl transition-all duration-300 
    flex flex-col items-center justify-between 
    cursor-pointer overflow-hidden transform-gpu
    ${isActive ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}
  `;
  
  // Animation de fond au survol
  const bgVariants = {
    hover: {
      backgroundPosition: ['0% 0%', '100% 100%'],
      transition: { duration: 3, repeat: Infinity, repeatType: "reverse" }
    }
  };

  const floatingAnimation = {
    y: [-5, 5],
    transition: {
      y: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      variants={variants}
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      className={cardBaseClass}
      style={{
        position: 'relative'
      }}
    >
      {/* Effet de surbrillance au survol */}
      <motion.div
        variants={bgVariants}
        className="absolute inset-0 opacity-0 hover:opacity-10 bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 dark:from-blue-600 dark:via-purple-600 dark:to-pink-600"
        style={{ 
          backgroundSize: '200% 200%'
        }}
      />
      
      {/* Card decorative elements */}
      <motion.div 
        className="absolute top-0 left-0 right-0 h-1.5 bg-blue-500"
        whileHover={{ scaleX: 1.05, height: "6px", transition: { duration: 0.3 } }}
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
        damping: 20
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, delay: 0.2 }
    }
  };

  const progressVariants = {
    initial: { width: 0 },
    animate: { 
      width: `${progress}%`,
      transition: { 
        duration: 1.2, 
        ease: "easeOut",
        delay: 0.5
      }
    }
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
        ease: "easeInOut"
      }
    }
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
        
        <motion.div 
          variants={textVariants}
          className="mb-3"
        >
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</h4>
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