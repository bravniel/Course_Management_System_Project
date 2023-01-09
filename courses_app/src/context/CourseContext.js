import React, { createContext, useContext, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { initCourseAction, initNotCourseStudentsAction } from "../actions/courseActions";
import { getAllNotRegisteredCourseStudents, getCourseInfo } from "../api/professorsAPI";
import courseReducer, { initialcourseState } from "../reducers/courseReduser";
import { LoginContext } from "./LoginContext";

export const CourseContext = createContext();

const CourseContextProvider = (props) => {
  const { userData } = useContext(LoginContext);
    const navigate = useNavigate();
  const [courseState, courseDispatch] = useReducer(
    courseReducer,
    initialcourseState
    );

    useEffect(() => {
        let isComponentExist = true;
      getCourseInfo(userData.token, props.roomId).then(
        (courseData) => {
          if (isComponentExist) {
            courseDispatch(initCourseAction(courseData));
            getAllNotRegisteredCourseStudents(
              userData.token,
              props.roomId
            ).then(
              (courseData) => {
                courseDispatch(initNotCourseStudentsAction(courseData));
              },
            );
          }
        },
        (err) => {
          if (err.response.data.Error === "Course not found") {
            navigate("/notfound");
          }
        }
      );
        
        return () => {
          isComponentExist = false;
        };
    }, [props.roomId,userData.token]);

  return (
    <CourseContext.Provider value={{ courseState, courseDispatch }}>
      {props.children}
    </CourseContext.Provider>
  );
};

export default CourseContextProvider;
