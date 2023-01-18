import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { LoginContext } from "../../context/LoginContext";

const Home = () => {
  const { userData } = useContext(LoginContext);
  console.log(userData);
  return !userData.isProfessor ? (
    <Navigate to="/student/home" />
  ) : (
    <Navigate to="/professor/home" />
  );
};

export default Home;