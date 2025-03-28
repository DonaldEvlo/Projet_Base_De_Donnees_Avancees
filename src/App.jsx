import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/signin";
import Register from "./pages/signup";
import DashboardProf from "./pages/dashboardProf";
import DashboardEtudiant from "./pages/dashboardEtudiant";
import NotFound from "./pages/notFound";
import Navbar from "./components/navbar";

function App() {
  return (
    <Router>
      <Navbar /> {/* Navbar persistante sur toutes les pages */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard-prof" element={<DashboardProf />} />
        <Route path="/dashboard-etudiant" element={<DashboardEtudiant />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
