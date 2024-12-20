const express = require("express");

const auth = require("./../Middleware/Auth");
const UserModel = require("./../Models/userModel");
const ProjectModel = require("./../Models/projectModel");

const router = express.Router();

router.post("/create", auth, (req, res) => {
  const { title, data } = req.body;
  const user = req.user;

  console.log(user);
  ProjectModel.create({
    owner: user._id,
    borrower: null,
    title: title,
    buffer: data,
    createTime: Date.now(),
  });

  return res.status(400).json({
    success: true,
    message: "project added successfully",
  });
});

module.exports = router;
