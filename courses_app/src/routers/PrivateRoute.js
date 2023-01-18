import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import Loader from "../components/main/Loader";
import { LoginContext } from "../context/LoginContext";

const PrivateRoute = () => {
  const { userData, isResponse } = useContext(LoginContext);
  console.log(userData);
  return isResponse ? <Outlet /> : <Loader />;
};

export default PrivateRoute;
