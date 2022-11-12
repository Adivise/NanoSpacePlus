const mongoose = require('mongoose');

const Create = new mongoose.Schema({
    name: String,
    count: Number,
});

module.exports = mongoose.model('commandstats', Create);