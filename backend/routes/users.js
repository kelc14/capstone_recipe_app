"use strict";

/** Routes for users. */

import jsonschema from "jsonschema";
import express from "express";
import { BadRequestError, UnauthorizedError } from "../expressError.js";
import User from "../models/user.js";
import { ensureAdmin, ensureSelfOrAdmin } from "../middleware/auth.js";
import {
  userNewSchema,
  userUpdateSchema,
} from "../schemas/userValidationSchemas.js";
import { createToken } from "../helpers/tokens.js";

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

router.post("/", ensureAdmin, async function (req, res, next) {
  try {
    // validate data:
    const { error, value } = userNewSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const { details } = error;
      const message = details.map((i) => i.message).join(",");
      console.log("error", message);
      throw new BadRequestError(message);
    }

    const user = await User.register(req.body);
    const token = createToken(user);
    return res.status(201).json({ user, token });
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

router.get("/", ensureAdmin, async function (req, res, next) {
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

router.get("/:username", ensureSelfOrAdmin, async function (req, res, next) {
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

router.patch("/:username", ensureSelfOrAdmin, async function (req, res, next) {
  try {
    // validate data:
    const { error, value } = userUpdateSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const { details } = error;
      const message = details.map((i) => i.message).join(",");
      console.log("error", message);
      throw new BadRequestError(message);
    }

    const user = await User.update(req.params.username, req.body);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[username]  =>  { deleted: username }
 *
 * Authorization required: login - this user or admin
 **/

router.delete("/:username", ensureSelfOrAdmin, async function (req, res, next) {
  try {
    await User.remove(req.params.username);
    return res.json({ deleted: req.params.username });
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

// router.post(
//   "/:username/recipe",
//   ensureSelfOrAdmin,
//   async function (req, res, next) {
//     let { recipeURI, username } = req.body;
//     console.log(recipeURI);
//     try {
//       const user_recipe = await User.addUserRecipe(username, recipeURI);
//       return res.status(201).json({ user_recipe });
//     } catch (err) {
//       return next(err);
//     }
//   }

export { router };
