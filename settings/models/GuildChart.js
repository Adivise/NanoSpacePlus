const mongoose = require('mongoose');

const createChart = new mongoose.Schema({
    guildId: String,
    playedHistory: Array,
});

module.exports = mongoose.model('guild-chart', createChart);