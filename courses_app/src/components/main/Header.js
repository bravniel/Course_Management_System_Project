import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutAction } from "../../actions/loginActions";
import { logoutProfessor } from "../../api/professorsAPI";
import { logoutStudent } from "../../api/studentsAPI";
import { LoginContext } from "../../context/LoginContext";

const Header = () => {
  const { userData, dispatchUserData } = useContext(LoginContext);
  const navigate = useNavigate();

  const onClickLogout = () => {
    !userData.isProfessor
      ? logoutStudent(userData.token).then(() => {
          dispatchUserData(logoutAction());
          localStorage.removeItem("token");
          navigate("/login");
        })
      : logoutProfessor(userData.token).then(() => {
          dispatchUserData(logoutAction());
          localStorage.removeItem("token");
          navigate("/login");
        });
  };

  return (
    <div className="header">
      <div className="header__nav">
        {!userData.user ? (
          <>
            <img src="./logo.png" />
            <div className="header__nav_logo_subtitle-full">
              <span>C</span>ourse <span>M</span>anagement <span>S</span>ystem
            </div>
            <div className="header__nav_logo_subtitle-small">
              <span>C</span> <span>M</span> <span>S</span>
            </div>
          </>
        ) : (
          <>
            {!userData.isProfessor ? (
              <NavLink
                to="/student/home"
                className={({ isActive }) =>
                  "home-nav-link" + (isActive ? " header__active-link" : "")
                }
              >
                Home
              </NavLink>
            ) : (
              <NavLink
                to="/professor/home"
                className={({ isActive }) =>
                  "home-nav-link" + (isActive ? " header__active-link" : "")
                }
              >
                Home
              </NavLink>
            )}

            <div>
              {!!userData.isProfessor && (
                <NavLink
                  to="/professor/students"
                  className={({ isActive }) =>
                    "home-nav" + (isActive ? " header__active-link" : "")
                  }
                >
                  Students
                </NavLink>
              )}

              {!userData.isProfessor ? (
                <NavLink
                  to="/student/courses"
                  className={({ isActive }) =>
                    "home-nav" + (isActive ? " header__active-link" : "")
                  }
                >
                  Courses
                </NavLink>
              ) : (
                <NavLink
                  to="/professor/courses"
                  className={({ isActive }) =>
                    "home-nav" + (isActive ? " header__active-link" : "")
                  }
                >
                  Courses
                </NavLink>
              )}
              {!userData.isProfessor ? (
                <NavLink
                  to="/student/edit"
                  className={({ isActive }) =>
                    "home-nav" + (isActive ? " header__active-link" : "")
                  }
                >
                  Profile
                </NavLink>
              ) : (
                <NavLink
                  to="/professor/edit"
                  className={({ isActive }) =>
                    "home-nav" + (isActive ? " header__active-link" : "")
                  }
                >
                  Profile
                </NavLink>
              )}

              {!!userData.user && (
                <div
                  className="header__logout-nav home-nav-link"
                  onClick={onClickLogout}
                >
                  Logout
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
