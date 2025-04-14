import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getEtudiant, listenToAuthChanges, signInWithEmail, signInWithOAuthEtudiant, updateEtudiantProfile } from "../../backend/services/authServices";
import "../styles/signin.css";
// Import de Framer Motion pour les animations
import { motion, AnimatePresence } from "framer-motion";

const LoginEtudiant = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [classe, setClasse] = useState("");
  const [filiere, setFiliere] = useState("");
  const [showAdditionalForm, setShowAdditionalForm] = useState(false);
  const [isPageMounted, setIsPageMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsPageMounted(true);
    
    const checkUser = async () => {
      try {
        const userWithData = await getEtudiant();

        if (!userWithData) {
          return;
        }

        setUser(userWithData);

        if (!userWithData.role) {
          return;
        }

        navigate("/dashboard-etudiant");
      } catch (err) {
        console.error("Erreur lors de la vérification de l'utilisateur:", err);
      }
    };

    checkUser();
    listenToAuthChanges(setUser);
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmail(email, password, false);

      const userWithData = await getEtudiant();
      if (!userWithData || !userWithData.role) {
        throw new Error("Impossible de récupérer les informations de l'utilisateur");
      }

      setUser(userWithData);
      navigate("/dashboard-etudiant");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider) => {
    setError("");

    try {
      const user = await signInWithOAuthEtudiant("etudiant", provider);
      if (user) {
        console.log("Connexion OAuth réussie, redirection...");
        setShowAdditionalForm(true);
      }
    } catch (error) {
      setError(`Erreur avec ${provider}: ${error.message}`);
    }
  };

  const handleAdditionalInfoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateEtudiantProfile({ classe, filiere });
      console.log("Informations supplémentaires enregistrées avec succès !");
      navigate("/dashboard-etudiant");
    } catch (err) {
      console.error("Erreur lors de l'enregistrement des informations supplémentaires :", err);
      setError("Erreur lors de l'enregistrement des informations supplémentaires.");
    } finally {
      setLoading(false);
    }
  };

  // Animations pour le conteneur de la carte
  const cardContainerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.4,
        when: "beforeChildren"
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  // Animation spéciale pour la carte de connexion - effet 3D subtil
  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 30,
      rotateX: 10
    },
    visible: { 
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
        duration: 0.6
      }
    }
  };

  // Animation pour les éléments du formulaire - entrée par le côté
  const formItemVariants = {
    hidden: { 
      x: -20, 
      opacity: 0
    },
    visible: (custom) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: custom * 0.1,
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }
    })
  };

  // Animation pour les boutons OAuth - effet rebond
  const oauthButtonVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.15,
        type: "spring",
        stiffness: 120,
        damping: 8
      }
    }),
    hover: {
      scale: 1.03,
      y: -3,
      boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.97,
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
    }
  };

  // Animation de la navbar - apparition progressive avec un effet de glissement
  const navbarVariants = {
    hidden: { 
      y: -50, 
      opacity: 0 
    },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 50,
        delay: 0.1,
        duration: 0.5
      } 
    }
  };

  // Animation pour les messages d'erreur
  const errorVariants = {
    hidden: { 
      opacity: 0, 
      y: -10, 
      height: 0 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      height: "auto",
      transition: { 
        type: "spring", 
        stiffness: 100 
      } 
    },
    exit: { 
      opacity: 0, 
      height: 0,
      transition: { 
        duration: 0.2 
      } 
    }
  };

  // Animation pour le bouton de connexion
  const loginButtonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        delay: 0.4, 
        type: "spring", 
        stiffness: 200, 
        damping: 10 
      }
    },
    hover: { 
      scale: 1.05,
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
      transition: { 
        duration: 0.2
      }
    },
    tap: { 
      scale: 0.98
    }
  };

  return (
    <div className="login-container">
      <motion.nav 
        className="navbar"
        initial="hidden"
        animate="visible"
        variants={navbarVariants}
      >
        <motion.div 
          className="navbar-brand"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          Plateforme SGBD
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Link to="/" className="navbar-link">Retour à l'accueil</Link>
        </motion.div>
      </motion.nav>

      <main className="login-main">
        <AnimatePresence mode="wait">
          <motion.div 
            key={showAdditionalForm ? "additional" : "login"}
            className="login-card"
            initial="hidden"
            animate={isPageMounted ? "visible" : "hidden"}
            exit="exit"
            variants={cardContainerVariants}
          >
            <motion.div variants={cardVariants}>
              {!showAdditionalForm ? (
                <>
                  <motion.h1 
                    className="login-title"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    Connexion
                  </motion.h1>
                  
                  <motion.p 
                    className="login-subtitle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    Accédez à votre espace étudiant
                  </motion.p>

                  <AnimatePresence>
                    {error && (
                      <motion.div 
                        className="login-error-message"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={errorVariants}
                      >
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.form onSubmit={handleLogin} className="login-form">
                    <motion.div 
                      className="form-group"
                      variants={formItemVariants}
                      custom={0}
                    >
                      <motion.input
                        type="email"
                        name="email"
                        placeholder="Adresse email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input"
                        required
                        whileFocus={{ 
                          scale: 1.02, 
                          boxShadow: "0 0 0 2px rgba(66, 153, 225, 0.3)",
                          transition: { type: "spring", stiffness: 300 }
                        }}
                      />
                    </motion.div>

                    <motion.div 
                      className="form-group"
                      variants={formItemVariants}
                      custom={1}
                    >
                      <motion.input
                        type="password"
                        name="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-input"
                        required
                        whileFocus={{ 
                          scale: 1.02, 
                          boxShadow: "0 0 0 2px rgba(66, 153, 225, 0.3)",
                          transition: { type: "spring", stiffness: 300 }
                        }}
                      />
                    </motion.div>

                    <motion.button 
                      type="submit" 
                      className="login-button" 
                      disabled={isLoading}
                      variants={loginButtonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      {isLoading ? (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          Connexion en cours...
                        </motion.span>
                      ) : (
                        "Se connecter"
                      )}
                    </motion.button>
                  </motion.form>

                  <motion.div 
                    className="login-separator"
                    initial={{ opacity: 0, scaleX: 0.5 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7, duration: 0.3 }}
                    >
                      OU
                    </motion.span>
                  </motion.div>

                  <motion.div className="oauth-buttons">
                    <motion.button 
                      type="button" 
                      onClick={() => handleOAuthLogin("google")} 
                      className="oauth-button google"
                      variants={oauthButtonVariants}
                      custom={0}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <span className="oauth-icon">G</span>
                      Continuer avec Google
                    </motion.button>

                    <motion.button 
                      type="button" 
                      onClick={() => handleOAuthLogin("github")} 
                      className="oauth-button github"
                      variants={oauthButtonVariants}
                      custom={1}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <span className="oauth-icon">G</span>
                      Continuer avec GitHub
                    </motion.button>
                  </motion.div>
                </>
              ) : (
                <motion.form 
                  onSubmit={handleAdditionalInfoSubmit} 
                  className="additional-info-form"
                  initial="hidden"
                  animate="visible"
                  variants={cardContainerVariants}
                >
                  <motion.h2 
                    className="login-title"
                    variants={formItemVariants}
                    custom={0}
                  >
                    Informations supplémentaires
                  </motion.h2>
                  
                  <motion.p 
                    className="login-subtitle"
                    variants={formItemVariants}
                    custom={1}
                  >
                    Veuillez renseigner votre classe et votre filière
                  </motion.p>

                  <AnimatePresence>
                    {error && (
                      <motion.div 
                        className="login-error-message"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={errorVariants}
                      >
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div 
                    className="form-group"
                    variants={formItemVariants}
                    custom={2}
                  >
                    <motion.input
                      type="text"
                      name="classe"
                      placeholder="Classe"
                      value={classe}
                      onChange={(e) => setClasse(e.target.value)}
                      className="form-input"
                      required
                      whileFocus={{ 
                        scale: 1.02, 
                        boxShadow: "0 0 0 2px rgba(66, 153, 225, 0.3)",
                        transition: { type: "spring", stiffness: 300 }
                      }}
                    />
                  </motion.div>

                  <motion.div 
                    className="form-group"
                    variants={formItemVariants}
                    custom={3}
                  >
                    <motion.input
                      type="text"
                      name="filiere"
                      placeholder="Filière"
                      value={filiere}
                      onChange={(e) => setFiliere(e.target.value)}
                      className="form-input"
                      required
                      whileFocus={{ 
                        scale: 1.02, 
                        boxShadow: "0 0 0 2px rgba(66, 153, 225, 0.3)",
                        transition: { type: "spring", stiffness: 300 }
                      }}
                    />
                  </motion.div>

                  <motion.button 
                    type="submit" 
                    className="login-button" 
                    disabled={isLoading}
                    variants={loginButtonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    {isLoading ? "Enregistrement..." : "Enregistrer"}
                  </motion.button>
                </motion.form>
              )}

              <motion.p 
                className="register-link"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                Pas encore inscrit ?{" "}
                <motion.span
                  whileHover={{ 
                    scale: 1.05, 
                    color: "#007bff",
                    transition: { duration: 0.2 }
                  }}
                >
                  <Link to="/register" className="register-link-text">Créer un compte</Link>
                </motion.span>
              </motion.p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default LoginEtudiant;