import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";
import { motion, AnimatePresence } from "framer-motion";

function ExerciseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exercice, setExercice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submittedFile, setSubmittedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchExercice = async () => {
      try {
        const response = await fetch(`http://localhost:5000/exercices/${id}`);
        if (!response.ok)
          throw new Error("Erreur lors de la récupération de l'exercice");
        const data = await response.json();
        setExercice(data);
        setLoading(false);
        // Déclenchement d'animation après le chargement des données
        setTimeout(() => setIsPageLoaded(true), 100);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
      else console.error("Erreur utilisateur:", error);
    };

    fetchExercice();
    fetchUser();
  }, [id]);

  const handleFileChange = (event) => {
    setSubmittedFile(event.target.files[0]);
    // Animation de succès lors de la sélection d'un fichier
    if (event.target.files[0]) {
      setMessage("Fichier sélectionné avec succès !");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  const handleSubmitWork = async (event) => {
    event.preventDefault();
    if (!submittedFile || !userId) {
      setMessage("Veuillez sélectionner un fichier PDF et être connecté.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("pdf", submittedFile);
    formData.append("etudiant_id", userId);

    try {
      const response = await fetch(
        `http://localhost:5000/exercices/${id}/submit`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setMessage(
        response.ok
          ? "✅ Travail soumis avec succès !"
          : data.error || "❌ Erreur lors de la soumission."
      );
    } catch (error) {
      setMessage("❌ Erreur réseau");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Variantes d'animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div
      className={`${darkMode ? "dark" : ""} relative min-h-screen transition-colors duration-500`}
      style={{
        backgroundImage: `url("/images/etudiant.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay avec animation de fondu */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1 }}
        className={`absolute inset-0 ${darkMode ? 'bg-zinc-900' : 'bg-gray-800'} z-0`}
        style={{ mixBlendMode: 'overlay' }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col bg-gradient-to-b from-gray-50/80 to-white/80 dark:from-zinc-900/80 dark:to-black/80 transition-colors duration-500">
        {/* Header avec animation de glissement */}
        <motion.header 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 50 }}
          className="bg-gradient-to-r from-gray-700/95 to-gray-800/95 dark:from-zinc-900/95 dark:to-black/95 backdrop-blur-lg py-5 px-8 shadow-lg flex justify-between items-center"
        >
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-white flex items-center"
          >
            <motion.span
              animate={{ rotate: [0, 10, 0] }}
              transition={{ repeat: Infinity, repeatDelay: 5, duration: 0.5 }}
            >
              📘
            </motion.span>
            <span className="ml-2">Plateforme SGBD</span>
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/dashboard-etudiant")}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-semibold transition shadow-md"
            >
              Retour
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className="bg-zinc-600 hover:bg-zinc-700 text-white px-4 py-2 rounded-md font-semibold transition shadow-md"
            >
              {darkMode ? "☀️ Mode Clair" : "🌙 Mode Sombre"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-semibold transition shadow-md"
            >
              Déconnexion
            </motion.button>
          </motion.div>
        </motion.header>

        {/* Main */}
        <main className="flex-grow flex justify-center items-start py-12 px-4">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="w-16 h-16 border-4 border-gray-500 border-t-transparent rounded-full mb-4"
              />
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Chargement...
              </p>
            </motion.div>
          ) : error ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-4 rounded-lg shadow"
            >
              {error}
            </motion.p>
          ) : (
            <AnimatePresence>
              {isPageLoaded && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 backdrop-blur-md bg-gradient-to-br from-white/95 to-gray-100/95 dark:from-zinc-900/95 dark:to-black/95 rounded-2xl shadow-2xl p-8 overflow-hidden border border-gray-200 dark:border-zinc-800"
                >
                  {/* Détails exercice */}
                  <motion.div 
                    variants={itemVariants}
                    className="flex-1"
                  >
                    <motion.h2 
                      variants={itemVariants}
                      className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200"
                    >
                      Détails de l'exercice {exercice.id}
                    </motion.h2>
                    <motion.p variants={itemVariants} className="mb-2 text-gray-800 dark:text-gray-300">
                      <strong className="text-gray-700 dark:text-gray-300">Commentaire:</strong> {exercice.commentaire}
                    </motion.p>
                    <motion.p variants={itemVariants} className="text-gray-800 dark:text-gray-300">
                      <strong className="text-gray-700 dark:text-gray-300">Date limite:</strong>{" "}
                      {new Date(exercice.date_limite).toLocaleString()}
                    </motion.p>

                    {exercice.pdf_url && (
                      <motion.div 
                        variants={itemVariants}
                        className="mt-6"
                      >
                        <h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">
                          Aperçu du PDF :
                        </h3>
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 600, opacity: 1 }}
                          transition={{ 
                            duration: 0.5, 
                            height: { delay: 0.2, type: "spring" },
                            opacity: { delay: 0.3 }
                          }}
                          className="overflow-hidden rounded-lg border border-gray-300 dark:border-zinc-700 shadow-lg"
                        >
                          <embed
                            src={exercice.pdf_url}
                            type="application/pdf"
                            width="100%"
                            height="600px"
                            className="border-0"
                          />
                        </motion.div>
                      </motion.div>
                    )}

                    <motion.a
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                      href={exercice.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-block text-gray-600 dark:text-gray-400 hover:underline font-medium"
                    >
                      Télécharger le PDF
                    </motion.a>
                  </motion.div>

                  {/* Soumission */}
                  <motion.div
                    variants={itemVariants}
                    className="w-full lg:w-1/3 p-6 bg-gradient-to-br from-white to-gray-50 dark:from-zinc-800 dark:to-zinc-900 shadow-xl rounded-xl border border-gray-200 dark:border-zinc-700"
                  >
                    <motion.h3 
                      variants={itemVariants}
                      className="text-2xl font-semibold mb-5 text-gray-800 dark:text-gray-200"
                    >
                      Soumettre votre travail
                    </motion.h3>
                    <motion.form 
                      variants={itemVariants}
                      onSubmit={handleSubmitWork} 
                      className="space-y-5"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={triggerFileInput}
                        className="border-2 border-dashed border-gray-300 dark:border-zinc-600 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-gray-500 dark:hover:border-gray-400 transition-all duration-200 bg-white/70 dark:bg-zinc-900/70"
                      >
                        <motion.div
                          animate={{ 
                            y: [0, -5, 0],
                            transition: {
                              y: {
                                repeat: Infinity,
                                duration: 2,
                                ease: "easeInOut"
                              }
                            }
                          }}
                          className="text-4xl mb-2"
                        >
                          📄
                        </motion.div>
                        <p className="text-center text-gray-700 dark:text-gray-300">
                          {submittedFile 
                            ? `Fichier sélectionné : ${submittedFile.name}` 
                            : "Cliquez pour sélectionner votre fichier PDF"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Format accepté : PDF
                        </p>
                      </motion.div>
                      
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        disabled={isSubmitting || !submittedFile}
                        className={`w-full flex items-center justify-center gap-2 ${
                          isSubmitting || !submittedFile
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800"
                        } text-white font-semibold py-3 px-4 rounded-md transition shadow-md`}
                      >
                        {isSubmitting ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                            <span>Soumission en cours...</span>
                          </>
                        ) : (
                          <>
                            <span>✅</span>
                            <span>Soumettre mon travail</span>
                          </>
                        )}
                      </motion.button>
                    </motion.form>

                    <AnimatePresence>
                      {message && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`mt-4 p-3 rounded-md ${
                            message.includes("succès")
                              ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                              : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                          } shadow-sm`}
                        >
                          <p className="text-center font-medium">
                            {message}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </main>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-gray-800/90 to-gray-900/90 dark:from-zinc-900/90 dark:to-black/90 backdrop-blur-md text-white text-center py-4 shadow-inner"
        >
          <p className="text-sm">
            © 2025 Plateforme SGBD. Tous droits réservés.
          </p>
        </motion.footer>
      </div>
    </div>
  );
}

export default ExerciseDetail;