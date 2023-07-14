"use strict";

import {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} from "../expressError";
import db from "../db.js";
import Book from "./book.js";
import {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} from "./_testCommon.js";

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** getAll ✓ 1/1  */

describe("getAll", function () {
  test("works", async function () {
    const books = await Book.getAll();
    expect(books).toEqual([
      {
        id: expect.any(Number),
        title: "book1",
        username: "u1",
      },
      {
        id: expect.any(Number),
        title: "book2",
        username: "u1",
      },
      {
        id: expect.any(Number),
        title: "book3",
        username: "u2",
      },
      {
        id: expect.any(Number),
        title: "book4",
        username: "u2",
      },
    ]);
  });
});

/************************************** getUserBooks ✓ 3/3  */

describe("getUserBooks", function () {
  test("works", async function () {
    let user = "u1";
    const books = await Book.getUserBooks(user);
    expect(books).toEqual([
      {
        id: expect.any(Number),
        title: "book1",
        username: "u1",
      },
      {
        id: expect.any(Number),
        title: "book2",
        username: "u1",
      },
    ]);
  });

  test("returns empty array for nonexistent users", async function () {
    let user = "doesntexist";
    const books = await Book.getUserBooks(user);
    expect(books).toEqual([]);
  });

  test("returns empty array for users with no books", async function () {
    let user = "u3";
    const books = await Book.getUserBooks(user);
    expect(books).toEqual([]);
  });
});

/************************************** get(id)  ✓ 2/2 */

describe("get(id)", function () {
  test("works", async function () {
    // get book id from db =>
    let res = await db.query("SELECT id, title, username FROM books");
    let id = res.rows[0].id;

    // ==> find book by id
    const books = await Book.get(id);
    expect(books).toEqual({
      id,
      title: "book1",
      username: "u1",
    });
  });

  test("not found error for non-existent id", async function () {
    try {
      const books = await Book.get(0);
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update(id, title)  ✓ 2/2 */

describe("update(id, title)", function () {
  test("works", async function () {
    // get book id from db =>
    let res = await db.query("SELECT id, title, username FROM books");
    let id = res.rows[0].id;

    // ==> find book by id
    let newTitle = "newbooktitle";
    const books = await Book.update(id, newTitle);
    expect(books).toEqual({
      id,
      title: "newbooktitle",
      username: "u1",
    });
  });

  test("not found error for non-existent id", async function () {
    try {
      const books = await Book.update(0, "newtitle");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** remove(id)  ✓ 2/2 */

describe("remove(id)", function () {
  test("works", async function () {
    // get book id from db =>
    let res = await db.query("SELECT id, title, username FROM books");
    let id = res.rows[0].id;

    // ==> find book by id
    const resp = await Book.remove(id);
    let secondResult = await db.query(`SELECT * FROM books WHERE id='${id}'`);
    expect(secondResult.rows.length).toBe(0);
  });

  test("not found error for non-existent id", async function () {
    try {
      const books = await Book.remove(0);
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
