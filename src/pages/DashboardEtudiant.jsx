import { useState } from "react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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

  // État pour gérer la section active
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-blue-700 text-white p-5 fixed h-full">
        <h2 className="text-xl font-bold mb-5">Tableau de bord Étudiant</h2>
        <ul className="space-y-3">
          <li>
            <Link
              to="/"
              className="block bg-blue-600 hover:bg-blue-500 p-3 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
            >
              🏠 Accueil
            </Link>
          </li>
          <li>
            <button
              onClick={() => setActiveSection("dashboard")}
              className="block bg-blue-600 hover:bg-blue-500 p-3 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1 w-full text-left"
            >
              📘 Mes cours
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection("exercices")}
              className="block bg-blue-600 hover:bg-blue-500 p-3 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1 w-full text-left"
            >
              📚 Mes Exercices
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection("stats")}
              className="block bg-blue-600 hover:bg-blue-500 p-3 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1 w-full text-left"
            >
              📊 Statistiques
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection("profile")}
              className="block bg-blue-600 hover:bg-blue-500 p-3 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1 w-full text-left"
            >
              👤 Profil
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection("logout")}
              className="block bg-red-600 hover:bg-red-500 p-3 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1 w-full text-left"
            >
              🚪 Déconnexion
            </button>
          </li>
        </ul>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 ml-64 p-6 bg-gray-50 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">Bienvenue, Étudiant ! 👋</h1>

        {/* Section Accueil */}
        {activeSection === "dashboard" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <input
                type="text"
                placeholder="Rechercher"
                className="border border-gray-300 rounded-lg p-2 w-1/3"
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                Filtrer
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
              <h2 className="text-xl font-semibold mb-4">
                Vue d’ensemble des cours
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {[
                  {
                    id: 1,
                    titre: "Cryptographie et Sécurité",
                    categorie: "Cours en Commun M-ISI/CI-GI",
                  },
                  {
                    id: 2,
                    titre: "Administration des réseaux",
                    categorie: "Cours en Commun M-ISI/CI-GI",
                  },
                  {
                    id: 3,
                    titre: "Bases de Données (Oracle)",
                    categorie: "Cours en Commun (1A-M-ISI)",
                  },
                  {
                    id: 4,
                    titre: "Interconnexion des réseaux",
                    categorie: "Cours en Commun M-ISI/CI-GI",
                  },
                  {
                    id: 5,
                    titre: "XML-Distanciel",
                    categorie: "Cours en Commun M-ISI/CI-GI",
                  },
                  {
                    id: 6,
                    titre: "Communication en Français I",
                    categorie: "M-(ISI/II/A/ISRT)",
                  },
                ].map((cours) => (
                  <div
                    key={cours.id}
                    className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-lg transition"
                  >
                    <h3 className="text-lg font-semibold">{cours.titre}</h3>
                    <p className="text-sm text-gray-500">{cours.categorie}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Section Mes Exercices */}
        {activeSection === "exercices" && (
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
        )}

        {/* Section Statistiques */}
        {activeSection === "stats" && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              📊 Progression des Notes
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="note"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Graphique des performances */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">
            📊 Progression des Notes
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="note"
                stroke="#3b82f6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
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
              <Link to="/services" className="footer-link">
                Services et assistance
              </Link>
            </div>
            <div className="footer-column">
              <h4>Liens Utiles</h4>
              <ul>
                <li>Apropos</li>
                <li>Actualités</li>
                <li>FAQ</li>
                <li>Contactez-Nous</li>
              </ul>
              <Link to="/support" className="footer-link">
                Contacter l'assistance du site
              </Link>
            </div>
            <div className="footer-column">
              <h4>UCAD</h4>
              <ul>
                <li>Campus UCAD :</li>
                <li>22, Avenue Cheick Anta Diop, FannHock - Dakar</li>
                <li>Campus ESP :</li>
                <li>98, Avenue Claudel, FannHock - Dakar</li>
              </ul>
              <Link to="/data-policy" className="footer-link">
                Résumé de conservation de données
              </Link>
            </div>
            <div className="footer-column">
              <h4>Contact</h4>
              <ul>
                <li>🌐 SGBD</li>
                <li>📞 +221 77 883 09 44</li>
                <li>✉️ info@esp.ac.sn</li>
              </ul>
              <Link to="/mobile-app" className="footer-link">
                Obtenir l'app mobile
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardEtudiant;
