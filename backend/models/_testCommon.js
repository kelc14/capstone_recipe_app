import bcrypt from "bcrypt";
import db from "../db.js";
import { BCRYPT_WORK_FACTOR } from "../config.js";

// const bcrypt = require("bcrypt");
// const db = require("../db.js");

// const { BCRYPT_WORK_FACTOR } = require("../config");

async function commonBeforeAll() {
  //   client = await db.connect();

  // noinspection SqlWithoutWhere
  //   await db.query("DELETE FROM companies");
  // noinspection SqlWithoutWhere
  await db.query(
    "TRUNCATE users, books, recipes_books, recipes_tried, notes, reviews"
  );

  await db.query(
    `
        INSERT INTO users(username,
                          password,
                          firstName,
                          lastName,
                          email)
        VALUES ('u1', $1, 'U1F', 'U1L', 'u1@email.com'),
               ('u2', $2, 'U2F', 'U2L', 'u2@email.com')
        RETURNING username`,
    [
      await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
      await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
    ]
  );
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

export { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll };
