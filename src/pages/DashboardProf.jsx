import { useState } from "react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const DashboardProf = () => {
  // Données des performances des étudiants
  const data = [
    { name: "Alice", moyenne: 14 },
    { name: "Bob", moyenne: 16 },
    { name: "Charlie", moyenne: 12 },
    { name: "David", moyenne: 18 },
  ];

  // Liste des étudiants avec leur progression
  const [etudiants] = useState([
    { id: 1, nom: "Alice", progression: "Bon", status: "Actif" },
    { id: 2, nom: "Bob", progression: "Excellent", status: "Actif" },
    { id: 3, nom: "Charlie", progression: "Moyen", status: "Inactif" },
    { id: 4, nom: "David", progression: "Très bon", status: "Actif" },
  ]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-blue-700 text-white p-5">
        <h2 className="text-xl font-bold mb-5">Dashboard Professeur</h2>
        <ul className="space-y-3">
          <li>
            <Link to="/" className="hover:underline">🏠 Accueil</Link>
          </li>
          <li>
            <Link to="/etudiants" className="hover:underline">👨‍🎓 Gérer Étudiants</Link>
          </li>
          <li>
            <Link to="/exercices" className="hover:underline">📚 Exercices</Link>
          </li>
          <li>
            <Link to="/stats" className="hover:underline">📊 Statistiques</Link>
          </li>
          <li>
            <Link to="/logout" className="hover:underline text-red-300">🚪 Déconnexion</Link>
          </li>
        </ul>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Bienvenue, Professeur ! 👨‍🏫</h1>

        {/* Graphique des performances globales */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">📊 Performances des Étudiants</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="moyenne" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tableau des étudiants */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">👨‍🎓 Liste des Étudiants</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 text-left">Nom</th>
                <th className="p-3 text-left">Progression</th>
                <th className="p-3 text-left">Statut</th>
              </tr>
            </thead>
            <tbody>
              {etudiants.map((etudiant) => (
                <tr key={etudiant.id} className="border-b">
                  <td className="p-3">{etudiant.nom}</td>
                  <td className="p-3">{etudiant.progression}</td>
                  <td
                    className={`p-3 ${
                      etudiant.status === "Actif" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {etudiant.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardProf;
