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
/************************************** new   */

describe("new", function () {
  test("works", async function () {
    const book = await Book.new({
      title: "New Book",
      username: "u2",
    });
    expect(book).toEqual({
      id: expect.any(Number),
      title: "New Book",
      username: "u2",
    });
  });
  test("notFound error with non-existing user", async function () {
    try {
      await Book.new({ title: "new book", username: "fakeusername" });
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

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
      recipes: [],
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

/************************************** addRecipe(recipeURI, bookId)  ✓ 3/3 */

describe("addRecipe(recipeURI, bookId)", function () {
  test("works", async function () {
    // get book id from db =>
    let res = await db.query("SELECT id, title, username FROM books");
    let bookId = res.rows[0].id;

    // ==> find book by id
    const added = await Book.addRecipe({ bookId, recipeURI: "testuri.com" });
    expect(added).toEqual({
      bookId,
      recipeURI: "testuri.com",
    });
  });

  test("not found error for non-existent bookId", async function () {
    try {
      const books = await Book.addRecipe({
        bookId: 0,
        recipeURI: "testuri.com",
      });
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("not found error for non-existent bookId", async function () {
    try {
      // get book id from db =>
      let res = await db.query("SELECT id, title, username FROM books");
      let bookId = res.rows[0].id;

      const books = await Book.addRecipe({
        bookId: bookId,
        recipeURI: "fakeuri",
      });
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** removeRecipe(recipeURI, bookId)  ✓ 3/3 */

describe("remove(recipeURI, bookId)", function () {
  test("works", async function () {
    // get book id from db =>
    let res = await db.query("SELECT id, title, username FROM books");
    let bookId = res.rows[0].id;

    let recipeURI = "testuri.com";

    // add recipe to book before you remove:
    await Book.addRecipe({ bookId, recipeURI });
    // ==> remove recipe
    const resp = await Book.removeRecipe({ bookId, recipeURI });

    // check that it is not in the db
    let secondResult = await db.query(
      `SELECT * FROM recipes_books WHERE bookId='${bookId}' AND recipeURI='${recipeURI}'`
    );
    expect(secondResult.rows.length).toBe(0);
  });

  test("not found error for non-existent id", async function () {
    try {
      let recipeURI = "testuri.com";

      // ==> remove recipe
      const resp = await Book.removeRecipe({ bookId: 0, recipeURI });
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
  test("not found error for non-existent uri", async function () {
    try {
      // get book id from db =>
      let res = await db.query("SELECT id, title, username FROM books");
      let bookId = res.rows[0].id;

      let recipeURI = "FAKEURI";

      // ==> remove recipe
      const resp = await Book.removeRecipe({ bookId, recipeURI });
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
