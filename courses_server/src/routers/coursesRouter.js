const express = require("express");
const { auth } = require("../middleware/auth");
const Course = require("../models/courseModel");
const Enrollment = require("../models/enrollmentModal");
const mongoose = require("mongoose");
const Student = require("../models/studentModel");
const utils = require("../utils/utils");

const router = new express.Router();

router.get("/courses", auth, async (req, res) => {
  try {
    if (!req.isProfessor) {
      return res.status(401).send({ Error: "not authenticate" });
    }
    const courses = await Course.find(
      !req.query.searchByProfessor
        ? {}
        : { professor: req.query.searchByProfessor }
    ).sort("name");
    if (!courses || courses.length === 0) {
      return res.status(404).send({ Error: "No courses" });
    }
    res.send({ courses });
  } catch (err) {
    res.status(500).send({ Error: err.message });
  }
});

router.get("/courses/:id", auth, async (req, res) => {
  const courseName = req.params.id;
  try {
    if (!req.isProfessor) {
      return res.status(401).send({ Error: "not authenticate" });
    }
    const course = await Course.findOne({ name: courseName }).populate(
      "professor"
    );
    if (!course || course.length === 0)
      return res.status(400).send({ Error: "Course not found" });
    const thisCourseStudents = await utils.getAllCourseStudents(course._id);
    const allStudents = await Student.find();
    // all students that not registered for the course
    const allNotRegisteredStudents = getAllNotRegisteredStudents(
      allStudents,
      thisCourseStudents
    );
    res.send({ course, thisCourseStudents, allNotRegisteredStudents });
  } catch (e) {
    res.status(500).send({ Error: e.message });
  }
});

router.get("/courses/:id/:date", auth, async (req, res) => {
  const courseName = req.params.id;
  const courseDate = req.params.date;
  try {
    if (!req.isProfessor) {
      return res.status(401).send({ Error: "not authenticate" });
    }
    const courseDateNew = new Date(courseDate);
    const course = await Course.findOne({ name: courseName });
    if (!course || course.length === 0)
      return res.status(400).send({ Error: "Course not found" });
    const thisCourseEnrollments = await getAllCourseEnrollments(
      course._id,
      courseDateNew
    );
    if (!thisCourseEnrollments || thisCourseEnrollments.length === 0)
      return res.status(400).send({ Error: "Enrollments not found" });
    res.send(thisCourseEnrollments);
  } catch (e) {
    res.status(500).send({ Error: e.message });
  }
});

router.post("/courses", auth, async (req, res) => {
  const info = req.body;
  try {
    if (!req.isProfessor) {
      return res.status(401).send({ Error: "not authenticate" });
    }
    const course = new Course(info);
    await course.save();
    res.send({ course });
  } catch (e) {
    e.name === "MongoError" && e.code === 11000
      ? res
          .status(500)
          .send({ Error: "This Name exists in the system, Name is unique" })
      : res.status(500).send({ Error: e.message });
  }
});

// delete a course - this course and the registrations for the course
router.delete("/courses/:id", auth, async (req, res) => {
  // Start a transaction
  const session = await mongoose.startSession();
  session.startTransaction();
  const courseName = req.params.id;
  try {
    if (!req.isProfessor) {
      return res.status(401).send({ Error: "not authenticate" });
    }
    const course = await Course.findOne({ name: courseName });
    if (!course) return res.status(400).send({ Error: "Course not found" });
    // Remove data from the first collection
    await Enrollment.deleteMany({ course: course._id }, { session });
    // Remove data from the second collection
    await course.remove({ session });
    // Commit the transaction
    await session.commitTransaction();
    res.send("Course & its registrations has been successfully deleted");
  } catch (e) {
    // If an error occurred, abort the transaction and throw the error
    await session.abortTransaction();
    //res.status(500).send({ Error: e.message });
    res.status(500).send({
      Error: e.message,
      Message: "Server connection failed, try again later!",
    });
  } finally {
    // End the session
    session.endSession();
  }
});

// Auxiliary functions:

const getAllNotRegisteredStudents = (allStudents, allRegisteredStudents) => {
  let allNotRegisteredStudents = [...allStudents];
  allRegisteredStudents.forEach((existStudent) => {
    allNotRegisteredStudents = allNotRegisteredStudents.filter(
      (student) => student.email !== existStudent.student.email
    );
  });
  return allNotRegisteredStudents;
};

const getAllCourseEnrollments = async (courseId, courseDateNew) => {
  const thisCourseEnrollments = await Enrollment.find(
    {
      course: courseId,
    },
    { student: 1, statuses: 1 }
  )
    .select({
      statuses: { $elemMatch: { classDate: courseDateNew } },
    })
    .populate("student");
  return thisCourseEnrollments;
};

module.exports = router;
