import { useState } from "react";
import { Link } from "react-router-dom";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import "../styles/dashboardEtudiant.css"; // Lier le fichier CSS

const DashboardEtudiant = () => {
  // Données du graphique
  const data = [
    { name: "Exo 1", note: 14 },
    { name: "Exo 2", note: 16 },
    { name: "Exo 3", note: 12 },
    { name: "Exo 4", note: 18 },
  ];

  // Liste des exercices
  const [exercices] = useState([
    { id: 1, titre: "Exercice SQL SELECT", status: "Terminé" },
    { id: 2, titre: "Exercice Jointures", status: "En cours" },
    { id: 3, titre: "Exercice Normalisation", status: "Non commencé" },
  ]);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="sidebar-title">Dashboard Étudiant</h2>
        <ul className="sidebar-menu">
          <li>
            <Link to="/" className="sidebar-link">🏠 Accueil</Link>
          </li>
          <li>
            <Link to="/exercices" className="sidebar-link">📚 Mes Exercices</Link>
          </li>
          <li>
            <Link to="/stats" className="sidebar-link">📊 Statistiques</Link>
          </li>
          <li>
            <Link to="/profile" className="sidebar-link">👤 Profil</Link>
          </li>
          <li>
            <Link to="/logout" className="sidebar-link logout">🚪 Déconnexion</Link>
          </li>
        </ul>
      </div>

      {/* Contenu principal */}
      <div className="main-content">
        <h1 className="welcome-text">Bienvenue, Étudiant ! 👋</h1>

        {/* Graphique des performances */}
        <div className="card">
          <h2 className="card-title">📊 Progression des Notes</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="note" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Liste des exercices */}
        <div className="card">
          <h2 className="card-title">📚 Mes Exercices</h2>
          <ul>
            {exercices.map((exo) => (
              <li key={exo.id} className="exercise-item">
                <span>{exo.titre}</span>
                <span className={`status-badge ${exo.status.toLowerCase().replace(" ", "-")}`}>
                  {exo.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardEtudiant;
