import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { LoginContext } from "../../context/LoginContext";

const EditUser = () => {
  const { userData } = useContext(LoginContext);

  return !userData.isProfessor ? (
    <Navigate to="/student/edit" />
  ) : (
    <Navigate to="/professor/edit" />
  );
};

export default EditUser;
