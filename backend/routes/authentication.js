"use strict";

/** Routes for authentication. */

import User from "../models/user.js";
import {
  userRegisterSchema,
  userLoginSchema,
} from "../schemas/userValidationSchemas.js";
import { BadRequestError } from "../expressError.js";
import express from "express";
import { createToken } from "../helpers/tokens.js";

const router = new express.Router();

/** POST /auth/login:  { username, password } => { token }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/login", async function (req, res, next) {
  try {
    // validate data:
    const { error, value } = userLoginSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const { details } = error;
      const message = details.map((i) => i.message).join(",");
      console.log("error", message);
      throw new BadRequestError(message);
    }

    // if both username and password present:
    const { username, password } = req.body;
    const user = await User.authenticate(username, password);
    const token = createToken(user);
    return res.json({ user, token });
  } catch (err) {
    return next(err);
  }
});

/** POST /auth/register:   { user } => { token }
 *
 * user must include { username, password, firstName, lastName, email }
 *
 * ** ALWAYS SETS ISADMIN TO FALSE **
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/register", async function (req, res, next) {
  try {
    // validate data:
    const { error, value } = userRegisterSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const { details } = error;
      const message = details.map((i) => i.message).join(",");
      console.log("error", message);
      throw new BadRequestError(message);
    }

    // if passes validation, register user and return token:
    const user = await User.register({ ...req.body, isAdmin: false });
    const token = createToken(user);
    return res.status(201).json({ user, token });
  } catch (err) {
    return next(err);
  }
});

export { router };
