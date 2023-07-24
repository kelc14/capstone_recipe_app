"use strict";

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

/************************************** POST /recipe ✓ 3/3 */
describe("POST /recipe", function () {
  test("works for admin to add recipe to db", async function () {
    const response = await request(app)
      .post("/recipe")
      .send({
        uri: "test.com",
        label: "Recipe1",
        image: "testimg.png",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .set("authorization", `Bearer ${u2Token}`);
    expect(response.body).toEqual({
      recipe: {
        uri: "test.com",
        label: "Recipe1",
        image: "testimg.png",
      },
    });
  });

  test("bad request for duplicate", async function () {
    const response = await request(app)
      .post("/recipe")
      .send({
        uri: "testuri.com",
        label: "Recipe1",
        image: "testimg.png",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .set("authorization", `Bearer ${u2Token}`);
    expect(response.statusCode).toEqual(400);
  });

  test("unauth error for unknown user", async function () {
    const response = await request(app)
      .post("/recipe")
      .send({
        uri: "testuri.com",
        label: "Recipe1",
        image: "testimg.png",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .set("authorization", `Bearer fakeToken`);
    expect(response.statusCode).toEqual(401);
  });
});

// // /************************************** GET /recipe ✓ 2/2 */
describe("GET /recipe", function () {
  test("works for admin", async function () {
    const response = await request(app)
      .get("/recipe")
      .set("authorization", `Bearer ${u2Token}`);

    expect(response.body).toEqual({
      recipes: [
        {
          uri: "testuri.com",
          label: "Test Recipe",
          image: "test.png",
        },
        {
          uri: "testuri2.com",
          label: "Test Recipe 2",
          image: "test2.png",
        },
        {
          uri: "testuri3.com",
          label: "Test Recipe 3",
          image: "test3.png",
        },
      ],
    });
  });

  test("works for non admin", async function () {
    const response = await request(app)
      .get("/recipe")
      .set("authorization", `Bearer ${u1Token}`);

    expect(response.body).toEqual({
      recipes: [
        {
          uri: "testuri.com",
          label: "Test Recipe",
          image: "test.png",
        },
        {
          uri: "testuri2.com",
          label: "Test Recipe 2",
          image: "test2.png",
        },
        {
          uri: "testuri3.com",
          label: "Test Recipe 3",
          image: "test3.png",
        },
      ],
    });
  });

  test("unauth for anon user", async function () {
    const response = await request(app)
      .get("/recipe")
      .set("authorization", `Bearer fakeToken`);
    expect(response.statusCode).toEqual(401);
  });
});

// // /************************************** GET /book/:id ✓ 4/4 */
// describe("GET /book/:id", function () {
//   test("works for admin", async function () {
//     // get a book id to test:
//     let books = await db.query("SELECT id, title, username FROM books");
//     let book = books.rows[0];

//     // test
//     const response = await request(app)
//       .get(`/book/${book.id}`)
//       .set("authorization", `Bearer ${u2Token}`);

//     expect(response.body).toEqual({
//       book: { title: "book1", username: "u1", id: expect.any(Number) },
//     });
//   });

//   test("works for self", async function () {
//     // get a book id to test:
//     let books = await db.query("SELECT id, title, username FROM books");
//     let book = books.rows[0];

//     // test
//     const response = await request(app)
//       .get(`/book/${book.id}`)
//       .set("authorization", `Bearer ${u1Token}`);

//     expect(response.body).toEqual({
//       book: { title: "book1", username: "u1", id: expect.any(Number) },
//     });
//   });

//   test("unauth for non-admin / non-user", async function () {
//     // get a book id to test:
//     let books = await db.query("SELECT id, title, username FROM books");
//     let book = books.rows[0];

//     // test
//     const response = await request(app)
//       .get(`/book/${book.id}`)
//       .set("authorization", `Bearer ${u3Token}`);
//     expect(response.statusCode).toEqual(401);
//   });

//   test("not found for non-existing book", async function () {
//     const response = await request(app)
//       .get(`/book/0`)
//       .set("authorization", `Bearer ${u2Token}`);
//     expect(response.statusCode).toEqual(404);
//   });
// });

// // /************************************** PATCH /book/:id ✓ 3/3 */
// describe("PATCH /book/:id", function () {
//   test("works for admin - update title", async function () {
//     // get a book id to test:
//     let books = await db.query("SELECT id, title, username FROM books");
//     let book = books.rows[0];

//     // test
//     const response = await request(app)
//       .patch(`/book/${book.id}`)
//       .send({
//         title: "newTitle",
//       })
//       .set("Content-Type", "application/json")
//       .set("Accept", "application/json")
//       .set("authorization", `Bearer ${u2Token}`);

//     expect(response.body).toEqual({
//       book: { title: "newTitle", username: "u1", id: expect.any(Number) },
//     });
//   });

//   test("works for self - update title", async function () {
//     // get a book id to test:
//     let books = await db.query("SELECT id, title, username FROM books");
//     let book = books.rows[0];

//     // test
//     const response = await request(app)
//       .patch(`/book/${book.id}`)
//       .send({
//         title: "newTitle",
//       })
//       .set("Content-Type", "application/json")
//       .set("Accept", "application/json")
//       .set("authorization", `Bearer ${u1Token}`);

//     expect(response.body).toEqual({
//       book: { title: "newTitle", username: "u1", id: expect.any(Number) },
//     });
//   });

//   test("unauth for nonadmin", async function () {
//     // get a book id to test:
//     let books = await db.query("SELECT id, title, username FROM books");
//     let book = books.rows[0];

//     // test
//     const response = await request(app)
//       .patch(`/book/${book.id}`)
//       .send({
//         title: "newTitle",
//       })
//       .set("Content-Type", "application/json")
//       .set("Accept", "application/json")
//       .set("authorization", `Bearer ${u3Token}`);
//     expect(response.statusCode).toEqual(401);
//   });
// });

// // /************************************** DELETE /book/:id ✓ 3/3  */
// describe("DELETE /book/:id", function () {
//   test("works for admin", async function () {
//     // get a book id to test:
//     let books = await db.query("SELECT id, title, username FROM books");
//     let book = books.rows[0];

//     // test
//     const response = await request(app)
//       .delete(`/book/${book.id}`)
//       .set("Content-Type", "application/json")
//       .set("Accept", "application/json")
//       .set("authorization", `Bearer ${u2Token}`);

//     expect(response.body).toEqual({
//       deleted: `${book.id}`,
//     });
//   });
//   test("works for self", async function () {
//     // get a book id to test:
//     let books = await db.query("SELECT id, title, username FROM books");
//     let book = books.rows[0];

//     // test
//     const response = await request(app)
//       .delete(`/book/${book.id}`)
//       .set("Content-Type", "application/json")
//       .set("Accept", "application/json")
//       .set("authorization", `Bearer ${u1Token}`);

//     expect(response.body).toEqual({
//       deleted: `${book.id}`,
//     });
//   });
//   test("unauth for non-self/ non-admin", async function () {
//     // get a book id to test:
//     let books = await db.query("SELECT id, title, username FROM books");
//     let book = books.rows[0];

//     // test
//     const response = await request(app)
//       .delete(`/book/${book.id}`)
//       .set("Content-Type", "application/json")
//       .set("Accept", "application/json")
//       .set("authorization", `Bearer ${u3Token}`);

//     expect(response.statusCode).toEqual(401);
//   });
// });
