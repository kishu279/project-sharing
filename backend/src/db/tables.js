// require("dotenv").config();

// const db = require("./index.js");
// const { PG_USER, PG_HOST, PG_PASS, PG_DATABASE } = process.env;

// const CreateSchemasAndTables = async () => {
//   const schemaQuery = `CREATE SCHEMA IF NOT EXISTS ps`;
//   await db.pgClient.query(schemaQuery);
//   console.log("Schema is created or already exists");

//   const tableQuery = `CREATE TABLE IF NOT EXISTS ps.users_table`;
//   await db.pgClient.query(tableQuery);
//   console.log("Table is created or already exits");

//   // if more tables to be added
// };

// module.exports = {
//   CreateSchemasAndTables,
// };
