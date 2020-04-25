CREATE TABLE artist (
    id SERIAL PRIMARY KEY,
    artist_name VARCHAR
);

CREATE TABLE album (
    id SERIAL PRIMARY KEY,
    artist_id INTEGER REFERENCES artist(id),
    release_year INTEGER,
    album_name VARCHAR
);

CREATE TABLE track (
    id SERIAL PRIMARY KEY,
    album_id INTEGER REFERENCES album(id),
    artist_id INTEGER REFERENCES artist(id),
    duration INTEGER
);

CREATE TABLE song_writer (
    id SERIAL PRIMARY KEY,
    writer_name VARCHAR
);

CREATE TABLE song (
    id SERIAL PRIMARY KEY,
    song_name VARCHAR,
    duration INTEGER,
    release_year INTEGER,
    writer_id INTEGER REFERENCES song_writer(id)
);