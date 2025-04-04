import React from "react";
import { Route, Routes } from "react-router-dom";
import CreerExercice from "../../src/pages/CreerExercice";
import DashboardEtudiant from "../../src/pages/DashboardEtudiant";
import DashboardProf from "../../src/pages/DashboardProf";
import ChooseRole from "../../src/pages/choisirRole";
import Home from "../../src/pages/home";
import NotFound from "../../src/pages/notFound";
import LoginEtudiant from "../../src/pages/signin etudiant";
import LoginProf from "../../src/pages/signin prof";
import Register from "../../src/pages/signup";


    const AppRoutes = () =>{
        return(
            <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login/etudiant" element={<LoginEtudiant />} />
        <Route path="/login/prof" element={<LoginProf />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard-prof" element={<DashboardProf />} />
        <Route path="/create-exercise" element={<CreerExercice />} />
        <Route path="/dashboard-etudiant" element={<DashboardEtudiant />} />
        <Route path="/login" element={<ChooseRole />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
        );
    };
      
  
    export default AppRoutes;