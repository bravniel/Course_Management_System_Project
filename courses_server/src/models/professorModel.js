const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const professorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First Name required"],
    trim: true,
    minlength: [2, "First Name is too short"],
  },
  lastName: {
    type: String,
    required: [true, "Last Name required"],
    trim: true,
    minlength: [2, "Last Name is too short"],
  },
  birthDate: {
    type: Date,
    required: [true, "Birth Date required"],
    min: ["1923-01-01", "Invalid age, too old"],
    max: ["2007-01-01", "Invalid age, too young"],
  },
  address: {
    type: String,
    required: [true, "Address required"],
    trim: true,
    minlength: [2, "Addres is too short"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone Number required"],
    trim: true,
    validate(phoneNumber) {
      const phoneRegex = /^[0][5][0|2|3|4|5|9]{1}[-]{0,1}[0-9]{7}$/;
      if (!phoneRegex.test(phoneNumber)) {
        throw new Error("Invalid Phone number");
      }
    },
  },
  email: {
    type: String,
    required: [true, "Email required"],
    trim: true,
    lowercase: true,
    unique: [true, "This Email exists in the system, Email is unique"],
    validate(email) {
      if (!validator.isEmail(email)) {
        throw new Error("Invalid email");
      }
    },
  },
  password: {
    type: String,
    required: [true, "Password required"],
    trim: true,
    validate(password) {
      const passwordRegex =
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/;
      if (!passwordRegex.test(password)) {
        throw new Error(
          "Invalid password. Must contain big and small letters, numbers and minimum length 6 characters"
        );
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

// {
//     "firstName" : "fanni",
//     "lastName" : "tsirlin",
//     "birthDate" : "2001-12-25",
//     "address" : "avraham sahnin 1/1 haifa",
//     "phoneNumber" : "0544983771",
// 	"email" : "fanni.tsirlin@gmail.com",
// 	"password" : "fanni123"
// }
