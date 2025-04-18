import { Link } from "react-router-dom";
import "../styles/home.css";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Home = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      console.log("Mode sombre :", !prev);
      return !prev;
    });
  };

  // Variants pour les animations framer-motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.8, 
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    },
    exit: { 
      opacity: 0,
      transition: { ease: "easeInOut", duration: 0.5 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { ease: "easeOut", duration: 0.8 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        ease: "easeOut", 
        duration: 0.5 
      }
    },
    hover: { 
      scale: 1.03,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { ease: "easeOut", duration: 0.2 }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      boxShadow: "0 0 15px rgba(66, 153, 225, 0.5)",
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.95 }
  };

  if (loading) {
    return (
      <motion.div
        className="flex items-center justify-center h-screen bg-white dark:bg-black overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [0.8, 1.1, 1],
            opacity: 1,
          }}
          transition={{ 
            duration: 1.2,
            ease: "easeInOut",
            times: [0, 0.6, 1]
          }}
          className="flex flex-col items-center"
        >
          <motion.div
            className="h-16 w-16 mb-6"
            animate={{ 
              rotate: [0, 180],
              borderRadius: ["20%", "50%"]
            }}
            transition={{ 
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          >
            <div className="h-full w-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-xl" />
          </motion.div>
          <motion.h1
            className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Plateforme SGBD
          </motion.h1>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        className={`${darkMode ? "dark" : ""} relative`}
        style={{
          backgroundImage: "url('/images/home.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
      >
        <motion.div 
          className={`absolute inset-0 ${darkMode ? "bg-black/70" : "bg-white/20"} z-0`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />

        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Navbar */}
          <motion.nav 
            className="navbar bg-white/40 dark:bg-black/60 backdrop-blur-md py-5 px-8 shadow-md flex justify-between items-center"
            variants={itemVariants}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="navbar-brand text-gray-900 dark:text-white text-xl font-bold">
              <motion.span
                className="inline-block"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Plateforme SGBD
              </motion.span>
            </div>
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
          </motion.nav>

          {/* Contenu principal */}
          <main className="main-content flex-grow flex flex-col items-center justify-center">
            <motion.section 
              className="hero-section text-gray-900 dark:text-white text-center px-4"
              variants={itemVariants}
            >
              <motion.h1 
                className="text-5xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.2,
                  duration: 0.8,
                  ease: "easeOut"
                }}
              >
                Bienvenue sur notre Plateforme
              </motion.h1>
              <motion.p 
                className="subtitle text-lg text-gray-800 dark:text-gray-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Gestion avancée des bases de données pour étudiants et enseignants
              </motion.p>
            </motion.section>

            {/* Auth */}
            <motion.section 
              className="auth-card mt-10 p-6 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg w-[90%] max-w-md text-center"
              variants={cardVariants}
              whileHover="hover"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                delay: 0.3,
                duration: 0.7,
                ease: "easeOut"
              }}
            >
              <motion.h2 
                className="text-xl font-semibold text-gray-900 dark:text-white mb-2"
                variants={itemVariants}
              >
                Connectez-vous à votre espace
              </motion.h2>
              <motion.p 
                className="auth-message text-gray-700 dark:text-gray-300 mb-4"
                variants={itemVariants}
              >
                Accédez à toutes les fonctionnalités en vous connectant à votre compte
              </motion.p>

              <motion.div 
                className="auth-actions flex flex-col gap-3"
                variants={itemVariants}
              >
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link
                    to="/login"
                    className="auth-btn login-btn bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg block transition-all duration-300"
                  >
                    Se connecter
                  </Link>
                </motion.div>
                <p className="auth-divider text-gray-700 dark:text-gray-300">ou</p>
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link
                    to="/register"
                    className="auth-btn signup-btn bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg block transition-all duration-300"
                  >
                    Créer un compte
                  </Link>
                </motion.div>
              </motion.div>
            </motion.section>

            {/* Informations */}
            <motion.section 
              className="info-section mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 w-[90%] max-w-4xl px-4"
              variants={itemVariants}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <motion.div 
                className="info-card p-6 rounded-xl bg-white/90 dark:bg-gray-700/90 shadow-md"
                variants={cardVariants}
                whileHover="hover"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <motion.div
                  className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Pour les Étudiants</h3>
                <p className="text-gray-700 dark:text-gray-300">Accédez à vos ressources pédagogiques et exercices pratiques</p>
              </motion.div>
              
              <motion.div 
                className="info-card p-6 rounded-xl bg-white/90 dark:bg-gray-700/90 shadow-md"
                variants={cardVariants}
                whileHover="hover"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <motion.div
                  className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4"
                  whileHover={{ rotate: -5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Pour les Enseignants</h3>
                <p className="text-gray-700 dark:text-gray-300">Gérez vos cours et suivez la progression de vos étudiants</p>
              </motion.div>
            </motion.section>
          </main>

          {/* Footer */}
          <motion.footer 
            className="footer bg-white/40 dark:bg-black/60 backdrop-blur-md text-gray-900 dark:text-white py-4 text-center mt-12"
            variants={itemVariants}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <p>© 2025 Plateforme SGBD - Tous droits réservés</p>
          </motion.footer>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Home;