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
    console.log("courseState:");
    console.log(courseState);
    
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
      <div className="chatroom__main">
        <div>
                <h3>Course Name: {courseState.name}</h3>
                <button onClick={onClickDeleteCourse} className="rooms__button-new">
            Delete course
          </button>
                <div>Registerd students:</div>
          {courseState.registeredStudents.map((registeredStudent, i) => (
            <RegisteredStudent
              key={registeredStudent.student.email}
              registeredStudent={registeredStudent}
              index={i}
            />
          ))}
                
        <div>Add students:</div>
        {courseState.newStudents.map((notRegisteredStudent, i) => (
            <NotRegisteredStudent
              key={notRegisteredStudent.email}
              notRegisteredStudent={notRegisteredStudent}
              index={i}
            />
          ))}
        </div>
        {/* <AddMessage
        //addMessage={props.addMessage}
        /> */}
      </div>
    );
};

export default CourseUsers;
