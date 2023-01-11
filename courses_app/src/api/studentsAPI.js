import axios from "axios";

const url = process.env.REACT_APP_API_URL;

export const editStudentInfo = async (token, changes) => {
  const routeUrl = url + "students";
  const headers = { Authorization: "Bearer " + token };
  const student = await axios.patch(routeUrl, changes, {headers});
  return student.data;
};

export const logoutStudent = async (token) => {
  const routeUrl = url + "students/logout";
  const headers = { Authorization: "Bearer " + token };
  const student = await axios.post(routeUrl, {}, {headers});
  return student.data;
};

export const getStudentCourses = async (token) => {
  const routeUrl = url + "students/courses";
  const headers = { Authorization: "Bearer " + token };
  const course = await axios.get(routeUrl, {headers});
  return course.data;
};

export const getStudentCourseInfo = async (token, courseName) => {
  const routeUrl = url + "students/courses/" + courseName;
  const headers = { Authorization: "Bearer " + token };
  const course = await axios.get(routeUrl, {headers});
  return course.data;
};

export const updateStudentClassAttendanceStatus = async (
  token,
  courseName,
  attendanceStatus
) => {
  const routeUrl = url + "students/courses/" + courseName;
  const headers = { Authorization: "Bearer " + token };
  const course = await axios.patch(routeUrl, attendanceStatus, {headers});
  return course.data;
};


