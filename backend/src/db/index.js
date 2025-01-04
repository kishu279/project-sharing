require("dotenv").config();
const { Client } = require("pg");

const { PG_USER, PG_PASS, PG_HOST, PG_DATABASE } = process.env;
// const tables = require("./tables.js");

const pgClient = new Client({
  user: PG_USER,
  host: PG_HOST,
  password: PG_PASS,
  database: PG_DATABASE,
  ssl: { rejectUnauthorized: false },
});

async function ConnectDb() {
  try {
    await pgClient.connect();
    console.log("Database Connected !!!");

    // const response = await pgClient.query("SELECT version()");
    // console.log(response.rows[0]);

    // await tables.CreateSchemasAndTables(); // Schemas and Tables
    await CreateSchemasAndTables();
  } catch (err) {
    console.log(err);
  }
}

const CreateSchemasAndTables = async () => {
  try {
    const schemaQuery = `CREATE SCHEMA IF NOT EXISTS ps`;
    // await db.pgClient.query(schemaQuery);
    await pgClient.query(schemaQuery);
    console.log("Schema is created or already exists");

    const tableQuery = `CREATE TABLE IF NOT EXISTS ps.users_table (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(200) UNIQUE NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )`;
    // await db.pgClient.query(tableQuery);
    await pgClient.query(tableQuery);
    console.log("Table is created or already exits");

    // if more tables to be added

    // to query how schema is looking like
    // const selectQuery = `SELECT column_name
    // FROM information_schema.columns
    // WHERE table_schema = 'ps' AND table_name = 'users_table'
    // `;
    // const results = await pgClient.query(selectQuery);

    // console.log(results.rows);

    // const insertQuery = `INSERT INTO ps.users_table ( name, email, pass, created_at)
    //   VALUES ('sourav', 'sourav@gmail.com', 'sda2jdia3321dada', NOW());
    // `;

    // await pgClient.query(insertQuery);
    // console.log("Sample data inserted");
  } catch (err) {
    console.log(err);
  }
};

module.exports = { pgClient, ConnectDb };
