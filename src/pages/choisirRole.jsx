import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/signin.css";
// Import de Framer Motion pour les animations
import { motion } from "framer-motion";

const ChooseRole = () => {
  const navigate = useNavigate();
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  // Déclencher l'animation après le montage du composant
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const handleChoose = (role) => {
    if (role === "teacher") {
      navigate("/login/prof");
    } else if (role === "student") {
      navigate("/login/etudiant");
    }
  };

  // Variantes d'animation pour le conteneur principal
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  // Variantes pour les éléments enfants
  const childVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 90,
        damping: 12
      }
    }
  };

  // Variantes pour les boutons
  const buttonVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    },
    tap: {
      scale: 0.98,
      boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)"
    }
  };

  // Animation pour la barre de navigation
  const navbarVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  };

  return (
    <div className="login-container">
      {/* Navbar avec animation */}
      <motion.nav 
        className="navbar"
        initial="hidden"
        animate="visible"
        variants={navbarVariants}
      >
        <motion.div 
          className="navbar-brand"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          Plateforme SGBD
        </motion.div>
      </motion.nav>

      <main className="login-main">
        <motion.div 
          className="login-card"
          initial="hidden"
          animate={isPageLoaded ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.h1 
            className="login-title"
            variants={childVariants}
          >
            Qui êtes-vous ?
          </motion.h1>
          
          <motion.p 
            className="login-subtitle"
            variants={childVariants}
          >
            Choisissez votre rôle pour continuer
          </motion.p>

          <motion.div 
            className="oauth-buttons"
            variants={childVariants}
          >
            <motion.button
              type="button"
              className="oauth-button google"
              onClick={() => handleChoose("teacher")}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                Je suis Professeur
              </motion.span>
            </motion.button>

            <motion.button
              type="button"
              className="oauth-button github"
              onClick={() => handleChoose("student")}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                Je suis Étudiant
              </motion.span>
            </motion.button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default ChooseRole;