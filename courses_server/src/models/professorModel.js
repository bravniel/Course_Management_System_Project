const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const professorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    //minlength: 2,
    validate(firstName) {
      if (firstName.length < 2) {
        throw new Error("First Name is too short");
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
        throw new Error("Last Name is too short");
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
    //minlength: 2,
    validate(address) {
      if (address.length < 2) {
        throw new Error("Address is too short");
      }
    },
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
    validate(phoneNumber) {
      if (phoneNumber.length !== 10) {
        throw new Error("Phone Number is too short");
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

professorSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

professorSchema.statics.findProfessorbyEmailAndPassword = async (
  email,
  password
) => {
  const user = await Professor.findOne({ email });
  if (!user) {
    throw new Error("Unable to login, user not found");
  }
  const isPassMatch = await bcrypt.compare(password, user.password);
  if (!isPassMatch) {
    throw new Error("Unable to login, password does not match to user");
  }
  return user;
};

professorSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    { _id: user._id, isProfessor: true },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "6h",
    }
  );
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

professorSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.tokens;
  return userObj;
};

const Professor = mongoose.model("Professor", professorSchema);

module.exports = Professor;
