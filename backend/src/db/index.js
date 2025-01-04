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

    // await CreateSchemasAndTables();
  } catch (err) {
    console.log(err);
  }
}

const CreateSchemasAndTables = async () => {
  try {
    const schemaQuery = `CREATE SCHEMA IF NOT EXISTS ps`;

    await pgClient.query(schemaQuery);
    console.log("Schema is created or already exists");

    const userTableQuery = `CREATE TABLE IF NOT EXISTS ps.users_table (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(200) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )`;

    await pgClient.query(userTableQuery);
    console.log("Table is created or already exits");

    // if more tables to be added ...

    // to query how schema is looking like
    // const selectQuery = `SELECT column_name
    // FROM information_schema.columns
    // WHERE table_schema = 'ps' AND table_name = 'users_table'
    // `;
    // const results = await pgClient.query(selectQuery);

    // console.log(results.rows);
  } catch (err) {
    console.log(err);
  }
};

const SetUserData = async ({ name, email, hashpass }) => {
  try {
    const userInputQuery = `
      INSERT INTO ps.users_table (name, email, password, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING id;
    `;

    console.log(hashpass);
    const values = [name, email, hashpass];
    const result = await pgClient.query(userInputQuery, values);
    return await result.rows[0].id;
  } catch (err) {
    console.log(err);
  }
};

module.exports = { pgClient, ConnectDb, CreateSchemasAndTables, SetUserData };
