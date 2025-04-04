import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { signOut } from "../../backend/services/authServices"; // Assurez-vous que le chemin est correct

const DashboardEtudiant = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
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

  const handleLogout = async () => {
    try {
      console.log("Déconnexion en cours...");
      await signOut();
      setUser(null);
      console.log("Déconnexion réussie !");
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error.message);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-blue-700 text-white p-5 fixed h-full">
        <h2 className="text-xl font-bold mb-5">Tableau de bord Étudiant</h2>
        <ul className="space-y-3">
          <li>
            <Link to="/" className="block bg-blue-600 hover:bg-blue-500 p-3 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
              🏠 Accueil
            </Link>
          </li>
          <li>
            <button onClick={handleLogout} className="sidebar-link logout">
              🚪 Déconnexion
            </button>
          </li>
        </ul>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 ml-64 p-6 bg-gray-50 overflow-y-auto">
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
      </div>
    </div>
  );
};

export default DashboardEtudiant;
