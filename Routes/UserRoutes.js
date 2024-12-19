require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserModel = require("./../Models/userModel");
const auth = require("./../Middleware/Auth");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { uName, uEmail, uPass } = req.body;

  if (!uName || !uEmail || !uPass) {
    return res.status(400).json({
      success: false,
      message: "Condition do not meet",
    });
  }

  try {
    const user = await UserModel.findOne({ userEmail: uEmail });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "user already exists",
      });
    }

    const hashPass = await bcrypt.hash(uPass, 7);

    const newUser = await new UserModel({
      userName: uName,
      userEmail: uEmail,
      userPassword: hashPass,
    });

    newUser.save();

    console.log(newUser.id);
    const sessionKey = jwt.sign(
      //Json web Token
      { id: newUser.id, creationTime: Date.now() },
      process.env.JWT_KEY,
      {
        expiresIn: 60,
      }
    );

    return res.status(200).json({
      success: true,
      meesage: "account created",
      sessionKey: sessionKey,
    });
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: error,
    });
  }
});

router.post("/signin", auth, async (req, res) => {
  // const token = req.headers["authorization"].split(" ");

  // console.log(token[1]);
  // return res.status(400).json({
  //   success: true,
  // });

  console.log("succeddfully passed authentication middleware");
});

module.exports = router;
