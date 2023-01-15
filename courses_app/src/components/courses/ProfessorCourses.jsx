import React, { useContext, useEffect, useReducer, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addRoomAction, setRoomsAction } from "../../actions/roomsActions";
import { createNewCourse, getAllCourses } from "../../api/professorsAPI";
import { LoginContext } from "../../context/LoginContext";
import roomsReducer, { initialRoomsState } from "../../reducers/roomsReducer";
import Loader from "../main/Loader";

const ProfessorCourses = () => {
    const { userData } = useContext(LoginContext);
    const [rooms, dispatcRooms] = useReducer(roomsReducer, []);
    const [isRoomLoaded, setIsRoomLoaded] = useState(false);
  const [searchByWho, setSearchByWho] = useState(null);
  const [isSearchByProfessorId, setIsSearchByProfessorId] = useState(false);
    const [name, setName] = useState("");
    const [isNameinputInvalid, setIsNameInputInvalid] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const currentDate = new Date();
    const [startDate, setStartDate] = useState(currentDate);
    const maxStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()+7);
    const maxEndDate = new Date(maxStartDate.getFullYear(), maxStartDate.getMonth()+4, maxStartDate.getDate());
    const [endDate, setEndDate] = useState(maxStartDate);
    const [daysChecked, setDaysChecked] = useState([false, false, false, false, false]);
    const [scheduleDays, setScheduleDays] = useState([]);
    const [isScheduleDaysInvalid, setIsScheduleDaysInvalid] = useState(true);
    const [scheduleStartHours, setScheduleStartHours] = useState(["07:00", "07:30", "08:00", "08:30", "09:00"]);
    const [scheduleEndHours, setScheduleEndHours] = useState(["12:00", "12:30", "13:00", "13:30", "14:00"]);

    useEffect(() => {
      let isComponentExist = true;
      getAllCourses(userData.token, searchByWho).then(
        (courses) => {
          if (isComponentExist) {
            dispatcRooms(setRoomsAction(courses.courses));
            setIsRoomLoaded(true);
          }
        },
        (err) => {
          dispatcRooms(setRoomsAction([]));
          setIsRoomLoaded(true);
        }
      );

      return () => {
        isComponentExist = false;
      };
    }, [userData.token, searchByWho]);

    const navigate = useNavigate();

    const isFormInavlid = () => {
        const isScheduleDaysValid = daysChecked.some(el=>el===true)
        return isNameinputInvalid || !isScheduleDaysValid;
    };
    
    const onBlurNameInput = (event) => {
    const theName = event.target.value.trim();
    if (theName === "") {
      setName("");
        setIsNameInputInvalid(true);
        setErrorMessage("You must enter a course name.");
    } else if (theName.length < 2) {
      setName("");
        setIsNameInputInvalid(true);
        setErrorMessage("Course name must be at least 2 letters long.");
    } else {
      setName(theName);
        setIsNameInputInvalid(false);
        setErrorMessage("");
    }
  };

    const onSubmitInputNewRoom = (event) => {
      console.log(scheduleDays)
        event.preventDefault();
        
        console.log("New course data: ",userData.user._id,startDate.toISOString().substring(0, 10),{endDate: endDate.toISOString().substring(0, 10)},scheduleDays);
      createNewCourse(userData.token, {name, professor: userData.user._id , startDate: startDate.toISOString().substring(0, 10),endDate: endDate.toISOString().substring(0, 10), schedule: scheduleDays}).then(
      () => {
        navigate("/course/"+name);
      },
          (err) => {
              console.log(err);
          if (err.response.data.Error === "Duplicate course name") {
            setIsNameInputInvalid(true);
          setErrorMessage("Name already exist.");
        }
      }
    );
    };

    const onChangeDay = (event) => {
    // Get the value of the checkbox that was just clicked
        const day = event.target.value;
        const position = event.target.id;
        const hours = { startHour: scheduleStartHours[+position], endHour: scheduleEndHours[+position] };
        const lesson = { day, hours: hours };

    let updatedCheckedDaysState = daysChecked.map((isDayChecked, index) =>
        index === +position ? !isDayChecked : isDayChecked);
        setDaysChecked(updatedCheckedDaysState);
        daysChecked[+position] ? setIsScheduleDaysInvalid(false) : setIsScheduleDaysInvalid(true);
    
        // Check if the item is in the checkedItems array
    if (scheduleDays.includes(day)) {
      // If it is, remove it from the array
      setScheduleDays(scheduleDays.filter(i => i.day !== day));
    } else {
      // If it's not, add it to the array
      setScheduleDays([...scheduleDays, lesson]);
    }
  }
    
    const onChangeStartTime = (value,index) => {
    let updatedScheduleStartHoursValue = [...scheduleStartHours];  
    updatedScheduleStartHoursValue[index] = value;
    setScheduleStartHours(updatedScheduleStartHoursValue);
    };
    
const onChangeEndTime = (value,index) => {
    let updatedScheduleEndHoursValue = [...scheduleEndHours];  
    updatedScheduleEndHoursValue[index] = value;
    setScheduleEndHours(updatedScheduleEndHoursValue);
  };
  
  const onChangeSearchBy = () => {
    setIsRoomLoaded(false);
    setSearchByWho(!isSearchByProfessorId ? userData.user._id : null);
    setIsSearchByProfessorId(!isSearchByProfessorId);
  };
    
  return (
    <div className="pages">
      <div className="pages__section">
        <h3>Choose course:</h3>
        <div className="courses__day-container">
          <input
            type="checkbox"
            checked={isSearchByProfessorId}
            onChange={onChangeSearchBy}
          />
          <label className="" htmlFor="searchByProfessorId">
            My courses
          </label>
        </div>
        {rooms.length > 0 &&
          rooms.map((room) => (
            <div className="page" key={room.name}>
              <Link to={"/course/" + room.name}>{room.name}</Link>
            </div>
          ))}

        {rooms.length == 0 && <div className="no-students">no coursrs!</div>}
      </div>
      <div className="pages__section">
        <h3>Create course:</h3>
        <form onSubmit={onSubmitInputNewRoom}>
          <input
            className={
              !isNameinputInvalid
                ? "courses__input-new"
                : "courses__input-invalid-new"
            }
            placeholder="course name"
            onBlur={onBlurNameInput}
          />
          {isNameinputInvalid && (
            <div className="invalid-message">{errorMessage}</div>
          )}
          <label className="">Start date:</label>
          <input
            type="date"
            className="courses__input-new"
            value={startDate.toISOString().substring(0, 10)}
            min={currentDate.toISOString().substring(0, 10)}
            max={maxStartDate.toISOString().substring(0, 10)}
            onChange={(event) => setStartDate(event.target.valueAsDate)}
          />
          <label className="">End date:</label>
          <input
            type="date"
            className="courses__input-new"
            value={endDate.toISOString().substring(0, 10)}
            min={maxStartDate.toISOString().substring(0, 10)}
            max={maxEndDate.toISOString().substring(0, 10)}
            onChange={(event) => setEndDate(event.target.valueAsDate)}
          />
          <div className="courses__schedule-container">
            <u>Schedule:</u>
          </div>

          <div className="courses__day-container">
            <input
              type="checkbox"
              checked={daysChecked[0]}
              onChange={onChangeDay}
              id="0"
              value="Sunday"
            />
            <label className="" htmlFor="0">
              Sunday
            </label>
          </div>
          {daysChecked[0] && (
            <div className="courses__hours-container">
              <label className="">Start:</label>
              <input
                type="time"
                className="courses__input-time"
                value={scheduleStartHours[0]}
                onChange={(event) => onChangeStartTime(event.target.value, 0)}
              />
              <label className="">End:</label>
              <input
                type="time"
                className="courses__input-time"
                value={scheduleEndHours[0]}
                onChange={(event) => onChangeEndTime(event.target.value, 0)}
              />
            </div>
          )}

          <div className="courses__day-container">
            <input
              type="checkbox"
              checked={daysChecked[1]}
              onChange={onChangeDay}
              id="1"
              value="Monday"
            />
            <label className="" htmlFor="1">
              Monday
            </label>
          </div>
          {daysChecked[1] && (
            <div className="courses__hours-container">
              <label className="">Start:</label>
              <input
                type="time"
                className="courses__input-time"
                value={scheduleStartHours[1]}
                onChange={(event) => onChangeStartTime(event.target.value, 1)}
              />
              <label className="">End:</label>
              <input
                type="time"
                className="courses__input-time"
                value={scheduleEndHours[1]}
                onChange={(event) => onChangeEndTime(event.target.value, 1)}
              />
            </div>
          )}

          <div className="courses__day-container">
            <input
              type="checkbox"
              checked={daysChecked[2]}
              onChange={onChangeDay}
              id="2"
              value="Tuesday"
            />
            <label className="" htmlFor="2">
              Tuesday
            </label>
          </div>
          {daysChecked[2] && (
            <div className="courses__hours-container">
              <label className="">Start:</label>
              <input
                type="time"
                className="courses__input-time"
                value={scheduleStartHours[2]}
                onChange={(event) => onChangeStartTime(event.target.value, 2)}
              />
              <label className="">End:</label>
              <input
                type="time"
                className="courses__input-time"
                value={scheduleEndHours[2]}
                onChange={(event) => onChangeEndTime(event.target.value, 2)}
              />
            </div>
          )}

          <div className="courses__day-container">
            <input
              type="checkbox"
              checked={daysChecked[3]}
              onChange={onChangeDay}
              id="3"
              value="Wednesday"
            />
            <label className="" htmlFor="3">
              Wednesday
            </label>
          </div>
          {daysChecked[3] && (
            <div className="courses__hours-container">
              <label className="">Start:</label>
              <input
                type="time"
                className="courses__input-time"
                value={scheduleStartHours[3]}
                onChange={(event) => onChangeStartTime(event.target.value, 3)}
              />
              <label className="">End:</label>
              <input
                type="time"
                className="courses__input-time"
                value={scheduleEndHours[3]}
                onChange={(event) => onChangeEndTime(event.target.value, 3)}
              />
            </div>
          )}

          <div className="courses__day-container">
            <input
              type="checkbox"
              checked={daysChecked[4]}
              onChange={onChangeDay}
              id="4"
              value="Thursday"
            />
            <label className="" htmlFor="4">
              Thursday
            </label>
          </div>
          {daysChecked[4] && (
            <div className="courses__hours-container">
              <label className="">Start:</label>
              <input
                type="time"
                className="courses__input-time"
                value={scheduleStartHours[4]}
                onChange={(event) => onChangeStartTime(event.target.value, 4)}
              />
              <label className="">End:</label>
              <input
                type="time"
                className="courses__input-time"
                value={scheduleEndHours[4]}
                onChange={(event) => onChangeEndTime(event.target.value, 4)}
              />
            </div>
          )}

          <button
            type="submit"
            className="courses__button-new"
            disabled={isFormInavlid()}
          >
            Create
          </button>
        </form>
      </div>
      {!isRoomLoaded && <Loader />}
    </div>
  );
};

export default ProfessorCourses;
