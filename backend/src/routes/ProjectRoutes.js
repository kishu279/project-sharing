require("dotenv").config();
const express = require("express");
const { v4: uuid4 } = require("uuid");

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
  const id = await db.GetUserData({ email });

  const pid = uuid4();
  console.log(pid);

  const userId = id.id;
  await db.SetTitleAndDescription({ title, userId, pid });

  const response = await db.sharedTable({ pid, userId });
  console.log(response);

  return res.status(200).json({
    success: true,
    message: "Inserted",
  });
});

router.patch("/update/:id", auth, async (req, res) => {
  const { title, description, userid } = req.body;
  const id = req.params.id;

  const result = await db.updateTitleAndDescription({
    title,
    description,
    id,
    userid,
  });
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
        count: count,
        id: data.pid,
        name: data.name,
        title: data.title,
        description: data.description,
        userid: data.userid,
      };
      count++;
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

router.delete("/remove/:id", auth, async (req, res) => {
  const contentId = req.params.id;

  try {
    const response = await db.deleteProject({ contentId });
    console.log(response);

    if (response.rowCount > 0) {
      console.log(response);
      return res.status(200).json({
        success: true,
        message: "successfully deleted",
      });
    }
    return res.status(400).json({
      success: false,
      message: "content not found",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "server error",
    });
  }
});

module.exports = router;
