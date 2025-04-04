import { useNavigate } from "react-router-dom";
import "../styles/signin.css";

const ChooseRole = () => {
  const navigate = useNavigate();

  const handleChoose = (role) => {
    if (role === "teacher") {
      navigate("/login/prof");
    } else if (role === "student") {
      navigate("/login/etudiant");
    }
  };

  return (
    <div className="login-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">Plateforme SGBD</div>
      </nav>

      <main className="login-main">
        <div className="login-card">
          <h1 className="login-title">Qui êtes-vous ?</h1>
          <p className="login-subtitle">Choisissez votre rôle pour continuer</p>

          <div className="oauth-buttons">
            <button
              type="button"
              className="oauth-button google"
              onClick={() => handleChoose("teacher")}
            >
              Je suis Professeur
            </button>

            <button
              type="button"
              className="oauth-button github"
              onClick={() => handleChoose("student")}
            >
              Je suis Étudiant
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChooseRole;
