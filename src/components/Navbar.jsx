import React from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li>
          <Link to="/" className="navbar-link">
            Accueil
          </Link>
        </li>
        <li>
          <Link to="/login" className="navbar-link">
            Connexion
          </Link>
        </li>
        <li>
          <Link to="/register" className="navbar-link">
            Inscription
          </Link>
        </li>
        <li>
          <Link to="/login/prof" className="navbar-link">
            Dashboard Prof
          </Link>
        </li>
        <li>
          <Link to="/login/etudiant" className="navbar-link">
            Dashboard Étudiant
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
