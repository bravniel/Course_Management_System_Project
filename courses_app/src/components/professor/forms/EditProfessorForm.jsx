import React, { useContext, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAction } from "../../../actions/loginActions";
import { editProfessorInfo } from "../../../api/professorsAPI";
import { LoginContext } from "../../../context/LoginContext";
import {
  editFormInitialState,
  FormReducer,
} from "../../../reducers/formReduser";
import Form from "../../form/Form";

const EditProffesorForm = () => {
  const navigate = useNavigate();
  const { userData, dispatchUserData } = useContext(LoginContext);
  const [formState, dispatchForm] = useReducer(
    FormReducer,
    editFormInitialState
  );
  const [isEmailExists, setIsEmailExists] = useState(false);

  const onSubmitform = (event) => {
    event.preventDefault();
    editProfessorInfo(userData.token, formState.values).then(
      (newUserData) => {
        dispatchUserData(
          loginAction({
            user: newUserData,
            isProfessor: userData.isProfessor,
            token: userData.token,
          })
        );
        navigate("/home");
        alert(
          `professor: ${userData.user.firstName} ${userData.user.lastName}, your's data updated sucsesfuly.`
        );
      },
      (err) => {
        console.log("err:");
        console.log(err);
        if (
          err.response.data.Error ===
          "This Email exists in the system, Email is unique"
        ) {
          dispatchForm({
            type: "SET",
            payload: { type: "email", value: "", isValidInput: false },
          });
          setIsEmailExists(true);
        }
      }
    );
  };

  const inputDisabledAttributes = {
    firstName: false,
    lastName: false,
    birthDate: true,
    address: false,
    phoneNumber: false,
    email: false,
    password: false,
    repeatPassword: false,
    role: true,
  };

  const inputsProperties = {
    ...userData.user,
    birthDate: userData.user.birthDate.slice(0, 10),
    password: "password",
    repeatPassword: "repeat password",
    role: userData.isProfessor ? "professor" : "student",
  };

  return (
    <div className="edit-page">
      <div className="edit-page__form">
        <div className="edit-form">
          <div className="title">Edit Profile</div>
          <Form
            inputsValues={inputsProperties}
            inputDisabledAttributes={inputDisabledAttributes}
            formState={formState}
            dispatchForm={dispatchForm}
            isEmailExists={isEmailExists}
            onSubmitFunc={onSubmitform}
            formType={"edit"}
          />
        </div>
      </div>
    </div>
  );
};

export default EditProffesorForm;
