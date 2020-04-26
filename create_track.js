const pgp = require('pg-promise')();
const prompt = require('prompt-promise');
const db = pgp(config);

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