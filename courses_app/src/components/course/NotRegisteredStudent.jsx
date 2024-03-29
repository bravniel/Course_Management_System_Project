import React, { useContext } from "react";
import { addStudentAction, initCourseAction } from "../../actions/courseActions";
import { getCourseInfo, registerStudentForCourse } from "../../api/professorsAPI";
import { CourseContext } from "../../context/CourseContext";
import { LoginContext } from "../../context/LoginContext";

const NotRegisteredStudent = ({ notRegisteredStudent, index }) => {
  const { userData } = useContext(LoginContext);
  const { courseState, courseDispatch } = useContext(CourseContext);
  
  const onClickAdd = () => {
    registerStudentForCourse(
        userData.token,
        courseState.name,
              notRegisteredStudent.email
            ).then(
              (courseData) => {
                courseDispatch(addStudentAction(courseData));
                
                getCourseInfo(userData.token, courseState.name).then(
                  (courseData) => {
                    courseDispatch(initCourseAction(courseData));
                  }
                );
              }
            );
    };
    
  return (
    <div className="new-message">
      <div className="username">{notRegisteredStudent.firstName} {notRegisteredStudent.lastName}</div>
      <div className="content">{notRegisteredStudent.phoneNumber}</div>
         <div onClick={onClickAdd} className="add-message">
          +
        </div>
    </div>
  );
};

export default NotRegisteredStudent;
