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
      const enhancedSubmissions = await Promise.all(data.map(async (submission) => {
        const etudiantInfo = await getEtudiantById(submission.etudiant_id, 'etudiants');
        return {
          ...submission,
          studentName: etudiantInfo ? etudiantInfo.nom : "Étudiant inconnu",
          studentEmail: etudiantInfo ? etudiantInfo.email : null,
        };
      }));

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
              <motion.h3
                variants={itemVariants}
                className="text-2xl font-bold text-gray-100 dark:text-white mb-4"
              >
                Soumissions pour l'exercice {selectedExercise.titre ?? selectedExercise.id}
              </motion.h3>

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
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedSubmission(submission)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-600 transition"
                      >
                        {submission.note ? "Modifier la note" : "Noter"}
                      </motion.button>
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
    </div>
  );
};

export default ExercicesSoumis;