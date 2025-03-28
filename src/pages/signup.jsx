import React, { useState } from "react";
import "../styles/signup.css"; // Importer le fichier CSS

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
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
      <h1 className="register-title">Inscription</h1>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="register-form-group">
          <label htmlFor="username" className="register-label">Nom d'utilisateur</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="register-input"
            required
          />
        </div>
        <div className="register-form-group">
          <label htmlFor="email" className="register-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="register-input"
            required
          />
        </div>
        <div className="register-form-group">
          <label htmlFor="password" className="register-label">Mot de passe</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="register-input"
            required
          />
        </div>
        <button type="submit" className="register-button">S'inscrire</button>
      </form>
    </div>
  );
}

export default Register;
