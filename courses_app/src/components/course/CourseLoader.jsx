import React from "react";
import { useParams } from "react-router-dom";
import CourseContextProvider from "../../context/CourseContext";
import Course from "./Course";

const CourseLoader = () => {
  const {id:roomId} = useParams();

  return (
    <CourseContextProvider roomId={roomId}>
          <Course />
    </CourseContextProvider>
  );
};

export default CourseLoader;