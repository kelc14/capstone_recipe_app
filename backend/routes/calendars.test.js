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

// /************************************** GET /calendars ✓ 2/2 */
describe("GET /calendar", function () {
  test("works for admin", async function () {
    const response = await request(app)
      .get("/calendar")
      .set("authorization", `Bearer ${u2Token}`);

    expect(response.body).toEqual({
      calendars: [
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
        {
          username: "u2",
          monday: null,
          tuesday: null,
          wednesday: null,
          thursday: null,
          friday: null,
          saturday: null,
          sunday: null,
        },
        {
          username: "u3",
          monday: null,
          tuesday: null,
          wednesday: null,
          thursday: null,
          friday: null,
          saturday: null,
          sunday: null,
        },
      ],
    });
  });
  test("unauth for non-admin", async function () {
    const response = await request(app)
      .get("/calendar")
      .set("authorization", `Bearer ${u1Token}`);
    expect(response.statusCode).toEqual(401);
  });
});

/************************************** PATCH /calendar/:username ✓ 4/4 */
describe("PATCH /calendar/:username", function () {
  test("works for admin - update day of the week", async function () {
    const response = await request(app)
      .patch("/calendar/u1")
      .send({
        day: "monday",
        uri: "testuri.com",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .set("authorization", `Bearer ${u2Token}`);

    expect(response.body).toEqual({
      calendar: {
        username: "u1",
        monday: "testuri.com",
        tuesday: null,
        wednesday: null,
        thursday: null,
        friday: null,
        saturday: null,
        sunday: null,
      },
    });
  });
  test("works for self - update day of the week", async function () {
    const response = await request(app)
      .patch("/calendar/u1")
      .send({
        day: "monday",
        uri: "testuri.com",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .set("authorization", `Bearer ${u1Token}`);

    expect(response.body).toEqual({
      calendar: {
        username: "u1",
        monday: "testuri.com",
        tuesday: null,
        wednesday: null,
        thursday: null,
        friday: null,
        saturday: null,
        sunday: null,
      },
    });
  });
  test("works for self - update day of the week and then reset to null", async function () {
    const response = await request(app)
      .patch("/calendar/u1")
      .send({
        day: "monday",
        uri: "testuri.com",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .set("authorization", `Bearer ${u1Token}`);

    expect(response.body).toEqual({
      calendar: {
        username: "u1",
        monday: "testuri.com",
        tuesday: null,
        wednesday: null,
        thursday: null,
        friday: null,
        saturday: null,
        sunday: null,
      },
    });
    const response2 = await request(app)
      .patch("/calendar/u1")
      .send({
        day: "monday",
        uri: null,
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .set("authorization", `Bearer ${u1Token}`);

    expect(response2.body).toEqual({
      calendar: {
        username: "u1",
        monday: null,
        tuesday: null,
        wednesday: null,
        thursday: null,
        friday: null,
        saturday: null,
        sunday: null,
      },
    });
  });
  test("unauth for diff user", async function () {
    const response = await request(app)
      .patch("/calendar/u1")
      .send({
        day: "monday",
        uri: "testuri.com",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .set("authorization", `Bearer ${u3Token}`);
    expect(response.statusCode).toEqual(401);
  });
});
