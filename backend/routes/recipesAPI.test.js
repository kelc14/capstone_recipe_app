// "use strict";

// import db from "../db";
// import request from "supertest";
// import app from "../app.js";

// import {
//   commonBeforeAll,
//   commonBeforeEach,
//   commonAfterAll,
//   commonAfterEach,
//   u1Token,
//   u2Token,
//   u3Token,
// } from "./_testCommon";

// beforeAll(commonBeforeAll);
// beforeEach(commonBeforeEach);
// afterEach(commonAfterEach);
// afterAll(commonAfterAll);

// // // /************************************** GET /book/:id ✓ 4/4 */
// // describe("GET /book/:id", function () {
// //   test("works for admin", async function () {
// //     // get a book id to test:
// //     let books = await db.query("SELECT id, title, username FROM books");
// //     let book = books.rows[0];

// //     // test
// //     const response = await request(app)
// //       .get(`/book/${book.id}`)
// //       .set("authorization", `Bearer ${u2Token}`);

// //     expect(response.body).toEqual({
// //       book: { title: "book1", username: "u1", id: expect.any(Number) },
// //     });
// //   });

// //   test("works for self", async function () {
// //     // get a book id to test:
// //     let books = await db.query("SELECT id, title, username FROM books");
// //     let book = books.rows[0];

// //     // test
// //     const response = await request(app)
// //       .get(`/book/${book.id}`)
// //       .set("authorization", `Bearer ${u1Token}`);

// //     expect(response.body).toEqual({
// //       book: { title: "book1", username: "u1", id: expect.any(Number) },
// //     });
// //   });

// //   test("unauth for non-admin / non-user", async function () {
// //     // get a book id to test:
// //     let books = await db.query("SELECT id, title, username FROM books");
// //     let book = books.rows[0];

// //     // test
// //     const response = await request(app)
// //       .get(`/book/${book.id}`)
// //       .set("authorization", `Bearer ${u3Token}`);
// //     expect(response.statusCode).toEqual(401);
// //   });

// //   test("not found for non-existing book", async function () {
// //     const response = await request(app)
// //       .get(`/book/0`)
// //       .set("authorization", `Bearer ${u2Token}`);
// //     expect(response.statusCode).toEqual(404);
// //   });
// // });
