"use strict";

/** Routes for books. */

import express from "express";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../expressError.js";
import Book from "../models/book.js";
import {
  ensureAdmin,
  ensureLoggedIn,
  ensureSelfOrAdmin,
} from "../middleware/auth.js";
import {
  bookSchema,
  updateBookSchema,
} from "../schemas/bookValidationSchemas.js";

const router = express.Router();

/** POST / { book }  => { book }
 *
 * Adds a new user. This is not the registration endpoint --- instead, this is
 * only for admin users to add new users. The new user being added can be an
 * admin.
 *
 * This returns the newly created user and an authentication token for them:
 *  {user: { username, firstName, lastName, email, isAdmin }, token }
 *
 * Authorization required: login - self or admin
 **/

router.post("/", ensureLoggedIn, async function (req, res, next) {
  try {
    // check that user matches username in req.body or is an Admin >
    if (
      res.locals.user.username === req.body.username ||
      res.locals.user.isAdmin
    ) {
      // validate data:
      const { error, value } = bookSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        const { details } = error;
        const message = details.map((i) => i.message).join(",");
        console.log("error", message);
        throw new BadRequestError(message);
      }

      const book = await Book.new(req.body);
      return res.status(201).json({ book });
    } else {
      throw new UnauthorizedError();
    }
  } catch (err) {
    return next(err);
  }
});

/** GET / => { books: [{id, title, username} ... ]}
 *
 * Retrieves a list of all books
 *
 * Authorization required: login - admin
 */

router.get("/", ensureAdmin, async function (req, res, next) {
  try {
    const books = await Book.getAll();
    return res.json({ books });
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

router.get("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    const book = await Book.get(req.params.id);
    if (res.locals.user.username === book.username || res.locals.user.isAdmin) {
      return res.json({ book });
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

router.patch("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    let book = await Book.get(req.params.id);
    if (!book) return NotFoundError(`No book with id: ${req.params.id}`);

    // check that user matches username from the book or is an Admin >
    if (res.locals.user.username === book.username || res.locals.user.isAdmin) {
      // validate data:
      const { error, value } = updateBookSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        const { details } = error;
        const message = details.map((i) => i.message).join(",");
        console.log("error", message);
        throw new BadRequestError(message);
      }

      const book = await Book.update(req.params.id, req.body.title);
      return res.json({ book });
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

// router.delete("/:username", ensureSelfOrAdmin, async function (req, res, next) {
//   try {
//     await User.remove(req.params.username);
//     return res.json({ deleted: req.params.username });
//   } catch (err) {
//     return next(err);
//   }
// });

export { router };
