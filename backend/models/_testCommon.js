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
  await db.query("DELETE FROM recipes_books");
  await db.query("DELETE FROM recipes_tried");
  await db.query("DELETE FROM notes");
  await db.query("DELETE FROM reviews");
  await db.query("DELETE FROM recipes");
  await db.query("DELETE FROM books");
  await db.query("DELETE FROM users");

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
  await db.query(`
  INSERT INTO books(title, username)
  VALUES ('book1', 'u1'), ('book2', 'u1'), ('book3', 'u2'), ('book4', 'u2')
  `);

  await db.query(`
  INSERT INTO recipes(uri, label, image)
  VALUES ('testuri.com', 'test recipe label', 'fakeimage.jpeg'), ('testuri2.com', 'test recipe label 2', 'fakeimage2.jpeg')
  `);
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
