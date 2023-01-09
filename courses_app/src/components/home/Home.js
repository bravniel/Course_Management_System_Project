import React, { useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { LoginContext } from "../../context/LoginContext";

const Home = () => {
  const { userData } = useContext(LoginContext);
    const navigate = useNavigate();


  console.log(userData)

  const offlineUserPanel = (
    <p className="offline-msg">You are currently offline, Please log in. </p>
  );

  return !userData.isProfessor ? (
    <Navigate to="/student/home" />
  ) : (
    <Navigate to="/professor/home" />
  );
};

export default Home;
