"use strict";

import {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} from "../expressError";
import {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} from "./_testCommon.js";

import RecipeAPI from "./recipeAPI";

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** fetchRecipes   */
// ************ --------------------------------------> NEED TO SET THIS UP TO MOCK THE API CALL FOR THE TEST --------------- ///
describe("fetch from api", function () {
  test("works", async function () {
    // let query = "chicken";
    // const recipes = await RecipeAPI.fetchRecipes(query);
    // console.log(recipes);
    // expect(book).toEqual({
    //   id: expect.any(Number),
    //   title: "New Book",
    //   username: "u2",
    // });
  });
});

/************************************** fetchRandomRecipes   */
// ************ --------------------------------------> NEED TO SET THIS UP TO MOCK THE API CALL FOR THE TEST --------------- ///
describe("fetch random recipes from api", function () {
  test("works", async function () {
    // const recipes = await RecipeAPI.fetchRandomRecipes();
    // console.log(recipes);
    // expect(book).toEqual({
    //   id: expect.any(Number),
    //   title: "New Book",
    //   username: "u2",
    // });
  });
});
