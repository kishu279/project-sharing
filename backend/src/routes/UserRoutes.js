require("dotenv").config();
const expresss = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const db = require("./../db/index.js");
const { PRIVATE_KEY } = process.env;
const router = expresss.Router();

router.post("/signup", async (req, res) => {
  const { name, email, pass } = req.body;

  if (!name || !email || !pass) {
    return res.status(200).json({
      success: false,
      message: "entry fields are necessary",
    });
  }

  try {
    // take the user name, email and hash password
    const hashpass = await bcrypt.hash(pass, 10);
    console.log(hashpass);
    const id = await db.SetUserData({ name, email, hashpass });

    return res.status(200).json({
      success: true,
      message: `user is created with ${id}`,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      message: err,
    });
  }
});

router.post("/signin", async (req, res) => {
  const { email, pass } = req.body;

  if (!email || !pass) {
    return res.status(400).json({
      success: false,
      message: "entry fields are necessary",
    });
  }

  try {
    // sigin logic
    const user = await db.GetUserData({ email });
    console.log(user);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user with this email not available",
      });
    }

    const userPass = user.password; // hashed password
    const match = await bcrypt.compare(pass, userPass);

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "failed to signed in",
      });
    }

    // console.log(user.name);    // if signed in than it will create the jwt token
    const token = await jwt.sign({ email: user.email }, PRIVATE_KEY, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      success: true,
      messgae: "signed in successfully",
      token: token,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err,
    });
  }
});

// router.use(
//   cors({
//     origin: "http://localhost:5173",
//     methods: ["GET, PUT, DELETE, POST"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

module.exports = router;
