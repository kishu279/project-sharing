const expresss = require("express");
const bcrypt = require("bcrypt");

const db = require("./../db/index.js");
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

module.exports = router;
