import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { CourseContext } from "../../context/CourseContext";

const LessonEnrollments = ({ date, lessonStudentsEnrollments, closeLessonEnrollments }) => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const { id } = useParams();
  const { courseState } = useContext(CourseContext);  
  const dateDay = new Date(date);
  const thisDateSchedule = courseState.schedule.filter(el => el.day === days[dateDay.getDay()]);
  const currentDate = new Date();
  
  return lessonStudentsEnrollments ? (
    <div className="modal">
      <div className="modal__body">
        <div
          onClick={() => {
            closeLessonEnrollments();
          }}
          className="close-modal"
        >
          x
        </div>
        <div className="course-date">
          <h4>Lesson Enrollments Statuses for course: {id}</h4>
          <h5>
            ({days[dateDay.getDay()]}, {thisDateSchedule[0].hours.startHour} -{" "}
            {thisDateSchedule[0].hours.endHour})
          </h5>
        </div>
        {lessonStudentsEnrollments.map((lessonStudentEnrollment, i) => (
          <div key={i} className={i % 2 == 0 ? "my-message" : "message"}>
            <p>
              <u>
                {lessonStudentEnrollment.student.firstName +
                  " " +
                  lessonStudentEnrollment.student.lastName}
                :
              </u>
              {dateDay.getTime() > currentDate.getTime() ? (
                <span> Future course, not yet held</span>
              ) : (
                <span
                  className={
                    !!lessonStudentEnrollment.statuses[0].presence
                      ? "attend"
                      : "absent"
                  }
                >
                  {!!lessonStudentEnrollment.statuses[0].presence
                    ? "Attend"
                    : "Absent"}
                </span>
              )}
              .<br />
              {dateDay.getTime() < currentDate.getTime() &&
                (lessonStudentEnrollment.statuses[0].absenceReason
                  ? `Absence Reason: ${lessonStudentEnrollment.statuses[0].absenceReason}.`
                  : "")}
            </p>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className="modal">
      <div className="modal__body">
        <div
          onClick={() => {
            closeLessonEnrollments();
          }}
          className="close-modal"
        >
          x
        </div>
        <div className="course-date">
          <h4>Lesson Enrollments Statuses for course: {id}</h4>
          <h5>
            ({days[dateDay.getDay()]}, {thisDateSchedule[0].hours.startHour} -{" "}
            {thisDateSchedule[0].hours.endHour})
          </h5>
        </div>
        <div className="no-students">There are no registered students</div>
      </div>
    </div>
  );
};

export default LessonEnrollments;
