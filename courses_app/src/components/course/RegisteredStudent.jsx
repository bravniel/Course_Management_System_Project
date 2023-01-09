import React, { useContext } from "react";
import { initNotCourseStudentsAction, removeStudentAction } from "../../actions/courseActions";
import { getAllNotRegisteredCourseStudents, removeStudentFromCourse } from "../../api/professorsAPI";
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
                    getAllNotRegisteredCourseStudents(
              userData.token,
              courseState.name
            ).then(
              (courseData) => {
                courseDispatch(initNotCourseStudentsAction(courseData));
              },
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
