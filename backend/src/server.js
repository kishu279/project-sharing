require("dotenv").config();
const express = require("express");

const { PORT } = process.env;
const db = require("./db/index.js"); // database related
const UserRoutes = require("./routes/UserRoutes.js");
const ProjectsRoutes = require("./routes/ProjectRoutes.js");

const app = express();
app.use(express.json());

async function main() {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });

  await db.ConnectDb(); // Database connected
  await db.CreateSchemasAndTables(); // tables required are created
}

app.get("/", async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Hey, Hii",
  });
});

app.use("/user", UserRoutes);
app.use("/project", ProjectsRoutes);

main();
