import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-blue-500 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold">Plateforme SGBD</h1>
          <div>
            <Link to="/login" className="text-white mr-4 hover:underline">
              Connexion
            </Link>
            <Link to="/register" className="bg-white text-blue-500 px-4 py-2 rounded hover:bg-gray-200">
              S'inscrire
            </Link>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <div className="flex-grow flex flex-col justify-center items-center text-center p-6 bg-gray-100">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Bienvenue sur la Plateforme SGBD
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl">
          Apprenez et gérez vos bases de données facilement avec notre plateforme dédiée aux étudiants et enseignants.
        </p>
        <div className="mt-6">
          <Link to="/login" className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg mr-4 hover:bg-blue-600">
            Connexion
          </Link>
          <Link to="/register" className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg text-lg hover:bg-gray-400">
            S'inscrire
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
