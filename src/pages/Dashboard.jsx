import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Tableau de bord</h1>
      <p>Bienvenue sur la plateforme.</p>
      <Link to="/" className="text-blue-500 underline">
        Déconnexion
      </Link>
    </div>
  );
}

export default Dashboard;
