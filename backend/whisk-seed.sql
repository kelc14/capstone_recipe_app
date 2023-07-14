-- both test users have the password "password"

INSERT INTO users (username, password, firstName, lastName, email, isAdmin)
VALUES ('testuser',
        '$2b$12$ylEmdQJZ4gUOW6f3nZoN9uG3lxDBZnECBfc0Uv4ZGlK3ZeqzPG4r.',
        'Test',
        'User',
        'test@email.com',
        FALSE),
       ('testadmin',
        '$2b$12$ylEmdQJZ4gUOW6f3nZoN9uG3lxDBZnECBfc0Uv4ZGlK3ZeqzPG4r.',
        'Test',
        'Admin!',
        'test@email.com',
        TRUE);

INSERT INTO books (title, username)
VALUES ('Family Dinner', 'testuser'), 
('Thanksgiving', 'testuser'), 
('Kids Dinner', 'testuser'), 
('Easter Brunch', 'testuser'), 
('Breakfast', 'testuser'), 
('Cookies', 'testuser'),
('Toddler Meals', 'testuser'), 
('Birthday Party', 'testuser'),
('Christmas', 'testadmin'), 
('Kids Birthday Party', 'testadmin'), 
('Brunch', 'testadmin'), 
('Lunch Ideas', 'testadmin'), 
('Dessert', 'testadmin'),
('Sunday Dinners', 'testadmin'), 
('Bday Party', 'testadmin');


-- CREATE TABLE recipes (
--   id SERIAL PRIMARY KEY,
--   name VARCHAR NOT NULL,
--   image VARCHAR NOT NULL,
--   uri VARCHAR NOT NULL
-- );




-- CREATE TABLE recipes_books (
--   recipe_id INTEGER NOT NULL
--     REFERENCES recipes ON DELETE CASCADE,
--   book_id INTEGER NOT NULL
--     REFERENCES books ON DELETE CASCADE
-- );
