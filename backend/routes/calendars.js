"use strict";

/** Routes for calendars. */

import express from "express";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../expressError.js";
import Calendar from "../models/calendar.js";
import { ensureAdmin, ensureLoggedIn } from "../middleware/auth.js";
import {
  bookSchema,
  updateBookSchema,
} from "../schemas/bookValidationSchemas.js";
import User from "../models/user.js";

const router = express.Router();

/** GET / => { calendars: [....]}
 *
 * Retrieves a list of all calendars
 *
 * Authorization required: login - admin
 */

router.get("/", ensureAdmin, async function (req, res, next) {
  try {
    const calendars = await Calendar.getAll();
    return res.json({ calendars });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id] => { book }
 *
 * Returns { id, title, username, recipes: [...] }
 *
 * Authorization required: login - this user OR admin
 **/

router.get("/:username", ensureLoggedIn, async function (req, res, next) {
  try {
    const calendar = await Calendar.get({ username: req.params.username });
    if (
      res.locals.user.username === req.params.username ||
      res.locals.user.isAdmin
    ) {
      return res.json({ calendar });
    } else {
      throw new UnauthorizedError();
    }
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[username] { book } => { book }
 *
 * Data can include:
 *   { title }
 *
 * Returns { id, title, username }
 *
 * Authorization required: login - this user or admin
 **/

router.patch("/:username", ensureLoggedIn, async function (req, res, next) {
  try {
    let username = req.params.username;
    let calendar = await Calendar.get({ username });
    if (!calendar)
      return new NotFoundError(`No calendar for username: ${username}`);

    // check that user matches username from the book or is an Admin >
    if (
      res.locals.user.username === calendar.username ||
      res.locals.user.isAdmin
    ) {
      //   // validate data:
      //   const { error, value } = updateBookSchema.validate(req.body, {
      //     abortEarly: false,
      //   });
      //   if (error) {
      //     const { details } = error;
      //     const message = details.map((i) => i.message).join(",");
      //     console.log("error", message);
      //     throw new BadRequestError(message);
      //   }

      let day = req.body.day;
      let uri = req.body.uri;
      const calendar = await Calendar.update({ day, uri, username });
      return res.json({ calendar });
    } else {
      throw new UnauthorizedError();
    }
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[username]  =>  { deleted: username }
 *
 * Authorization required: login - this user or admin
 **/

router.delete("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    let book = await Book.get(req.params.id);
    if (!book) return NotFoundError(`No book with id: ${req.params.id}`);

    // check that user matches username from the book or is an Admin >
    if (res.locals.user.username === book.username || res.locals.user.isAdmin) {
      const book = await Book.remove(req.params.id);
      return res.json({ deleted: req.params.id });
    } else {
      throw new UnauthorizedError();
    }
  } catch (err) {
    return next(err);
  }
});

export { router };
