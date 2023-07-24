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
import { date } from "joi";

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** addToDB  ✓ 1/1 */
describe("add a recipe to the db", function () {
  test("works", async function () {
    const recipe = await Recipe.addToDB({
      uri: "testuri1.com",
      label: "test recipe label 1",
      image: "fakeimage1.jpeg",
    });
    expect(recipe).toEqual({
      uri: "testuri1.com",
      label: "test recipe label 1",
      image: "fakeimage1.jpeg",
    });
  });
});

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

/************************************** addRating({uri, username, rating}) ✓ 2/2  */
describe("add recipe rating for user", function () {
  test("works", async function () {
    let data = {
      uri: "testuri.com",
      username: "u1",
      rating: 5,
    };
    const recipes = await Recipe.addRating(data);
    expect(recipes).toEqual({
      id: expect.any(Number),
      recipeURI: "testuri.com",
      username: "u1",
      starRating: 5,
      createdAt: expect.any(Date),
    });
  });

  test("returns original rating for recipe/user if duplicate sent", async function () {
    let data = {
      uri: "testuri2.com",
      username: "u1",
      rating: 5,
    };
    const recipes = await Recipe.addRating(data);
    expect(recipes).toEqual({
      id: expect.any(Number),
      recipeURI: "testuri2.com",
      username: "u1",
      starRating: 3,
      createdAt: expect.any(Date),
    });
  });
});

/************************************** updateRating({uri, username, rating}) ✓ 2/2  */
describe("updates rating for user", function () {
  test("works", async function () {
    let data = {
      uri: "testuri2.com",
      username: "u1",
      rating: 5,
    };
    const recipes = await Recipe.updateRating(data);
    expect(recipes).toEqual({
      id: expect.any(Number),
      recipeURI: "testuri2.com",
      username: "u1",
      starRating: 5,
      createdAt: expect.any(Date),
    });
  });
  test("notFound error with non-existing rating", async function () {
    let data = {
      uri: "FAKEURI",
      username: "u1",
      rating: 5,
    };
    try {
      await Recipe.updateRating(data);
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** updateRating({uri, username, rating}) ✓ 2/2  */
describe("removes rating for user", function () {
  test("works", async function () {
    let data = {
      uri: "testuri2.com",
      username: "u1",
    };
    await Recipe.removeRating(data);
    let res = await db.query(
      `SELECT * FROM ratings WHERE username='${data.username}' AND recipeURI = '${data.uri}'`
    );
    expect(res.rows.length).toBe(0);
  });

  test("notFound error with non-existing rating", async function () {
    let data = {
      uri: "FAKEURI",
      username: "u1",
    };
    try {
      await Recipe.removeRating(data);
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
