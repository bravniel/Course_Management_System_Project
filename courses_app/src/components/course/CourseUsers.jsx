import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { deleteCourse } from "../../api/professorsAPI";
import { CourseContext } from "../../context/CourseContext";
import { LoginContext } from "../../context/LoginContext";
import NotRegisteredStudent from "./NotRegisteredStudent";
import RegisteredStudent from "./RegisteredStudent";

const CourseUsers = (props) => {
    const navigate = useNavigate();
    const { userData } = useContext(LoginContext);
    const { courseState } = useContext(CourseContext);
    
const onClickDeleteCourse = () => {
   deleteCourse(userData.token, courseState.name).then(
      () => {
        navigate("/courses");
      }
    ); 
  }

    return (
      <>
        <div className="pages__section-delete">
          <h3>Course Name: {courseState.name}</h3>
          <button onClick={onClickDeleteCourse}>Delete course</button>
          <div>Registerd students:</div>
          <div className="chatroom__main__messages">
            {courseState.registeredStudents.length > 0 &&
              courseState.registeredStudents.map((registeredStudent, i) => (
                <RegisteredStudent
                  key={registeredStudent.student.email}
                  registeredStudent={registeredStudent}
                  index={i}
                />
              ))}
          </div>
          {courseState.registeredStudents.length == 0 && (
            <div className="no-students">There are no registered students.</div>
          )}

          <div>Add students:</div>
          <div className="chatroom__main__messages">
            {courseState.newStudents.length > 0 &&
              courseState.newStudents.map((notRegisteredStudent, i) => (
                <NotRegisteredStudent
                  key={notRegisteredStudent.email}
                  notRegisteredStudent={notRegisteredStudent}
                  index={i}
                />
              ))}
          </div>
          {courseState.newStudents.length == 0 && (
            <div className="no-students">All students are registered.</div>
          )}
        </div>
      </>
    );
};

export default CourseUsers;
