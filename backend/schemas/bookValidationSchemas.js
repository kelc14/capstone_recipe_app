import Joi from "joi";

/**  bookSchema => Schema for creating a book
 *
 * routes   => POST /book
 *          => PATCH /book/:id
 * *
 */

const bookSchema = Joi.object({
  username: Joi.string().alphanum().min(1).max(30).required(),
  title: Joi.string().min(1).max(60).required(),
});

/**  bookSchema => Schema for updating a book
 *
 * routes   => POST /book
 *          => PATCH /book/:id
 * *
 */

const updateBookSchema = Joi.object({
  title: Joi.string().min(1).max(60).required(),
});

export { bookSchema, updateBookSchema };
