const pgp = require('pg-promise')();
const prompt = require('prompt-promise');
const dbConfig = require('./config');
const db = pgp(dbConfig.config);

// Insert a new album into the database
let insertAlbum = (album, albumYear, artistID) => {
    let sql = 'INSERT INTO album (album_name, release_year, artist_id) VALUES ($1, $2, $3)';
    db.result(sql, [album, albumYear, artistID])
        .then((res) => {
            console.log(res);
        })
    
    pgp.end();
}

// Prompt user for specific data to enter into the music database
module.exports = newAlbum = () => {
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