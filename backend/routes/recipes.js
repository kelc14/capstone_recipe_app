"use strict";

/** Routes for Recipes. */

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

/** GET / => { recipes: [{uri, label, image} ... ]}
 *
 * Retrieves a list of recipes from the Edamam API
 *
 * Authorization required: login
 */

router.get("/", ensureLoggedIn, async function (req, res, next) {
  try {
    let recipes = await Recipe.getAll();
    return res.json({ recipes });
  } catch (err) {
    return next(err);
  }
});

/** GET /[uri] => { recipe }
 *
 * Returns {  }
 *
 * Authorization required: login
 **/

// **** MIGHT WANT TO ADD AN ID TO THE RECIPE IN MY DATABASE SO THAT IT IS EASIER TO ADD TO URL PARAMS ...

router.get("/:uri", ensureLoggedIn, async function (req, res, next) {
  try {
    if (res.locals.user.username === book.username || res.locals.user.isAdmin) {
      const recipe = await Recipe.get(req.params.uri);

      return res.json({ recipe });
    } else {
      throw new UnauthorizedError();
    }
  } catch (err) {
    return next(err);
  }
});

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
