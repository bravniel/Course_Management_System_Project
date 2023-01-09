import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";

const PrivateProfessorRoute = () => {
    const { userData } = useContext(LoginContext);
    console.log(userData)
    return !!userData.user && !!userData.isProfessor ? (
      <Outlet />
    ) : (
      <Navigate to="/login" state={{ needToLogin: true }} />
        // <Outlet />
    );
};

export default PrivateProfessorRoute;
