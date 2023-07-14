-- TABLES FOR WHISK APP DATABASE:

-- * users
-- * books
-- * recipes
-- * recipes_books
-- * recipes_tried
-- * notes
-- * reviews

CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  isAdmin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  username VARCHAR(25) NOT NULL
    REFERENCES users ON DELETE CASCADE
);

CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  image VARCHAR NOT NULL,
  uri VARCHAR NOT NULL
);


CREATE TABLE recipes_books (
  recipeId INTEGER NOT NULL
    REFERENCES recipes ON DELETE CASCADE,
  bookId INTEGER NOT NULL
    REFERENCES books ON DELETE CASCADE
);

-- // tables: recipes_tried
CREATE TABLE recipes_tried (
    id INTEGER NOT NULL PRIMARY KEY,
  recipeId INTEGER NOT NULL
    REFERENCES recipes ON DELETE CASCADE,
  username VARCHAR(25) NOT NULL
    REFERENCES users ON DELETE CASCADE
);

-- // tables: notes
CREATE TABLE notes (
    id INTEGER NOT NULL PRIMARY KEY,
  recipeId INTEGER NOT NULL
    REFERENCES recipes ON DELETE CASCADE,
  username VARCHAR(25) NOT NULL
    REFERENCES users ON DELETE CASCADE,
noteText VARCHAR NOT NULL
);
-- // tables reviews
CREATE TABLE reviews (
    id INTEGER NOT NULL PRIMARY KEY,
  recipeId INTEGER NOT NULL
    REFERENCES recipes ON DELETE CASCADE,
  username VARCHAR(25) NOT NULL
    REFERENCES users ON DELETE CASCADE,
reviewText VARCHAR NOT NULL,
starRating INTEGER CHECK (starRating >= 0)

);