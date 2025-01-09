require("dotenv").config();
const express = require("express");

const auth = require("./../middleware/Auth");
const db = require("./../db/index");

const router = express.Router();

router.post("/create", auth, async (req, res) => {
  const { title } = req.body;

  if (title.length === 0) {
    return res.status(400).json({
      success: false,
      message: "title is needed",
    });
  }

  const email = req.emailId;
  const id = await db.GetIdFromEmail({ email });

  const userId = id.rows[0].id;
  await db.SetTitleAndDescription({ title, userId });

  return res.status(200).json({
    success: true,
    message: "Inserted",
  });
});

router.patch("/update/:id", auth, async (req, res) => {
  const { title, description } = req.body;
  const id = req.params.id;

  const result = await db.updateTitleAndDescription({ title, description, id });
  return res.status(200).json({
    success: true,
    message: result,
  });
});

router.get("/view", auth, async (req, res) => {
  const emailId = req.emailId;

  try {
    const result = await db.viewProjects({ emailId });
    let count = 0;
    let datas = [];

    result.rows.map((data) => {
      datas[count] = {
        id: ++count,
        title: data.title,
        description: data.description,
      };
    });

    return res.status(200).json({
      success: true,
      message: datas,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "something went wrong",
    });
  }
});

module.exports = router;
