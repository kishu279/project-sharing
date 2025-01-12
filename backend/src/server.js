require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { PORT } = process.env;
const db = require("./db/index.js"); // database related
const UserRoutes = require("./routes/UserRoutes.js");
const ProjectsRoutes = require("./routes/ProjectRoutes.js");

const app = express();
app.use(express.json());

// cors functionality
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTION", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:5173");
//   res.header(
//     "Access-Control-Allow-Method",
//     "POST, GET, DELETE, PATCH, PUT, OPTIONS"
//   );
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Content-Type, Origin, X-Requested-With, Authorization, Accept"
//   );
  
//   next();
// });

// app.options("*", cors());

app.get("/", async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Hey, Hii",
  });
});

async function main() {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });

  await db.ConnectDb(); // Database connected
  await db.CreateSchemasAndTables(); // tables required are created
}

app.use("/user", UserRoutes);
app.use("/project", ProjectsRoutes);

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:5173");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   next();
// });

main();
