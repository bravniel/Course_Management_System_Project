const express = require("express");
const { auth } = require("../middleware/auth");
const Professor = require("../models/professorModel");
const Student = require("../models/studentModel");
const Course = require("../models/courseModel");
const Enrollment = require("../models/enrollmentModal");
const mongoose = require("mongoose");
const utils = require("../utils/utils");

const router = new express.Router();

// logout professor - remove connected token
router.post("/professors/logout", auth, async (req, res) => {
  const professor = req.user;
  try {
    if (!req.isProfessor) {
      return res.status(401).send({ Error: "not authenticate" });
    }
    professor.tokens = professor.tokens.filter(
      (tokenDoc) => tokenDoc.token !== req.token
    );
    await professor.save();
    res.send("logout succsessfuly");
  } catch (e) {
    res.status(500).send({ Error: e.message });
  }
});

// login professor - get new connected token
router.post("/professors/login", async (req, res) => {
  const loginInfo = req.body;
  try {
    if (!loginInfo.email)
      return res.status(400).send({ Error: "Email required" });
    if (!loginInfo.password)
      return res.status(400).send({ Error: "Password required" });
    const professor = await Professor.findProfessorbyEmailAndPassword(
      loginInfo.email,
      loginInfo.password
    );
    const token = await professor.generateAuthToken();
    const isProfessor = true;
    res.send({ professor, isProfessor, token });
  } catch (e) {
    res.status(500).send({ Error: e.message });
  }
});

// create new professor
router.post("/professors", async (req, res) => {
  const info = req.body;
  try {
    const professor = new Professor(info);
    await professor.save();
    const token = await professor.generateAuthToken();
    res.send({ professor, token });
  } catch (e) {
    e.name === "MongoError" && e.code === 11000
      ? res
          .status(500)
          .send({ Error: "This Email exists in the system, Email is unique" })
      : res.status(500).send({ Error: e.message });
  }
});

// edit professor data
router.patch("/professors", auth, async (req, res) => {
  const professor = req.user;
  const updateProfessor = req.body;

  try {
    if (!req.isProfessor) {
      return res.status(401).send({ Error: "not authenticate" });
    }
    professor.firstName = updateProfessor.firstName || professor.firstName;
    professor.lastName = updateProfessor.lastName || professor.lastName;
    professor.address = updateProfessor.address || professor.address;
    professor.phoneNumber =
      updateProfessor.phoneNumber || professor.phoneNumber;
    professor.email = updateProfessor.email || professor.email;

    if (updateProfessor.password) {
      if (!updateProfessor.repeatPassword)
        return res.status(400).send({ Error: "Repeat Password required!" });
      if (updateProfessor.repeatPassword !== updateProfessor.password)
        return res
          .status(400)
          .send({ Error: "Password is not equals to Repeat Password" });
      professor.password = updateProfessor.password;
    }

    await professor.save();
    res.send(professor);
  } catch (e) {
     e.code === 11000
      ? res
          .status(500)
          .send({ Error: "This Email exists in the system, Email is unique" })
      : res.status(500).send({ Error: e.message });
  }
});

// |----------------------------------------------------------------------------------------------|
// |-------------------->     Professor's actions on students:     <------------------------------|
// |----------------------------------------------------------------------------------------------|

router.get("/students", auth, async (req, res) => {
  // all students
  try {
    if (!req.isProfessor) {
      return res.status(401).send({ Error: "not authenticate" });
    }
    const allStudents = await Student.find();
    res.send(allStudents);
  } catch (e) {
    res.status(500).send({ Error: e.message });
  }
});

router.post("/students", auth, async (req, res) => {
  // create new student
  const info = req.body;
  try {
    if (!req.isProfessor) {
      return res.status(401).send({ Error: "not authenticate" });
    }
    const user = new Student(info);
    await user.save();
    const token = await user.generateAuthToken();
    const students = await Student.find();
    res.send(students);
  } catch (e) {
    e.code === 11000
      ? res
          .status(500)
          .send({ Error: "This Email exists in the system, Email is unique" })
      : res.status(500).send({ Error: e.message });
  }
});

router.delete("/students/:id", auth, async (req, res) => {
  // delete student - user & belonged courses

  // Start a transaction
  const session = await mongoose.startSession();
  session.startTransaction();
  const studentEmail = req.params.id;
  try {
    if (!req.isProfessor) {
      return res.status(401).send({ Error: "not authenticate" });
    }
    const student = await Student.findOne({ email: studentEmail });
    if (!student) {
      //throw new Error();
      const err = new Error("No student found");
      err.status = 401;
      throw err;
    }
    // Remove data from the first collection
    await Enrollment.deleteMany({ student: student._id }, { session });
    // Remove data from the second collection
    await student.remove({ session });
    // Commit the transaction
    await session.commitTransaction();
    const students = await Student.find();
    // "Student & its registrations to courses has been successfully deleted"
    res.send(students);
  } catch (e) {
    // If an error occurred, abort the transaction and throw the error
    await session.abortTransaction();
    res.status(500).send({
      Error: e.message,
      Message: "Server connection failed, try again later!",
    });
  } finally {
    // End the session
    session.endSession();
  }
});

router.post("/students/courses/:id", auth, async (req, res) => {
  // add student belonged course
  const courseName = req.params.id;
  const studentEmail = req.body.studentEmail;
  try {
    if (!req.isProfessor) {
      return res.status(401).send({ Error: "not authenticate" });
    }
    const student = await Student.findOne({ email: studentEmail });
    const course = await Course.findOne({ name: courseName });
    const isDoubleEnrollment = await Enrollment.findOne({
      student: student._id,
      course: course._id,
    });
    if (isDoubleEnrollment) {
      return res
        .status(400)
        .send({ Error: "This student already belong to this course" });
    }
    const allDates = utils.getArrayOfDates(
      course.startDate,
      course.endDate,
      course.schedule
    );
    const statuses = [...setStudentStatuses(allDates)];
    const enrollment = new Enrollment({
      student: student._id,
      course: course._id,
      statuses: statuses,
    });
    await enrollment.save();
    const thisCourseStudents = await utils.getAllCourseStudents(course._id);
    res.send(thisCourseStudents);
  } catch (e) {
    res.status(500).send({ Error: e.message });
  }
});

router.delete("/students/courses/:id", auth, async (req, res) => {
  // remove student belonging from course
  const courseName = req.params.id;
  const studentEmail = req.body.studentEmail;
  try {
    if (!req.isProfessor) {
      return res.status(401).send({ Error: "not authenticate" });
    }
    const student = await Student.findOne({ email: studentEmail });
    const course = await Course.findOne({ name: courseName });
    const enrollment = await Enrollment.deleteMany({
      student: student._id,
      course: course._id,
    });
    if (!enrollment) {
      return res.status(400).send({ Error: "No belonging for course" });
    }
    const thisCourseStudents = await utils.getAllCourseStudents(course._id);
    res.send(thisCourseStudents);
  } catch (e) {
    res.status(500).send({ Error: e.message });
  }
});

// Auxiliary functions:

const setStudentStatuses = (allDates) => {
  let studentStatuses = [];
  allDates.forEach((date) => {
    const status = {
      classDate: date,
      presence: false,
      absenceReason: "did not justify yet",
    };
    studentStatuses.push(status);
  });
  return studentStatuses;
};

module.exports = router;
