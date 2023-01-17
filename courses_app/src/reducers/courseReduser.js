export const initialcourseState = {
  isCourseExist: false,
    name: "",
    startDate: "",
    endDate:"",
  schedule:[],
  dates: [],
  registeredStudents: [],
  newStudents: [],
};

const courseReducer = (courseState, action) => {
  switch (action.type) {
    case "INIT":
      return {
        name: action.courseData.course.name,
        startDate: action.courseData.course.startDate,
        endDate: action.courseData.course.endDate,
        schedule: action.courseData.course.schedule,
        dates: action.courseData.course.allDates,
        registeredStudents: action.courseData.thisCourseStudents,
        newStudents: action.courseData.allNotRegisteredStudents,
        isCourseExist: true,
      };
    case "ADD_STUDENT":
      return {
        ...courseState,
        registeredStudents: action.courseData,
        isCourseExist: false,
      };
    case "REMOVE_STUDENT":
      return {
        ...courseState,
        registeredStudents: action.courseData,
        isCourseExist: false,
      };
    default:
      return courseState;
  }
};

export default courseReducer;
