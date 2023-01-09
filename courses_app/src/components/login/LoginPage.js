import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import LoginForm from "./LoginForm";

const LoginPage = (props) => {
  const location = useLocation();
  // const errorMessage = location.state?.needToLogin ? "You must to login!" : "";
  
  const [isLoginMode, setIsLoginMode] = useState(true);
  const errorMessage = location.state?.needToLogin ? "You must to login!" : "";

  return (
    <div className="login-page">
      <div className="login-page__form">
          <LoginForm
            setIsLoginMode={setIsLoginMode}
            errorMessage={errorMessage}
          />
      </div>
    </div>
  );
};

export default LoginPage;
