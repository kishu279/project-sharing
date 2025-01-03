require("dotenv").config();
const { Client } = require("pg");

const { PG_USER, PG_PASS, PG_HOST, PG_DATABASE } = process.env;

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
  } catch (err) {
    console.log(err);
  }
}

module.exports = { pgClient, ConnectDb };
