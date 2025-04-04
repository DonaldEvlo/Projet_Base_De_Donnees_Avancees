import React from "react";
import ReactDOM from "react-dom/client";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import DashboardEtudiant from "../../src/pages/DashboardEtudiant";
import DashboardProf from "../../src/pages/DashboardProf";
import Home from "../../src/pages/home";
import NotFound from "../../src/pages/notFound";
import Login from "../../src/pages/signin";
import Register from "../../src/pages/signup";
import CreerExercice from "../../src/pages/CreerExercice";


    const AppRoutes = () =>{
        return(
            <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard-prof" element={<DashboardProf />} />
        <Route path="/create-exercise" element={<CreerExercice />} />
        <Route path="/dashboard-etudiant" element={<DashboardEtudiant />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
        );
    };
      
  
    export default AppRoutes;