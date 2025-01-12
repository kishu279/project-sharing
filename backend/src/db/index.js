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

    // Project Table Query ...
    const projectTableQuery = `CREATE TABLE IF NOT EXISTS ps.projects_table(
    id SERIAL PRIMARY KEY,
    userid INTEGER NOT NULL,
    title VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )`;

    await pgClient.query(projectTableQuery);
    console.log("Project table created");

    const sharedTableQuery = `
      CREATE TABLE IF NOT EXISTS ps.shared_table(
        id SERIAL PRIMARY KEY,
        userid INT NOT NULL,
        projectid INT NOT NULL,
        FOREIGN KEY (userid) REFERENCES ps.users_table(id) ON DELETE CASCADE,
        FOREIGN KEY (projectid) REFERENCES ps.projects_table(pid) ON DELETE CASCADE       
      )`;

    await pgClient.query(sharedTableQuery);
    console.log("Shared table created");

    // I USED ALTER TABLE ...
    // const alterTable = `
    // ALTER TABLE ps.projects_table
    //   DROP COLUMN user_id
    // `;

    // await pgClient.query(alterTable);
    // console.log("Project Table altered");

    // if more tables to be added ...
  } catch (err) {
    await pgClient.query(`ROLLBACK;`);
    console.log(err);
  }
};

const SetUserData = async ({ name, email, hashpass }) => {
  try {
    const userSetQuery = `
      INSERT INTO ps.users_table (name, email, password, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING id;
    `;

    console.log(hashpass);
    const values = [name, email, hashpass];
    const result = await pgClient.query(userSetQuery, values);
    return await result.rows[0].id;
  } catch (err) {
    console.log(err);
  }
};

const GetUserData = async ({ email }) => {
  try {
    const userGetQuery = `
      SELECT * 
      FROM ps.users_table
      WHERE email = $1
    `;

    const values = [email];
    const user = await pgClient.query(userGetQuery, values);
    return user.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const GetIdFromEmail = async ({ email }) => {
  try {
    const idQuery = `
      SELECT id FROM ps.users_table
      WHERE email = $1
    `;

    const id = await pgClient.query(idQuery, [email]);
    return id;
  } catch (err) {
    console.log(err);
  }
};

const SetTitleAndDescription = async ({ title, userId }) => {
  const description = "";
  const dataQuery = `
    INSERT INTO ps.projects_table(title, description, userid)
    VALUES($1, $2, $3)
  `;

  values = [title, description, userId];
  await pgClient.query(dataQuery, values);
  console.log("inserted the document successfully");
};

const updateTitleAndDescription = async ({
  title,
  description,
  id,
  userid,
}) => {
  await pgClient.query("BEGIN;");
  try {
    await pgClient.query(
      `
        UPDATE ps.projects_table
        SET title=$1
        WHERE pid=$2 AND userid=$3
      `,
      [title, id, userid]
    );

    await pgClient.query(
      `
        UPDATE ps.projects_table
        SET description=$1
        WHERE pid=$2 AND userid=$3
      `,
      [description, id, userid]
    );

    // await pgClient.query(
    //   `
    //     UPDATE ps.projects_table
    //     SET title=$1,
    //         description=$2

    //     WHERE userid=$3 AND title=$4;
    //   `,
    //   [title, description, id, prevTitle]
    // );

    // await pgClient.query(`COMMIT;`);

    return "SUCCESS";
  } catch (err) {
    await pgClient.query("ROLLBACK");
    console.log(err);
    return "FAILED";
  } finally {
    await pgClient.query("COMMIT");
    console.log("Finalized");
  }
};

const viewProjects = async ({ emailId }) => {
  try {
    // actual use of joins
    // await pgClient.query("BEGIN");

    const result = await pgClient.query(
      `
        SELECT 
          u.email,
          u.id,
          u.name,
          p.pid,
          p.title,
          p.description,
          p.userid
          FROM ps.users_table u
          INNER JOIN ps.projects_table p
          ON u.id = p.userid 
          WHERE u.email=$1
          `,
      [emailId]
    );
    return result;
  } catch (err) {
    return err;
  }
};

const deleteProject = async ({ contentId }) => {
  try {
    const response = await pgClient.query(
      `DELETE FROM ps.projects_table
      WHERE pid=$1
      RETURNING pid;`,
      [contentId]
    );

    return response;
  } catch (err) {
    return err;
  }
};

module.exports = {
  pgClient,
  ConnectDb,
  CreateSchemasAndTables,
  SetUserData,
  GetUserData,
  GetIdFromEmail,
  SetTitleAndDescription,
  updateTitleAndDescription,
  viewProjects,
  deleteProject,
};
