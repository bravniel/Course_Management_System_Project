import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { LoginContext } from "../../context/LoginContext";

const Courses = () => {
  const { userData } = useContext(LoginContext);

  return !userData.isProfessor ? (
    <Navigate to="/student/courses" />
  ) : (
    <Navigate to="/professor/courses" />
  );
};

export default Courses;
