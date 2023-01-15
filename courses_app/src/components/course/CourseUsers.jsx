import React, { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteCourse } from "../../api/professorsAPI";
import { CourseContext } from "../../context/CourseContext";
import { LoginContext } from "../../context/LoginContext";
import NotRegisteredStudent from "./NotRegisteredStudent";
import RegisteredStudent from "./RegisteredStudent";

const CourseUsers = (props) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userData } = useContext(LoginContext);
    const { courseState } = useContext(CourseContext);
    
const onClickDeleteCourse = () => {
   deleteCourse(userData.token, courseState.name).then(
      () => {
        
        navigate("/courses");
      },
          (err) => {
              console.log(err);
        //   if (err.response.data.Error === "Duplicate course name") {
        //     setIsNameInputInvalid(true);
        //   setErrorMessage("Name already exist.");
        // }
      }
    ); 
  }

    return (
      <div className="page__section">
        <div>
          <h3>Course Name: {courseState.name}</h3>
          <button onClick={onClickDeleteCourse} className="page__button-new">
            Delete course
          </button>
          <div>Registerd students:</div>
          {courseState.registeredStudents.length > 0 &&
            courseState.registeredStudents.map((registeredStudent, i) => (
              <RegisteredStudent
                key={registeredStudent.student.email}
                registeredStudent={registeredStudent}
                index={i}
              />
            ))}
          {courseState.registeredStudents.length == 0 && (
            <div className="no-students">There are no registered students.</div>
          )}

          <div>Add students:</div>
          {courseState.newStudents.length > 0 &&
            courseState.newStudents.map((notRegisteredStudent, i) => (
              <NotRegisteredStudent
                key={notRegisteredStudent.email}
                notRegisteredStudent={notRegisteredStudent}
                index={i}
              />
            ))}
          {courseState.newStudents.length == 0 && (
            <div className="no-students">All students are registered.</div>
          )}
        </div>
      </div>
    );
};

export default CourseUsers;
