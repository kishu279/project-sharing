require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const UserModel = require("./../Models/userModel");

const auth = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  const { email, pass } = req.body;

  if (!email || !pass) {
    return res.status(400).json({
      success: false,
      message: "required fields are required",
    });
  }

  if (!token) {
    return next();
  }

  jwt.verify(token, process.env.JWT_KEY, async function (err, decoded) {
    if (err) {
      return next();
    }

    try {
      const user = await UserModel.findOne({ userEmail: decoded.email });
      if (
        user &&
        email === decoded.email &&
        (await bcrypt.compare(pass, user.userPassword))
      ) {
        return res.status(200).json({
          success: true,
          message: "Authentication Success",
        });
      }

      return res.status(400).json({
        success: false,
        message: "Authentication failed",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error,
      });
    }
  });
};

module.exports = auth;
