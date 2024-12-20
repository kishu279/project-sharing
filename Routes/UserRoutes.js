require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Models
const UserModel = require("./../Models/userModel");
const projectModel = require("./../Models/projectModel");

//Auth
const auth = require("./../Middleware/Auth");

const router = express.Router();

async function tokenCreation(email) {
  return await jwt.sign({ email: email }, process.env.JWT_KEY, {
    expiresIn: "1h",
  });
}

router.post("/signup", async (req, res) => {
  const { name, email, pass } = req.body;

  if (!name || !email || !pass) {
    return res.status(404).json({
      success: false,
      message: "required fields are not satisfied",
    });
  }

  try {
    const found = await UserModel.findOne({ email });

    if (found) {
      return res.status(404).json({
        success: false,
        message: "user already exists",
      });
    }

    const hashpass = await bcrypt.hash(pass, 10);

    await UserModel.create({
      userName: name,
      userEmail: email,
      userPassword: hashpass,
    });

    const token = tokenCreation(email); //Jwt token is created

    return res.status(200).json({
      success: true,
      message: "user created",
      token: token,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error,
    });
  }
});

router.post("/signin", auth, async (req, res) => {
  const { email, pass } = req.body;

  try {
    const user = await UserModel.findOne({ userEmail: email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "no such user",
      });
    }

    if (!(await bcrypt.compare(pass, user.userPassword))) {
      return res.status(400).json({
        success: false,
        message: "Authentication failed",
      });
    }

    const token = await tokenCreation(email);

    return res.status(200).json({
      success: true,
      messaage: "Authentication Success",
      token: token,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
