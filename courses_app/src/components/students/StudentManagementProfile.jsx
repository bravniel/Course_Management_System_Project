import React from "react";
import { FaUserEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const EditStudent = () => {
  const navigate = useNavigate();

  return (
    <div className="request-container">
      <FaUserEdit
        className="svg"
        onClick={() => {
          navigate("/student/edit");
        }}
      />
      <p>Edit Profile</p>
    </div>
  );
};

export default EditStudent;
