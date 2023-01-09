import React, { useContext } from "react";
import { CourseContext } from "../../context/CourseContext";
import Loader from "../main/Loader";
import CourseDates from "./CourseDates";
import CourseUsers from "./CourseUsers";

const Course = (props) => {

  const { courseState } = useContext(CourseContext);
  
  return (
    <div className="chatroom-container">
      {courseState.isCourseExist ? (
        <div className="chatroom">
          <CourseDates/>
          <CourseUsers/>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default Course;