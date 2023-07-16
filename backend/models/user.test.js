"use strict";

import {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} from "../expressError";
import db from "../db.js";
import User from "./user.js";
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

/************************************** authenticate ✓ 3/3  */

describe("authenticate", function () {
  test("works", async function () {
    const user = await User.authenticate("u1", "password1");
    expect(user).toEqual({
      username: "u1",
      firstName: "U1F",
      lastName: "U1L",
      email: "u1@email.com",
      isAdmin: false,
    });
  });

  test("unauth if no such user", async function () {
    try {
      await User.authenticate("nope", "password");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });

  test("unauth if wrong password", async function () {
    try {
      await User.authenticate("c1", "wrong");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
});

/************************************** register ✓ 2/2 */

describe("register", function () {
  test("works", async function () {
    const user = await User.register({
      username: "newUser",
      password: "password",
      firstName: "First",
      lastName: "Last",
      email: "test@email.com",
      isAdmin: false,
    });
    expect(user).toEqual({
      username: "newUser",
      firstName: "First",
      lastName: "Last",
      email: "test@email.com",
      isAdmin: false,
    });

    const checkDatabase = await db.query(
      `SELECT username, password, firstName AS "firstName", lastName AS "lastName", isAdmin as "isAdmin", email
               FROM users
               WHERE username = '${user.username}'`
    );

    expect(checkDatabase.rows.length).toEqual(1);
    expect(checkDatabase.rows[0].isAdmin).toEqual(false);
    expect(checkDatabase.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("works to add an admin", async function () {
    const user = await User.register({
      username: "newUser2",
      password: "password",
      firstName: "First",
      lastName: "Last",
      email: "test@email.com",
      isAdmin: true,
    });
    expect(user).toEqual({
      username: "newUser2",
      firstName: "First",
      lastName: "Last",
      email: "test@email.com",
      isAdmin: true,
    });
    const checkDatabase = await db.query(
      `SELECT username, password, firstName AS "firstName", lastName AS "lastName", isAdmin as "isAdmin", email
                 FROM users
                 WHERE username = '${user.username}'`
    );

    expect(checkDatabase.rows.length).toEqual(1);
    expect(checkDatabase.rows[0].isAdmin).toEqual(true);
    expect(checkDatabase.rows[0].password.startsWith("$2b$")).toEqual(true);
  });
});

/************************************** findAll ✓ 1/1  */

describe("findAll", function () {
  test("works", async function () {
    const users = await User.findAll();
    expect(users).toEqual([
      {
        username: "u1",
        firstName: "U1F",
        lastName: "U1L",
        email: "u1@email.com",
        isAdmin: false,
      },
      {
        username: "u2",
        firstName: "U2F",
        lastName: "U2L",
        email: "u2@email.com",
        isAdmin: false,
      },
    ]);
  });
});

/************************************** get(username) ✓ 2/2  */

describe("get(username)", function () {
  test("works with existing user", async function () {
    let username = "u1";
    const user = await User.get(username);
    expect(user).toEqual({
      username: "u1",
      firstName: "U1F",
      lastName: "U1L",
      email: "u1@email.com",
      isAdmin: false,
      books: [
        {
          id: expect.any(Number),
          title: "book1",
        },
        {
          id: expect.any(Number),
          title: "book2",
        },
      ],
    });
  });
  test("notFound error with non-existing user", async function () {
    let fakeUsername = "nonexistinguser";
    try {
      await User.get(fakeUsername);
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update(username) ✓ 3/3  */

describe("update(username,data)", function () {
  test("updates existing user", async function () {
    let username = "u1";
    let data = {
      firstName: "updatedFirstName",
    };
    const user = await User.update(username, data);
    expect(user).toEqual({
      username: "u1",
      firstName: "updatedFirstName",
      lastName: "U1L",
      email: "u1@email.com",
      isAdmin: false,
    });
  });
  test("notFound error with non-existing user", async function () {
    let fakeUsername = "nonexistinguser";
    try {
      await User.update(fakeUsername, { firstName: "wontgethere" });
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
  test("updates password", async function () {
    let username = "u1";
    let password = "newpassword";
    const user = await User.update(username, { password });
    expect(user).toEqual({
      username: "u1",
      firstName: "U1F",
      lastName: "U1L",
      email: "u1@email.com",
      isAdmin: false,
    });

    // verify we can login with new password
    const userVerify = await User.authenticate("u1", "newpassword");
    expect(userVerify).toEqual({
      username: "u1",
      firstName: "U1F",
      lastName: "U1L",
      email: "u1@email.com",
      isAdmin: false,
    });
  });
});

/************************************** remove(username) ✓ 2/2  */

describe("remove(username)", function () {
  test("removes existing user", async function () {
    let username = "u1";

    const user = await User.remove(username);
    let res = await db.query(
      `SELECT * FROM users WHERE username='${username}'`
    );
    expect(res.rows.length).toBe(0);
  });
  test("notFound error with non-existing user", async function () {
    let fakeUsername = "nonexistinguser";
    try {
      await User.remove(fakeUsername);
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
