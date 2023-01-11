import React, { useContext } from "react";
import { initCourseAction, removeStudentAction } from "../../actions/courseActions";
import { getCourseInfo, removeStudentFromCourse } from "../../api/professorsAPI";
import { CourseContext } from "../../context/CourseContext";
import { LoginContext } from "../../context/LoginContext";

const RegisteredStudent = ({ registeredStudent, index }) => {
  const { userData } = useContext(LoginContext);
  const { courseState, courseDispatch } = useContext(CourseContext);
  const onClickDelete = () => {
    removeStudentFromCourse(
        userData.token,
        courseState.name,
        registeredStudent.student.email
            ).then(
              (courseData) => {
                courseDispatch(removeStudentAction(courseData));
                
                getCourseInfo(userData.token, courseState.name).then(
                  (courseData) => {
                      courseDispatch(initCourseAction(courseData));
                  }
                );
            },
        );
    };
    

  return (
    <div className="my-message">
      <div className="username">{registeredStudent.student.firstName} {registeredStudent.student.lastName}</div>
      <div className="content">{registeredStudent.student.phoneNumber}</div>
         <div onClick={onClickDelete} className="delete-message">
          x
        </div>
    </div>
  );
};

export default RegisteredStudent;