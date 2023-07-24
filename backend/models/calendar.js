"use strict";

import db from "../db.js";
import {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} from "../expressError.js";
import axios from "axios";

/** Related functions for User Calendars. */

class Calendar {
  /** createCalendar: create a calendar for the given user
   *
   * ** INVOKED AFTER A USER IS REGISTERED - > SO THIS HAPPENS AUTOMATICALLY
   *
   * Returns {username, monday, tuesday, wednesday, thursday, friday, saturday, sunday }
   *
   **/

  static async createCalendar({ username }) {
    // check that user exists first:
    const user = await db.query(
      `SELECT username
                 FROM users
                 WHERE username = $1`,
      [username]
    );
    if (!user.rows[0]) throw new NotFoundError(`No user: ${username}`);

    const duplicateCheck = await db.query(
      `
    SELECT username
    FROM calendars
    WHERE username = $1`,
      [username]
    );
    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate calendar for username: ${username}`);
    }

    let calendar = await db.query(
      `
    INSERT INTO calendars (username) 
    VALUES ($1)
    RETURNING username, monday, tuesday, wednesday, thursday, friday, saturday, sunday
    `,
      [username]
    );
    return calendar.rows[0];
  }

  /** Get all books
   *
   * Returns [{ id, title, username }, ...]
   *
   **/

  static async getAll() {
    const result = await db.query(
      `SELECT username, monday, tuesday, wednesday, thursday, friday, saturday, sunday FROM calendars`
    );
    return result.rows;
  }

  //   /** get(username): Given an username {username} get calendar from DB if it exists.
  //    *
  //    * Returns {username, monday, tuesday, wednesday, thursday, friday, saturday, sunday}
  //    *
  //    * throws NotFoundError if not found
  //    **/

  static async get({ username }) {
    const result = await db.query(
      `SELECT username, monday, tuesday, wednesday, thursday, friday, saturday, sunday
               FROM calendars
               WHERE username = $1`,
      [username]
    );
    return result.rows[0];
  }

  //   /** update(day, username) => updates existing calendar
  //    *
  //    *
  //    * Returns {username, monday, tuesday, wednesday, thursday, friday, saturday, sunday}
  //    *
  //    * throws NotFoundError if not found
  //    **/

  static async update({ day, uri, username }) {
    const results = await db.query(
      `UPDATE calendars
        SET ${day}=$1
        WHERE username=$2 
          RETURNING username, monday, tuesday, wednesday, thursday, friday, saturday, sunday`,
      [uri, username]
    );
    let userCalendar = results.rows[0];

    if (!userCalendar)
      throw new NotFoundError(`No user rating for this recipe`);

    return userCalendar;
  }

  //   /** delete Rating ({uri, username}) => deletes existing rating
  //    *
  //    *
  //    * Returns undefined
  //    *
  //    * throws NotFoundError if not found
  //    **/
  //   static async removeRating({ uri, username }) {
  //     const results = await db.query(
  //       `DELETE FROM ratings
  //       WHERE username=$1 AND recipeURI=$2
  //         RETURNING recipeURI AS "recipeURI", username`,
  //       [username, uri]
  //     );
  //     let userRating = results.rows[0];

  //     if (!userRating) throw new NotFoundError(`No user rating for this recipe`);
  //   }

  //   // GET AVG STAR RATING FOR RECIPE
  //   //
  //   // DELETE RECIPE from DB
}

export default Calendar;
