import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FaArrowRight, FaFileAlt, FaLaptopCode, FaSearch } from "react-icons/fa";
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
        if (!response.ok) throw new Error("Erreur lors de la récupération des exercices");
        const data = await response.json();
        setExercises(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
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
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
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

  // Enhanced animation variants
  const pageTransition = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.6, ease: "easeInOut" }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.08,
        delayChildren: 0.3
      }
    },
    exit: {
      opacity: 0,
      transition: {
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
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
        damping: 15 
      }
    },
    exit: {
      y: -20,
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    hover: {
      y: -8,
      scale: 1.04,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 15 
      }
    }
  };

  const buttonVariants = {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    hover: { 
      scale: 1.05, 
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)", 
      transition: { type: "spring", stiffness: 400, damping: 10 } 
    },
    tap: { scale: 0.95, transition: { duration: 0.1 } }
  };
  
  const searchVariants = {
    initial: { width: "80%", opacity: 0 },
    animate: { width: "100%", opacity: 1, transition: { delay: 0.5, duration: 0.8, ease: "easeOut" } },
    focus: { 
      boxShadow: "0 0 0 4px rgba(59, 130, 246, 0.5)",
      scale: 1.02,
      transition: { duration: 0.3, type: "spring", stiffness: 300, damping: 15 }
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
        damping: 20 
      }
    },
    hover: {
      y: -12,
      scale: 1.05,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 15 
      }
    }
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
          <motion.button
            variants={buttonVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
            transition={{ delay: 0.6 }}
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold transition"
          >
            Accueil
          </motion.button>
          <motion.button
            variants={buttonVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
            transition={{ delay: 0.7 }}
            onClick={toggleDarkMode}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-semibold transition"
          >
            {darkMode ? "☀️ Mode Clair" : "🌙 Mode Sombre"}
          </motion.button>
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
      <main className="relative z-10 flex-grow flex flex-col items-center py-8 px-4">
        {/* Search bar with animated reveal */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.9 }}
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
                  transition: { delay: 0.3 }
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
                <motion.div
                  animate={floatingAnimation}
                >
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
                    {searchTerm ? "Aucun exercice ne correspond à votre recherche." : "Aucun exercice disponible actuellement."}
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
                        whileHover={{ scaleX: 1.05, height: "6px", transition: { duration: 0.3 } }}
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 0.8, scale: 1, transition: { delay: 0.3 + index * 0.1 } }}
                        className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-blue-500/10 blur-xl"
                      />
                      
                      <div className="p-6">
                        <motion.div 
                          className="flex flex-col items-center mb-6 relative"
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ 
                              delay: 0.4 + index * 0.1,
                              type: "spring",
                              stiffness: 260,
                              damping: 20
                            }}
                            className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4"
                          >
                            <motion.div
                              animate={floatingAnimation}
                            >
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
                            {new Date(exercise.date_limite).toLocaleDateString()}
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