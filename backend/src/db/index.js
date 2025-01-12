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
    pid uuid DEFAULT gen_random_uuid(),
    userid INTEGER NOT NULL,
    title VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )`;

    await pgClient.query(projectTableQuery);
    console.log("Project table created");

    const sharedTableQuery = `CREATE TABLE IF NOT EXISTS ps.shared_table (
      sid uuid DEFAULT gen_random_uuid(),
      pid uuid NOT NULL,
      uid INTEGER NOT NULL,
      CONSTRAINT fk_sharedTable_pid FOREIGN KEY (pid)
      REFERENCES ps.projects_table(pid)
      ON UPDATE NO ACTION ON DELETE CASCADE,
      CONSTRAINT fk_sharedTable_uid FOREIGN KEY (uid)
      REFERENCES ps.users_table(id)
      ON UPDATE NO ACTION ON DELETE CASCADE
      )
      `;

    await pgClient.query(sharedTableQuery);

    // await pgClient.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    // await pgClient.query("BEGIN");
    // await pgClient.query(`
    //     ALTER TABLE ps.projects_table
    //     DROP CONSTRAINT IF EXISTS projects_table_pkey;
    //   `); // Drop primary key constraint

    // await pgClient.query(`
    //     ALTER TABLE ps.projects_table
    //     DROP COLUMN IF EXISTS pid;
    //     `); // Drop the existing pid column (if exists)

    // await pgClient.query("CREATE EXTENSION IF NOT EXISTS pgcrypto;"); // Create extension for uuid generation (if not already created)

    // await pgClient.query(`
    //   ALTER TABLE ps.projects_table
    //   ADD COLUMN pid UUID PRIMARY KEY DEFAULT gen_random_uuid();
    //   `); // Add the new pid column with UUID as primary key

    // await pgClient.query("COMMIT;"); // Commit the transaction
    // console.log("Table altered successfully.");

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

const SetTitleAndDescription = async ({ title, userId, pid }) => {
  const description = "";
  const dataQuery = `
    INSERT INTO ps.projects_table(title, description, userid, pid)
    VALUES($1, $2, $3, $4)
  `;

  values = [title, description, userId, pid];
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

const sharedTable = async ({ pid, userId }) => {
  try {
    const response = await pgClient.query(
      `
      INSERT INTO ps.shared_table(pid, uid)
      VALUES ($1, $2)
      RETURNING uid`,
      [pid, userId]
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
  SetTitleAndDescription,
  updateTitleAndDescription,
  viewProjects,
  deleteProject,
  sharedTable,
};
