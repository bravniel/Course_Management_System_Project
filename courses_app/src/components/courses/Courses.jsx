import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { LoginContext } from "../../context/LoginContext";

const Courses = () => {
  const { userData } = useContext(LoginContext);

  console.log(userData)

  const offlineUserPanel = (
    <p className="offline-msg">You are currently offline, Please log in. </p>
  );

  return !userData.isProfessor ? (
    <Navigate to="/student/courses" />
  ) : (
    <Navigate to="/professor/courses" />
  );
};

export default Courses;
