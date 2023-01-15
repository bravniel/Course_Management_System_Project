import React, { useContext, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import { loginAction } from "../../../actions/loginActions";
import { editStudentInfo } from "../../../api/studentsAPI";
import { LoginContext } from "../../../context/LoginContext";
import {
  editFormInitialState,
  FormReducer,
} from "../../../reducers/formReduser";
import FormInput from "../../form/FormInput";

const EditStudentForm = () => {
  const { userData, dispatchUserData } = useContext(LoginContext);
  const [formState, dispatchForm] = useReducer(
    FormReducer,
    editFormInitialState
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

  const navigate = useNavigate();

  const onSubmitform = (event) => {
    event.preventDefault();
    editStudentInfo(userData.token, formState.values).then(
      (newUserData) => {
        dispatchUserData(
          loginAction({
            user: newUserData,
            isProfessor: userData.isProfessor,
            token: userData.token,
          })
        );
        alert("student data updated sucsesfuly");
        navigate("/home");
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
          // "Mail exist."
        }
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

  return (
    <div className="edit-page">
      <div className="edit-page__form">
        <div className="edit-form">
          <div className="title">Edit Profile</div>
          <form onSubmit={onSubmitform} id="editForm">
            <FormInput
              data={{
                type: "text",
                placeholder: userData.user.firstName,
                label: "First Name",
                name: "FIRST_NAME",
                validationFunc: isTextValid,
                invalidMessage:
                  "First name could not be shorter than 2 letters",
                isInputDisabledAttribute: false,
                dispatchForm: dispatchForm,
              }}
            />
            <FormInput
              data={{
                type: "text",
                placeholder: userData.user.lastName,
                label: "Last Name",
                name: "LAST_NAME",
                validationFunc: isTextValid,
                invalidMessage: "Last name could not be shorter than 2 letters",
                isInputDisabledAttribute: false,
                dispatchForm: dispatchForm,
              }}
            />
            <FormInput
              data={{
                type: "text",
                placeholder: userData.user.birthDate.slice(0, 10),
                label: "Birth date",
                isInputDisabledAttribute: true,
              }}
            />
            <FormInput
              data={{
                type: "text",
                placeholder: userData.user.address,
                label: "Address",
                name: "ADDRESS",
                validationFunc: isTextValid,
                invalidMessage: "Address could not be shorter than 2 letters",
                isInputDisabledAttribute: false,
                dispatchForm: dispatchForm,
              }}
            />
            <FormInput
              data={{
                type: "text",
                placeholder: userData.user.phoneNumber,
                label: "Phone Number",
                name: "PHONE_NUMBER",
                validationFunc: isPhoneNumberValid,
                invalidMessage: "Phone number length invalid",
                isInputDisabledAttribute: false,
                dispatchForm: dispatchForm,
              }}
            />
            <FormInput
              data={{
                type: "text",
                placeholder: userData.user.email,
                label: "Email",
                name: "EMAIL",
                validationFunc: isEmailValid,
                invalidMessage: "Email invalid",
                isInputDisabledAttribute: false,
                dispatchForm: dispatchForm,
              }}
            />
            <FormInput
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
            <FormInput
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
            <FormInput
              data={{
                type: "text",
                placeholder: userData.isProfessor ? "Professor" : "Student",
                label: "Role",
                isInputDisabledAttribute: true,
              }}
            />
            {isEmailExists && (
              <div className="invalid-message">Mail exist.</div>
            )}
            <div className="edit-form__nav">
              <button type="submit" disabled={!formState.isFormValid}>
                Update
              </button>
              <div onClick={onClickClear}>Clear</div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditStudentForm;
