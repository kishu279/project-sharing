require("dotenv").config();
const express = require("express");

const auth = require("./../middleware/Auth");
const db = require("./../db/index");

const router = express.Router();

router.post("/create", auth, async (req, res) => {
  const { title, description } = req.body;

  if (title.length === 0) {
    return res.status(400).json({
      success: false,
      message: "title is needed",
    });
  }

  const email = req.emailId;
  const id = await db.GetIdFromEmail({ email });
  // projects will be added

  const userId = id.rows[0].id;
  await db.SetTitleAndDescription({ title, description, userId });

  return res.status(200).json({
    success: true,
    message: "Insertion of the data successfully",
  });
});

module.exports = router;
