import React, { useContext, useEffect, useReducer, useState } from "react";
import { setRoomsAction } from "../../actions/roomsActions";
import { getStudentCourseInfo, getStudentCourses } from "../../api/studentsAPI";
import { LoginContext } from "../../context/LoginContext";
import roomsReducer from "../../reducers/roomsReducer";
import Loader from "../main/Loader";
import EditStudentClassStatus from "./EditStudentClassStatus";

const StudentCourses = () => {
    const { userData } = useContext(LoginContext);
    const [rooms, dispatcRooms] = useReducer(roomsReducer, []);
    const [isRoomLoaded, setIsRoomLoaded] = useState(false);
    const currentDate = new Date();    
    const [courseInfo, setCourseInfo] = useState([]);
    const [courseName, setCourseName] = useState("");
    const [editStudentClassStatusForm, setEditStudentClassStatusForm] = useState(false);
    const [classStatus, setClassStatus] = useState(null);

    useEffect(() => {
        let isComponentExist = true;
        getStudentCourses(userData.token).then((courses) => {
            if (isComponentExist) {
                dispatcRooms(setRoomsAction(courses));
                setIsRoomLoaded(true);
            }
        });
        return () => {
            isComponentExist = false;
        };
    }, [userData.token]);

    const getCourse = (courseName) => {
        setIsRoomLoaded(false);
        getStudentCourseInfo(userData.token, courseName).then((newAllStatuses) => {
            setCourseInfo(newAllStatuses);
            setCourseName(courseName);
            setIsRoomLoaded(true);
        });
    };

    const closeEditStudentClassStatus = () => {
        setEditStudentClassStatusForm(false);
        setClassStatus(null);
    };

    const isButtonDisabled = (value) => {
        const date = new Date(value);
        return date.getTime() >= currentDate.getTime();
    }
    
  return (
    <div className="pages">
      <div className="pages__section">
        <h3>Choose course:</h3>
        {rooms.map((room) => (
          <div
            className="page"
            key={room._id}
            onClick={() => getCourse(room.course.name)}
          >
            {room.course.name}
          </div>
        ))}
      </div>
      {courseName !== "" && (
        <div className="pages__section">
          <h3>Attendances for course: {courseName}</h3>
          <div className="course-schedule">
            Start date: {courseInfo.course.startDate.substring(0, 10)}
          </div>
          <div className="course-schedule">
            End date: {courseInfo.course.endDate.substring(0, 10)}
          </div>
          {courseInfo.course.schedule.map((day, i) => (
            <div key={i} className="course-schedule">
              Every {day.day}, {day.hours.startHour} - {day.hours.startHour}
            </div>
          ))}
          <div className="statuses">
            {courseInfo.statuses.map((status, i) => (
              <div key={i} className={i % 2 == 0 ? "my-message" : "message"}>
                <p>
                  <u>{status.classDate.substring(0, 10)}:</u>
                  {new Date(status.classDate).getTime() >
                  currentDate.getTime() ? (
                    <span> Future course, not yet held</span>
                  ) : (
                    <span className={!!status.presence ? "attend" : "absent"}>
                      {status.presence ? " Attend" : " Absent"}
                    </span>
                  )}
                  .
                  {new Date(status.classDate).getTime() <
                    currentDate.getTime() && (
                    <button
                      className="courses__button-new"
                      disabled={isButtonDisabled(status.classDate)}
                      onClick={() => {
                        setClassStatus(status);
                        setEditStudentClassStatusForm(true);
                      }}
                    >
                      Change
                    </button>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      {!isRoomLoaded && <Loader />}
      {!!editStudentClassStatusForm && (
        <EditStudentClassStatus
          classStatus={classStatus}
          courseName={courseName}
          closeEditStudentClassStatus={closeEditStudentClassStatus}
          getCourse={getCourse}
        />
      )}
    </div>
  );
};

export default StudentCourses;


