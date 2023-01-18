import React from "react";

import { FaUserEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const EditProfessor = () => {
  const navigate = useNavigate();

  return (
    <div className="request-container">
      <FaUserEdit
        className="svg"
        onClick={() => {
          navigate("/professor/edit");
        }}
      />
      <p>Edit Profile</p>
    </div>
  );
};

export default EditProfessor;
