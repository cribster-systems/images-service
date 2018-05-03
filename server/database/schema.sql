DROP DATABASE IF EXISTS images;
CREATE DATABASE images;

\c images;

CREATE TABLE listings (
  ID SERIAL PRIMARY KEY,
  location_id INTEGER,
  caption VARCHAR,
  src TEXT[],
);

INSERT INTO listings (location_id, caption, src)
  VALUES (1, 'Lorem ipsum tho watup thot', ['http://abc.com', 'http://www.facebook.com']);