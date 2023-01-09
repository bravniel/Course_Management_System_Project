import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import { loginAction } from "../../../actions/loginActions";
import { editProfessorInfo } from "../../../api/professorsAPI";
import { LoginContext } from "../../../context/LoginContext";


const EditProffesorForm = () => {
    const { userData, dispatchUserData, isResponse } = useContext(LoginContext);
    console.log("edit student")
    console.log(userData)
    const phoneRegex = /^ [0][5][0 | 2 | 3 | 4 | 5 | 9]{ 1}[-]{ 0, 1 } [0 - 9]{ 7 } $ /;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/;
    
  const [inputClasses, setInputClasses] = useState([
    "input-valid",
    "input-valid",
    "input-valid",
    "input-valid",
    "input-valid",
    "input-valid",
    "input-valid",
  ]);
  const [invalidMessages, setInvalidMessages] = useState(["", "", "", "", "", "", ""]);
  const [validInputs, setValidInputs] = useState([
    true,
    true,
    true,
    true,
    true,
    true,
    true,
  ]);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const [repeatPassword, setRepeatPassword] = useState("");
  const navigate = useNavigate();

  const isFormInvalid = () => {
    return validInputs.includes(false);
  };

  const validateInput = (
    value,
    inputindex,
    isValueValidFunc,
    setValue,
    invalidValueMessage
  ) => {
    const setStateOfInputs = (message, inputClass, isvalidInput) => {
      const newInavlidMessages = [...invalidMessages];
      const newInputClasses = [...inputClasses];
      const newValidInputs = [...validInputs];
      newInavlidMessages[inputindex] = message;
      setInvalidMessages(newInavlidMessages);
      newInputClasses[inputindex] = inputClass;
      setInputClasses(newInputClasses);
      newValidInputs[inputindex] = isvalidInput;
      setValidInputs(newValidInputs);
    };

    if (value.length > 0) {
      if (isValueValidFunc(value)) {
        setStateOfInputs("", "input-valid", true);
        setValue(value);
      } else {
        setStateOfInputs(invalidValueMessage, "input-invalid", false);
      }
    } else {
        setValue("");
        setStateOfInputs("", "input-valid", true);
    }
  };

  const onBlurFirstName = (event) => {
    const newFirstName = event.target.value.trim();
    const isFirstNamevalid = (value) => {
      return value.length > 2;
    };
    validateInput(
      newFirstName,
      0,
      isFirstNamevalid,
      setFirstName,
      "First name could not be shorter than 2 letters"
    );
    };

    const onBlurLastName = (event) => {
    const newLastName = event.target.value.trim();
    const isLastNamevalid = (value) => {
      return value.length > 2;
    };
    validateInput(
      newLastName,
      1,
      isLastNamevalid,
      setLastName,
      "Last name could not be shorter than 2 letters"
    );
  };

  const onBlurAddress = (event) => {
    const newAddress = event.target.value.trim();
    const isAddressValid = (value) => {
      return value.length > 2;
    };
    validateInput(
      newAddress,
      2,
      isAddressValid,
      setAddress,
      "Address could not be shorter than 2 letters"
    );
    };
    
    const onBlurPhoneNumber = (event) => {
    const newPhoneNumber = event.target.value.trim();
    const isPhoneNumberValid = (value) => {
      return phoneRegex.test(value);
    };
    validateInput(
      newPhoneNumber,
      3,
      isPhoneNumberValid,
      setPhoneNumber,
      "Phone number length invalid"
    );
  };

  const onBlurEmail = (event) => {
    const newEmail = event.target.value.trim();
    validateInput(
      newEmail,
      4,
      validator.isEmail,
      setEmail,
      "Email invalid"
    );
  };

  const onBlurPassword = (event) => {
    const newPassword = event.target.value.trim();
    const isPasswordValid = (value) => {
      return passwordRegex.test(value);
    };
    validateInput(
      newPassword,
      5,
      isPasswordValid,
      setPassword,
      "Password must contain capital and regular characters, numbers and must have at least 6 characters"
    );
  };

  const onBlurPasswordRepeated = (event) => {
    const passwordRepeated = event.target.value.trim();
    const isPasswordRepeatedValid = (value) => {
      return password === passwordRepeated;
    };
    validateInput(
      passwordRepeated,
      6,
      isPasswordRepeatedValid,
      setRepeatPassword,
      "The two passwords not identical"
    );
  };


  const onSubmitform = (event) => {
    event.preventDefault();
    editProfessorInfo(userData.token,{firstName,lastName,address,phoneNumber,email, password,repeatPassword}).then(
      (newUserData) => {
        dispatchUserData(loginAction({user:newUserData,isProfessor:userData.isProfessor,token:userData.token}));
        alert("professor data updated sucsesfuly");
        navigate("/home");
      },
        (err) => {
            console.log("err:")
            console.log(err)
        if (err.response.data.Error === "Duplicate professor email") {
          setInputClasses(["input-valid", "input-valid", "input-valid", "input-valid", "input-invalid", "input-valid", "input-valid"]);
          setInvalidMessages(["", "", "", "", "Mail exist.", "", ""]);
          setValidInputs([true,true,true, true, false, true, true]);
        }
      }
    );
  };

  const onClickClear = () => {
    // props.setIsLoginMode(true);
      document.getElementById("editForm").reset();
    setInputClasses([
    "input-valid",
    "input-valid",
    "input-valid",
    "input-valid",
    "input-valid",
    "input-valid",
    "input-valid",
  ]);
  setInvalidMessages(["", "", "", "", "", "", ""]);
  setValidInputs([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
    };

    return (
      <div className="login-page">
      <div className="login-page__form">
          <div className="login-form">
      <div className="close-modal_btn" onClick={()=>{navigate("/home")}}>X</div>
              <h3>Edit Profile</h3>
      <form onSubmit={onSubmitform} id="editForm" >
        <input
          placeholder={userData.user.firstName}
          className={inputClasses[0]}
          onBlur={onBlurFirstName}
        />
        {invalidMessages[0] !== "" && (
          <div className="invalid-message">{invalidMessages[0]}</div>
              )}

        <input
          placeholder={userData.user.lastName}
          className={inputClasses[1]}
          onBlur={onBlurLastName}
        />
        {invalidMessages[1] !== "" && (
          <div className="invalid-message">{invalidMessages[1]}</div>
              )}

        <input
                      type="date"
                     
          value={userData?.user.birthDate.slice(0,10)}
          disabled={true}
              />
              
        <input
          placeholder={userData.user.address}
          className={inputClasses[2]}
          onBlur={onBlurAddress}
        />
        {invalidMessages[2] !== "" && (
          <div className="invalid-message">{invalidMessages[2]}</div>
              )}
              
        <input
          placeholder={userData.user.phoneNumber}
          className={inputClasses[3]}
          onBlur={onBlurPhoneNumber}
        />
        {invalidMessages[3] !== "" && (
          <div className="invalid-message">{invalidMessages[3]}</div>
              )}
              
        <input
          placeholder={userData.user.email}
          className={inputClasses[4]}
          onBlur={onBlurEmail}
        />
        {invalidMessages[4] !== "" && (
          <div className="invalid-message">{invalidMessages[4]}</div>
        )}
        <input
          type="password"
          placeholder="Password"
          className={inputClasses[5]}
          onBlur={onBlurPassword}
        />
        {invalidMessages[5] !== "" && (
          <div className="invalid-message">{invalidMessages[5]}</div>
        )}
        <input
          type="password"
          placeholder="Repeat on password"
          className={inputClasses[6]}
          onBlur={onBlurPasswordRepeated}
        />
        {invalidMessages[6] !== "" && (
          <div className="invalid-message">{invalidMessages[6]}</div>
        )}
              <input placeholder={userData.isProfessor ? "Role: Professor" : "Role: Student"} disabled={true} />
        <div className="login-form__nav">
          <button type="submit" disabled={isFormInvalid()}>
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

export default EditProffesorForm;
