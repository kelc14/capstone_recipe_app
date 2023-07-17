"use strict";

/** Routes for books. */

import express from "express";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../expressError.js";
import Recipe from "../models/recipe.js";
import {
  ensureAdmin,
  ensureLoggedIn,
  ensureSelfOrAdmin,
} from "../middleware/auth.js";
// import {
//   bookSchema,
//   updateBookSchema,
// } from "../schemas/bookValidationSchemas.js";

const router = express.Router();

/** POST / { uri, label, text }  => { recipe }
 *
 * Adds a recipe to the database.
 *
 * This returns the newly created recipe OR the existing recipe
 *  {recipe: { uri, label, image, [rating....reviews....??] }
 *
 * Authorization required: login - self or admin
 **/

router.post("/", ensureLoggedIn, async function (req, res, next) {
  try {
    // // check that user matches username in req.body or is an Admin >

    // // validate data:
    // const { error, value } = bookSchema.validate(req.body, {
    //   abortEarly: false,
    // });
    // if (error) {
    //   const { details } = error;
    //   const message = details.map((i) => i.message).join(",");
    //   console.log("error", message);
    //   throw new BadRequestError(message);
    // }

    const recipe = await Recipe.addToDB(req.body);
    return res.status(201).json({ recipe });
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

// router.get("/", ensureAdmin, async function (req, res, next) {
//   try {
//     const books = await Book.getAll();
//     return res.json({ books });
//   } catch (err) {
//     return next(err);
//   }
// });

// /** GET /[id] => { book }
//  *
//  * Returns { id, title, username, recipes: [...] }
//  *
//  * Authorization required: login - this user OR admin
//  **/

// router.get("/:id", ensureLoggedIn, async function (req, res, next) {
//   try {
//     const book = await Book.get(req.params.id);
//     if (res.locals.user.username === book.username || res.locals.user.isAdmin) {
//       return res.json({ book });
//     } else {
//       throw new UnauthorizedError();
//     }
//   } catch (err) {
//     return next(err);
//   }
// });

// /** PATCH /[username] { book } => { book }
//  *
//  * Data can include:
//  *   { title }
//  *
//  * Returns { id, title, username }
//  *
//  * Authorization required: login - this user or admin
//  **/

// router.patch("/:id", ensureLoggedIn, async function (req, res, next) {
//   try {
//     let book = await Book.get(req.params.id);
//     if (!book) return NotFoundError(`No book with id: ${req.params.id}`);

//     // check that user matches username from the book or is an Admin >
//     if (res.locals.user.username === book.username || res.locals.user.isAdmin) {
//       // validate data:
//       const { error, value } = updateBookSchema.validate(req.body, {
//         abortEarly: false,
//       });
//       if (error) {
//         const { details } = error;
//         const message = details.map((i) => i.message).join(",");
//         console.log("error", message);
//         throw new BadRequestError(message);
//       }

//       const book = await Book.update(req.params.id, req.body.title);
//       return res.json({ book });
//     } else {
//       throw new UnauthorizedError();
//     }
//   } catch (err) {
//     return next(err);
//   }
// });

// /** DELETE /[username]  =>  { deleted: username }
//  *
//  * Authorization required: login - this user or admin
//  **/

// router.delete("/:id", ensureLoggedIn, async function (req, res, next) {
//   try {
//     let book = await Book.get(req.params.id);
//     if (!book) return NotFoundError(`No book with id: ${req.params.id}`);

//     // check that user matches username from the book or is an Admin >
//     if (res.locals.user.username === book.username || res.locals.user.isAdmin) {
//       const book = await Book.remove(req.params.id);
//       return res.json({ deleted: req.params.id });
//     } else {
//       throw new UnauthorizedError();
//     }
//   } catch (err) {
//     return next(err);
//   }
// });

export { router };
