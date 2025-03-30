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

  {/* À propos */}
  <div className="about-section">
    <h2>À propos de la Plateforme</h2>
    <p>
      Notre plateforme est conçue pour aider les étudiants et enseignants à maîtriser les bases de données grâce à des exercices interactifs, des statistiques de progression, et des parcours personnalisés.
    </p>
  </div>

  {/* Fonctionnalités */}
  <div className="features-container">
    <div className="feature"> 
      <img src="/images/image1.png" alt="Parcours Personnalisée" className="feature-icon hover-effect"/>
      <p><strong>Parcours Personnalisé</strong><br/>Adaptez votre apprentissage à vos besoins.</p>
    </div>
    <div className="feature">
      <img src="/images/image2.png" alt="Esprit Différents" className="feature-icon hover-effect"/>
      <p><strong>Esprit Différent</strong><br/>Apprenez avec une approche unique.</p>
    </div>
    <div className="feature">
      <img src="/images/image3.png" alt="Recherche et Innovation" className="feature-icon hover-effect"/>
      <p><strong>Recherche et Innovation</strong><br/>Explorez des concepts avancés.</p>
    </div>
    <div className="feature">
      <img src="/images/image4.png" alt="Internationalisation" className="feature-icon hover-effect"/>
      <p><strong>Internationalisation</strong><br/>Apprenez où que vous soyez.</p>
    </div>
  </div>
{/* Section Étudiant et Enseignant */}
<div className="roles-section">
  <div className="role">
    <img src="/images/student-image.png" alt="Étudiant" className="role-image" />
    <h3>En Tant Qu'Étudiant</h3>
    <ul className="role-details">
      <li>✅ Plans d'étude personnalisés</li>
      <li>✅ Accès à des ressources éducatives sélectionnées</li>
      <li>✅ Quizz et évaluations interactives</li>
      <li>✅ Notifications en temps réel et rappels</li>
      <li>✅ Intégration avec des outils d'étude</li>
    </ul>
    <Link to="/student-resources" className="role-link">Découvrez-en plus sur nos Ressources d'Apprentissage</Link>
  </div>
  <div className="role">
    <img src="/images/teacher-image.png" alt="Enseignant" className="role-image" />
    <h3>En Tant Qu'Enseignant</h3>
    <ul className="role-details">
      <li>✅ Matériel de cours personnalisable</li>
      <li>✅ Intégration avec les systèmes de gestion de l'apprentissage</li>
      <li>✅ Analyse approfondie et suivi des progrès</li>
      <li>✅ Fonctionnalités de planification de cours collaboratives</li>
      <li>✅ Outils d'engagement pour des salles de classe interactives</li>
    </ul>
    <Link to="/teacher-tools" className="role-link">Découvrez-en plus sur nos Outils d'Enseignement</Link>
  </div>
</div>
  {/* Témoignages */}
  <div className="testimonials">
    <h2>Ce que disent nos utilisateurs</h2>
    <blockquote>
      "Cette plateforme m'a aidé à comprendre les bases de données de manière simple et efficace." - Étudiant
    </blockquote>
    <blockquote>
      "Un outil indispensable pour enseigner les bases de données à mes étudiants." - Enseignant
    </blockquote>
  </div>

  {/* Appel à l'action */}
  <div className="cta-section">
    <Link to="/features" className="cta-button">Découvrir les Fonctionnalités</Link>
  </div>
  {/* Footer */}
<footer className="footer">
  <div className="footer-container">
    <div className="footer-column">
      <h4>Services Numériques</h4>
      <ul>
        <li>Plateforme e-learning de SGBD</li>
        <li>Espace Étudiants</li>
        <li>Espace Concours</li>
      </ul>
      <Link to="/services" className="footer-link">Services et assistance</Link>
    </div>
    <div className="footer-column">
      <h4>Liens Utiles</h4>
      <ul>
        <li>Apropos</li>
        <li>Actualités</li>
        <li>FAQ</li>
        <li>Contactez-Nous</li>
      </ul>
      <Link to="/support" className="footer-link">Contacter l'assistance du site</Link>
    </div>
    <div className="footer-column">
      <h4>UCAD</h4>
      <ul>
        <li>Campus UCAD :</li>
        <li>22, Avenue Cheick Anta Diop, FannHock - Dakar</li>
        <li>Campus ESP  :</li>
        <li>98, Avenue Claudel, FannHock - Dakar</li>
      </ul>
      <Link to="/data-policy" className="footer-link">Résumé de conservation de données</Link>
    </div>
    <div className="footer-column">
      <h4>Contact</h4>
      <ul>
        <li>🌐 SGBD</li>
        <li>📞 +221 77 883 09 44</li>
        <li>✉️ info@esp.ac.sn</li>
      </ul>
      <Link to="/mobile-app" className="footer-link">Obtenir l'app mobile</Link>
    </div>
  </div>
</footer>
</div>
    
  );
};

export default Home;
