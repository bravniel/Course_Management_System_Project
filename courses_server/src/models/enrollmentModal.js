const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Student",
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  statuses: [
    {
      classDate: { type: Date, required: true },
      presence: {
        type: Boolean,
        required: true,
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
