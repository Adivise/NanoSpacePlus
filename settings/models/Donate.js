const mongoose = require('mongoose');

const CreateDonate = mongoose.Schema({
    time: String,
    name: String,
    message: String,
    amount: String,
    url: String,
    email: String,
    currency: String,
    transaction: String,
    type: String,
    items: Array,
    tier: String,
    useable: Boolean
});

module.exports = mongoose.model('Donate', CreateDonate);