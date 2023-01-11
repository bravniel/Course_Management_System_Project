const Enrollment = require("../models/enrollmentModal");

const getAllCourseStudents = async (courseId) => {
  const thisCourseStudents = await Enrollment.find(
    {
      course: courseId,
    },
    { student: 1 }
  ).populate("student");
  return thisCourseStudents;
};

module.exports =  getAllCourseStudents;

// const validatePropertyLength = (user, updateUser, property, error) => {
//   if (updateUser?.[property]?.length < 2)
//     return res.status(400).send({ Error: error });
//   user[property] = updateUser[property];
// };

// validatePropertyLength(
//   professor,
//   updateProfessor,
//   "firstName",
//   "First name is too short"
// );
