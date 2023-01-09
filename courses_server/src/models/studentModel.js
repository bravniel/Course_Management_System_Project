const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    //minlength: 2,
    validate(firstName) {
      if (firstName.length < 2) {
        throw new Error("First name is too short");
      }
    },
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    //minlength: 2,
    validate(lastName) {
      if (lastName.length < 2) {
        throw new Error("Last name is too short");
      }
    },
  },
  birthDate: {
    type: Date,
    required: true,
    min: "1923-01-01",
    max: "2007-01-01",
  },
  address: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    //minlength: 2,
    validate(address) {
      if (address.length < 2) {
        throw new Error("Address is too short");
      }
    },
  },
  // ^05\d([-]{0,1})\d{7}$
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
    validate(phoneNumber) {
      if (phoneNumber.length !== 10) {
        throw new Error("Invalid phone number");
      }
    },
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate(email) {
      if (!validator.isEmail(email)) {
        throw new Error("Invalid email");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    //minlength: 6
    validate(password) {
      if (password.length < 6) {
        throw new Error("Password is too short");
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

studentSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

studentSchema.statics.findStudentByEmailAndPassword = async (
  email,
  password
) => {
  const user = await Student.findOne({ email });
  if (!user) {
    throw new Error("Unable to login, user not found");
  }
  const isPassMatch = await bcrypt.compare(password, user.password);
  if (!isPassMatch) {
    throw new Error("Unable to login, password does not match to user");
  }
  return user;
};

studentSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    { _id: user._id, isProfessor: false },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "6h",
    }
  );
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

studentSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.tokens;
  return userObj;
};

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;

// const phoneRegex =/^ [0][5][0 | 2 | 3 | 4 | 5 | 9]{ 1}[-]{ 0, 1 } [0 - 9]{ 7 } $ /;
// const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/;
