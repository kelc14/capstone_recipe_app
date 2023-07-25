"use strict";

import { NotFoundError } from "../expressError.js";
import axios from "axios";

const BASE_URL = "https://api.edamam.com/api/recipes/v2";

/** Related functions for fetching Recipes from Edamam API. */

class RecipeAPI {
  /** fetchRecipes: Given a query parameter, return 20 (or less if less are found) random recipes related to query.
   *
   * Returns [{recipe: {uri, label, image}, _links: {}}...]
   *
   **/
  static async fetchRecipes(query) {
    try {
      const recipeData = await axios.get(
        `https://api.edamam.com/api/recipes/v2?type=public&q=${query}&app_id=${process.env.API_APP_ID}&app_key=${process.env.API_APP_KEY}&imageSize=REGULAR&random=true&field=uri&field=label&field=image
        `
      );
      //   console.log(recipeData.data.hits);
      return recipeData.data.hits;
    } catch (e) {
      throw new NotFoundError();
    }
  }

  /** fetchRandomRecipes: Return 20 random recipes
   *
   * Returns [{recipe: {uri, label, image}, _links: {}}...]
   *
   
   **/
  static async fetchRandomRecipes() {
    try {
      console.log(process.env.TEST);

      const recipeData = await axios.get(
        `https://api.edamam.com/api/recipes/v2?type=public&app_id=${process.env.API_APP_ID}&app_key=${process.env.API_APP_KEY}&imageSize=REGULAR&ingr=1%2B&random=true&field=uri&field=label&field=image
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
  static async getRecipeDetails(shortenedUri) {
    let uri = `http%3A%2F%2Fwww.edamam.com%2Fontologies%2Fedamam.owl%23${shortenedUri}`;
    console.log(uri);

    try {
      const recipeData = await axios.get(
        `https://api.edamam.com/api/recipes/v2/by-uri?type=public&uri=${uri}&app_id=${process.env.API_APP_ID}&app_key=${process.env.API_APP_KEY}&field=uri&field=label&field=image&field=source&field=url&field=yield&field=dietLabels&field=healthLabels&field=cautions&field=ingredientLines&field=ingredients&field=calories&field=totalWeight&field=totalTime&field=cuisineType&field=mealType&field=dishType&field=totalNutrients`
      );
      return recipeData.data.hits[0].recipe;
    } catch (e) {
      throw new NotFoundError();
    }
  }
}

export default RecipeAPI;
