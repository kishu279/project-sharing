require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const UserModel = require("./../Models/userModel");

const auth = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  // const token = req.headers["authorization"].split(" ") | null;
  const { uEmail, uPass } = req.body;

  try {
    // const decoded = await jwt.verify(token ? token : 0, process.env.JWT_KEY);
    if (token) {
      var decoded = await jwt.verify(token, process.env.JWT_KEY);

      console.log("token found"); //
      var user = await UserModel.findById({ _id: decoded.id });
    } else {
      var decoded = false;
      console.log("no token found"); //
      var user = await UserModel.findOne({ userEmail: uEmail });
    }

    // console.log(user);
    if (!user) {
      console.log("user not found"); //
      return res.status(400).json({
        success: false,
        message: "authentication failed",
      });
    }

    const whatIfAuth = await bcrypt.compare(uPass, user.userPassword);
    if (whatIfAuth) {
      console.log("password is wrong"); //
      //want to send something then it will be passed through req object
      req.user = user;

      const tokenRecreated = await jwt.sign(
        {
          id: user._id,
          creationTime: Date.now(),
        },
        process.env.JWT_KEY,
        {
          expiresIn: 60 * 60,
        }
      );

      console.log("Authenticated Successfully");
      console.log(tokenRecreated);
      next();
      return;
    }

    console.log("Authenticated Failed");
    return res.status(404).json({
      success: false,
      message: "auth failed",
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error,
    });
  }
};

module.exports = auth;
