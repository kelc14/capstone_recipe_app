-- CREATE TABLE companies (
--   handle VARCHAR(25) PRIMARY KEY CHECK (handle = lower(handle)),
--   name TEXT UNIQUE NOT NULL,
--   num_employees INTEGER CHECK (num_employees >= 0),
--   description TEXT NOT NULL,
--   logo_url TEXT
-- );

CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
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
  recipe_id INTEGER NOT NULL
    REFERENCES recipes ON DELETE CASCADE,
  book_id INTEGER NOT NULL
    REFERENCES books ON DELETE CASCADE
);

-- // tables: recipes_tried
CREATE TABLE recipes_tried (
    id INTEGER NOT NULL PRIMARY KEY,
  recipe_id INTEGER NOT NULL
    REFERENCES recipes ON DELETE CASCADE,
  username VARCHAR(25) NOT NULL
    REFERENCES users ON DELETE CASCADE
);

-- // tables: notes
CREATE TABLE notes (
    id INTEGER NOT NULL PRIMARY KEY,
  recipe_id INTEGER NOT NULL
    REFERENCES recipes ON DELETE CASCADE,
  username VARCHAR(25) NOT NULL
    REFERENCES users ON DELETE CASCADE,
note_text VARCHAR NOT NULL
);
-- // tables reviews
CREATE TABLE reviews (
    id INTEGER NOT NULL PRIMARY KEY,
  recipe_id INTEGER NOT NULL
    REFERENCES recipes ON DELETE CASCADE,
  username VARCHAR(25) NOT NULL
    REFERENCES users ON DELETE CASCADE,
review_text VARCHAR NOT NULL,
star_rating INTEGER CHECK (star_rating >= 0)

);