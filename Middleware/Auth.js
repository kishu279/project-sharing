require("dotenv").config();
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  const token = req.headers["authorization"].split(" ");

  const decoded = await jwt.verify(token[1], process.env.JWT_KEY);

  if (decoded) {
    console.log(decoded);
  }

  next();
};

module.exports = auth;
