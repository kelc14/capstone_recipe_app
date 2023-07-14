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

INSERT INTO recipes (name, image, uri) 
VALUES ('recipe name', 'https://edamam-product-images.s3.amazonaws.com/web-img/643/643d4bad9cc21284f7f52b1b9b862848.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFEaCXVzLWVhc3QtMSJIMEYCIQCa2m%2BA2LbUO6VH%2Flr32xwI%2BHbsICH%2BOHK30ixoHf2%2FbAIhAKpSdkEQOal3zcLbrTLb7ap1uMQlWggkVJ9gEl46pwwZKsIFCMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMMTg3MDE3MTUwOTg2IgwbgwTqtRQ5fpSm7zEqlgV35yG14qfBQ7EcW5lOsKUnTXV63IJ985eLh242z9VDUvNEAEtSusV%2Fk3tZMXRrJWnrUsJSfIUynchT3VXo%2F9lSBVPNISz4Y%2FrnoZxEyY3G0Gr%2BnYHDgLmOTTYgm9%2BHNallQfaWa94r6zZbLXoEjf78700AMt65rUEniK4sOZlHpgyrKYbSjIfY5BWnXiqGknH6%2FeTqPguCGCdTee8BqsKsLZfeMR1sY1Ji9QmQKpDmnOP3970p5SxHivKthd6rfnpyZ9gHNrGqMELl4%2B2Rh9Gva%2ByeCTTIU7yzRdFMMaRMIZQfI%2FMv8pNyTlcwJFanlBp2mgRhAfBwJ%2FGZO99b0JG%2BaQRnezG2a1nPtlAMCAujOfEZ4zQ%2BvYd1Fv5IJzQsY9FZYjQI5sxUr3Jqso8WgDPFrv%2BuqRlIMQZi97yBLuhNOFmQJ%2FX1%2BFcK4nwxjMKd%2Bp%2FbDLAg1uHkHXaoRTWpqgk44xqFMUYcb1mT%2FJR%2F5JNHCRSwq5ILAbHRciBUnX3so3DpU8vZbx2DKcfhwi5dVD%2F9Slivi%2BxMmnm39yXUUnI%2Fvowa58nUzlWTYQiv1Cn5ZQVh6gzd%2FTi65uhyVoibZNLAUfQtm2I7cYEZ76KYkyPVtQ0QZ%2BFtS3NH%2FEMKVefcW7bQQCmhHMICwtQSlTyUPaxgtKXoqCIwa%2BEQD4%2FJhPu0EmStaKUMPyHWbLbUlYB2XZDw9EjK12jxWMM90g8vQYX7KFtZ5JiKSdhH0hMvqoGZAK1t9eJrPgq62QAbU7qz9L%2BsDHlwwQ1pK1n7z1ooC0MOEQtl5MUMqTaSz%2BWCJ9nkoTb5ob4pznOKFVvIww%2FIWRx4Jc7gvBGPqVu9tROJshypkZdCKcjKBhRx8ghvwD6i0lVPTTi1LzC79relBjqwAcmvhuQMM73ScNvVtJ%2FdKyLNY7RmHBsu2fxO%2FVT9uYuH2H3OE7tuxoK%2BJ65EbDrsNf0hMbVZdZBTHwWcIQjmJ5Y0toRg2vN9EAXGgEUlj7dHsxwSqoCvtclvwARNqKw4kbxvw4cUFepgc8%2FkLscL02Tp%2Fi9C9%2B28F%2FzFaR7i6JaE1nIcLodZJ5XtIuDOogYDI2XZS4sA%2B7VcO8Wy64OjXGDcr6sq%2FZ9DxYQ53RN2%2FfMa&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20230712T021404Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCOWJRJ4U%2F20230712%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=951315779377a498d950e84d6116d2ed29f4ff307759902b92bee4ead302d990', 'http://www.edamam.com/ontologies/edamam.owl#recipe_4bb99424e1bbc40d3cd1d891883d6745'), ('recipe name 2', 'https://edamam-product-images.s3.amazonaws.com/web-img/b2d/b2dbd9ac524a41cae54682d3b5dc8d10.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFEaCXVzLWVhc3QtMSJIMEYCIQCa2m%2BA2LbUO6VH%2Flr32xwI%2BHbsICH%2BOHK30ixoHf2%2FbAIhAKpSdkEQOal3zcLbrTLb7ap1uMQlWggkVJ9gEl46pwwZKsIFCMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMMTg3MDE3MTUwOTg2IgwbgwTqtRQ5fpSm7zEqlgV35yG14qfBQ7EcW5lOsKUnTXV63IJ985eLh242z9VDUvNEAEtSusV%2Fk3tZMXRrJWnrUsJSfIUynchT3VXo%2F9lSBVPNISz4Y%2FrnoZxEyY3G0Gr%2BnYHDgLmOTTYgm9%2BHNallQfaWa94r6zZbLXoEjf78700AMt65rUEniK4sOZlHpgyrKYbSjIfY5BWnXiqGknH6%2FeTqPguCGCdTee8BqsKsLZfeMR1sY1Ji9QmQKpDmnOP3970p5SxHivKthd6rfnpyZ9gHNrGqMELl4%2B2Rh9Gva%2ByeCTTIU7yzRdFMMaRMIZQfI%2FMv8pNyTlcwJFanlBp2mgRhAfBwJ%2FGZO99b0JG%2BaQRnezG2a1nPtlAMCAujOfEZ4zQ%2BvYd1Fv5IJzQsY9FZYjQI5sxUr3Jqso8WgDPFrv%2BuqRlIMQZi97yBLuhNOFmQJ%2FX1%2BFcK4nwxjMKd%2Bp%2FbDLAg1uHkHXaoRTWpqgk44xqFMUYcb1mT%2FJR%2F5JNHCRSwq5ILAbHRciBUnX3so3DpU8vZbx2DKcfhwi5dVD%2F9Slivi%2BxMmnm39yXUUnI%2Fvowa58nUzlWTYQiv1Cn5ZQVh6gzd%2FTi65uhyVoibZNLAUfQtm2I7cYEZ76KYkyPVtQ0QZ%2BFtS3NH%2FEMKVefcW7bQQCmhHMICwtQSlTyUPaxgtKXoqCIwa%2BEQD4%2FJhPu0EmStaKUMPyHWbLbUlYB2XZDw9EjK12jxWMM90g8vQYX7KFtZ5JiKSdhH0hMvqoGZAK1t9eJrPgq62QAbU7qz9L%2BsDHlwwQ1pK1n7z1ooC0MOEQtl5MUMqTaSz%2BWCJ9nkoTb5ob4pznOKFVvIww%2FIWRx4Jc7gvBGPqVu9tROJshypkZdCKcjKBhRx8ghvwD6i0lVPTTi1LzC79relBjqwAcmvhuQMM73ScNvVtJ%2FdKyLNY7RmHBsu2fxO%2FVT9uYuH2H3OE7tuxoK%2BJ65EbDrsNf0hMbVZdZBTHwWcIQjmJ5Y0toRg2vN9EAXGgEUlj7dHsxwSqoCvtclvwARNqKw4kbxvw4cUFepgc8%2FkLscL02Tp%2Fi9C9%2B28F%2FzFaR7i6JaE1nIcLodZJ5XtIuDOogYDI2XZS4sA%2B7VcO8Wy64OjXGDcr6sq%2FZ9DxYQ53RN2%2FfMa&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20230712T021404Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCOWJRJ4U%2F20230712%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=eaafab82ab5d989ccfb9e21392f9b8e280c045999ae6ed678265177f7758644c','http://www.edamam.com/ontologies/edamam.owl#recipe_067f0b7be628ae847366e4f3e614b319');


-- CREATE TABLE recipes_books (
--   recipe_id INTEGER NOT NULL
--     REFERENCES recipes ON DELETE CASCADE,
--   book_id INTEGER NOT NULL
--     REFERENCES books ON DELETE CASCADE
-- );
