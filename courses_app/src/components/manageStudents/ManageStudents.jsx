import React, { useContext, useEffect, useReducer, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addRoomAction, setRoomsAction } from "../../actions/roomsActions";
import {
  addNewStudent,
  createNewCourse,
  deleteStudent,
  getAllCourses,
  getAllStudents,
} from "../../api/professorsAPI";
import { LoginContext } from "../../context/LoginContext";
import roomsReducer, { initialRoomsState } from "../../reducers/roomsReducer";
import Loader from "../main/Loader";
import validator from "validator";
import { newStudentFormInitialState, NewStudentFormReducer } from "../../reducers/newStudentReduser";
import NewFormInput from "../form/NewFormInput";

const EditProfessorStudents = () => {
  const { userData } = useContext(LoginContext);
  const [rooms, dispatcRooms] = useReducer(roomsReducer, []);
  const [isRoomLoaded, setIsRoomLoaded] = useState(false);
  const currentDate = new Date();
  const minDate = new Date(
    currentDate.getFullYear() - 120,
    currentDate.getMonth(),
    currentDate.getDate()
  );
  const minNewDate = new Date(
    currentDate.getFullYear() - 100,
    currentDate.getMonth(),
    currentDate.getDate()
  );
  const maxDate = new Date(
    currentDate.getFullYear() - 18,
    currentDate.getMonth(),
    currentDate.getDate()
  );

  const [allStudentsToDelete, dispatcAllStudentsToDelete] = useReducer(
    roomsReducer,
    []
  );
  const [studentToDelete, setStudentToDelete] = useState("All students...");

  useEffect(() => {
    let isComponentExist = true;
    getAllStudents(userData.token).then((newAllStudents) => {
      console.log(newAllStudents);
      if (isComponentExist) {
        dispatcAllStudentsToDelete(setRoomsAction(newAllStudents));
        setStudentToDelete("All students...");
        setIsRoomLoaded(true);
      }
      console.log(allStudentsToDelete);
    });
    return () => {
      isComponentExist = false;
    };
  }, [userData.token]);
  const [formState, dispatchForm] = useReducer(
    NewStudentFormReducer,
    newStudentFormInitialState
  );
  const [isEmailExists, setIsEmailExists] = useState(false);

  const phoneRegex = /^[0][5][0|2|3|4|5|9]{1}[-]{0,1}[0-9]{7}$/;
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/;
  const isTextValid = (value) => {
    return value.length >= 3;
  };
  const isPhoneNumberValid = (value) => {
    return phoneRegex.test(value);
  };
  const isEmailValid = (value) => {
    return !!validator.isEmail(value);
  };
  const isPasswordValid = (value) => {
    return passwordRegex.test(value);
  };
  const isPasswordRepeatValid = (value) => {
    return value.toString() === formState.values.password.toString();
  };
  const isBirthDateValid = (value) => {
    const newValue = new Date(value);
    return (
      newValue.getTime() <= maxDate.getTime() &&
      newValue.getTime() >= minNewDate.getTime()
    );
  };

  const onSubmitform = (event) => {
    event.preventDefault();
    setIsRoomLoaded(false);
    addNewStudent(userData.token, formState.values).then(
      (newAllStudents) => {
        dispatcAllStudentsToDelete(setRoomsAction(newAllStudents));
        setStudentToDelete("All students...");
        onClickClear();
        setIsRoomLoaded(true);
      },
      (err) => {
        console.log("err:");
        console.log(err);
        if (
          err.response.data.Error ===
          "This Email exists in the system, Email is unique"
        ) {
          document.getElementById(
            "editForm"
          ).childNodes[5].childNodes[2].className = "input-invalid";
          dispatchForm({
            type: "EMAIL",
            payload: { value: "", isValidInput: false },
          });
          setIsEmailExists(true);
        }
        setIsRoomLoaded(true);
      }
    );
  };

  const onClickClear = () => {
    document.getElementById("editForm").reset();
    const invalidMessages = document.getElementsByClassName("invalid-message");
    while (invalidMessages.length > 0) {
      invalidMessages[0].parentNode.childNodes[2].className = "input-valid";
      invalidMessages[0].parentNode.removeChild(invalidMessages[0]);
    }
  };

  const onChangeStudentToDelete = (event) => {
    const newStudentToDelete = event.target.value;
    setStudentToDelete(newStudentToDelete);
  };

  const onClickDelete = () => {
    setIsRoomLoaded(false);
    deleteStudent(userData.token, studentToDelete).then(
      (newAllStudents) => {
        dispatcAllStudentsToDelete(setRoomsAction(newAllStudents));
        setStudentToDelete("All students...");
        setIsRoomLoaded(true);
      },
      (err) => {
        alert("Server connection failed, try again later!");
      }
    );
  };

  return (
    <div className="rooms">
      <div className="rooms__section-delete">
        <h3>Choose student to delete:</h3>
        <select
          onChange={onChangeStudentToDelete}
          defaultValue={studentToDelete}
          className="input-valid"
        >
          <option value="All students..." hidden>
            All students...
          </option>
          {allStudentsToDelete.map((student) => (
            <option key={student.email} value={student.email}>
              {student.firstName} {student.lastName}
            </option>
          ))}
        </select>
        <button
          disabled={studentToDelete == "All students..."}
          onClick={onClickDelete}
        >
          Delete
        </button>
      </div>
      <div className="add-form">
        <h3>Subscribe student:</h3>
        <form onSubmit={onSubmitform} id="editForm">
          <NewFormInput
            data={{
              type: "text",
              placeholder: "first name",
              label: "First Name",
              name: "FIRST_NAME",
              validationFunc: isTextValid,
              invalidMessage: "First name could not be shorter than 2 letters",
              isInputDisabledAttribute: false,
              dispatchForm: dispatchForm,
            }}
          />
          <NewFormInput
            data={{
              type: "text",
              placeholder: "last name",
              label: "Last Name",
              name: "LAST_NAME",
              validationFunc: isTextValid,
              invalidMessage: "Last name could not be shorter than 2 letters",
              isInputDisabledAttribute: false,
              dispatchForm: dispatchForm,
            }}
          />
          <NewFormInput
            data={{
              type: "date",
              label: "Birth Date",
              name: "BIRTH_DATE",
              validationFunc: isBirthDateValid,
              invalidMessage: "Incorrect age, too young!",
              isInputDisabledAttribute: false,
              dispatchForm: dispatchForm,
              min: minDate.toISOString().substring(0, 10),
              max: currentDate.toISOString().substring(0, 10),
            }}
          />
          <NewFormInput
            data={{
              type: "text",
              placeholder: "address format: street building/door city",
              label: "Address",
              name: "ADDRESS",
              validationFunc: isTextValid,
              invalidMessage: "Address could not be shorter than 2 letters",
              isInputDisabledAttribute: false,
              dispatchForm: dispatchForm,
            }}
          />
          <NewFormInput
            data={{
              type: "text",
              placeholder: "phone number",
              label: "Phone Number",
              name: "PHONE_NUMBER",
              validationFunc: isPhoneNumberValid,
              invalidMessage: "Phone number length invalid",
              isInputDisabledAttribute: false,
              dispatchForm: dispatchForm,
            }}
          />
          <NewFormInput
            data={{
              type: "text",
              placeholder: "email",
              label: "Email",
              name: "EMAIL",
              validationFunc: isEmailValid,
              invalidMessage: "Email invalid",
              isInputDisabledAttribute: false,
              dispatchForm: dispatchForm,
            }}
          />
          <NewFormInput
            data={{
              type: "password",
              placeholder: "password",
              label: "Password",
              name: "PASSWORD",
              validationFunc: isPasswordValid,
              invalidMessage:
                "Password must contain capital and regular characters, numbers and must have at least 6 characters",
              isInputDisabledAttribute: false,
              dispatchForm: dispatchForm,
            }}
          />
          <NewFormInput
            data={{
              type: "password",
              placeholder: "repeat password",
              label: "Repeat Password",
              name: "REPEAT_PASSWORD",
              validationFunc: isPasswordRepeatValid,
              invalidMessage: "The two passwords not identical",
              isInputDisabledAttribute: false,
              dispatchForm: dispatchForm,
            }}
          />
          {isEmailExists && <div className="invalid-message">Mail exist.</div>}
          <div className="edit-form__nav">
            <button type="submit" disabled={!formState.isFormValid}>
              Add
            </button>
            <div onClick={onClickClear}>Clear</div>
          </div>
        </form>
      </div>
      {!isRoomLoaded && <Loader />}
    </div>
  );
};

export default EditProfessorStudents;
