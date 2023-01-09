import React from "react";
import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";

import Header from "../components/main/Header";
import Home from "../components/home/Home";
import LoginPage from "../components/login/LoginPage";
import PageNotFound from "../components/main/PageNotFound";
import Footer from "../components/main/Footer";
import LoginContextProvider from "../context/LoginContext";
import PrivateRoute from "./PrivateRoute";
import LoginRoute from "./LoginRoute";
import ProfessorHomePage from "../components/professor/ProfessorHomePage";
import Courses from "../components/courses/Courses";
import CourseLoader from "../components/course/CourseLoader";
import EditProfessorStudents from "../components/manageStudents/ManageStudents";
import PrivateProfessorRoute from "./PrivateProfessorRoute";
import PrivateStudentRoute from "./PrivateStudentRoute";
import StudentHomePage from "../components/students/StudentHomePage";
import ProfessorCourses from "../components/courses/ProfessorCourses";
import StudentCourses from "../components/courses/StudentCourses";
import EditUser from "../components/form/EditUser";
import EditStudentForm from "../components/students/forms/EditStudentForm";
import EditProffesorForm from "../components/professor/forms/EditProfessorForm";
const AppRouter = () => (
  <BrowserRouter>
    <LoginContextProvider>
      <Header />
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/edit" element={<EditUser />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/course/:id" element={<CourseLoader />} />

          <Route element={<PrivateProfessorRoute />}>
            <Route path="/professor/home" element={<ProfessorHomePage />} />
            <Route path="/professor/edit" element={<EditProffesorForm />} />
            <Route
              path="/professor/students"
              element={<EditProfessorStudents />}
            />
            <Route path="/professor/courses" element={<ProfessorCourses />} />
            <Route path="/professor/course/:id" element={<CourseLoader />} />
          </Route>

          <Route element={<PrivateStudentRoute />}>
            <Route path="/student/home" element={<StudentHomePage />} />
            <Route path="/student/edit" element={<EditStudentForm />} />
            <Route path="/student/courses" element={<StudentCourses />} />
            {/* <Route path="/student/course/:id" element={<CourseLoader />} /> */}
          </Route>
          
        </Route>

        <Route element={<LoginRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </LoginContextProvider>
  </BrowserRouter>
);

export default AppRouter;
