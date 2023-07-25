"use strict";

import db from "../db.js";
import Calendar from "./calendar.js";
import bcrypt from "bcrypt";
import {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} from "../expressError.js";
import { BCRYPT_WORK_FACTOR } from "../config.js";
import { partialUpdateSQL } from "../helpers/partialUpdate.js";

/** Related functions for users. */

class User {
  /** authenticate user with username, password.
   *
   * Returns { username, first_name, last_name, email, is_admin }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

  static async authenticate(username, password) {
    // try to find the user first
    const result = await db.query(
      `SELECT username,
                    password,
                    firstName AS "firstName",
                    lastName AS "lastName",
                    email,
                    isAdmin AS "isAdmin"
             FROM users
             WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  /** Register user with data.
   *
   * Returns { username, firstName, lastName, email, isAdmin }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register({
    username,
    password,
    firstName,
    lastName,
    email,
    isAdmin,
  }) {
    const duplicateCheck = await db.query(
      `SELECT username
             FROM users
             WHERE username = $1`,
      [username]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users
             (username,
              password,
              firstName,
              lastName,
              email,
              isAdmin)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING username, firstName AS "firstName", lastName AS "lastName", email, isAdmin AS "isAdmin"`,
      [username, hashedPassword, firstName, lastName, email, isAdmin]
    );

    const user = result.rows[0];

    // create user calendar
    await Calendar.createCalendar({ username });

    return user;
  }

  /** Find all users.
   *
   * Returns [{ username, firstName, lastName, email, isAdmin }, ...]
   **/

  static async findAll() {
    const result = await db.query(
      `SELECT username, firstName AS "firstName", lastName AS "lastName", email, isAdmin AS "isAdmin" FROM users`
    );
    return result.rows;
  }

  /** Given a username, return data about user.
   *
   * Returns { username, firstName, lastName, isAdmin, books: [{id, title}] }
   *
   * books returns empty array if user has not created any yet
   *
   * Throws NotFoundError if user not found.
   **/

  static async get(username) {
    const userRes = await db.query(
      `SELECT u.username, 
            firstName AS "firstName", 
            lastName AS "lastName", 
            email, 
            isAdmin AS "isAdmin", 
            COALESCE(json_agg(json_build_object('id', b.id, 'title',b.title)) FILTER (WHERE b.id IS NOT NULL), '[]') AS books
      FROM users AS u
      LEFT JOIN books as b
            ON b.username = u.username
        WHERE u.username = $1
        GROUP BY u.username`,
      [username]
    );
    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    return user;
  }

  /** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { firstName, lastName, password, email, isAdmin }
   *
   * Returns { username, firstName, lastName, email, isAdmin }
   *
   * Throws NotFoundError if not found.
   *
   * WARNING: this function can set a new password or make a user an admin.
   * Callers of this function must be certain they have validated inputs to this
   * or a serious security risks are opened.
   */

  static async update(username, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { setCols, values } = partialUpdateSQL(data);

    const usernameVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users
                        SET ${setCols}
                        WHERE username = ${usernameVarIdx}
                        RETURNING username,
                                  firstName AS "firstName",
                                  lastName AS "lastName",
                                  email,
                                  isAdmin AS "isAdmin"`;
    const result = await db.query(querySql, [...values, username]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    delete user.password;
    return user;
  }

  /** Delete given user from database; returns undefined. */

  static async remove(username) {
    let result = await db.query(
      `DELETE
             FROM users
             WHERE username = $1
             RETURNING username`,
      [username]
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);
  }

  /** User interactions with recipe */
  static async addUserRecipe(username, recipeURI) {
    let res = await db.query(
      ` INSERT INTO user_recipes (username, recipeuri)
      VALUES ($1, $2)
      RETURNING username, recipeURI AS "recipeURI", notes, tried, rating
      `,
      [username, recipeURI]
    );
    return res.rows[0];
  }

  static async updateUserRecipeTried(username, recipeURI, tried) {
    let res = await db.query(
      `UPDATE user_recipes 
    SET tried=$1
    WHERE username=$2 AND recipeURI=$3
    RETURNING username, recipeURI AS "recipeURI", notes, tried, rating
    `,
      [tried, username, recipeURI]
    );
    return res.rows[0];
  }

  static async updateUserRecipeNotes(username, recipeURI, notes) {
    let res = await db.query(
      `UPDATE user_recipes 
    SET notes=$1
    WHERE username=$2 AND recipeURI=$3
    RETURNING username, recipeURI AS "recipeURI", notes, tried, rating
    `,
      [notes, username, recipeURI]
    );
    return res.rows[0];
  }
  static async updateUserRecipeRating(username, recipeURI, rating) {
    let res = await db.query(
      `UPDATE user_recipes 
    SET rating=$1
    WHERE username=$2 AND recipeURI=$3
    RETURNING username, recipeURI AS "recipeURI", notes, tried, rating
    `,
      [rating, username, recipeURI]
    );
    return res.rows[0];
  }
  // username VARCHAR(25) NOT NULL
  // REFERENCES users ON DELETE CASCADE,
  // recipeURI VARCHAR NOT NULL
  // REFERENCES recipes ON DELETE CASCADE,
  // notes VARCHAR NOT NULL DEFAULT "Add your notes here...",
  // tried BOOLEAN NOT NULL DEFAULT false,
  // rating INTEGER
}

export default User;
