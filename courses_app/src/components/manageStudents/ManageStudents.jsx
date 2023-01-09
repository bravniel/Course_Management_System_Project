import React, { useContext, useEffect, useReducer, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addRoomAction, setRoomsAction } from "../../actions/roomsActions";
import { addNewStudent, createNewCourse, deleteStudent, getAllCourses, getAllStudents } from "../../api/professorsAPI";
import { LoginContext } from "../../context/LoginContext";
import roomsReducer, { initialRoomsState } from "../../reducers/roomsReducer";
import Loader from "../main/Loader";
import validator from "validator";

const EditProfessorStudents = () => {
    const { userData } = useContext(LoginContext);
    const [rooms, dispatcRooms] = useReducer(roomsReducer, []);
    const [isRoomLoaded, setIsRoomLoaded] = useState(false);
    const currentDate = new Date();
    const minDate = new Date(currentDate.getFullYear()-120, currentDate.getMonth(), currentDate.getDate());
    const maxDate = new Date(currentDate.getFullYear() - 18, currentDate.getMonth(), currentDate.getDate());
    
    const [allStudentsToDelete, dispatcAllStudentsToDelete] = useReducer(roomsReducer, []);
    const [studentToDelete, setStudentToDelete] = useState("All students...");

    useEffect(() => {
        let isComponentExist = true;
        getAllStudents(userData.token).then((newAllStudents) => {
            console.log(newAllStudents)
            if (isComponentExist) {
                dispatcAllStudentsToDelete(setRoomsAction(newAllStudents));
                setStudentToDelete("All students...");
                setIsRoomLoaded(true);
            }
            console.log(allStudentsToDelete)
      });
        return () => {
            isComponentExist = false;
        };
    }, [userData.token]);

    const phoneRegex = /^[0][5][0|2|3|4|5|9]{1}[-]{0,1}[0-9]{7}$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/;
    
  const [inputClasses, setInputClasses] = useState([
    "input-valid",
    "input-valid",
    "input-valid",
    "input-valid",
    "input-valid",
    "input-valid",
    "input-valid",
    "input-valid",
  ]);
  const [invalidMessages, setInvalidMessages] = useState(["", "", "", "", "", "", "", ""]);
  const [validInputs, setValidInputs] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const [repeatPassword, setRepeatPassword] = useState("");

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
          setValue("");
        setStateOfInputs(invalidValueMessage, "input-invalid", false);
      }
    } else {
        setValue("");
        setStateOfInputs("A value must be entered", "input-invalid", false);
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
    
    const onChangeBirthDate = (event) => {
    const newBirthDate = event.target.value;
        const isBirthDateValid = (value) => {
            const newValue = new Date(value);
      return newValue.getTime() <= maxDate.getTime();
    };
    validateInput(
      newBirthDate,
      2,
      isBirthDateValid,
      setBirthDate,
      "Incorrect age, too young!"
    );
  };

  const onBlurAddress = (event) => {
    const newAddress = event.target.value.trim();
    const isAddressValid = (value) => {
      return value.length > 2;
    };
    validateInput(
      newAddress,
      3,
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
      4,
      isPhoneNumberValid,
      setPhoneNumber,
      "Phone number length invalid"
    );
  };

  const onBlurEmail = (event) => {
    const newEmail = event.target.value.trim();
    validateInput(
      newEmail,
      5,
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
      6,
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
      7,
      isPasswordRepeatedValid,
      setRepeatPassword,
      "The two passwords not identical"
    );
  };

  const onSubmitform = (event) => {
      event.preventDefault();
      setIsRoomLoaded(false);
    addNewStudent(userData.token,{firstName,lastName,birthDate,address,phoneNumber,email, password}).then(
      (newAllStudents) => {
        // dispatchUserData(loginAction({user:newUserData,isProfessor:userData.isProfessor,token:userData.token}));
            dispatcAllStudentsToDelete(setRoomsAction(newAllStudents));
            setStudentToDelete("All students...");
            onClickClear();
            setIsRoomLoaded(true);
      },
        (err) => {
            console.log("err:")
            console.log(err)
        if (err.response.data.Error === "Email exists in the system, Email is unique") {
          setInputClasses(["input-valid", "input-valid", "input-valid", "input-valid", "input-valid", "input-invalid", "input-valid", "input-valid"]);
          setInvalidMessages(["", "", "", "", "", "Mail exist.", "", ""]);
          setValidInputs([true,true,,true,true, true, false, true, true]);
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
    "input-valid",
  ]);
  setInvalidMessages(["", "", "", "", "", "", "",""]);
  setValidInputs([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
    };

   const onChangeStudentToDelete = (event) => {
    const newStudentToDelete = event.target.value;
    setStudentToDelete(newStudentToDelete)
    };

    const onClickDelete = () => {
    setIsRoomLoaded(false);
    deleteStudent(userData.token,studentToDelete).then(
      (newAllStudents) => {
        dispatcAllStudentsToDelete(setRoomsAction(newAllStudents));
        setStudentToDelete("All students...");
        setIsRoomLoaded(true);
      },
        (err) => {
        alert("Server connection failed, try again later!")
      }
    );
    };
    
  return (
    <div className="rooms">
      <div className="rooms__section-delete">
        <h3>Choose student to delete:</h3>
        <select onChange={onChangeStudentToDelete} defaultValue={studentToDelete} className="input-valid">
            <option value="All students..." hidden>All students...</option>
            {allStudentsToDelete.map((student) => (
                <option key={student.email} value={student.email}>{student.firstName} {student.lastName}</option>
            ))}
        </select>
        <button disabled={studentToDelete=="All students..."} onClick={onClickDelete}>Delete</button>
      </div>
      <div className="add-form">
        <h3>Subscribe student:</h3>
        <form onSubmit={onSubmitform} id="editForm" >
        <label className="">Name:</label>
        <input
          placeholder="First Name"
          className={inputClasses[0]}
          onBlur={onBlurFirstName}
        />
        {invalidMessages[0] !== "" && (
          <div className="invalid-message">{invalidMessages[0]}</div>
              )}

        <input
          placeholder="Last Name"
          className={inputClasses[1]}
          onBlur={onBlurLastName}
        />
        {invalidMessages[1] !== "" && (
          <div className="invalid-message">{invalidMessages[1]}</div>
                  )}
                  
        <label className="">Birth date:</label>
        <input type="date" className={inputClasses[2]} min={minDate.toISOString().substring(0, 10)} max={currentDate.toISOString().substring(0, 10)} onChange={onChangeBirthDate} />
        {invalidMessages[2] !== "" && (
          <div className="invalid-message">{invalidMessages[2]}</div>
                  )}
                  
        <label className="">Address:</label>     
        <input
          placeholder="Format: street building/door city"
          className={inputClasses[3]}
          onBlur={onBlurAddress}
        />
        {invalidMessages[3] !== "" && (
          <div className="invalid-message">{invalidMessages[3]}</div>
              )}
        <label className="">Contact:</label>      
        <input
          placeholder="Phone Number"
          className={inputClasses[4]}
          onBlur={onBlurPhoneNumber}
        />
        {invalidMessages[4] !== "" && (
          <div className="invalid-message">{invalidMessages[4]}</div>
              )}
        <label className="">Identification:</label>      
        <input
          placeholder="Email"
          className={inputClasses[5]}
          onBlur={onBlurEmail}
        />
        {invalidMessages[5] !== "" && (
          <div className="invalid-message">{invalidMessages[5]}</div>
        )}
        <input
          type="password"
          placeholder="Password"
          className={inputClasses[6]}
          onBlur={onBlurPassword}
        />
        {invalidMessages[6] !== "" && (
          <div className="invalid-message">{invalidMessages[6]}</div>
        )}
        <input
          type="password"
          placeholder="Repeat on password"
          className={inputClasses[7]}
          onBlur={onBlurPasswordRepeated}
        />
        {invalidMessages[7] !== "" && (
          <div className="invalid-message">{invalidMessages[7]}</div>
        )}
        <div className="login-form__nav">
          <button type="submit" disabled={isFormInvalid()}>
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
