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

/************************************** POST /user ✓ 3/3 */
describe("POST /user", function () {
  test("works for admin to create admin", async function () {
    const response = await request(app)
      .post("/user")
      .send({
        username: "newusr1",
        password: "password",
        firstName: "first1",
        lastName: "last1",
        email: "email@email.com",
        isAdmin: true,
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .set("authorization", `Bearer ${u2Token}`);
    expect(response.body).toEqual({
      user: {
        username: "newusr1",
        firstName: "first1",
        lastName: "last1",
        email: "email@email.com",
        isAdmin: true,
      },
      token: expect.any(String),
    });
  });

  test("works for admin to create non-admin", async function () {
    const response = await request(app)
      .post("/user")
      .send({
        username: "newusr1",
        password: "password",
        firstName: "first1",
        lastName: "last1",
        email: "email@email.com",
        isAdmin: false,
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .set("authorization", `Bearer ${u2Token}`);

    expect(response.body).toEqual({
      user: {
        username: "newusr1",
        firstName: "first1",
        lastName: "last1",
        email: "email@email.com",
        isAdmin: false,
      },
      token: expect.any(String),
    });
  });

  test("unauth for nonadmin", async function () {
    const response = await request(app)
      .post("/user")
      .send({
        username: "newusr1",
        password: "password",
        firstName: "first1",
        lastName: "last1",
        email: "email@email.com",
        isAdmin: false,
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .set("authorization", `Bearer ${u1Token}`);
    expect(response.statusCode).toEqual(401);
  });
});

/************************************** GET /user ✓ 2/2 */
describe("GET /user", function () {
  test("works for admin", async function () {
    const response = await request(app)
      .get("/user")
      .set("authorization", `Bearer ${u2Token}`);
    // .set("authorization", `Bearer ${u2Token}`);;
    // console.log(response);
    expect(response.body).toEqual({
      users: [
        {
          username: "u1",
          firstName: "U1F",
          lastName: "U1L",
          email: "user1@user.com",
          isAdmin: false,
        },
        {
          username: "u2",
          firstName: "U2F",
          lastName: "U2L",
          email: "user2@user.com",
          isAdmin: false,
        },
        {
          username: "u3",
          firstName: "U3F",
          lastName: "U3L",
          email: "user3@user.com",
          isAdmin: false,
        },
      ],
    });
  });
  test("unauth for non-admin", async function () {
    const response = await request(app)
      .get("/user")
      .set("authorization", `Bearer ${u1Token}`);
    expect(response.statusCode).toEqual(401);
  });
});

/************************************** GET /user/:username ✓ 5/5 */
describe("GET /user/:username", function () {
  test("works for admin", async function () {
    const response = await request(app)
      .get("/user/u1")
      .set("authorization", `Bearer ${u2Token}`);

    expect(response.body).toEqual({
      user: {
        username: "u1",
        firstName: "U1F",
        lastName: "U1L",
        email: "user1@user.com",
        isAdmin: false,
      },
    });
  });
  test("works for self", async function () {
    const response = await request(app)
      .get("/user/u1")
      .set("authorization", `Bearer ${u1Token}`);

    expect(response.body).toEqual({
      user: {
        username: "u1",
        firstName: "U1F",
        lastName: "U1L",
        email: "user1@user.com",
        isAdmin: false,
      },
    });
  });

  test("unauth for non-admin / non-user", async function () {
    const response = await request(app)
      .get("/user/u1")
      .set("authorization", `Bearer ${u3Token}`);
    expect(response.statusCode).toEqual(401);
  });
  test("not found for non-existing user", async function () {
    const response = await request(app)
      .get("/user/userdoesntexist")
      .set("authorization", `Bearer ${u2Token}`);
    expect(response.statusCode).toEqual(404);
  });

  test("unauth for even with non-existing user", async function () {
    const response = await request(app)
      .get("/user/userdoesntexist")
      .set("authorization", `Bearer ${u1Token}`);
    expect(response.statusCode).toEqual(401);
  });
});

/************************************** PATCH /user/:username ✓ 3/3 */
describe("PATCH /user/:username", function () {
  test("works for admin - update first name", async function () {
    const response = await request(app)
      .patch("/user/u1")
      .send({
        firstName: "newFirst",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .set("authorization", `Bearer ${u2Token}`);

    expect(response.body).toEqual({
      user: {
        username: "u1",
        firstName: "newFirst",
        lastName: "U1L",
        email: "user1@user.com",
        isAdmin: false,
      },
    });
  });
  test("works for self - update first name", async function () {
    const response = await request(app)
      .patch("/user/u1")
      .send({
        firstName: "newFirst",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .set("authorization", `Bearer ${u1Token}`);

    expect(response.body).toEqual({
      user: {
        username: "u1",
        firstName: "newFirst",
        lastName: "U1L",
        email: "user1@user.com",
        isAdmin: false,
      },
    });
  });
  test("unauth for nonadmin", async function () {
    const response = await request(app)
      .patch("/user/u1")
      .send({
        firstName: "newFirst",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .set("authorization", `Bearer ${u3Token}`);
    expect(response.statusCode).toEqual(401);
  });
});

/************************************** DELETE /user/:username ✓ 3/3  */
describe("DELETE /user/:username", function () {
  test("works for admin", async function () {
    const response = await request(app)
      .delete("/user/u1")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .set("authorization", `Bearer ${u2Token}`);

    expect(response.body).toEqual({
      deleted: "u1",
    });
  });
  test("works for self", async function () {
    const response = await request(app)
      .delete("/user/u1")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .set("authorization", `Bearer ${u1Token}`);

    expect(response.body).toEqual({
      deleted: "u1",
    });
  });
  test("unauth for non-self/ non-admin", async function () {
    const response = await request(app)
      .delete("/user/u1")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .set("authorization", `Bearer ${u3Token}`);

    expect(response.statusCode).toEqual(401);
  });
});
