import React, { useContext, useEffect, useState } from "react";
import { getStudentsClassAttendanceStatusesByDate } from "../../api/professorsAPI";
import { CourseContext } from "../../context/CourseContext";
import { LoginContext } from "../../context/LoginContext";
import LessonEnrollments from "./LessonEnrollments";

const CourseDates = (props) => {
  const { userData } = useContext(LoginContext);
  const { courseState } = useContext(CourseContext);  
  const [courseToDisplay, setCourseToDisplay] = useState([]);
  const [lessonStudentsEnrollmentsForm, setLessonStudentsEnrollmentsForm] = useState(false);
  const [lessonStudentsEnrollments, setLessonStudentsEnrollments] = useState(null);
  const [date, setDate] = useState(null);

  useEffect(() => {
    setCourseToDisplay([...courseState.dates]);
  }, [courseState.dates]);
  
    const closeLessonEnrollments = () => {
      setLessonStudentsEnrollmentsForm(false);
  };
  
  const getLessonStudentsEnrollments = (date) => {
        getStudentsClassAttendanceStatusesByDate(
        userData.token,
        courseState.name,
              date
            ).then(
              (lessonStudentsEnrollments) => {
                setLessonStudentsEnrollments(lessonStudentsEnrollments);
                setLessonStudentsEnrollmentsForm(true);
              },
              (err) => {
                setLessonStudentsEnrollments(null);
                setLessonStudentsEnrollmentsForm(true);
              }
            );
  };

    return (
      <div className="pages__section-delete">
        <h3>Dates</h3>
        <div className="chatroom__main__messages">
          {courseToDisplay.map((date) => (
            <div
              className="user"
              key={date}
              onClick={() => {
                getLessonStudentsEnrollments(date.substring(0, 10));
                setDate(date.substring(0, 10));
              }}
            >
              {date.substring(0, 10)}
            </div>
          ))}
        </div>
        {!!lessonStudentsEnrollmentsForm && (
          <LessonEnrollments
            date={date}
            lessonStudentsEnrollments={lessonStudentsEnrollments}
            closeLessonEnrollments={closeLessonEnrollments}
          />
        )}
      </div>
    );
};

export default CourseDates;
