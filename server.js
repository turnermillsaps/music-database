const pgp = require('pg-promise')();
const prompt = require('prompt-promise');

// Database connection config
const config = {
    host: 'localhost',
    port: 5432,
    database: 'music',
    user: 'postgres',
    password: 'ph1shstix'
};

const db = pgp(config);

// Function to insert a new artist
let insertArtist = (artistName) => {
    let sql = 'INSERT INTO artist (artist_name) VALUES ($1) RETURNING id';
    db.result(sql, artistName)
        .then((res) => {
            console.log(res);
            console.log('Inserted new record');
            pgp.end();
        })
        .catch((err) => {
            console.error(err);
        })
}

// Function to insert a new album into the database
let insertAlbum = (album, albumYear, artistID) => {
    let sql = 'INSERT INTO album (album_name, release_year, artist_id) VALUES ($1, $2, $3)';
    db.result(sql, [album, albumYear, artistID])
        .then((res) => {
            console.log(res);
        })
    
    pgp.end();
}

// Function to insert a new track with corresponding link tables
let insertTrack = (trackName, albumID, duration) => {
    let songSQL = 'INSERT INTO song (song_name, duration) VALUES ($1, $2) RETURNING id';
    let trackSQL = 'INSERT INTO track (album_id, song_id) VALUES ($1, $2) RETURNING id';
    // let collabSQL = 'INSERT INTO artist_track_collab (artist_id, track_id) VALUES ($1, $2)';
    let collabSQL = 'INSERT INTO artist_track_collab (artist_id, track_id) SELECT artist_id, $1 FROM album WHERE id = $2';
    // let artistSQL = 'SELECT artist_id FROM album WHERE id = $1';

    let songID, trackID;

    db.result(songSQL, [trackName, duration])
        .then((res) => {
            console.log(res);
            songID = res.rows[0].id;
            return;
        })
        .then(() => {
            // Execute remainder of SQL statements on this chain
            db.result(trackSQL, [albumID, songID])
                .then((res) => {
                    trackID = res.rows[0].id;
                    return;
                })
                .then(() => {
                    db.result(collabSQL, [trackID, albumID])
                        .then((res) => {
                            console.log(res);
                            return;
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                })
        })
        .then(() => {
            pgp.end();
        })
        .catch((err) => {
            console.error(err);
        })
}

// Function to promt user for a new artist
let newArtist = () => {
    prompt('Artist name?')
        .then((val) => {
            return insertArtist(val);
        })
        .then(() => {
            prompt.done();
        })
        .catch((err) => {
            console.error(err);
            prompt.finish();
        })
}


// Prompt user for specific data to enter into the music database
let newAlbum = () => {
    let album, albumYear, artistID;
    prompt('Album name?')
        .then((val) => {
            album = val;
            return prompt('Album year?');
        })
        .then((val) => {
            albumYear = val;
            return prompt('Artist ID?');
        })
        .then((val) => {
            artistID = val;
            return insertAlbum(album, albumYear, artistID);
        })
        .then((res) => {
            console.log(res);
            prompt.done();
        })
        .catch((err) => {
            console.error(err);
            prompt.finish();
        });
}


let newTrack = () => {
    let trackName, albumID, duration;
    prompt('Track name? ')
        .then((val) => {
            trackName = val;
            return prompt('Album ID? ');
        })
        .then((val) => {
            albumID = val;
            return prompt('Duration of track in seconds? ')
        })
        .then((val) => {
            duration = val;
            return insertTrack(trackName, albumID, duration);
        })
        .then(() => {
            console.log('Thank you for testing this...');
            prompt.done();
        })
        .catch((err) => {
            console.log(err);
            prompt.finish();
        })
}


newTrack();