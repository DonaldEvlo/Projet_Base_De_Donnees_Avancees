import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { 
  FaChartLine, 
  FaCheckCircle, 
  FaChevronDown, 
  FaChevronUp,
  FaExclamationTriangle,
  FaUser,
  FaInfoCircle,
  FaLink,
  FaEnvelope,
  FaEye,
  FaExclamationCircle
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "../../supabaseClient";

const RapportPlagiat = () => {
  const [rapports, setRapports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const { id } = useParams(); // ID de l'exercice
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

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const fetchRapportsPlagiat = async () => {
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

        const response = await fetch(`http://localhost:5000/soumissions/${id}/plagiat`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Vérifier que data est bien un tableau
        if (Array.isArray(data)) {
          setRapports(data);
          showNotification(
            "Rapports de plagiat chargés avec succès!",
            "success"
          );
        } else {
          console.error("Les données reçues ne sont pas un tableau:", data);
          setRapports([]);  // Initialiser avec un tableau vide
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des rapports de plagiat:", err.message);
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

    fetchRapportsPlagiat();
  }, [id, navigate]);

  return (
    <div
      className={`${darkMode ? "dark" : ""} min-h-screen flex flex-col`}
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/plagiat.png')",
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
            onClick={() => navigate(-1)}
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

      {/* Plagiarism Report Component with Enhanced UI */}
<motion.main
  className="relative z-10 flex-grow flex flex-col items-center justify-start py-12 px-4"
  initial="hidden"
  animate="visible"
  exit="exit"
  variants={pageTransition}
>
  <motion.div
    className="bg-white/10 dark:bg-gray-800/90 backdrop-blur-lg p-8 rounded-xl shadow-2xl max-w-4xl w-full border border-white/20"
    variants={containerVariants}
  >
    <motion.div 
      className="flex items-center justify-center gap-3 mb-8"
      variants={itemVariants}
    >
      <FaExclamationTriangle className="text-yellow-400 text-3xl" />
      <h2 className="text-4xl font-extrabold text-white bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        Rapport de Plagiat
      </h2>
    </motion.div>
    
    <motion.div
      className="bg-white/5 dark:bg-gray-700/30 backdrop-blur p-4 rounded-lg mb-8 flex justify-between items-center"
      variants={itemVariants}
    >
      <span className="text-lg text-gray-200 font-medium">Exercice #{id}</span>
      <span className="px-4 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium border border-blue-500/30">
        {new Date().toLocaleDateString('fr-FR', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </span>
    </motion.div>

    {loading ? (
      <motion.div
        className="flex flex-col items-center justify-center py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-blue-300 font-medium">Analyse en cours...</p>
      </motion.div>
    ) : error ? (
      <motion.div
        className="text-center p-6 bg-red-500/20 backdrop-blur-sm rounded-lg border border-red-500/30"
        variants={itemVariants}
      >
        <FaExclamationCircle className="text-red-400 text-4xl mx-auto mb-3" />
        <p className="text-red-300 text-lg font-medium">Erreur</p>
        <p className="text-red-200 mt-2">{error}</p>
      </motion.div>
    ) : !rapports || rapports.length === 0 ? (
      <motion.div
        className="bg-green-500/10 backdrop-blur-sm p-8 rounded-lg border border-green-500/20 text-center"
        variants={itemVariants}
      >
        <FaCheckCircle className="text-green-400 text-5xl mx-auto mb-4" />
        <p className="text-gray-100 text-xl font-medium">
          Aucun plagiat détecté
        </p>
        <p className="text-gray-300 mt-3 max-w-md mx-auto">
          Aucune similarité significative n'a été détectée entre les soumissions pour cet exercice.
        </p>
      </motion.div>
    ) : (
      <AnimatePresence>
        <motion.div 
          className="space-y-6"
          variants={containerVariants}
        >
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="text-gray-200 font-medium">Résultats de l'analyse</h3>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-xs text-gray-300">Élevé</span>
              <div className="w-3 h-3 rounded-full bg-yellow-500 ml-2"></div>
              <span className="text-xs text-gray-300">Moyen</span>
              <div className="w-3 h-3 rounded-full bg-green-500 ml-2"></div>
              <span className="text-xs text-gray-300">Faible</span>
            </div>
          </div>
          
          {rapports.map((rapport, index) => (
            <motion.div
              key={rapport.id || index}
              variants={itemVariants}
              className={`backdrop-blur-md p-6 rounded-xl shadow-lg mb-6 border ${
                (rapport.similarite || 0) > 0.7
                  ? "bg-red-950/30 border-red-500/30"
                  : (rapport.similarite || 0) > 0.5
                  ? "bg-yellow-950/30 border-yellow-500/30"
                  : "bg-green-950/30 border-green-500/30"
              }`}
              whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
            >
              <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-full ${
                    (rapport.similarite || 0) > 0.7
                      ? "bg-red-500/20"
                      : (rapport.similarite || 0) > 0.5
                      ? "bg-yellow-500/20"
                      : "bg-green-500/20"
                  }`}>
                    <FaUser className={`text-xl ${
                      (rapport.similarite || 0) > 0.7
                        ? "text-red-400"
                        : (rapport.similarite || 0) > 0.5
                        ? "text-yellow-400"
                        : "text-green-400"
                    }`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {rapport.etudiant_nom || "Étudiant"}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      ID: {rapport.soumission_id || "N/A"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-700/50 border-2 border-gray-600" 
                       style={{ 
                         borderRightColor: (rapport.similarite || 0) > 0.7 
                           ? '#ef4444' 
                           : (rapport.similarite || 0) > 0.5 
                           ? '#eab308' 
                           : '#22c55e'
                       }}>
                    <span className="text-sm font-bold text-gray-200">{Math.round((rapport.similarite || 0) * 100)}%</span>
                  </div>
                  <div
                    className={`px-4 py-1.5 rounded-lg font-medium flex items-center gap-2 ${
                      (rapport.similarite || 0) > 0.7
                        ? "bg-red-500/20 text-red-300"
                        : (rapport.similarite || 0) > 0.5
                        ? "bg-yellow-500/20 text-yellow-300"
                        : "bg-green-500/20 text-green-300"
                    }`}
                  >
                    {(rapport.similarite || 0) > 0.7 ? (
                      <FaExclamationTriangle />
                    ) : (
                      <FaCheckCircle />
                    )}
                    <span>
                      {(rapport.similarite || 0) > 0.7
                        ? "Niveau élevé"
                        : (rapport.similarite || 0) > 0.5
                        ? "Niveau moyen"
                        : "Niveau faible"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-gray-800/40 p-4 rounded-lg border border-gray-700">
                <h4 className="font-medium text-gray-200 mb-3 flex items-center gap-2">
                  <FaInfoCircle className="text-blue-400" />
                  {rapport.message || "Analyse de plagiat"}
                </h4>

                {rapport.similarites && rapport.similarites.length > 0 ? (
                  <div className="mt-4">
                    <h5 className="font-medium text-gray-300 mb-3 flex items-center gap-2">
                      <FaLink className="text-gray-400" />
                      Soumissions similaires:
                    </h5>
                    <div className="space-y-3">
                      {rapport.similarites.map((similarite, idx) => (
                        <div
                          key={`${similarite.soumission_id}-${idx}`}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50 border border-gray-600/50 transition-all hover:bg-gray-700/80"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-1.5 h-16 rounded-l-md ${
                              (similarite.similarity || 0) > 0.7
                                ? "bg-red-500"
                                : (similarite.similarity || 0) > 0.5
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}></div>
                            <div className="flex flex-col">
                              <span className="font-medium text-white">
                                {similarite.etudiant_nom || "Étudiant"}
                              </span>
                              <p className="text-sm text-gray-400">
                                ID: {similarite.soumission_id || "N/A"}
                              </p>
                            </div>
                          </div>
                          <div
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              (similarite.similarity || 0) > 0.7
                                ? "bg-red-500/20 text-red-300 border border-red-500/30"
                                : (similarite.similarity || 0) > 0.5
                                ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                                : "bg-green-500/20 text-green-300 border border-green-500/30"
                            }`}
                          >
                            {Math.round((similarite.similarity || 0) * 100)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400 italic">
                    Aucune similarité significative détectée avec d'autres soumissions.
                  </p>
                )}
              </div>
              
              {(rapport.similarite || 0) > 0.7 && (
                <div className="mt-4 p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                  <div className="flex items-center text-red-300 mb-2">
                    <FaExclamationTriangle className="mr-2" />
                    <h5 className="font-medium">Action recommandée</h5>
                  </div>
                  <p className="text-red-200">
                    Une similarité élevée a été détectée. Il est recommandé de vérifier
                    manuellement ces soumissions et de contacter les étudiants concernés.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button className="px-4 py-2 bg-red-600/30 hover:bg-red-600/50 text-red-200 rounded-lg transition-colors border border-red-500/30 text-sm font-medium flex items-center gap-2">
                      <FaEnvelope />
                      Contacter l'étudiant
                    </button>
                    <button className="px-4 py-2 bg-gray-700/50 hover:bg-gray-700/80 text-gray-200 rounded-lg transition-colors border border-gray-600/30 text-sm font-medium flex items-center gap-2">
                      <FaEye />
                      Voir les détails
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    )}
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

export default RapportPlagiat;