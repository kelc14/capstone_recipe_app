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
import Calendar from "./calendar";

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** createCalendar  ✓ 3/3 */

describe("create new calendar", function () {
  test("works", async function () {
    const calendar = await Calendar.createCalendar({ username: "u2" });

    expect(calendar).toEqual({
      username: "u2",
      monday: null,
      tuesday: null,
      wednesday: null,
      thursday: null,
      friday: null,
      saturday: null,
      sunday: null,
    });
  });

  test("badRequest for user with existing calendar", async function () {
    try {
      await Calendar.createCalendar({ username: "u1" });
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
  test("notFound error with non-existing user", async function () {
    try {
      await Calendar.createCalendar("fakeUser");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

// /************************************** getAll ✓ 1/1  */

describe("getAll", function () {
  test("works", async function () {
    const calendars = await Calendar.getAll();
    expect(calendars).toEqual([
      {
        username: "u1",
        monday: null,
        tuesday: null,
        wednesday: null,
        thursday: null,
        friday: null,
        saturday: null,
        sunday: null,
      },
    ]);
  });
});

// /************************************** get(user) ✓ 3/3  */

describe("get", function () {
  test("works", async function () {
    const calendar = await Calendar.get({ username: "u1" });
    expect(calendar).toEqual({
      username: "u1",
      monday: null,
      tuesday: null,
      wednesday: null,
      thursday: null,
      friday: null,
      saturday: null,
      sunday: null,
    });
  });

  test("not found error for nonexistent user", async function () {
    try {
      await Calendar.get({ username: "fakeuser" });
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

// /************************************** update({day, uri, username})  ✓ 3/3 */

describe("update(day, uri, username)", function () {
  test("works", async function () {
    const calendar = await Calendar.update({
      day: "monday",
      uri: "testuri.com",
      username: "u1",
    });
    expect(calendar).toEqual({
      username: "u1",
      monday: "testuri.com",
      tuesday: null,
      wednesday: null,
      thursday: null,
      friday: null,
      saturday: null,
      sunday: null,
    });
  });

  test("not found error for non-existent user", async function () {
    try {
      const calendar = await Calendar.update({
        day: "monday",
        uri: "testuri.com",
        username: "u2",
      });
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
  test("not found error for non-existent uri", async function () {
    try {
      const calendar = await Calendar.update({
        day: "monday",
        uri: "fakeURI",
        username: "u2",
      });
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
  test("set day as null", async function () {
    const calendar = await Calendar.update({
      day: "monday",
      uri: null,
      username: "u1",
    });
    expect(calendar).toEqual({
      username: "u1",
      monday: null,
      tuesday: null,
      wednesday: null,
      thursday: null,
      friday: null,
      saturday: null,
      sunday: null,
    });
  });
});

// /************************************** remove(id)  ✓ 2/2 */

// describe("remove(id)", function () {
//   test("works", async function () {
//     // get book id from db =>
//     let res = await db.query("SELECT id, title, username FROM books");
//     let id = res.rows[0].id;

//     // ==> find book by id
//     const resp = await Book.remove(id);
//     let secondResult = await db.query(`SELECT * FROM books WHERE id='${id}'`);
//     expect(secondResult.rows.length).toBe(0);
//   });

//   test("not found error for non-existent id", async function () {
//     try {
//       const books = await Book.remove(0);
//     } catch (err) {
//       expect(err instanceof NotFoundError).toBeTruthy();
//     }
//   });
// });
