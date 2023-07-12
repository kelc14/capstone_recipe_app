\echo 'Delete and recreate whisk db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE whisk;
CREATE DATABASE whisk;
\connect whisk

\i whisk-schema.sql
-- \i whisk-seed.sql

\echo 'Delete and recreate whisk_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE whisk_test;
CREATE DATABASE whisk_test;
\connect whisk_test

\i whisk-schema.sql