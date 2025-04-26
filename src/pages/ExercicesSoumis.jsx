import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
  FaFileDownload,
  FaUser,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getEtudiantById } from "../../backend/services/authServices";
import supabase from "../../supabaseClient";

const ExercicesSoumis = () => {
  const [aiLoading, setAiLoading] = useState(false);
  const [plagiatLoading, setPlagiatLoading] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [grade, setGrade] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  // Fonction pour utiliser l'IA pour noter l'exercice
const handleAIGrading = async (submission, exerciseId) => {
  try {
    setAiLoading(true);
    setLoading(true);
    showNotification("Notation IA en cours...", "info");
    
    // Extraire l'URL du fichier PDF
    const pdfUrl = submission.fichier_reponse;
    
    if (!pdfUrl) {
      throw new Error("Le fichier de soumission est introuvable");
    }
    
    // Récupérer le fichier PDF
    const pdfResponse = await fetch(pdfUrl);
    const pdfBlob = await pdfResponse.blob();
    
    // Créer un FormData avec le PDF
    const formData = new FormData();
    formData.append('pdf', pdfBlob, 'submission.pdf');
    
    // Appeler le service de correction IA
    const aiResponse = await fetch('http://localhost:5001/api/correct', {
      method: 'POST',
      body: formData,
    });
    
    if (!aiResponse.ok) {
      throw new Error("Erreur lors de la communication avec le service IA");
    }
    
    const result = await aiResponse.json();
    
    if (result.success) {
      // Mettre à jour l'input avec la note générée par l'IA
      setGrade(result.note.toString());
      showNotification(`Note IA générée: ${result.note}/20`, "success");
      
      // Soumettre directement la note à la base de données
      // sans passer par handleGradeSubmit
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData?.session?.access_token;

        const response = await fetch(
          `http://localhost:5000/${submission.id}/noter`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              grade: result.note.toString(),
              exerciseId,
              source: 'ai' // Optionnel - si le backend accepte ce paramètre
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Erreur lors de l'enregistrement de la note générée par l'IA");
        }
        
        showNotification("Note IA enregistrée avec succès !", "success");
        setSelectedSubmission(null);
        
        // Rafraîchir les soumissions
        await fetchSubmissions(exerciseId);
      } catch (submitError) {
        throw new Error(`Erreur lors de l'enregistrement de la note: ${submitError.message}`);
      }
    } else {
      throw new Error(result.error || "Échec de la notation automatique");
    }
    
  } catch (err) {
    console.error("Erreur notation IA:", err);
    showNotification(`Erreur: ${err.message}`, "error");
  } finally {
    setAiLoading(false);
    setLoading(false);
  }
};
// Modifier la fonction handlePlagiatDetection pour gérer plusieurs soumissions
const handlePlagiatDetection = async () => {
  try {
    setPlagiatLoading(true);
    showNotification("Analyse du plagiat en cours...", "info");
    
    // Analyser toutes les soumissions de l'exercice sélectionné
    const results = await Promise.all(submissions.map(async (submission) => {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      
      const response = await fetch(
        `http://localhost:5000/soumissions/${submission.id}/detecter-plagiat`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur pour la soumission ${submission.id}`);
      }

      return await response.json();
    }));

/*     const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;
    
    // Appeler l'API avec l'ID de l'exercice au lieu de l'ID de la soumission
    const response = await fetch(
      `http://localhost:5000/soumissions/${selectedExercise.id}/detecter-plagiat`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Erreur lors de l'analyse du plagiat");
    }

    const result = await response.json(); */
    
    // Compter le nombre de plagiats détectés
    const plagiatsDetectes = results.filter(result => result.plagiat).length;
    
    // Afficher le résultat global
    if (plagiatsDetectes > 0) {
      showNotification(
        `${plagiatsDetectes} cas de plagiat détecté(s) !`,
        "error"
      );
    } else {
      showNotification("Aucun plagiat détecté dans les soumissions", "success");
    }
    
    // Rafraîchir les soumissions pour mettre à jour l'affichage
    await fetchSubmissions(selectedExercise.id);
    
  } catch (err) {
    console.error("Erreur:", err);
    showNotification(`Erreur lors de l'analyse: ${err.message}`, "error");
  } finally {
    setPlagiatLoading(false);
  }
};
  // Récupérer les exercices depuis l'API
  useEffect(() => {
    const fetchUserAndExercises = async () => {
      try {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();
        if (sessionError || !sessionData.session) {
          throw new Error("Utilisateur non authentifié.");
        }

        const token = sessionData.session.access_token;

        const response = await fetch("http://localhost:5000/mes-exercices", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des exercices.");
        }

        const data = await response.json();
        setExercises(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndExercises();
  }, []);

  // Récupérer les soumissions pour un exercice spécifique
  const fetchSubmissions = async (exerciseId) => {
    try {
      setLoading(true);
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        throw new Error("Utilisateur non authentifié.");
      }

      const token = sessionData.session.access_token;

      const response = await fetch(
        `http://localhost:5000/exercices/${exerciseId}/soumissions`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des soumissions.");
      }

      const data = await response.json();

      // Vérifie si la réponse contient un message spécifique ou si la liste est vide
      if (
        data.message === "Aucune soumission trouvée pour cet exercice." ||
        data.length === 0
      ) {
        setSubmissions([]);
        setError("Aucune soumission trouvée pour cet exercice.");
        return;
      }

      // Récupérer les informations des étudiants pour chaque soumission
      const enhancedSubmissions = await Promise.all(
        data.map(async (submission) => {
          const etudiantInfo = await getEtudiantById(
            submission.etudiant_id,
            "etudiants"
          );
          return {
            ...submission,
            studentName: etudiantInfo ? etudiantInfo.nom : "Étudiant inconnu",
            studentEmail: etudiantInfo ? etudiantInfo.email : null,
          };
        })
      );

      setSubmissions(enhancedSubmissions);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Soumettre la note
  const handleGradeSubmit = async (submissionId, exerciseId) => {
    try {
      if (!grade) {
        showNotification("Veuillez entrer une note.", "error");
        return;
      }

      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      const response = await fetch(
        `http://localhost:5000/${submissionId}/noter`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            grade,
            exerciseId,
          }),
        }
      );

      if (!response.ok) throw new Error("Erreur lors de l'envoi de la note.");

      showNotification("Note soumise avec succès !", "success");
      setSelectedSubmission(null);
      setGrade("");

      // Rafraîchir les soumissions
      await fetchSubmissions(exerciseId);
    } catch (err) {
      showNotification(`Erreur : ${err.message}`, "error");
    }
  };

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div
      className={`${darkMode ? "dark" : ""} min-h-screen flex flex-col`}
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/prof.png')",
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
            <FaUser className="text-blue-500" />
            Liste des Exercices Soumis
          </motion.h2>

          {loading ? (
            <motion.div
              className="flex justify-center py-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </motion.div>
          ) : error && !selectedExercise ? (
            <motion.p
              className="text-red-500 text-center p-4 bg-red-100/30 rounded-lg"
              variants={itemVariants}
            >
              Erreur: {error}
            </motion.p>
          ) : exercises.length === 0 ? (
            <motion.p
              className="text-gray-300 text-center p-6 bg-gray-800/50 rounded-lg"
              variants={itemVariants}
            >
              Aucun exercice disponible.
            </motion.p>
          ) : (
            <motion.div className="space-y-4" variants={containerVariants}>
              {exercises.map((exercise, index) => (
                <motion.div
                  key={exercise.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/90 dark:bg-gray-700 p-4 rounded-lg shadow-md flex justify-between items-center hover:shadow-xl transition"
                >
                  <div>
                    <p className="text-lg font-bold text-gray-800 dark:text-white">
                      Exercice : {exercise.titre ?? "Sans titre"}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Description :{" "}
                      {exercise.commentaire?.substring(0, 60) ??
                        "Aucune description"}
                      ...
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedExercise(exercise);
                      fetchSubmissions(exercise.id);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-600 transition flex items-center gap-2"
                  >
                    Voir les soumissions
                    {selectedExercise?.id === exercise.id ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Afficher les soumissions de l'exercice sélectionné */}
        <AnimatePresence>
          {selectedExercise && (
            <motion.div
              key="submissions"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={containerVariants}
              className="relative z-10 bg-white/20 dark:bg-gray-800/80 backdrop-blur-lg p-8 rounded-lg shadow-2xl max-w-4xl w-full mt-8"
            >
              <div className="flex justify-between items-center mb-6">
                <motion.h3
                  variants={itemVariants}
                  className="text-2xl font-bold text-gray-100 dark:text-white"
                >
                  Soumissions pour l'exercice {" "}
                  {selectedExercise.titre ?? selectedExercise.id}
                </motion.h3>
                
                {/* Bouton global de détection de plagiat */}
                {submissions.length > 0 && (
                  <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePlagiatDetection}
                    disabled={plagiatLoading}
                    className={`px-6 py-3 rounded-lg font-bold transition flex items-center gap-2
                      ${plagiatLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'} 
                      text-white`}
                  >
                    {plagiatLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Analyse en cours...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                          <path fillRule="evenodd" d="M12 3a9 9 0 100 18 9 9 0 000-18zM1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
                        </svg>
                        Détecter les plagiats
                      </>
                    )}
                  </motion.button>

                  {/* Nouveau bouton pour accéder à la page de détails des plagiats */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/exercice/${selectedExercise.id}/plagiat`)}
                    className="px-6 py-3 rounded-lg font-bold transition flex items-center gap-2 
                      bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Voir les détails des plagiats
                  </motion.button>
                  </div>
                )}
              </div>

              {loading ? (
                <motion.div
                  className="flex justify-center py-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </motion.div>
              ) : error ? (
                <motion.p
                  variants={itemVariants}
                  className="text-red-500 text-center p-4 bg-red-100/30 rounded-lg"
                >
                  {error}
                </motion.p>
              ) : submissions.length === 0 ? (
                <motion.p
                  variants={itemVariants}
                  className="text-gray-300 text-center p-6 bg-gray-800/50 rounded-lg"
                >
                  Aucune soumission pour cet exercice.
                </motion.p>
              ) : (
                <motion.div variants={containerVariants} className="space-y-4">
                  {submissions.map((submission) => (
                    <motion.div
                      key={submission.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white/90 dark:bg-gray-700 p-4 rounded-lg shadow-md flex justify-between items-center hover:shadow-xl transition"
                    >
                      <div>
                        <p className="text-lg font-bold text-gray-800 dark:text-white">
                          Étudiant : {submission.studentName ?? "Inconnu"}
                        </p>
                        {submission.note && (
                          <p className="text-green-600 dark:text-green-400 font-medium">
                            Note : {submission.note}/20
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedSubmission(submission)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-600 transition"
                        >
                          {submission.note ? "Modifier la note" : "Noter"}
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Visualisation et notation de la soumission */}
        <AnimatePresence>
          {selectedSubmission && (
            <motion.div
              key="grading"
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
                Soumission de {selectedSubmission.studentName}
              </motion.h3>
              <motion.div
                variants={itemVariants}
                className="bg-white/90 dark:bg-gray-700 p-4 rounded-lg"
              >
                <p className="text-gray-800 dark:text-gray-200 mb-2">
                  <strong>Titre :</strong> {selectedSubmission.exerciseTitle}
                </p>
                <p className="text-gray-800 dark:text-gray-200 mb-2">
                  <strong>Description :</strong>{" "}
                  {selectedSubmission.description}
                </p>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  variants={itemVariants}
                  href={selectedSubmission.fichier_reponse}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 dark:text-blue-400 underline flex items-center gap-2 w-fit"
                >
                  <FaFileDownload /> Télécharger le fichier soumis
                </motion.a>
              </motion.div>

              {/* Formulaire pour attribuer une note */}
              <motion.div
                variants={itemVariants}
                className="mt-6 bg-white/90 dark:bg-gray-700 p-4 rounded-lg"
              >
                <label className="block text-gray-800 dark:text-white font-bold mb-2">
                  Attribuer une note :
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white focus:outline-none"
                  placeholder="Entrez une note sur 20"
                />
                <div className="flex gap-4 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      handleGradeSubmit(
                        selectedSubmission.id,
                        selectedExercise.id
                      )
                    }
                    className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-600 transition flex items-center gap-2"
                  >
                    <FaCheckCircle /> Soumettre la note
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAIGrading(selectedSubmission, selectedExercise.id)}
                    className="bg-purple-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-purple-600 transition flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.563-.649-1.413-1.076-2.353-1.253V5z" clipRule="evenodd" />
                    </svg>
                    Notation IA
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSubmission(null)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition"
                  >
                    Fermer
                  </motion.button>
                </div>
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
      {aiLoading && (
  <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50 rounded-lg z-10">
    <div className="text-white text-center">
      <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
      <p>Analyse du PDF par l'IA...</p>
    </div>
  </div>
)}
    </div>
    
  );
};

export default ExercicesSoumis;
