const mongoose = require('mongoose')

const CreateRedeem = mongoose.Schema({
  code: {
    type: String,
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
})

module.exports = mongoose.model('Redeem', CreateRedeem)