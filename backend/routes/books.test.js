"use strict";

import db from "../db";
import request from "supertest";
import app from "../app.js";

import {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterAll,
  commonAfterEach,
  u1Token,
  u2Token,
  u3Token,
} from "./_testCommon";

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /book ✓ 4/4 */
describe("POST /book", function () {
  test("works for admin to create book for user", async function () {
    const response = await request(app)
      .post("/book")
      .send({
        title: "new book",
        username: "u1",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .set("authorization", `Bearer ${u2Token}`);
    expect(response.body).toEqual({
      book: {
        id: expect.any(Number),
        title: "new book",
        username: "u1",
      },
    });
  });

  test("works for self user to create their own book", async function () {
    const response = await request(app)
      .post("/book")
      .send({
        title: "new book",
        username: "u1",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .set("authorization", `Bearer ${u1Token}`);

    expect(response.body).toEqual({
      book: {
        id: expect.any(Number),
        title: "new book",
        username: "u1",
      },
    });
  });

  test("unauth for nonadmin", async function () {
    const response = await request(app)
      .post("/book")
      .send({
        title: "new book",
        username: "u1",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .set("authorization", `Bearer ${u3Token}`);
    expect(response.statusCode).toEqual(401);
  });

  test("notfound error for unknown user", async function () {
    const response = await request(app)
      .post("/book")
      .send({
        title: "new book",
        username: "000",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .set("authorization", `Bearer ${u2Token}`);
    expect(response.statusCode).toEqual(404);
  });
});

// /************************************** GET /book ✓ 2/2 */
describe("GET /book", function () {
  test("works for admin", async function () {
    const response = await request(app)
      .get("/book")
      .set("authorization", `Bearer ${u2Token}`);

    expect(response.body).toEqual({
      books: [
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
      ],
    });
  });
  test("unauth for non-admin", async function () {
    const response = await request(app)
      .get("/book")
      .set("authorization", `Bearer ${u1Token}`);
    expect(response.statusCode).toEqual(401);
  });
});

// /************************************** GET /book/:id ✓ 4/4 */
describe("GET /book/:id", function () {
  test("works for admin", async function () {
    // get a book id to test:
    let books = await db.query("SELECT id, title, username FROM books");
    let book = books.rows[0];

    // test
    const response = await request(app)
      .get(`/book/${book.id}`)
      .set("authorization", `Bearer ${u2Token}`);

    expect(response.body).toEqual({
      book: { title: "book1", username: "u1", id: expect.any(Number) },
    });
  });

  test("works for self", async function () {
    // get a book id to test:
    let books = await db.query("SELECT id, title, username FROM books");
    let book = books.rows[0];

    // test
    const response = await request(app)
      .get(`/book/${book.id}`)
      .set("authorization", `Bearer ${u1Token}`);

    expect(response.body).toEqual({
      book: { title: "book1", username: "u1", id: expect.any(Number) },
    });
  });

  test("unauth for non-admin / non-user", async function () {
    // get a book id to test:
    let books = await db.query("SELECT id, title, username FROM books");
    let book = books.rows[0];

    // test
    const response = await request(app)
      .get(`/book/${book.id}`)
      .set("authorization", `Bearer ${u3Token}`);
    expect(response.statusCode).toEqual(401);
  });

  test("not found for non-existing book", async function () {
    const response = await request(app)
      .get(`/book/0`)
      .set("authorization", `Bearer ${u2Token}`);
    expect(response.statusCode).toEqual(404);
  });
});

// /************************************** PATCH /book/:id ✓ 3/3 */
describe("PATCH /book/:id", function () {
  test("works for admin - update title", async function () {
    // get a book id to test:
    let books = await db.query("SELECT id, title, username FROM books");
    let book = books.rows[0];

    // test
    const response = await request(app)
      .patch(`/book/${book.id}`)
      .send({
        title: "newTitle",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .set("authorization", `Bearer ${u2Token}`);

    expect(response.body).toEqual({
      book: { title: "newTitle", username: "u1", id: expect.any(Number) },
    });
  });

  test("works for self - update title", async function () {
    // get a book id to test:
    let books = await db.query("SELECT id, title, username FROM books");
    let book = books.rows[0];

    // test
    const response = await request(app)
      .patch(`/book/${book.id}`)
      .send({
        title: "newTitle",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .set("authorization", `Bearer ${u1Token}`);

    expect(response.body).toEqual({
      book: { title: "newTitle", username: "u1", id: expect.any(Number) },
    });
  });

  test("unauth for nonadmin", async function () {
    // get a book id to test:
    let books = await db.query("SELECT id, title, username FROM books");
    let book = books.rows[0];

    // test
    const response = await request(app)
      .patch(`/book/${book.id}`)
      .send({
        title: "newTitle",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .set("authorization", `Bearer ${u3Token}`);
    expect(response.statusCode).toEqual(401);
  });
});

// /************************************** DELETE /user/:username ✓ 3/3  */
// describe("DELETE /user/:username", function () {
//   test("works for admin", async function () {
//     const response = await request(app)
//       .delete("/user/u1")
//       .set("Content-Type", "application/json")
//       .set("Accept", "application/json")
//       .set("authorization", `Bearer ${u2Token}`);

//     expect(response.body).toEqual({
//       deleted: "u1",
//     });
//   });
//   test("works for self", async function () {
//     const response = await request(app)
//       .delete("/user/u1")
//       .set("Content-Type", "application/json")
//       .set("Accept", "application/json")
//       .set("authorization", `Bearer ${u1Token}`);

//     expect(response.body).toEqual({
//       deleted: "u1",
//     });
//   });
//   test("unauth for non-self/ non-admin", async function () {
//     const response = await request(app)
//       .delete("/user/u1")
//       .set("Content-Type", "application/json")
//       .set("Accept", "application/json")
//       .set("authorization", `Bearer ${u3Token}`);

//     expect(response.statusCode).toEqual(401);
//   });
// });
