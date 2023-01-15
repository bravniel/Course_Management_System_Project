import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { updateStudentClassAttendanceStatus } from "../../api/studentsAPI";
import { CourseContext } from "../../context/CourseContext";
import { LoginContext } from "../../context/LoginContext";

const EditStudentClassStatus = ({ classStatus,courseName, closeEditStudentClassStatus,getCourse }) => {
  const { userData } = useContext(LoginContext);
    const [absenceReason, setAbsenceReason] = useState(classStatus.absenceReason);
  const [presence, setPresence] = useState(classStatus.presence);
  const [isCanUpdate, setIsCanUpdate] = useState(true);
    
    const updateStatus = () => {
        updateStudentClassAttendanceStatus(userData.token,courseName, {classDate: classStatus.classDate.substring(0, 10), presence: presence, absenceReason: absenceReason}).then(() => {
            getCourse(courseName);
            closeEditStudentClassStatus();
        })
    }
  return (
    <div className="modal">
      <div className="modal__body">
        <div
          onClick={() => {
            closeEditStudentClassStatus();
          }}
          className="close-modal"
        >
          x
        </div>
        <h4>Lesson Status for {courseName} course date: {classStatus.classDate.substring(0, 10)}</h4>
        <select className="input-valid" value={presence} onChange={(event) => {
          const newPresence = event.target.value == "true"? true : false;
          console.log(newPresence);
          setPresence(newPresence);
          if (newPresence) {
            setIsCanUpdate(true)
          } else {
            setIsCanUpdate(classStatus.absenceReason.length > 0? true : false)
            setAbsenceReason(classStatus.absenceReason);
          }
        }}>
            <option value={true}>attend</option>
            <option value={false}>absent</option>
        </select>
              {presence === false && (<textarea value={absenceReason} onChange={(event) => {
                  const newAbsenceReason = event.target.value.trim();
          setAbsenceReason(newAbsenceReason);
          if (newAbsenceReason.length < 1) {
            setIsCanUpdate(false)
          } else {
            setIsCanUpdate(true)
          }
        }}></textarea>)}
        <button disabled={!isCanUpdate} onClick={updateStatus}>Send</button>
      </div>
    </div>
  );
};

export default EditStudentClassStatus;
