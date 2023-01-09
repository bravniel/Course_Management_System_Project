const express = require("express");
const { auth } = require("../middleware/auth");
const Student = require("../models/studentModel");
const Course = require("../models/courseModel");
const Enrollment = require("../models/enrollmentModal");
const router = new express.Router();

router.get("/connected-user-info", auth, async (req, res) => {
  // get connected student data
  const user = req.user;
  const isProfessor = req.isProfessor;
  const token = req.token;
  try {
    res.send({ user, isProfessor, token });
  } catch (e) {
    res.status(500).send({ Error: e.message });
  }
});

router.patch("/students", auth, async (req, res) => {
  // edit student data
  const user = req.user;
  const updateUser = req.body;
  try {
    if (!req.isProfessor) {
      if (updateUser.firstName) {
        if (updateUser.firstName.length < 2)
          return res.status(400).send({ Error: "First name is too short" });
        user.firstName = updateUser.firstName;
      }
      if (updateUser.lastName) {
        if (updateUser.lastName.length < 2)
          return res.status(400).send({ Error: "Last name is too short" });
        user.lastName = updateUser.lastName;
      }
      if (updateUser.address) {
        if (updateUser.address.length < 2)
          return res.status(400).send({ Error: "Address is too short" });
        user.address = updateUser.address;
      }
      if (updateUser.phoneNumber) {
        if (updateUser.phoneNumber.length !== 10)
          return res.status(400).send({ Error: "Invalid phone number" });
        user.phoneNumber = updateUser.phoneNumber;
      }
      if (updateUser.email) {
        const duplicateUser = await Student.findOne({
          email: updateUser.email,
        });
        if (duplicateUser)
          return res.status(400).send({ Error: "Duplicate user email" });
        user.email = updateUser.email;
      }
      if (updateUser.password) {
        if (updateUser.password.length < 6)
          return res.status(400).send({ Error: "Password is too short" });
        if (!updateUser.repeatPassword)
          return res.status(400).send({ Error: "Repeat Password required!" });
        if (updateUser.repeatPassword !== updateUser.password)
          return res
            .status(400)
            .send({ Error: "Password is not equals to Repeat Password" });
        user.password = updateUser.password;
      }
      await user.save();
      res.send( user );
    } else {
      return res.status(401).send({ Error: "not authenticate" });
    }
  } catch (e) {
    res.status(500).send({ Error: e.message });
  }
});

router.post("/students/login", async (req, res) => {
  // login student - get new connected token
  const loginInfo = req.body;
  try {
    if (!loginInfo.email)
      return res.status(400).send({ Error: "Email required" });
    if (!loginInfo.password)
      return res.status(400).send({ Error: "Password required" });
    const user = await Student.findStudentByEmailAndPassword(
      loginInfo.email,
      loginInfo.password
    );
    const token = await user.generateAuthToken();
    res.send({
      token,
      user,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (e) {
    res.status(500).send({ Error: e.message });
  }
});

router.post("/students/logout", auth, async (req, res) => {
  // logout student - remove connected token
  const user = req.user;
  try {
    if (!req.isProfessor) {
      user.tokens = user.tokens.filter(
        (tokenDoc) => tokenDoc.token !== req.token
      );
      await user.save();
      res.send();
    } else {
      return res.status(401).send({ Error: "not authenticate" });
    }
  } catch (e) {
    res.status(500).send({ Error: e.message });
  }
});

router.get("/students/courses", auth, async (req, res) => {
  // get student belonged courses
  const user = req.user;
  try {
    if (!req.isProfessor) {
      const studentCourses = await Enrollment.find({
        student: user._id,
      }).populate("course");
      if (studentCourses.length === 0) {
        return res.status(400).send({ Error: "No belonged courses" });
      }
      res.send(studentCourses);
    } else {
      return res.status(401).send({ Error: "not authenticate" });
    }
  } catch (e) {
    res.status(500).send({ Error: e.message });
  }
});

router.get("/students/courses/:id", auth, async (req, res) => {
  // get student belonged course info
  const courseName = req.params.id;
  const student = req.user;
  try {
    if (!req.isProfessor) {
      const course = await Course.findOne({ name: courseName }).populate(
        "professor"
      );
      const thisCourse = await Enrollment.findOne({
        student: student._id,
        course: course._id,
      });
      thisCourse.course = course;
      res.send(thisCourse);
    } else {
      return res.status(401).send({ Error: "not authenticate" });
    }
  } catch (e) {
    res.status(500).send({ Error: e.message });
  }
});

router.patch("/students/courses/:id", auth, async (req, res) => {
  // post student belonged course attendance status
  const courseName = req.params.id;
  const student = req.user;
  const classDate = new Date(req.body.classDate);
  const presence = req.body.presence;
  const absenceReason = req.body.absenceReason;
  try {
    if (!req.isProfessor) {
      const course = await Course.findOne({ name: courseName });
      const thisCourse = await Enrollment.findOne({
        student: student._id,
        course: course._id,
      });
      for (let i = 0; i < thisCourse.statuses.length; i++) {
        if (
          thisCourse.statuses[i].classDate.getTime() === classDate.getTime()
        ) {
          if (presence == true) {
            thisCourse.statuses[i].presence = true;
            thisCourse.statuses[i].absenceReason = "";
          } else {
            thisCourse.statuses[i].presence = false;
            thisCourse.statuses[i].absenceReason = absenceReason;
          }
        }
      }
      await thisCourse.save();
      res.send(thisCourse);
    } else {
      return res.status(401).send({ Error: "not authenticate" });
    }
  } catch (e) {
    res.status(500).send({ Error: e.message });
  }
});

module.exports = router;
