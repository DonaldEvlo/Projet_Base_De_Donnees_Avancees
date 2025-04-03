import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/signin";
import Register from "./pages/signup";
import DashboardProf from "./pages/DashboardProf";
import DashboardEtudiant from "./pages/dashboardEtudiant";
import NotFound from "./pages/notFound";
import Navbar from "./components/navbar";
import CreerExercice from "./pages/CreerExercice";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard-prof/*" element={<DashboardProf />} />
        <Route path="/dashboard-etudiant" element={<DashboardEtudiant />} />
        <Route path="/create-exercise" element={< CreerExercice/>} />
        

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}


export default App;
