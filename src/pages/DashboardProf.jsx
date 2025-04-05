import { useNavigate } from "react-router-dom";
import { FaHome, FaChalkboardTeacher, FaBook, FaChartBar, FaSignOutAlt } from "react-icons/fa";
import "../styles/dashboardProf.css";

const DashboardProf = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      console.log("Déconnexion en cours...");
      console.log("Déconnexion réussie !");
      navigate("/"); // Redirige vers la page d'accueil
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error.message);
    }
  };

  return (
    <div
      className="dashboard-container min-h-screen flex flex-col bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/prof.png')",
        backgroundSize: "cover", // Assure que l'image couvre toute la page
        backgroundPosition: "center 30%", // Descend l'image pour qu'elle cadre bien
        backgroundRepeat: "no-repeat", // Empêche la répétition de l'image
      }}
    >
      {/* Entête */}
      <header className="bg-transparent text-gray-800 py-4 px-8 flex justify-between items-center shadow-md">
        <h1 className="text-3xl font-bold">Plateforme SGBD</h1>
      </header>

      {/* Contenu principal */}
      <main className="flex-grow flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-10">Tableau de Bord Professeur</h1>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {/* Accueil */}
          <div
            className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition"
            onClick={() => navigate("/")}
          >
            <FaHome className="text-6xl text-blue-500 mb-4" />
            <p className="text-lg font-semibold text-gray-700">Accueil</p>
          </div>

          {/* Créer un exercice */}
          <div
            className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition"
            onClick={() => navigate("/create-exercise")}
          >
            <FaChalkboardTeacher className="text-6xl text-orange-500 mb-4" />
            <p className="text-lg font-semibold text-gray-700">Créer un Exercice</p>
          </div>

          {/* Exercices */}
          <div
            className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition"
            onClick={() => navigate("/exercices")}
          >
            <FaBook className="text-6xl text-green-500 mb-4" />
            <p className="text-lg font-semibold text-gray-700">Exercices</p>
          </div>

          {/* Exercices Soumis */}
          <div
            className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition"
            onClick={() => navigate("/exercices-soumis")} // Mise à jour pour rediriger vers la nouvelle page
          >
            <FaChartBar className="text-6xl text-purple-500 mb-4" />
            <p className="text-lg font-semibold text-gray-700">Exercices Soumis</p>
          </div>

          {/* Déconnexion */}
          <div
            className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="text-6xl text-red-500 mb-4" />
            <p className="text-lg font-semibold text-gray-700">Déconnexion</p>
          </div>
        </div>
      </main>

      {/* Pied de page */}
      <footer className="bg-transparent text-gray-800 py-4 text-center shadow-md">
        <p className="text-lg font-semibold">© 2025 Plateforme SGBD. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default DashboardProf;