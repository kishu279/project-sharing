require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserModel = require("./../Models/userModel");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { name, email, pass } = req.body;

  if (!name || !email || !pass) {
    return res.status(404).json({
      success: false,
      message: "required fields are not satisfied",
    });
  }

  try {
    const found = await UserModel.findOne({ userEmail: email });

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

    const token = await jwt.sign({ email: email }, process.env.JWT_KEY);

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

module.exports = router;
