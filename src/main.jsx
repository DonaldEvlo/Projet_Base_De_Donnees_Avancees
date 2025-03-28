import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardEtudiant from "./pages/dashboardEtudiant";
import Home from "./pages/home";
import Login from "./pages/signin";
import Register from "./pages/signup";
import NotFound from "./pages/notFound";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard/etudiant" element={<DashboardEtudiant />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
