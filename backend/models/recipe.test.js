"use strict";

import {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} from "../expressError";
import db from "../db.js";
import {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} from "./_testCommon.js";
import Recipe from "./recipe";

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** fetch   */
// describe("fetch from api", function () {
//   test("works", async function () {
//     let query = "chicken";
//     const recipes = await Recipe.fetchRecipes(query);
//     console.log(recipes);
//     // expect(book).toEqual({
//     //   id: expect.any(Number),
//     //   title: "New Book",
//     //   username: "u2",
//     // });
//   });

//   //   test("notFound error with non-existing user", async function () {
//   //     try {
//   //       await Book.new({ title: "new book", username: "fakeusername" });
//   //     } catch (err) {
//   //       expect(err instanceof NotFoundError).toBeTruthy();
//   //     }
//   //   });
// });

/************************************** getAll  ✓ 1/1 */
describe("get all reicpes from DB", function () {
  test("works", async function () {
    const recipes = await Recipe.getAll();
    expect(recipes).toEqual([
      {
        uri: "testuri.com",
        label: "test recipe label",
        image: "fakeimage.jpeg",
      },
      {
        uri: "testuri2.com",
        label: "test recipe label 2",
        image: "fakeimage2.jpeg",
      },
    ]);
  });
});

/************************************** get(uri)  ✓ 2/2 */
describe("get single recipe", function () {
  test("works", async function () {
    let uri = "testuri.com";
    const recipes = await Recipe.get(uri);
    expect(recipes).toEqual({
      uri: "testuri.com",
      label: "test recipe label",
      image: "fakeimage.jpeg",
    });
  });
  test("notFound error with non-existing recipe", async function () {
    let fakeuri = "DOESNTEXIST";
    try {
      await Recipe.get(fakeuri);
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
