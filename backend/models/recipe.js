"use strict";

import db from "../db.js";
import {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} from "../expressError.js";
import axios from "axios";

const BASE_URL = "https://api.edamam.com/api/recipes/v2";
import { configDotenv } from "dotenv";
/** Related functions for users. */

class Recipe {
  /** fetchRecipes: Given a query parameter, return 20 (or less if less are found) random recipes related to query.
   *
   * Returns [{recipe: {uri, label, image}, _links: {}}...]
   *
   * Throws NotFoundError if book not found.
   **/
  static async fetchRecipes(query) {
    try {
      const recipeData = await axios.get(
        `${BASE_URL}?type=public&q=${query}&app_id=${process.env.API_APP_ID}&app_key=${process.env.API_APP_KEY}&random=true&field=uri&field=label&field=image
        `
      );
      return recipeData.data.hits;
    } catch (e) {
      throw new NotFoundError();
    }
  }

  /** addRecipeToDB: Given a recipe {uri, label, image} add to DB if it does not already exist.
   *
   * Returns { uri, label, image}
   *
   *
   **/

  static async addToDB({ uri, label, image }) {
    // check that recipe does not already exist:
    let results = await db.query(
      `SELECT  uri, label, image
             FROM recipes
             WHERE uri = $1`,
      [uri]
    );
    let recipe = results.rows[0];

    // if the recipe does not exist, add to DB
    if (!recipe) {
      let results = await db.query(
        `INSERT INTO recipes
               (uri,
                label,
                image)
               VALUES ($1, $2, $3)
               RETURNING  uri, label, image`,
        [uri, label, image]
      );

      recipe = results.rows[0];
    }

    return recipe;
  }

  /** getAll(): Get all recipes from DB.
   *
   * Returns [recipes: { uri, label, image}...]
   *
   **/

  static async getAll() {
    let result = await db.query(
      `SELECT uri, label, image
             FROM recipes`
    );

    let recipes = result.rows;

    return recipes;
  }

  /** get(uri): Given a recipe {uri} get from DB if it exists.
   *
   * Returns {id, uri, label, image}
   *
   * throws NotFoundError if not found
   **/

  // ************ ADD RATINGS AND REVIEWS to return value HERE **********************

  static async get(uri) {
    const result = await db.query(
      `SELECT uri, label, image
             FROM recipes
             WHERE uri = $1`,
      [uri]
    );

    const recipe = result.rows[0];

    if (!recipe) throw new NotFoundError(`No recipe: ${uri}`);

    return recipe;
  }

  /** addRating(uri, username, rating): Given a recipe {uri} get from DB if it exists.
   *
   * Returns {id, uri, label, image}
   *
   * throws NotFoundError if not found
   **/
  // ADD USER STAR RATING
  // HOW DO WE CONTROL MULTIPLE INPUTS HERE - CAN WE DO UPDATE AND ADD RATING IN THE SAME FUNCTION? EX. IF THERE ALREADY EXISTS USERRATING - UPDATE INSTEAD OF ADD ?
  static async addRating({ uri, username, rating }) {
    // check that user did not already leave a rating:
    const result = await db.query(
      `SELECT recipeURI, username, starRating, id
             FROM ratings
             WHERE recipeURI = $1 AND username = $2`,
      [uri, username]
    );
    let userRating = result.rows[0];

    // if the recipe does not exist, add to DB
    if (!userRating) {
      const results = await db.query(
        `INSERT INTO ratings (recipeURI, username, starRating)
        VALUES ($1,$2,$3)
        RETURNING id, recipeURI AS "recipeURI", username, starRating AS "starRating", createdAt AS "createdAt"`,
        [uri, username, rating]
      );
      userRating = results.rows[0];
    }
    return userRating;
  }

  // GET AVG STAR RATING FOR RECIPE
  //
  // DELETE RECIPE from DB
}

export default Recipe;
