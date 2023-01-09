const mongoose = require("mongoose");
const getArrayOfDates = require("../utils/utils");

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
      unique: true,
      //minlength: 2
      validate(name) {
        if (name.length < 2) {
          throw new Error("Course Name is too short");
        }
      },
    },
    professor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Professor",
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    schedule: [
      {
        day: { type: String, trim: true, required: true },
        hours: {
          startHour: { type: String, trim: true, required: true },
          endHour: { type: String, trim: true, required: true },
        },
      },
    ],
  },
  {
    toJSON: { virtuals: true },
  }
);

courseSchema.virtual("allDates").get(function () {
  const start = this.startDate;
  const end = this.endDate;
  const schedule = this.schedule;
  const allDates = getArrayOfDates(start, end, schedule);
  return allDates;
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
