import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    // Vérification des champs
    if (!email || !password) {
      setError("Tous les champs sont requis !");
      return;
    }

    // Vérification du format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email invalide !");
      return;
    }

    // Simuler une connexion réussie (à remplacer par une API plus tard)
    console.log("Connexion réussie :", { email, password });

    // Redirige vers le Dashboard après connexion
    navigate("/dashboard-etudiant");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Connexion</h2>
        
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Se connecter
          </button>
        </form>

        <p className="text-sm mt-3 text-center">
          Pas encore inscrit ? 
          <a href="/register" className="text-blue-500 hover:underline"> Créer un compte</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
