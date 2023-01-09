import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { updateStudentClassAttendanceStatus } from "../../api/studentsAPI";
import { CourseContext } from "../../context/CourseContext";
import { LoginContext } from "../../context/LoginContext";

const EditStudentClassStatus = ({ classStatus,courseName, closeEditStudentClassStatus,getCourse }) => {
  const { userData } = useContext(LoginContext);
    const [absenceReason, setAbsenceReason] = useState(classStatus.absenceReason);
    const [presence, setPresence] = useState(classStatus.presence);
    
    const updateStatus = () => {
        updateStudentClassAttendanceStatus(userData.token,courseName, {classDate: classStatus.classDate.substring(0, 10), presence: presence, absenceReason: absenceReason}).then(() => {
            getCourse(courseName);
            closeEditStudentClassStatus();
        })
    }
  return (
    <div className="private-message">
      <div className="private-message__body">
        <div
          onClick={() => {
            closeEditStudentClassStatus();
          }}
          className="close-modal"
        >
          x
        </div>
        <h4>Lesson Status for {courseName} course date: {classStatus.classDate.substring(0, 10)}</h4>
        <select defaultValue={classStatus.presence} onChange={(event) => {
                  const newPresence = event.target.value;
                setPresence(newPresence);
        }}>
            <option value={true}>attend</option>
            <option value={false}>absent</option>
        </select>
              <textarea value={absenceReason} onChange={(event) => {
                  const newAbsenceReason = event.target.value.trim();
                      setAbsenceReason(newAbsenceReason);
        }}></textarea>
        <button onClick={updateStatus}>Send</button>
      </div>
    </div>
  );
};

export default EditStudentClassStatus;
