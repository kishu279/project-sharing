require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const UserRoutes = require("./Routes/UserRoutes");
const UserCard = require("./Routes/UserCard");

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

async function main() {
  await mongoose.connect(process.env.DB_URL).then(() => {
    console.log("database connected securely");
  });

  app.listen(port, () => {
    console.log("Listening on port 3000");
  });

  console.log("running");
}

app.use("/", UserRoutes);

app.use("/", UserCard);

main();
