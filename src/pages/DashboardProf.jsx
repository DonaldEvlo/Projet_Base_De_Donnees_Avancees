import { useState } from "react";
import { Link } from "react-router-dom";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import "../styles/dashboardProf.css";

const DashboardProf = () => {
  const data = [
    { name: "Alice", moyenne: 14 },
    { name: "Bob", moyenne: 16 },
    { name: "Charlie", moyenne: 12 },
    { name: "David", moyenne: 18 },
  ];

  const [etudiants] = useState([
    { id: 1, nom: "Alice", progression: "Bon", status: "Actif" },
    { id: 2, nom: "Bob", progression: "Excellent", status: "Actif" },
    { id: 3, nom: "Charlie", progression: "Moyen", status: "Inactif" },
    { id: 4, nom: "David", progression: "Très bon", status: "Actif" },
  ]);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Dashboard Professeur</h2>
        <ul className="sidebar-menu">
          <li><Link to="/" className="sidebar-link">🏠 Accueil</Link></li>
          <li><Link to="/etudiants" className="sidebar-link">👨‍🎓 Gérer Étudiants</Link></li>
          <li><Link to="/exercices" className="sidebar-link">📚 Exercices</Link></li>
          <li><Link to="/stats" className="sidebar-link">📊 Statistiques</Link></li>
          <li><Link to="/logout" className="sidebar-link logout">🚪 Déconnexion</Link></li>
        </ul>
      </aside>

      {/* Contenu principal */}
      <main className="main-content">
        <h1 className="welcome-text">Bienvenue, Professeur ! 👨‍🏫</h1>

        {/* Graphique des performances */}
        <section className="card">
          <h2 className="card-title">📊 Performances des Étudiants</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="moyenne" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </section>

        {/* Tableau des étudiants */}
        <section className="card">
          <h2 className="card-title">👨‍🎓 Liste des Étudiants</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Progression</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {etudiants.map((etudiant) => (
                <tr key={etudiant.id}>
                  <td>{etudiant.nom}</td>
                  <td>{etudiant.progression}</td>
                  <td className={etudiant.status === "Actif" ? "text-green" : "text-red"}>
                    {etudiant.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default DashboardProf;
