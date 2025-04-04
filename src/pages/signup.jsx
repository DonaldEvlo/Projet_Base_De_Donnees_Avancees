import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmail, signUpWithEmail } from "../../backend/services/authServices";
import "../styles/signup.css";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "professeur", // default: teacher
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
        formData.role
      );

      await signInWithEmail(formData.email, formData.password);

      console.log("✅ Utilisateur inscrit :", user);

      console.log("🔑 Connexion réussie ! LE role est", formData.role);
      if (formData.role === "etudiant") {
        console.log("Le role est :", formData.role);
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

  return (
    <div className="register-container">
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

          {error && <div className="register-error">{error}</div>}

          <form onSubmit={handleSubmit} className="register-form">
            {/* Sélection du rôle */}
            <div className="form-group role-selection">
              <label className="role-option">
                <input
                  type="radio"
                  name="role"
                  value="professeur"
                  checked={formData.role === "professeur"}
                  onChange={handleChange}
                />
                <span className="role-label teacher-label">Enseignant</span>
              </label>

              <label className="role-option">
                <input
                  type="radio"
                  name="role"
                  value="etudiant"
                  checked={formData.role === "etudiant"}
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

            <button type="submit" className="register-button" disabled={loading}>
              {loading ? "Création du compte..." : "S'inscrire"}
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
