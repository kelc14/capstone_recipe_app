"use strict";

import db from "../db";
import User from "../models/user";
import Book from "../models/book";
import { createToken } from "../helpers/tokens";

async function commonBeforeAll() {
  await db.query(
    "TRUNCATE users, books, recipes_books, recipes_tried, notes, reviews"
  );

  await User.register({
    username: "u1",
    firstName: "U1F",
    lastName: "U1L",
    email: "user1@user.com",
    password: "password1",
    isAdmin: false,
  });
  await User.register({
    username: "u2",
    firstName: "U2F",
    lastName: "U2L",
    email: "user2@user.com",
    password: "password2",
    isAdmin: false,
  });
  await User.register({
    username: "u3",
    firstName: "U3F",
    lastName: "U3L",
    email: "user3@user.com",
    password: "password3",
    isAdmin: false,
  });
  await Book.new({ title: "book1", username: "u1" });
  await Book.new({ title: "book2", username: "u1" });
  await Book.new({ title: "book3", username: "u2" });
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

const u1Token = createToken({ username: "u1", isAdmin: false });
const u2Token = createToken({ username: "u2", isAdmin: true });
const u3Token = createToken({ username: "u3", isAdmin: false });

export {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  u3Token,
};
