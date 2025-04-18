import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getProf,
  listenToAuthChanges,
  signInWithEmail,
  signInWithOAuthProf,
} from "../../backend/services/authServices";
import "../styles/signin.css";
// Import de Framer Motion pour les animations
import { motion } from "framer-motion";

const LoginProf = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🚀 useEffect exécuté");
    
    // Démarrer les animations après un court délai
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 100);

    const checkUser = async () => {
      try {
        console.log("🔍 Appel de getUser...");
        const userWithData = await getProf();

        if (!userWithData) {
          console.warn("⚠️ Aucun utilisateur trouvé, connexion requise.");
          return;
        }

        console.log("✅ Utilisateur récupéré :", userWithData);
        setUser(userWithData);

        const userRole = userWithData.role;
        if (!userRole) {
          console.error("❌ Erreur : rôle non défini !");
          return;
        }

        const destination = "/dashboard-prof";
        console.log("🔀 Redirection vers :", destination);
        navigate(destination);
      } catch (err) {
        console.error("❌ Erreur lors de la vérification de l'utilisateur:", err);
      }
    };

    checkUser();

    // 🔄 Écouter les changements d'authentification
    listenToAuthChanges(setUser);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("🔑 Tentative de connexion avec", email, password);
      
      await signInWithEmail(email, password, true);
      console.log("✅ Connexion réussie !");

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const userWithData = await getProf();
      if (!userWithData || !userWithData.role) {
        throw new Error("Impossible de récupérer les informations de l'utilisateur");
      }

      setUser(userWithData);
      const destination = "/dashboard-prof";
      navigate(destination);
    } catch (err) {
      console.error("❌ Erreur lors de la connexion :", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider) => {
    setError("");
  
    try {
      const user = await signInWithOAuthProf("etudiant", provider);
      if (user) {
        console.log("✅ Connexion OAuth réussie, redirection...");
        navigate("/dashboard-etudiant");
      }
    } catch (error) {
      setError(`Erreur avec ${provider}: ${error.message}`);
    }
  };

  // Variantes pour l'effet de perspective
  const pageVariants = {
    initial: {
      opacity: 0,
      perspective: 800
    },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  // Variantes pour la barre de navigation
  const navbarVariants = {
    initial: { 
      opacity: 0, 
      y: -30 
    },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 0.1
      }
    }
  };

  // Variantes pour la carte de connexion - effet de perspective
  const cardVariants = {
    initial: { 
      opacity: 0,
      rotateY: -5,
      scale: 0.98,
      y: 20
    },
    animate: { 
      opacity: 1,
      rotateY: 0,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 15,
        delay: 0.3,
        duration: 0.6
      }
    }
  };

  // Animation pour les titres
  const titleVariants = {
    initial: { 
      opacity: 0, 
      x: -30 
    },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: 0.4
      }
    }
  };

  // Animation pour le formulaire - défilement de haut en bas
  const formItemVariants = {
    initial: { 
      opacity: 0, 
      y: -15 
    },
    animate: (custom) => ({ 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: 0.5 + (custom * 0.1)
      }
    })
  };

  // Animation pour le bouton de connexion - pulsation
  const buttonVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.9
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.8
      }
    },
    hover: { 
      scale: 1.03,
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: { 
      scale: 0.97,
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)"
    },
    loading: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "loop"
      }
    }
  };

  // Animation pour le séparateur
  const separatorVariants = {
    initial: { 
      opacity: 0, 
      width: "0%" 
    },
    animate: { 
      opacity: 1, 
      width: "100%",
      transition: {
        delay: 0.9,
        duration: 0.5
      }
    }
  };

  // Animation pour les boutons OAuth - apparition progressive
  const oauthButtonVariants = {
    initial: { 
      opacity: 0, 
      y: 20,
      scale: 0.9
    },
    animate: (custom) => ({ 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 10,
        delay: 1.0 + (custom * 0.2)
      }
    }),
    hover: { 
      y: -3,
      scale: 1.03,
      boxShadow: "0 8px 15px rgba(0, 0, 0, 0.1)",
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10
      }
    },
    tap: { 
      y: 0,
      scale: 0.97
    }
  };

  // Animation pour le lien d'inscription
  const registerLinkVariants = {
    initial: { 
      opacity: 0 
    },
    animate: { 
      opacity: 1,
      transition: {
        delay: 1.4,
        duration: 0.5
      }
    }
  };

  // Animation pour le message d'erreur
  const errorVariants = {
    initial: { 
      opacity: 0, 
      y: -10,
      height: 0 
    },
    animate: { 
      opacity: 1, 
      y: 0,
      height: "auto",
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    exit: { 
      opacity: 0, 
      height: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.div 
      className="login-container"
      initial="initial"
      animate={animationComplete ? "animate" : "initial"}
      variants={pageVariants}
    >
      {/* Navbar avec animation */}
      <motion.nav 
        className="navbar"
        variants={navbarVariants}
      >
        <motion.div 
          className="navbar-brand"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          Plateforme SGBD
        </motion.div>
        
        <motion.button
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 onClick={() => navigate("/login")}
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
      </motion.nav>

      <main className="login-main">
        <motion.div 
          className="login-card"
          variants={cardVariants}
          style={{ transformOrigin: "center center" }}
        >
          <motion.h1 
            className="login-title"
            variants={titleVariants}
          >
            Connexion
          </motion.h1>
          
          <motion.p 
            className="login-subtitle"
            variants={titleVariants}
          >
            Accédez à votre espace personnel
          </motion.p>

          {error && (
            <motion.div 
              className="login-error-message"
              variants={errorVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {error}
            </motion.div>
          )}

          <motion.form 
            onSubmit={handleLogin} 
            className="login-form"
          >
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
                  boxShadow: "0 0 0 2px rgba(0, 123, 255, 0.25)",
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
                  boxShadow: "0 0 0 2px rgba(0, 123, 255, 0.25)",
                  transition: { type: "spring", stiffness: 300 }
                }}
              />
            </motion.div>

            <motion.button 
              type="submit" 
              className="login-button" 
              disabled={isLoading}
              variants={buttonVariants}
              whileHover={!isLoading && "hover"}
              whileTap={!isLoading && "tap"}
              animate={isLoading ? "loading" : "animate"}
            >
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </motion.button>
          </motion.form>

          <motion.div 
            className="login-separator"
            variants={separatorVariants}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                transition: { delay: 1.0, duration: 0.3 }
              }}
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
              <motion.span className="oauth-icon">G</motion.span>
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
              <motion.span className="oauth-icon">G</motion.span>
              Continuer avec GitHub
            </motion.button>
          </motion.div>

          <motion.p 
            className="register-link"
            variants={registerLinkVariants}
          >
            Pas encore inscrit ?{" "}
            <motion.span
              whileHover={{ 
                color: "#007bff", 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
            >
              <Link to="/register" className="register-link-text">
                Créer un compte
              </Link>
            </motion.span>
          </motion.p>
        </motion.div>
      </main>
    </motion.div>
  );
};

export default LoginProf;