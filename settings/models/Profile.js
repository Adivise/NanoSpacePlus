const mongoose = require('mongoose')

const Create = mongoose.Schema({
    userId: String,
    playedCount: Number,
    useCount: Number,
    listenTime: Number,
    playedHistory: Array,
})
module.exports = mongoose.model('Profiles', Create)