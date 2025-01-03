require("dotenv").config();
const express = require("express");
const { Client } = require("pg");

const { PORT, PG_USER, PG_PASS, PG_HOST, PG_DATABASE } = process.env;

// import * from "./db/index.js"
const db = require("./db/index.js");

const app = express();
app.use(express.json());

async function main() {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });

  await db.ConnectDb(); // Database connected
}

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Hey, Hii",
  });
});

main();
