import { useState } from "react";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

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
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-blue-700 text-white p-5">
        <h2 className="text-xl font-bold mb-5">Dashboard Étudiant</h2>
        <ul className="space-y-3">
          <li>
            <Link to="/" className="hover:underline">🏠 Accueil</Link>
          </li>
          <li>
            <Link to="/exercices" className="hover:underline">📚 Mes Exercices</Link>
          </li>
          <li>
            <Link to="/stats" className="hover:underline">📊 Statistiques</Link>
          </li>
          <li>
            <Link to="/profile" className="hover:underline">👤 Profil</Link>
          </li>
          <li>
            <Link to="/logout" className="hover:underline text-red-300">🚪 Déconnexion</Link>
          </li>
        </ul>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Bienvenue, Étudiant ! 👋</h1>

        {/* Graphique des performances */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">📊 Progression des Notes</h2>
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
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">📚 Mes Exercices</h2>
          <ul>
            {exercices.map((exo) => (
              <li key={exo.id} className="flex justify-between p-3 border-b">
                <span>{exo.titre}</span>
                <span
                  className={`px-3 py-1 rounded text-white ${
                    exo.status === "Terminé"
                      ? "bg-green-500"
                      : exo.status === "En cours"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                >
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
