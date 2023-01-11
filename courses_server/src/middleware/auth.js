const jwt = require("jsonwebtoken");
const Professor = require("../models/professorModel");
const Student = require("../models/studentModel");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const data = jwt.verify(token, process.env.TOKEN_SECRET);
    let user = {};
    if (!data.isProfessor) {
      user = await Student.findOne({
        _id: data._id,
        "tokens.token": token,
      });
    } else {
      user = await Professor.findOne({
        _id: data._id,
        "tokens.token": token,
      });
    }
    if (!user) {
      res.status(401).send({ Error: "not authenticate" });
    }
    req.user = user;
    req.token = token;
    req.isProfessor = data.isProfessor;
    next();
  } catch (e) {
    res.status(500).send({ Error: e.message });
  }
};

module.exports = { auth };
