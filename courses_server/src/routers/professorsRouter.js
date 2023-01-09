const express = require("express");
const { auth } = require("../middleware/auth");
const Professor = require("../models/professorModel");
const Student = require("../models/studentModel");
const Course = require("../models/courseModel");
const Enrollment = require("../models/enrollmentModal");
const mongoose = require("mongoose");
const getArrayOfDates = require("../utils/utils");
const app = require("..");
const router = express.Router();

// logout professor - remove connected token
router.post("/professors/logout", auth, async (req, res) => {
  const professor = req.user;
  try {
    if (req.isProfessor) {
      professor.tokens = professor.tokens.filter(
        (tokenDoc) => tokenDoc.token !== req.token
      );
      await professor.save();
      res.send("logout succsessfuly");
    } else {
      return res.status(401).send({ Error: "not authenticate" });
    }
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
    if (!info.firstName)
      return res.status(400).send({ Error: "First Name required" });
    if (!info.lastName)
      return res.status(400).send({ Error: "Last Name required" });
    if (!info.birthDate)
      return res.status(400).send({ Error: "Birth Date required" });
    if (!info.address)
      return res.status(400).send({ Error: "Address required" });
    if (!info.phoneNumber)
      return res.status(400).send({ Error: "Phone Number required" });
    if (!info.email) return res.status(400).send({ Error: "Email required" });
    if (!info.password)
      return res.status(400).send({ Error: "Password required" });
    const duplicateUser = await Professor.findOne({ email: info.email });
    if (duplicateUser)
      return res
        .status(400)
        .send({ Error: "Email exists in the system, Email is unique" });
    await professor.save();
    const token = await professor.generateAuthToken();
    res.send({ professor, token });
  } catch (e) {
    res.status(500).send({ Error: e.message });
  }
});

// edit professor data
router.patch("/professors", auth, async (req, res) => {
  const professor = req.user;
  const updateProfessor = req.body;
  try {
    if (req.isProfessor) {
      if (updateProfessor.firstName) {
        if (updateProfessor.firstName.length < 2)
          return res.status(400).send({ Error: "First name is too short" });
        professor.firstName = updateProfessor.firstName;
      }
      if (updateProfessor.lastName) {
        if (updateProfessor.lastName.length < 2)
          return res.status(400).send({ Error: "Last name is too short" });
        professor.lastName = updateProfessor.lastName;
      }
      if (updateProfessor.address) {
        if (updateProfessor.address.length < 2)
          return res.status(400).send({ Error: "Address is too short" });
        professor.address = updateProfessor.address;
      }
      if (updateProfessor.phoneNumber) {
        if (updateProfessor.phoneNumber.length !== 10)
          return res.status(400).send({ Error: "Invalid phone number" });
        professor.phoneNumber = updateProfessor.phoneNumber;
      }
      if (updateProfessor.email) {
        const duplicateUser = await Professor.findOne({
          email: updateProfessor.email,
        });
        if (duplicateUser)
          return res.status(400).send({ Error: "Duplicate professor email" });
        professor.email = updateProfessor.email;
      }
      if (updateProfessor.password) {
        if (updateProfessor.password.length < 6)
          return res.status(400).send({ Error: "Password is too short" });
        if (!updateProfessor.repeatPassword)
          return res.status(400).send({ Error: "Repeat Password required!" });
        if (updateProfessor.repeatPassword !== updateProfessor.password)
          return res
            .status(400)
            .send({ Error: "Password is not equals to Repeat Password" });
        professor.password = updateProfessor.password;
      }
      await professor.save();
      res.send({ professor });
    } else {
      return res.status(401).send({ Error: "not authenticate" });
    }
  } catch (e) {
    res.status(500).send({ Error: e.message });
  }
});

// |----------------------------------------------------------------------------------------------|
// |-------------------->     Professor's actions on students:     <------------------------------|
// |----------------------------------------------------------------------------------------------|

router.get("/students", auth, async (req, res) => {
  // all students
  try {
    if (req.isProfessor) {
      const allStudents = await Student.find();
      res.send(allStudents);
    } else {
      return res.status(401).send({ Error: "not authenticate" });
    }
  } catch (e) {
    res.status(500).send({ Error: e.message });
  }
});

router.post("/students", auth, async (req, res) => {
  // create new student
  const info = req.body;
  try {
    if (req.isProfessor) {
      const user = new Student(info);
      if (!info.firstName)
        return res.status(400).send({ Error: "First Name required" });
      if (!info.lastName)
        return res.status(400).send({ Error: "Last Name required" });
      if (!info.birthDate)
        return res.status(400).send({ Error: "Birth Date required" });
      if (!info.address)
        return res.status(400).send({ Error: "Address required" });
      if (!info.phoneNumber)
        return res.status(400).send({ Error: "Phone Number required" });
      if (!info.email) return res.status(400).send({ Error: "Email required" });
      if (!info.password)
        return res.status(400).send({ Error: "Password required" });
      const duplicateUser = await Student.findOne({ email: info.email });
      if (duplicateUser)
        return res
          .status(400)
          .send({ Error: "Email exists in the system, Email is unique" });
      await user.save();
      const token = await user.generateAuthToken();
      // res.send({ user, token, name: user.name });
      const students = await Student.find();
      res.send(students);
    } else {
      return res.status(401).send({ Error: "not authenticate" });
    }
  } catch (e) {
    res.status(500).send({ Error: e.message });
  }
});

router.delete("/students/:id", auth, async (req, res) => {
  // delete student - user & belonged courses

  // Start a transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  const studentEmail = req.params.id;
  try {
    if (req.isProfessor) {
      const student = await Student.findOne({ email: studentEmail });
      if (!student) {
        //throw new Error();
        const err = new Error("No student found");
        err.status = 401;
        throw err;
      }
      // Remove data from the first collection
      await Enrollment.deleteMany({ student: student._id }, { session });

      // app.close(() => {
      //   console.log("server has been closed!!!");
      // });

      // Remove data from the second collection
      await student.remove({ session });

      // //process.exit(0);
      // app.close(() => {
      //   console.log("server has been closed!!!");
      // });

      // Commit the transaction
      await session.commitTransaction();
      const students = await Student.find();
      // "Student & its registrations to courses has been successfully deleted";
      res.send(students);
    } else {
      return res.status(401).send({ Error: "not authenticate" });
    }
  } catch (e) {
    // If an error occurred, abort the transaction and
    // throw the error
    await session.abortTransaction();
    //res.status(500).send({ Error: e.message });
    res
      .status(500)
      .send({
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
    if (req.isProfessor) {
      const student = await Student.findOne({ email: studentEmail });
      const course = await Course.findOne({ name: courseName });
      const isDoubleEnrollment = await Enrollment.findOne({
        student: student._id,
        course: course._id,
      });
      if (isDoubleEnrollment) {
        return res
          .status(400)
          .send({ Error: "You already belong to this course" });
      }
      const allDates = getArrayOfDates(
        course.startDate,
        course.endDate,
        course.schedule
      );
      const statuses = [];
      allDates.forEach((date) => {
        const status = {
          classDate: date,
          presence: false,
          absenceReason: "did not justify yet",
        };
        statuses.push(status);
      });
      const enrollment = new Enrollment({
        student: student._id,
        course: course._id,
        statuses: statuses,
      });
      await enrollment.save();
      const thisCourseStudents = await Enrollment.find(
        {
          course: course._id,
        },
        { student: 1 }
      ).populate("student");
      res.send(thisCourseStudents);
    } else {
      return res.status(401).send({ Error: "not authenticate" });
    }
  } catch (e) {
    res.status(500).send({ Error: e.message });
  }
});

router.delete("/students/courses/:id", auth, async (req, res) => {
  // remove student belonging from course
  const courseName = req.params.id;
  const studentEmail = req.body.studentEmail;
  try {
    if (req.isProfessor) {
      const student = await Student.findOne({ email: studentEmail });
      const course = await Course.findOne({ name: courseName });
      const enrollment = await Enrollment.deleteMany({
        student: student._id,
        course: course._id,
      });
      if (!enrollment) {
        return res.status(400).send({ Error: "No belonging for course" });
      }
      const thisCourseStudents = await Enrollment.find(
        {
          course: course._id,
        },
        { student: 1 }
      ).populate("student");
      res.send(thisCourseStudents);
    } else {
      return res.status(401).send({ Error: "not authenticate" });
    }
  } catch (e) {
    res.status(500).send({ Error: e.message });
  }
});

router.get("/professor/students/courses/:id", auth, async (req, res) => {
  // all students that not!! registered for the course
  const courseName = req.params.id;
  try {
    if (req.isProfessor) {
      const allStudents = await Student.find();
      const course = await Course.findOne({ name: courseName });
      const thisCourseStudents = await Enrollment.find(
        {
          course: course._id,
        },
        { student: 1, _id: 0 }
      ).populate("student");
      let allNotRegisteredStudents = [...allStudents];
      allStudents.forEach((student, i) => {
        thisCourseStudents.forEach((existStudent) => {
          // if (
          //   student.email == existStudent.student.email
          // ) {
          allNotRegisteredStudents = allNotRegisteredStudents.filter(
            (student) => student.email !== existStudent.student.email
          );
          // }
        });
      });
      res.send(allNotRegisteredStudents);
    } else {
      return res.status(401).send({ Error: "not authenticate" });
    }
  } catch (e) {
    res.status(500).send({ Error: e.message });
  }
});

module.exports = router;
