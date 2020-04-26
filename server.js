const prompt = require('prompt-promise');
const artist = require('./create_artist');
const album = require('./create_album');
const track = require('./create_track');

// Main function to prompt user for all values in the database
artist.newArtist();
album.newAlbum();
track.newTrack();

prompt('Would you like to add another artist?')
    .then((val) => {
        if (val.toLowerCase() == 'yes') {
            artist.newArtist();
            album.newAlbum();
            track.newTrack();
        } else {
            console.log('Thank you.');
            prompt.done();
        }
    })
    .catch((err) => {
        console.error(err);
    })