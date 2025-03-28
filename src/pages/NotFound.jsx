import { Link } from "react-router-dom";
import "../styles/notFound.css"; // Importation du fichier CSS

const NotFound = () => {
  return (
    <div className="notfound-container">
      <h1 className="notfound-title">404</h1>
      <h2 className="notfound-subtitle">Page non trouvée</h2>
      <p className="notfound-text">
        Oups ! La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Link to="/" className="notfound-button">
        Retour à l'accueil
      </Link>
    </div>
  );
};

export default NotFound;
