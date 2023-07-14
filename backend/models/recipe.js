"use strict";

import db from "../db.js";
import bcrypt from "bcrypt";
import {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} from "../expressError.js";
import { BCRYPT_WORK_FACTOR } from "../config.js";
import { partialUpdateSQL } from "../helpers/partialUpdate.js";

/** Related functions for users. */

class Recipe {
  //  CREATE RECIPE (add new recipe to db if it is not already there)
  // RETRIEVE RECIPE INFO from DB
  // UPDATE RECIPE INFO in DB (star rating)
  // DELETE RECIPE from DB
}

export default Recipe;
