"use strict";

import db from "../db.js";
import {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} from "../expressError.js";
import axios from "axios";

const BASE_URL = "https://api.edamam.com/api/recipes/v2";

/** Related functions for Recipes. */

class Recipe {
  /** fetchRecipes: Given a query parameter, return 20 (or less if less are found) random recipes related to query.
   *
   * Returns [{recipe: {uri, label, image}, _links: {}}...]
   *
   **/
  static async fetchRecipes(query) {
    try {
      const recipeData = await axios.get(
        `${BASE_URL}?type=public&q=${query}&app_id=${process.env.API_APP_ID}&app_key=${process.env.API_APP_KEY}&imageSize=REGULAR&random=true&field=uri&field=label&field=image
        `
      );
      console.log(recipeData.data.hits);
      return recipeData.data.hits;
    } catch (e) {
      throw new NotFoundError();
    }
  }
  // *********************** EDAMAM RECIPE DB ******************************************************

  /** fetchRandomRecipes: Return 20 random recipes
   *
   * Returns [{recipe: {uri, label, image}, _links: {}}...]
   *
   
   **/
  static async fetchRandomRecipes() {
    try {
      const recipeData = await axios.get(
        `${BASE_URL}?type=public&app_id=${process.env.API_APP_ID}&app_key=${process.env.API_APP_KEY}&imageSize=REGULAR&ingr=1%2B&random=true&field=uri&field=label&field=image
        `
      );

      return recipeData.data.hits;
    } catch (e) {
      throw new NotFoundError();
    }
  }

  /** getRecipeDetails: Return recipe details
   *
   * Returns from edamam
   *
   
   **/
  static async getRecipeDetails(uri) {
    try {
      const recipeData = await axios.get(
        `${BASE_URL}/by-uri?type=public&uri=${uri}&app_id=${process.env.API_APP_ID}&app_key=${process.env.API_APP_KEY}&field=uri&field=label&field=image&field=source&field=url&field=ingredients&field=totalTime&field=mealType`
      );

      // once indiv recipe details are fetched, add this recipe to our DB =>

      return recipeData.data.hits;
    } catch (e) {
      throw new NotFoundError();
    }
  }

  // *********************** OUR RECIPE DB ******************************************************

  /** addRecipeToDB: Given a recipe {uri, label, image} add to DB if it does not already exist.
   *
   * Returns { uri, label, image}
   *
   *
   **/

  static async addToDB({ uri, label, image }) {
    // check that recipe does not already exist:
    let duplicateCheck = await db.query(
      `SELECT  uri, label, image
             FROM recipes
             WHERE uri = $1`,
      [uri]
    );
    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate recipe: ${uri}`);
    }

    // if the recipe does not exist, add to DB

    let results = await db.query(
      `INSERT INTO recipes
               (uri,
                label,
                image)
               VALUES ($1, $2, $3)
               RETURNING  uri, label, image`,
      [uri, label, image]
    );

    let recipe = results.rows[0];

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

  /** addRating({uri, username, rating}): creates user rating
   *
   * if the user already posted a rating, returns existing rating data
   *
   * Returns {id, recipeURI, username, starRating}
   *
   * throws NotFoundError if not found
   **/
  // HOW DO WE CONTROL MULTIPLE INPUTS HERE - CAN WE DO UPDATE AND ADD RATING IN THE SAME FUNCTION? EX. IF THERE ALREADY EXISTS USERRATING - UPDATE INSTEAD OF ADD ?
  static async addRating({ uri, username, rating }) {
    // check that user did not already leave a rating:
    const result = await db.query(
      `SELECT id, username, recipeURI AS "recipeURI", starRating AS "starRating", createdAt AS "createdAt" 
      FROM ratings 
      WHERE username=$1 AND recipeURI=$2`,
      [username, uri]
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

  /** updateRating({uri, username, rating}) => updates existing rating
   *
   *
   * Returns {id, recipeURI, username, starRating}
   *
   * throws NotFoundError if not found
   **/
  static async updateRating({ uri, username, rating }) {
    const results = await db.query(
      `UPDATE ratings
      SET starRating=$1
      WHERE username=$2 AND recipeURI=$3
        RETURNING id, recipeURI AS "recipeURI", username, starRating AS "starRating", createdAt AS "createdAt"`,
      [rating, username, uri]
    );
    let userRating = results.rows[0];

    if (!userRating) throw new NotFoundError(`No user rating for this recipe`);

    return userRating;
  }

  /** delete Rating ({uri, username}) => deletes existing rating
   *
   *
   * Returns undefined
   *
   * throws NotFoundError if not found
   **/
  static async removeRating({ uri, username }) {
    const results = await db.query(
      `DELETE FROM ratings
      WHERE username=$1 AND recipeURI=$2
        RETURNING recipeURI AS "recipeURI", username`,
      [username, uri]
    );
    let userRating = results.rows[0];

    if (!userRating) throw new NotFoundError(`No user rating for this recipe`);
  }

  // GET AVG STAR RATING FOR RECIPE
  //
  // DELETE RECIPE from DB
}

export default Recipe;
