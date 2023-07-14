"use strict";

/** Routes for users. */

import jsonschema from "jsonschema";
import express from "express";
import { BadRequestError, UnauthorizedError } from "../expressError.js";
import User from "../models/user.js";

// const jsonschema = require("jsonschema");
// const express = require("express");
// const {
//   ensureLoggedIn,
//   ensureAdmin,
//   ensureSelfOrAdmin,
// } = require("../middleware/auth");
// const { BadRequestError, UnauthorizedError } = require("../expressError");
// const User = require("../models/user");
// const { createToken } = require("../helpers/tokens");
// const userNewSchema = require("../schemas/userNew.json");
// const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();

/** POST / { user }  => { user, token }
 *
 * Adds a new user. This is not the registration endpoint --- instead, this is
 * only for admin users to add new users. The new user being added can be an
 * admin.
 *
 * This returns the newly created user and an authentication token for them:
 *  {user: { username, firstName, lastName, email, isAdmin }, token }
 *
 * Authorization required: login - admin
 **/

router.post("/", async function (req, res, next) {
  try {
    // const validator = jsonschema.validate(req.body, userNewSchema);
    // if (!validator.valid) {
    //   const errs = validator.errors.map((e) => e.stack);
    //   throw new BadRequestError(errs);
    // }

    const user = await User.register(req.body);
    // const token = createToken(user);
    // return res.status(201).json({ user, token });
    return res.status(201).json({ user });
  } catch (err) {
    return next(err);
  }
});

/** GET / => { users: [{username, firstName, lastName, email, isAdmin} ... ]}
 *
 * Retrieves a list of all users
 *
 * Authorization required: login - admin
 */

router.get("/", async function (req, res, next) {
  try {
    const users = await User.findAll();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});

/** GET /[username] => { user }
 *
 * Returns { username, firstName, lastName, isAdmin, jobs: [jobId of applied jobs] }
 *
 * Authorization required: login - this user OR admin
 **/

router.get("/:username", async function (req, res, next) {
  try {
    const user = await User.get(req.params.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[username] { user } => { user }
 *
 * Data can include:
 *   { firstName, lastName, password, email }
 *
 * Returns { username, firstName, lastName, email, isAdmin }
 *
 * Authorization required: login - this user or admin
 **/

router.patch("/:username", async function (req, res, next) {
  try {
    // if (
    //   res.locals.user.username === req.params.username ||
    //   res.locals.user.isAdmin
    // ) {
    const validator = jsonschema.validate(req.body, userUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.update(req.params.username, req.body);
    return res.json({ user });
    // } else {
    //   throw new UnauthorizedError();
    // }
  } catch (err) {
    return next(err);
  }
});

export { router };
