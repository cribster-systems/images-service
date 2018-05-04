DROP DATABASE IF EXISTS images;
CREATE DATABASE images;

\c images;

CREATE TABLE images (
  id SERIAL PRIMARY KEY,
  caption TEXT,
  src TEXT,
  listing_id INTEGER
);

-- INSERT INTO locations (id, caption, src)
--   VALUES (1, 'Lorem ipsum tho watup thot', 'www.google.com');

-- CREATE TABLE sources (
--   id SERIAL PRIMARY KEY,
--   src TEXT
-- );

-- CREATE TABLE locations_sources (
--   locations_id INTEGER REFERENCES locations (id),
--   sources_id INTEGER REFERENCES sources (id),
--   PRIMARY KEY (locations_id, sources_id)
-- );

-- CREATE UNIQUE INDEX ON locations_sources (locations_id, sources_id);

-- INSERT INTO sources (id, src) 
--   VALUES (1, 'www.google.com');

-- INSERT INTO locations_sources (locations_id, sources_id) 
--   VALUES (1, 1);

