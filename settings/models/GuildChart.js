const mongoose = require('mongoose');

const createChart = new mongoose.Schema({
    guildId: String,
    track_data: Array,
});

module.exports = mongoose.model('guild-chart', createChart);