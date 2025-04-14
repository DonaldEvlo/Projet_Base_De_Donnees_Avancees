import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmail, signUpWithEmail } from "../../backend/services/authServices";
import "../styles/signup.css";
// Ajoutez ces imports pour l'animation
import { motion } from "framer-motion";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "professeur",
    classe: "",
    filiere: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const navigate = useNavigate();

  // Afficher le formulaire après un court délai pour l'animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFormVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await signUpWithEmail(
        formData.username,
        formData.email,
        formData.password,
        formData.role,
        formData.classe,
        formData.filiere
      );

      await signInWithEmail(formData.email, formData.password);

      console.log("✅ Utilisateur inscrit :", user);

      console.log("🔑 Connexion réussie ! Le rôle est", formData.role);
      if (formData.role === "etudiant") {
        console.log("Le rôle est :", formData.role);
        navigate("/dashboard-etudiant");
      } else {
        navigate("/dashboard-prof");
      }
    } catch (err) {
      console.error("❌ Erreur d'inscription :", err);
      setError(err.message || "Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  // Variantes d'animation pour les éléments
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100,
        damping: 10
      }
    }
  };

  const formGroupVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100
      }
    }
  };

  // Animation pour le bouton
  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 }
  };

  return (
    <div className="register-container">
      <motion.nav 
        className="navbar"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div 
          className="navbar-brand"
          whileHover={{ scale: 1.05 }}
        >
          Plateforme SGBD
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
        >
          <Link to="/" className="navbar-link">Retour à l'accueil</Link>
        </motion.div>
      </motion.nav>

      <main className="register-main">
        <motion.div 
          className="register-card"
          initial="hidden"
          animate={isFormVisible ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.h1 
            className="register-title"
            variants={itemVariants}
          >
            Créer un compte
          </motion.h1>
          
          <motion.p 
            className="register-subtitle"
            variants={itemVariants}
          >
            Rejoignez notre plateforme en tant qu'enseignant ou étudiant
          </motion.p>

          {error && (
            <motion.div 
              className="register-error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {error}
            </motion.div>
          )}

          <motion.form 
            onSubmit={handleSubmit} 
            className="register-form"
            variants={containerVariants}
          >
            {/* Sélection du rôle */}
            <motion.div 
              className="form-group role-selection"
              variants={formGroupVariants}
            >
              <motion.label 
                className="role-option"
                whileHover={{ scale: 1.05 }}
              >
                <input
                  type="radio"
                  name="role"
                  value="professeur"
                  checked={formData.role === "professeur"}
                  onChange={handleChange}
                />
                <motion.span className="role-label teacher-label">Enseignant</motion.span>
              </motion.label>

              <motion.label 
                className="role-option"
                whileHover={{ scale: 1.05 }}
              >
                <input
                  type="radio"
                  name="role"
                  value="etudiant"
                  checked={formData.role === "etudiant"}
                  onChange={handleChange}
                />
                <motion.span className="role-label student-label">Étudiant</motion.span>
              </motion.label>
            </motion.div>

            {/* Champs du formulaire */}
            {["username", "email", "password", "classe", "filiere"].map((field, index) => (
              <motion.div 
                key={field}
                className="form-group"
                variants={formGroupVariants}
                custom={index}
              >
                <motion.input
                  type={field === "password" ? "password" : field === "email" ? "email" : "text"}
                  name={field}
                  placeholder={
                    field === "username" ? "Nom d'utilisateur" :
                    field === "email" ? "Adresse email" :
                    field === "password" ? "Mot de passe" :
                    field === "classe" ? "Classe" : "Filière"
                  }
                  value={formData[field]}
                  onChange={handleChange}
                  className="form-input"
                  required
                  whileFocus={{ scale: 1.02, boxShadow: "0 0 8px rgba(0, 123, 255, 0.5)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              </motion.div>
            ))}

            <motion.button 
              type="submit" 
              className="register-button" 
              disabled={loading}
              variants={buttonVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
            >
              {loading ? (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Création du compte...
                </motion.span>
              ) : (
                "S'inscrire"
              )}
            </motion.button>
          </motion.form>

          <motion.p 
            className="login-link"
            variants={itemVariants}
          >
            Déjà un compte ? {" "}
            <motion.span
              whileHover={{ scale: 1.05, color: "#007bff" }}
            >
              <Link to="/login">Se connecter</Link>
            </motion.span>
          </motion.p>
        </motion.div>
      </main>
    </div>
  );
}

export default Register;