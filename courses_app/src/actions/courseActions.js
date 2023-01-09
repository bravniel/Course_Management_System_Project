export const addStudentAction = (courseData) => ({
  type: "ADD_STUDENT",
  courseData,
});

export const removeStudentAction = (courseData) => ({
  type: "REMOVE_STUDENT",
  courseData,
});

export const initCourseAction = (courseData) => ({
  type: "INIT",
  courseData,
});

export const removeCourseAction = (courseId) => ({
  type: "REMOVE",
  courseId,
});
