const pgp = require('pg-promise')();
const prompt = require('prompt-promise');
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