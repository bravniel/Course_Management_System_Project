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

  const [isLessonStudentsEnrollmentsExist, setIsLessonStudentsEnrollmentsExist] = useState(false);

    
  useEffect(() => {
    setCourseToDisplay([...courseState.dates]);
    console.log(courseState);
  }, [courseState.dates]);
  
  // const searchUsers = (searchValue) => {
  //     const users = [...courseState.users];
  //     setCourseToDisplay(
  //       searchValue === ""
  //         ? users
  //         : users.filter((user) =>
  //             user.username.toLowerCase().includes(searchValue)
  //           )
  //     );
  //   };
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
            );
  };

    return (
      <div className="chatroom__users">
        <h3>Dates</h3>
        {/* <SearchUsers searchUsers={searchUsers} /> */}
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
