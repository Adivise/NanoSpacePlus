const mongoose = require('mongoose');

const CreatePlaylist = mongoose.Schema({
    name: String,
    tracks: Array,
    created: Number,
    private: Boolean,
    owner: String,
});

module.exports = mongoose.model('Playlist', CreatePlaylist);

