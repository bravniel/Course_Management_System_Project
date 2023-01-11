const mongoose = require("mongoose");
const utils = require("../utils/utils");

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Course Name required"],
      trim: true,
      unique: [true, "This Name exists in the system, Name is unique"],
      minlength: [2, "Course Name is too short"],
    },
    professor: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Professor _id required"],
      ref: "Professor",
    },
    startDate: {
      type: Date,
      required: [true, "Start Date required"],
    },
    endDate: {
      type: Date,
      required: [true, "End Date required"],
    },
    schedule: [
      {
        day: {
          type: String,
          trim: true,
          required: [true, "Day required"],
        },
        hours: {
          startHour: {
            type: String,
            trim: true,
            required: [true, "End Hour required"],
          },
          endHour: {
            type: String,
            trim: true,
            required: [true, "End Hour required"],
          },
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
  const allDates = utils.getArrayOfDates(start, end, schedule);
  return allDates;
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
