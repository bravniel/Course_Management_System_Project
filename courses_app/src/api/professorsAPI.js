import axios from "axios";

const url = process.env.REACT_APP_API_URL;

// export const getProfessorInfo = async (token) => {
//   const routeUrl = url + "professors/connected-professor-info";
//   const headers = { Authorization: "Bearer " + token };
//   const professor = await axios.get(routeUrl, {headers});
//   return professor.data;
// };

export const editProfessorInfo = async (token, changes) => {
  const routeUrl = url + "professors";
  const headers = { Authorization: "Bearer " + token };
  const professor = await axios.patch(routeUrl, changes, {headers});
  return professor.data;
};

export const logoutProfessor = async (token) => {
  console.log("token logout: "+token)
  const routeUrl = url + "professors/logout";
  const headers = { Authorization: "Bearer " + token };
  const professor = await axios.post(routeUrl,{} ,{ headers });
  return professor.data;
};

// |----------------------------------------------------------------------------------------------|
// |-------------------->     Professor's actions on students:     <------------------------------|
// |----------------------------------------------------------------------------------------------|

export const addNewStudent = async (token, newStudentInfoBody) => {
  const routeUrl = url + "students";
  const headers = { Authorization: "Bearer " + token };
  const student = await axios.post(routeUrl, newStudentInfoBody, {headers});
  return student.data;
};

export const deleteStudent = async (token, studentId) => {
  const routeUrl = url + "students/" + studentId;
  const headers = { Authorization: "Bearer " + token };
  const student = await axios.delete(routeUrl, {headers});
  return student.data;
};

export const registerStudentForCourse = async (
  token,
  courseName,
  studentId
) => {
  console.log(studentId);
  const routeUrl = url + "students/courses/" + courseName;
  const headers = { Authorization: "Bearer " + token };
  const response = await axios.post(
    routeUrl,
    { studentEmail: studentId },
    { headers }
  );
  return response.data;
};

export const removeStudentFromCourse = async (token, courseName, studentId) => {
  const routeUrl = url + "students/courses/" + courseName;
  const headers = { Authorization: "Bearer " + token };
  console.log("token: " + token);
  console.log("courseName: " + courseName);
  console.log("studentId: " + studentId);
  const response = await axios.delete(
    routeUrl,
    {
      headers: {...headers},
      data: { studentEmail: studentId }
    }
  );
  return response.data;
};

export const getAllStudents = async (token) => {
  const routeUrl = url + "students";
  const headers = { Authorization: "Bearer " + token };
  const students = await axios.get(routeUrl, { headers });
  return students.data;
};

// |----------------------------------------------------------------------------------------------|
// |-------------------->     Professor's actions on courses:      <------------------------------|
// |----------------------------------------------------------------------------------------------|

export const getAllCourses = async (token, professorId) => {
  const routeUrl =
    url + "courses" + `?searchByProfessor=${professorId}`;
  const headers = { Authorization: "Bearer " + token };
  const courses = await axios.get(routeUrl, {headers});
  return courses.data;
};

export const getCourseInfo = async (token, courseName) => {
  const routeUrl = url + "courses/" + courseName;
  const headers = { Authorization: "Bearer " + token };
  const course = await axios.get(routeUrl, {headers});
  return course.data;
};

export const getAllNotRegisteredCourseStudents = async (token, courseName) => {
  const routeUrl = url + "professor/students/courses/" + courseName;
  const headers = { Authorization: "Bearer " + token };
  const course = await axios.get(routeUrl, { headers });
  return course.data;
};

export const getStudentsClassAttendanceStatusesByDate = async (
  token,
  courseName,
  courseDate
) => {
  const routeUrl = url + "courses/" + courseName + "/" + courseDate;
  const headers = { Authorization: "Bearer " + token };
  const response = await axios.get(routeUrl, {headers});
  return response.data;
};

export const createNewCourse = async (token, newCourseInfoBody) => {
  const routeUrl = url + "courses";
  const headers = { Authorization: "Bearer " + token };
  const course = await axios.post(routeUrl, newCourseInfoBody, {headers});
  return course.data;
};

export const deleteCourse = async (token, courseName) => {
  const routeUrl = url + "courses/" + courseName;
  const headers = { Authorization: "Bearer " + token };
  const course = await axios.delete(routeUrl, {headers});
  return course.data;
};
