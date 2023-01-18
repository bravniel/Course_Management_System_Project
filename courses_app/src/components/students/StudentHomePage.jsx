import React from "react";
import CoursesStudent from "./StudentManagementCourses";
import EditStudent from "./StudentManagementProfile";

const StudentHomePage = () => {
  return (
    <div className="home">
      <EditStudent />
      <CoursesStudent />
    </div>
  );
};

export default StudentHomePage;
