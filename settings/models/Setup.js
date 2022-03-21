const mongoose = require('mongoose');

const CreateSetup = mongoose.Schema({
    guild: String,
    enable: Boolean,
    channel: String,
    playmsg: String,
    queuemsg: String,
});

module.exports = mongoose.model('Setup', CreateSetup);