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

/************************************** POST /auth/login ✓ 5/5 */

describe("POST auth/login", function () {
  test("works", async function () {
    let payload = { username: "u1", password: "password1" };
    const response = await request(app)
      .post("/auth/login")
      .send(payload)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");
    expect(response.body).toEqual({
      token: expect.any(String),
    });
  });
  test("unauth with non-existent user", async function () {
    const resp = await request(app).post("/auth/login").send({
      username: "no-such-user",
      password: "password1",
    });
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth with wrong password", async function () {
    const resp = await request(app).post("/auth/login").send({
      username: "u1",
      password: "nope",
    });
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing data", async function () {
    const resp = await request(app).post("/auth/login").send({
      username: "u1",
    });
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app).post("/auth/login").send({
      username: 42,
      password: "above-is-a-number",
    });
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** POST /auth/register ✓ 4/4 */

describe("POST auth/register", function () {
  let newUser = {
    username: "newUser",
    password: "password",
    firstName: "newFirst",
    lastName: "newLast",
    email: "email@email.com",
  };

  test("works", async function () {
    const response = await request(app)
      .post("/auth/register")
      .send(newUser)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");
    expect(response.body).toEqual({
      token: expect.any(String),
    });
  });

  test("bad request with missing data", async function () {
    delete newUser.email;
    const resp = await request(app).post("/auth/register").send(newUser);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app).post("/auth/register").send({
      username: 42,
      password: "above-is-a-number",
      firstName: "first",
      lastName: "last",
      email: "email@email.com",
    });
    expect(resp.statusCode).toEqual(400);
  });
  test("bad request with too short of a password", async function () {
    const resp = await request(app).post("/auth/register").send({
      username: "user",
      password: "pass",
      firstName: "first",
      lastName: "last",
      email: "email@email.com",
    });
    expect(resp.statusCode).toEqual(400);
  });
});
