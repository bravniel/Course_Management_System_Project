import React, { createContext, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAction } from "../actions/loginActions";
import { getUserInfo } from "../api/generalAPI";
import loginReducer, { userDataInitialState } from "../reducers/loginReducer";

export const LoginContext = createContext();

const LoginContextProvider = (props) => {
  const navigate = useNavigate();
  const [isResponse, setIsResponse] = useState(false);

  const [userData, dispatchUserData] = useReducer(
    loginReducer, userDataInitialState);
  
  const initAuthUser = async () => {
    try {
      if (!userData.user) {
        const userToken = localStorage.getItem("token");
      if (userToken) {
        const response = await getUserInfo(userToken);
        if (!response.Error) {
          setIsResponse(true);
          return dispatchUserData(loginAction({
            user: response.user,
            isProfessor: response.isProfessor,
            token: response.token,
          }));
        } else {
          setIsResponse(true);
          return navigate("/login");
        }
      } else {
        setIsResponse(true);
        return navigate("/login");
      }
      }
      setIsResponse(true);
    } catch (error) {
      setIsResponse(true);
      return navigate("/login");
    }
  }
  useEffect(() => {
    initAuthUser();
  }, [userData]);

  return (
    <LoginContext.Provider value={{ userData, dispatchUserData, isResponse }}>
      {props.children}
    </LoginContext.Provider>
  );
};

export default LoginContextProvider;
