import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";

const LoginRoute = () => {
  const { userData } = useContext(LoginContext);
  console.log(userData);
  return !!userData.user ? <Navigate to="/home" /> : <Outlet />;
};

export default LoginRoute;

// You are currently offline, Please log in.
