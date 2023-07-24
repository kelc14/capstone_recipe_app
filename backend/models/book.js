// CREATE BOOK for user
// RETRIEVE BOOK INFO from DB
// ADD NEW RECIPE TO BOOK
// DELETE RECIPE FROM BOOK
// DELETE BOOK from DB

"use strict";

import db from "../db.js";
import { NotFoundError } from "../expressError.js";

/** Related functions for books. */

class Book {
  /** Make new book (for user)
   *
   * accepts {title, username}
   * returns book => {id, title, username}
   *
   */

  static async new({ title, username }) {
    // check that user exists first:
    const user = await db.query(
      `SELECT username
               FROM users
               WHERE username = $1`,
      [username]
    );
    if (!user.rows[0]) throw new NotFoundError(`No user: ${username}`);

    // if yes, create new book
    const result = await db.query(
      `INSERT INTO books(title, username) 
      VALUES ($1,$2)
      RETURNING id, title, username`,
      [title, username]
    );
    return result.rows[0];
  }

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

  // REEFERENCE ONLY static async get(username) {
  //   const userRes = await db.query(
  //     `SELECT u.username,
  //           firstName AS "firstName",
  //           lastName AS "lastName",
  //           email,
  //           isAdmin AS "isAdmin",
  //           json_agg(json_build_object('id', b.id, 'title',b.title)) AS books
  //     FROM users AS u
  //     LEFT JOIN books as b
  //           ON b.username = u.username
  //       WHERE u.username = $1
  //       GROUP BY u.username`,
  //     [username]
  // ******** add image thumbnails to this object -> 6 images from each book

  static async getUserBooks(username) {
    const result = await db.query(
      `SELECT b.id, b.title, b.username
      FROM books AS b 
      WHERE username=$1
     `,
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

  /** Add a recipe to a book */
  static async addRecipe({ bookId, recipeURI }) {
    // check that bookId exists first:
    const book = await db.query(
      `SELECT id
               FROM books
               WHERE id = $1`,
      [bookId]
    );
    if (!book.rows[0]) throw new NotFoundError(`No book: ${bookId}`);

    // check that recipe exists first:
    const recipe = await db.query(
      `SELECT uri
               FROM recipes
               WHERE uri = $1`,
      [recipeURI]
    );
    if (!recipe.rows[0]) throw new NotFoundError(`No recipe: ${recipeURI}`);

    // if yes to both, add recipe to book
    let result = await db.query(
      `
    INSERT INTO recipes_books (recipeURI, bookId)
    VALUES ($1, $2)
    RETURNING bookId AS "bookId", recipeURI AS "recipeURI"
    `,
      [recipeURI, bookId]
    );

    const added = result.rows[0];
    return added;
  }

  /** Add a recipe to a book */
  static async removeRecipe({ bookId, recipeURI }) {
    // check that bookId exists first:
    const book = await db.query(
      `SELECT id
                 FROM books
                 WHERE id = $1`,
      [bookId]
    );
    if (!book.rows[0]) throw new NotFoundError(`No book: ${bookId}`);

    // check that recipe exists first:
    const recipe = await db.query(
      `SELECT uri
                 FROM recipes
                 WHERE uri = $1`,
      [recipeURI]
    );
    if (!recipe.rows[0]) throw new NotFoundError(`No recipe: ${recipeURI}`);

    // if yes to both, add remove the recipe from the book
    let result = await db.query(
      `
      DELETE FROM recipes_books 
      WHERE bookId=$1 AND recipeURI=$2
      RETURNING bookId AS "bookId", recipeURI AS "recipeURI"
      `,
      [bookId, recipeURI]
    );

    const recipebook = result.rows[0];

    if (!recipebook)
      throw new NotFoundError(
        `No recipe with uri: ${recipeURI} in book with id: ${bookId}`
      );
  }
}

export default Book;
