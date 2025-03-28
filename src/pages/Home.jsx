import { Link } from "react-router-dom";
import "../styles/home.css"; // Importer le fichier CSS

const Home = () => {
  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <h1 className="navbar-title">Plateforme SGBD</h1>
          <div className="navbar-links">
            <Link to="/login" className="navbar-link">Connexion</Link>
            <Link to="/register" className="navbar-signup-button">S'inscrire</Link>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <div className="main-content">
        <h2 className="main-title">Bienvenue sur la Plateforme SGBD</h2>
        <p className="main-description">
          Apprenez et gérez vos bases de données facilement avec notre plateforme dédiée aux étudiants et enseignants.
        </p>
        <div className="main-actions">
          <Link to="/login" className="main-action-button login-button">Connexion</Link>
          <Link to="/register" className="main-action-button signup-button">S'inscrire</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
