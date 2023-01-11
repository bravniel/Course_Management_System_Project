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
    if (req.isProfessor) {
      return res.status(401).send({ Error: "not authenticate" });
    }
    user.firstName = updateUser.firstName || user.firstName;
    user.lastName = updateUser.lastName || user.lastName;
    user.address = updateUser.address || user.address;
    user.phoneNumber = updateUser.phoneNumber || user.phoneNumber;

    if (updateUser.password) {
      if (!updateUser.repeatPassword)
        return res.status(400).send({ Error: "Repeat Password required!" });
      if (updateUser.repeatPassword !== updateUser.password)
        return res
          .status(400)
          .send({ Error: "Password is not equals to Repeat Password" });
      user.password = updateUser.password;
    }

    await user.save();
    res.send(user);
  } catch (e) {
    e.name === "MongoError" && e.code === 11000
      ? res
          .status(500)
          .send({ Error: "This Email exists in the system, Email is unique" })
      : res.status(500).send({ Error: e.message });
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
    if (req.isProfessor) {
      return res.status(401).send({ Error: "not authenticate" });
    }
    user.tokens = user.tokens.filter(
      (tokenDoc) => tokenDoc.token !== req.token
    );
    await user.save();
    res.send();
  } catch (e) {
    res.status(500).send({ Error: e.message });
  }
});

router.get("/students/courses", auth, async (req, res) => {
  // get student belonged courses
  const user = req.user;
  try {
    if (req.isProfessor) {
      return res.status(401).send({ Error: "not authenticate" });
    }
    const studentCourses = await Enrollment.find({
      student: user._id,
    }).populate("course");
    if (studentCourses.length === 0) {
      return res.status(400).send({ Error: "No belonged courses" });
    }
    res.send(studentCourses);
  } catch (e) {
    res.status(500).send({ Error: e.message });
  }
});

router.get("/students/courses/:id", auth, async (req, res) => {
  // get student belonged course info
  const courseName = req.params.id;
  const student = req.user;
  try {
    if (req.isProfessor) {
      return res.status(401).send({ Error: "not authenticate" });
    }
    const course = await Course.findOne({ name: courseName }).populate(
      "professor"
    );
    const thisCourse = await Enrollment.findOne({
      student: student._id,
      course: course._id,
    });
    thisCourse.course = course;
    res.send(thisCourse);
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
    if (req.isProfessor) {
      return res.status(401).send({ Error: "not authenticate" });
    }
    const course = await Course.findOne({ name: courseName });
    const thisCourse = await Enrollment.findOne({
      student: student._id,
      course: course._id,
    });
    for (let i = 0; i < thisCourse.statuses.length; i++) {
      if (thisCourse.statuses[i].classDate.getTime() === classDate.getTime()) {
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
  } catch (e) {
    res.status(500).send({ Error: e.message });
  }
});

module.exports = router;
