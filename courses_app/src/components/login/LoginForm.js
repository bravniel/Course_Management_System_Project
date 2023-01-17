import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAction } from "../../actions/loginActions";
import { loginToSite } from "../../api/generalAPI";
import { LoginContext } from "../../context/LoginContext";
const LoginForm = (props) => {
  const { dispatchUserData } = useContext(LoginContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailinputValid, setIsEmailInputValid] = useState(true);
  const [isPasswordInputValid, setIsPasswordInputValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [role, setRole] = useState("student");

  const navigate = useNavigate();

  useEffect(() => {
    if (props.errorMessage !== "") {
      setErrorMessage(props.errorMessage);
    }
  }, [props.errorMessage]);

  const isFormInavlid = () => {
    return email === "" || password === "";
  };

  const onChangeEmailInput = (event) => {
    const theEmail = event.target.value.trim();
    if (theEmail === "") {
      setEmail("");
      setIsEmailInputValid(false);
    } else {
      setEmail(theEmail);
      setIsEmailInputValid(true);
    }
  };

  const onChangePasswordInput = (event) => {
    const thePassword = event.target.value.trim();
    setPassword(thePassword === "" ? "" : thePassword);
    setIsPasswordInputValid(thePassword !== "");
  };

  const onSubmitform = (event) => {
    event.preventDefault();
    console.log("login form:", email, password);
    loginToSite(email, password, role).then(
      (userData) => {
        dispatchUserData(loginAction(userData));
        localStorage.setItem("token", userData.token);
        navigate("/home");
      },
      (err) => {
        // if (err.message === "Request failed with status code 401") {
          setErrorMessage("Email or password are invalid.");
        // }
      }
    );
  };

  const onRoleChange = (event) => {
    setRole(event.target.value);
  };

  return (
    <div className="login-form">
      <h3>Login</h3>
      {errorMessage !== "" && (
        <div className="error-message">{errorMessage}</div>
      )}
      <form onSubmit={onSubmitform}>
        <input
          placeholder="Email"
          className={isEmailinputValid ? "input-valid" : "input-invalid"}
          onChange={onChangeEmailInput}
        />
        {!isEmailinputValid && (
          <div className="invalid-message">You must enter your email.</div>
        )}
        <input
          type="password"
          placeholder="Password"
          className={isPasswordInputValid ? "input-valid" : "input-invalid"}
          onChange={onChangePasswordInput}
        />
        {!isPasswordInputValid && (
          <div className="invalid-message">You must enter your password.</div>
        )}
        <div className="radio-choice_btn">
          <div>
            <input
              type="radio"
              name="role"
              value="student"
              id="student"
              checked={role === "student"}
              onChange={onRoleChange}
              disabled={isFormInavlid()}
            />
            <label
              className={
                email === "" || password === "" ? "disabled" : "undisabled"
              }
              htmlFor="student"
            >
              Student
            </label>
          </div>
          <div>
            <input
              type="radio"
              name="role"
              value="professor"
              id="professor"
              checked={role === "professor"}
              onChange={onRoleChange}
              disabled={isFormInavlid()}
            />
            <label
              className={
                email === "" || password === "" ? "disabled" : "undisabled"
              }
              htmlFor="professor"
            >
              Professor
            </label>
          </div>
        </div>
        <div className="login-form__nav">
          <button type="submit" disabled={isFormInavlid()}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
