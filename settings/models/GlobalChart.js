const mongoose = require('mongoose');

const createChart = new mongoose.Schema({
    track_id: String,
    track_title: String,
    track_url: String,
    track_duration: String,
    track_count: Number,
});

module.exports = mongoose.model('global-chart', createChart);