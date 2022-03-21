const mongoose = require('mongoose')

const CreatePremium = mongoose.Schema({
    Id: {
        type: String,
        required: true,
        unique: true
    },
    isPremium: {
        type: Boolean,
        default: false
    },

    premium: {

    redeemedBy: {
      type: Array,
      default: null
    },
    redeemedAt: {
      type: Number,
      default: null
    },
    expiresAt: {
      type: Number,
      default: null
    },
    plan: {
      type: String,
      default: null
    }
  }
})
module.exports = mongoose.model('Premium', CreatePremium)