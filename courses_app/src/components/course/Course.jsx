import React, { useContext } from "react";
import { CourseContext } from "../../context/CourseContext";
import Loader from "../main/Loader";
import CourseDates from "./CourseDates";
import CourseUsers from "./CourseUsers";

const Course = (props) => {

  const { courseState } = useContext(CourseContext);

  return courseState.isCourseExist ? (
    <div className="pages">
      <CourseDates />
      <CourseUsers />
    </div>
  ) : (
    <Loader />
  );
};

export default Course;