import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Simule une connexion et redirige vers le dashboard
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h2 className="text-2xl font-bold">Connexion</h2>
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        onClick={handleLogin}
      >
        Se connecter
      </button>
    </div>
  );
}

export default Login;
