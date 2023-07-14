// CREATE BOOK for user
// RETRIEVE BOOK INFO from DB
// ADD NEW RECIPE TO BOOK
// DELETE RECIPE FROM BOOK
// DELETE BOOK from DB

"use strict";

import db from "../db.js";
import bcrypt from "bcrypt";
import {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} from "../expressError.js";

/** Related functions for books. */

class Book {
  /** Get all books
   *
   * Returns [{ id, title, username }, ...]
   *
   **/

  static async getAll() {
    const result = await db.query(`SELECT id, title, username FROM books`);
    return result.rows;
  }

  /** Get all books for a user
   *
   * Returns [{ id, title, username, recipes: [recipeIds...] }, ...]
   *
   **/

  static async getUserBooks(username) {
    const result = await db.query(
      `SELECT id, title, username FROM books WHERE username=$1`,
      [username]
    );
    return result.rows;
  }

  /** Given a bookId, return all data about the book.
   *
   * Returns { id, title, username, recipes: [recipeIds...] }
   *
   * Throws NotFoundError if book not found.
   **/

  static async get(id) {
    const bookRes = await db.query(
      `SELECT id, title, username FROM books WHERE id=$1`,
      [id]
    );
    const book = bookRes.rows[0];

    if (!book) throw new NotFoundError(`No book id: ${id}`);

    return book;
  }

  /** Update book data.
   *
   * Data can include:
   *   { title }
   *
   * Returns { id, title, username }
   *
   * Throws NotFoundError if not found.
   *
   */

  static async update(id, title) {
    const result = await db.query(
      `
    UPDATE books
    SET title=$1
    WHERE id=$2
    RETURNING id, title, username
    `,
      [title, id]
    );
    const book = result.rows[0];

    if (!book) throw new NotFoundError(`No book with id: ${id}`);

    return book;
  }

  /** Delete given user from database; returns undefined. */

  static async remove(id) {
    let result = await db.query(
      `DELETE
             FROM books
             WHERE id = $1
             RETURNING id`,
      [id]
    );
    const book = result.rows[0];

    if (!book) throw new NotFoundError(`No book with id: ${id}`);
  }
}

export default Book;
