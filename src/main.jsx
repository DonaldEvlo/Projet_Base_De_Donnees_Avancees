import React from "react";
import ReactDOM from "react-dom/client";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import DashboardEtudiant from "./pages/dashboardEtudiant";
import DashboardProf from "./pages/dashboardProf";
import Home from "./pages/home";
import NotFound from "./pages/notFound";
import Login from "./pages/signin";
import Register from "./pages/signup";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard-prof" element={<DashboardProf />} />
        <Route path="/dashboard-etudiant" element={<DashboardEtudiant />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
