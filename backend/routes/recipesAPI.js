"use strict";

/** Routes for fetching Recipes from Edamam API. */

import express from "express";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../expressError.js";
import RecipeAPI from "../models/recipeAPI.js";
import Recipe from "../models/recipe.js";
import { ensureLoggedIn } from "../middleware/auth.js";

const router = express.Router();

/** GET / => { recipes: [{uri, label, image} ... ]}
 *
 * Retrieves a list of recipes from the Edamam API
 *
 * Authorization required: login
 */

router.get("/", ensureLoggedIn, async function (req, res, next) {
  try {
    let recipes;
    // if (req.query.uri) {
    //   recipes = await RecipeAPI.getRecipeDetails(req.query.uri);
    // } else

    if (!req.query.search) {
      recipes = await RecipeAPI.fetchRandomRecipes();
    } else {
      recipes = await RecipeAPI.fetchRecipes(req.query.search);
    }
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

router.get("/:shortenedUri", ensureLoggedIn, async function (req, res, next) {
  try {
    const recipe = await RecipeAPI.getRecipeDetails(req.params.shortenedUri);

    // after recipe details are fetched, check to see if it is in our database, and if not then add ->
    try {
      await Recipe.addToDB({
        uri: recipe.uri,
        label: recipe.label,
        image: recipe.image,
      });
    } catch (e) {}

    return res.json({ recipe });
  } catch (err) {
    return next(err);
  }
});

export { router };
