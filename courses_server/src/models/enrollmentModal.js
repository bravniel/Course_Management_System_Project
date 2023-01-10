const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Student _id required"],
    ref: "Student",
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: [true, "Course _id required"],
  },
  statuses: [
    {
      classDate: { type: Date, required: [true, "Class Date required"] },
      presence: {
        type: Boolean,
        required: [true, "Presence required"],
        default: false,
      },
      absenceReason: {
        type: String,
        // required: true,
        trim: true,
        default: "did not justify yet",
      },
    },
  ],
});

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

module.exports = Enrollment;
