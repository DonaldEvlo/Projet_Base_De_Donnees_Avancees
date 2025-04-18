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
                <motion.button
                         whileHover={{ scale: 1.05 }}
                         whileTap={{ scale: 0.95 }}
                         onClick={() => navigate("/")}
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