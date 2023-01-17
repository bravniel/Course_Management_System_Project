import React, { useContext, useEffect, useReducer, useState } from "react";
import { setRoomsAction } from "../../actions/roomsActions";
import {
  addNewStudent,
  deleteStudent,
  getAllStudents,
} from "../../api/professorsAPI";
import { LoginContext } from "../../context/LoginContext";
import roomsReducer from "../../reducers/roomsReducer";
import Loader from "../main/Loader";
import { newStudentFormInitialState, NewStudentFormReducer } from "../../reducers/newStudentReduser";
import Form from "../form/Form";

const EditProfessorStudents = () => {
  const { userData } = useContext(LoginContext);
  const [isRoomLoaded, setIsRoomLoaded] = useState(false);
  const [allStudentsToDelete, dispatcAllStudentsToDelete] = useReducer(
    roomsReducer,
    []
  );
  const [studentToDelete, setStudentToDelete] = useState("All students...");

  useEffect(() => {
    let isComponentExist = true;
    getAllStudents(userData.token).then((newAllStudents) => {
      if (isComponentExist) {
        dispatcAllStudentsToDelete(setRoomsAction(newAllStudents));
        setStudentToDelete("All students...");
        setIsRoomLoaded(true);
      }
    });
    return () => {
      isComponentExist = false;
    };
  }, [userData.token]);

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

  const [formState, dispatchForm] = useReducer(
    NewStudentFormReducer,
    newStudentFormInitialState
  );
  const [isEmailExists, setIsEmailExists] = useState(false);

  const onSubmitform = (event) => {
    event.preventDefault();
    setIsRoomLoaded(false);
    addNewStudent(userData.token, formState.values).then(
      (newAllStudents) => {
        dispatcAllStudentsToDelete(setRoomsAction(newAllStudents));
        setStudentToDelete("All students...");
        document.getElementById("form").reset();
        setIsRoomLoaded(true);
      },
      (err) => {
        if (
          err.response.data.Error ===
          "This Email exists in the system, Email is unique"
        ) {
          // document.getElementById(
          //   "editForm"
          // ).childNodes[5].childNodes[2].className = "input-invalid";
          dispatchForm({
            type: "SET",
            payload: { type: "email", value: "", isValidInput: false },
          });
          setIsEmailExists(true);
        }
        setIsRoomLoaded(true);
      }
    );
  };

  const inputDisabledAttributes = {
    firstName: false,
    lastName: false,
    birthDate: false,
    address: false,
    phoneNumber: false,
    email: false,
    password: false,
    repeatPassword: false,
  };

  const inputsProperties = {
    firstName: "first name",
    lastName: "last name",
    birthDate: "birth date",
    address: "address format: street building/door city",
    phoneNumber: "phone number",
    email: "email",
    password: "password",
    repeatPassword: "repeat password",
  };

  return (
    <div className="pages">
      <div className="pages__section-delete">
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
        <Form
          inputsValues={inputsProperties}
          inputDisabledAttributes={inputDisabledAttributes}
          formState={formState}
          dispatchForm={dispatchForm}
          isEmailExists={isEmailExists}
          onSubmitFunc={onSubmitform}
          formType={"new"}
        />
      </div>
      {!isRoomLoaded && <Loader />}
    </div>
  );
};

export default EditProfessorStudents;
