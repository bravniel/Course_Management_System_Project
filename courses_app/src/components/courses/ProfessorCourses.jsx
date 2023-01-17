import React, { useContext, useEffect, useReducer, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setRoomsAction } from "../../actions/roomsActions";
import { createNewCourse, getAllCourses } from "../../api/professorsAPI";
import { LoginContext } from "../../context/LoginContext";
import {
  newCourseFormInitialState,
  NewCourseFormReducer,
} from "../../reducers/newCourseReduser";
import roomsReducer from "../../reducers/roomsReducer";
import { inputProperties } from "../../utils/utils";
import FormInput from "../form/FormInput";
import Loader from "../main/Loader";
import CourseDay from "./CourseDay";

const ProfessorCourses = () => {
  const { userData } = useContext(LoginContext);
  const [rooms, dispatcRooms] = useReducer(roomsReducer, []);
  const [isRoomLoaded, setIsRoomLoaded] = useState(false);
  const [searchByWho, setSearchByWho] = useState(null);
  const [isSearchByProfessorId, setIsSearchByProfessorId] = useState(false);
  const [formState, dispatchForm] = useReducer(
    NewCourseFormReducer,
    newCourseFormInitialState
  );
  const [isNameExists, setIsNameExists] = useState(false);
  const onClickClear = () => {
    document.getElementById("form").reset();
    dispatchForm({
      type: "INIT",
      // payload: { day: day, startHour: startHour, endHour: newEndTime },
    });
  };

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

  const onSubmitInputNewRoom = (event) => {
    const scheduleDays = [];
    Object.entries(formState.values.scheduleDays).forEach(([key, value]) => {
      scheduleDays.push(value);
    });
    console.log(scheduleDays);
    event.preventDefault();
    setIsRoomLoaded(false);
    // .toISOString().substring(0, 10)
    createNewCourse(userData.token, {
      name: formState.values.name,
      professor: userData.user._id,
      startDate: formState.values.startDate,
      endDate: formState.values.endDate,
      schedule: scheduleDays,
    }).then(
      () => {
        setIsRoomLoaded(true);
        navigate("/course/" + formState.values.name);
      },
      (err) => {
        if (
          err.response.data.Error ===
          "This Name exists in the system, Name is unique"
        ) {
          dispatchForm({
            type: "SET",
            payload: { type: "name", value: "", isValidInput: false },
          });
          setIsNameExists(true);
        }
        setIsRoomLoaded(true);
      }
    );
  };

  const onChangeSearchBy = () => {
    setIsRoomLoaded(false);
    setSearchByWho(!isSearchByProfessorId ? userData.user._id : null);
    setIsSearchByProfessorId(!isSearchByProfessorId);
  };

  const inputsProperties = {
    name: "course name",
    startDate: "",
    endDate: "",
  };
  const courseDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

  return (
    <div className="pages">
      <div className="pages__section-delete">
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
      <div className="add-form">
        <h3>Create course:</h3>
        <form onSubmit={onSubmitInputNewRoom} id="form">
          {Object.entries(inputsProperties).map(([key, value], index) => (
            <FormInput
              key={index}
              data={{
                type: inputProperties[key].type,
                placeholder: value,
                label: inputProperties[key].label,
                name: key,
                validationFunc: inputProperties[key].validationFunc,
                invalidMessage: inputProperties[key].invalidMessage,
                isInputDisabledAttribute: false,
                dispatchForm: dispatchForm,
                formState: formState,
                min: inputProperties[key].minValue,
                max: inputProperties[key].maxValue,
                formType: "new",
              }}
            />
          ))}
          <div className="courses__schedule-container">
            <u>Schedule:</u>
          </div>
          {courseDays.map((day, index) => (
            <CourseDay
              key={index}
              day={day}
              formState={formState}
              dispatchForm={dispatchForm}
            />
          ))}
          {isNameExists && (
            <div className="invalid-message">Course name exist.</div>
          )}
          <div className="edit-form__nav">
            <button type="submit" disabled={!formState.isFormValid}>
              Create
            </button>
            <div onClick={onClickClear}>Clear</div>
          </div>
        </form>
      </div>
      {!isRoomLoaded && <Loader />}
    </div>
  );
};

export default ProfessorCourses;
