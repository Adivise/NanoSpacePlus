const mongoose = require('mongoose');

const CreateLang = mongoose.Schema({
    guild: {
		type: String,
		required: true,
		unique: true,
	},
    language: {
        type: String,
        default: "en",
        required: true,
    }
});

module.exports = mongoose.model('Language', CreateLang);