import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/signup.css";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "teacher" // Ajout du rôle
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Ajoutez ici la logique pour envoyer les données au backend
  };

  return (
    <div className="register-container">
      {/* Navbar cohérente avec l'accueil */}
      <nav className="navbar">
        <div className="navbar-brand">Plateforme SGBD</div>
        <Link to="/" className="navbar-link">Retour à l'accueil</Link>
      </nav>

      <main className="register-main">
        <div className="register-card">
          <h1 className="register-title">Créer un compte</h1>
          <p className="register-subtitle">
            Rejoignez notre plateforme en tant qu'enseignant ou étudiant
          </p>

          <form onSubmit={handleSubmit} className="register-form">
            {/* Sélection du rôle */}
            <div className="form-group role-selection">
              <label className="role-option">
                <input
                  type="radio"
                  name="role"
                  value="teacher"
                  checked={formData.role === "teacher"}
                  onChange={handleChange}
                />
                <span className="role-label teacher-label">Enseignant</span>
              </label>
              
              <label className="role-option">
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={formData.role === "student"}
                  onChange={handleChange}
                />
                <span className="role-label student-label">Étudiant</span>
              </label>
            </div>

            {/* Champs du formulaire */}
            <div className="form-group">
              <input
                type="text"
                name="username"
                placeholder="Nom d'utilisateur"
                value={formData.username}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Adresse email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="Mot de passe"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <button type="submit" className="register-button">
              S'inscrire
            </button>
          </form>

          <p className="login-link">
            Déjà un compte ? <Link to="/login">Se connecter</Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Register;