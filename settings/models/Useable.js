const mongoose = require('mongoose');

const createCommands = new mongoose.Schema({
    name: String,
    count: Number,
});

module.exports = mongoose.model('top-commands', createCommands);